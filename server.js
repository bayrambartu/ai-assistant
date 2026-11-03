import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { RULES, buildSystemPrompt, FULL_SYSTEM_PROMPT, KNOWN_URLS } from "./prompt.js";
import { findRelevant, loadIndex, METHOD as RETRIEVAL } from "./retrieval.js";
import { chatStream, warmUp, listModels, OllamaError, CHAT_MODEL, EMBED_MODEL, OLLAMA_URL } from "./ollama.js";
import { SOURCE_URL } from "./faq.js";

const here = path.dirname(fileURLToPath(import.meta.url));

const PORT = Number(process.env.PORT ?? 3000);
// rag: her soruda ilgili 3 SSS maddesi sistem mesajına girer (8 GB makineler için).
// full: tüm SSS sistem mesajına girer (16 GB+ makineler; ilk ısınma uzun, sonrası hızlı).
const MODE = process.env.FAQ_MODE === "full" ? "full" : "rag";
const TOP_K = Number(process.env.FAQ_TOP_K ?? 3);
const NUM_CTX = Number(process.env.OLLAMA_NUM_CTX ?? (MODE === "full" ? 8192 : 3072));
// Küçük yerel modelde istem kısa kalsın diye son birkaç mesaj modele gönderilir.
const HISTORY_FOR_MODEL = 6;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const TRUST_PROXY = process.env.TRUST_PROXY === "1";

const LIMITS = {
  maxMessages: 20,
  maxUserChars: 600,
  maxAssistantChars: 4000,
  maxBodyBytes: 64 * 1024,
  perMinute: 15,
};

const UNAVAILABLE_MESSAGE = "Asistan şu anda yanıt veremiyor. Lütfen biraz sonra tekrar deneyin.";

// Yerel model aynı anda tek yanıt üretsin; 8 GB makinede paralel istekler belleği taşırır.
let queue = Promise.resolve();
let waiting = 0;
function enqueue(task) {
  waiting++;
  const run = queue.then(task, task).finally(() => waiting--);
  queue = run.catch(() => {});
  return run;
}

const status = { ready: false, problem: null };

// --- Statik dosyalar (yalnızca izin verilenler) ---
const STATIC = {
  "/": ["public/index.html", "text/html; charset=utf-8"],
  "/index.html": ["public/index.html", "text/html; charset=utf-8"],
  "/widget.js": ["public/widget.js", "text/javascript; charset=utf-8"],
};

// --- Basit IP hız sınırı ---
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > LIMITS.perMinute;
}
setInterval(() => {
  const now = Date.now();
  for (const [ip, ts] of hits) if (ts.every((t) => now - t >= 60_000)) hits.delete(ip);
}, 60_000).unref();

function corsHeaders(req) {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      Vary: "Origin",
    };
  }
  return {};
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > LIMITS.maxBodyBytes) {
        reject(new Error("İstek çok büyük"));
        req.destroy();
      } else chunks.push(c);
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch {
        reject(new Error("Geçersiz JSON"));
      }
    });
    req.on("error", reject);
  });
}

function validateMessages(body) {
  const msgs = body?.messages;
  if (!Array.isArray(msgs) || msgs.length === 0) return "Mesaj bulunamadı";
  if (msgs.length > LIMITS.maxMessages) return "Sohbet çok uzun, lütfen yeni bir sohbet başlatın";
  for (let i = 0; i < msgs.length; i++) {
    const m = msgs[i];
    const expected = i % 2 === 0 ? "user" : "assistant";
    if (m?.role !== expected || typeof m.content !== "string") return "Geçersiz mesaj sırası";
    const max = expected === "user" ? LIMITS.maxUserChars : LIMITS.maxAssistantChars;
    if (!m.content.trim()) return "Boş mesaj gönderilemez";
    if (m.content.length > max) return `Mesaj en fazla ${max} karakter olabilir`;
  }
  if (msgs.at(-1).role !== "user") return "Son mesaj kullanıcıya ait olmalı";
  return null;
}

function sse(res, payload) {
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

// Küçük model SSS'de olmayan bir adres uydurursa onu İSPARK'a Sor sayfasıyla değiştir.
const isKnown = (url) => KNOWN_URLS.has(url) || KNOWN_URLS.has(url.replace(/\/$/, "")) || KNOWN_URLS.has(url + "/");
function fixUnknownUrls(text) {
  return text
    .replace(/\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g, (m, label, url) => {
      if (isKnown(url)) return m;
      const cleanLabel = label.replace(/https?:\/\/\S+/g, "").trim();
      return `${cleanLabel ? cleanLabel + " " : ""}${SOURCE_URL}`;
    })
    .replace(/https?:\/\/[^\s)<\]]+/g, (url) => {
      const clean = url.replace(/[.,;:!?*]+$/, "");
      return isKnown(clean) ? url : SOURCE_URL + url.slice(clean.length);
    });
}

async function handleChat(req, res) {
  const ip = (TRUST_PROXY && req.headers["x-forwarded-for"]?.split(",")[0].trim()) || req.socket.remoteAddress;
  const headers = corsHeaders(req);

  if (rateLimited(ip)) {
    res.writeHead(429, { "Content-Type": "application/json", ...headers });
    return res.end(JSON.stringify({ error: "Çok fazla istek gönderdiniz. Lütfen biraz sonra tekrar deneyin." }));
  }

  let body;
  try {
    body = await readJson(req);
  } catch (err) {
    res.writeHead(400, { "Content-Type": "application/json", ...headers });
    return res.end(JSON.stringify({ error: err.message }));
  }
  const problem = validateMessages(body);
  if (problem) {
    res.writeHead(400, { "Content-Type": "application/json", ...headers });
    return res.end(JSON.stringify({ error: problem }));
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
    ...headers,
  });

  const abort = new AbortController();
  res.on("close", () => {
    if (!res.writableFinished) abort.abort();
  });

  if (waiting > 0) sse(res, { type: "status", text: "Sıradasınız, yanıt birazdan başlayacak…" });

  await enqueue(async () => {
    if (abort.signal.aborted) return;
    const started = Date.now();
    const history = body.messages
      .slice(-HISTORY_FOR_MODEL)
      .map((m) => ({ role: m.role, content: m.content.trim() }));
    if (history[0].role !== "user") history.shift();

    let answer = "";
    try {
      // 1) Bilgiyi hazırla: sistem mesajı = kurallar + ilgili SSS maddeleri
      let system = FULL_SYSTEM_PROMPT;
      let matched = "tümü";
      if (MODE === "rag") {
        // Takip sorularında ("peki iade olur mu?") önceki soru da arama bağlamına katılır.
        const userTurns = history.filter((m) => m.role === "user").map((m) => m.content);
        const hits = await findRelevant(userTurns.slice(-2).join("\n"), TOP_K);
        system = buildSystemPrompt(hits.map((h) => h.item));
        matched = hits.map((h) => `${h.item.id}:${h.score.toFixed(2)}`).join(" ");
      }

      // 2) Modelden yanıtı akış halinde al
      let stats = null;
      for await (const event of chatStream({
        messages: [{ role: "system", content: system }, ...history],
        numCtx: NUM_CTX,
        signal: abort.signal,
      })) {
        const piece = event.message?.content;
        if (piece) {
          answer += piece;
          sse(res, { type: "delta", text: piece });
        }
        if (event.done) stats = event;
      }

      const fixed = fixUnknownUrls(answer);
      if (fixed !== answer) {
        console.warn("[düzeltme] Modelin uydurduğu bir adres değiştirildi.");
        sse(res, { type: "replace", text: fixed });
      }
      if (stats?.done_reason === "length") sse(res, { type: "delta", text: "\n\n(Yanıt kısaltıldı.)" });
      sse(res, { type: "done" });
      res.end();
      status.ready = true;
      status.problem = null;

      const sec = (n) => ((n ?? 0) / 1e9).toFixed(1);
      console.log(
        `[sohbet] ${((Date.now() - started) / 1000).toFixed(1)}sn | istem ${stats?.prompt_eval_count ?? "?"} tok/${sec(stats?.prompt_eval_duration)}sn | üretim ${stats?.eval_count ?? "?"} tok/${sec(stats?.eval_duration)}sn | sss: ${matched}`,
      );
    } catch (err) {
      if (abort.signal.aborted || res.destroyed) return;
      console.error(`[hata] ${err.message}${err.hint ? `\n        → ${err.hint}` : ""}`);
      if (err instanceof OllamaError) status.problem = err.hint ?? err.message;
      sse(res, {
        type: "error",
        message: answer ? "Bağlantı kesildi. Lütfen sorunuzu tekrar gönderin." : UNAVAILABLE_MESSAGE,
      });
      res.end();
    }
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");

  if (url.pathname === "/api/chat") {
    if (req.method === "OPTIONS") {
      res.writeHead(204, corsHeaders(req));
      return res.end();
    }
    if (req.method === "POST") return handleChat(req, res);
    res.writeHead(405, { Allow: "POST, OPTIONS" });
    return res.end();
  }

  if (url.pathname === "/api/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({
        ok: status.ready,
        mode: MODE,
        model: CHAT_MODEL,
        retrieval: MODE === "rag" ? RETRIEVAL : null,
        embed: MODE === "rag" && RETRIEVAL === "embedding" ? EMBED_MODEL : null,
        problem: status.problem,
      }),
    );
  }

  const file = STATIC[url.pathname];
  if (req.method === "GET" && file) {
    try {
      const data = await readFile(path.join(here, file[0]));
      res.writeHead(200, { "Content-Type": file[1], "Cache-Control": "no-cache" });
      return res.end(data);
    } catch {
      res.writeHead(500);
      return res.end();
    }
  }

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Bulunamadı");
});

// Açılışta Ollama'yı ve modelleri kontrol et, sonra modeli belleğe al.
async function prepare() {
  try {
    const models = await listModels();
    const needed = MODE === "rag" && RETRIEVAL === "embedding" ? [CHAT_MODEL, EMBED_MODEL] : [CHAT_MODEL];
    const has = (name) => models.some((m) => m === name || m === `${name}:latest`);
    const missing = needed.filter((m) => !has(m));
    if (missing.length) {
      status.problem = `Eksik model: ${missing.join(", ")}`;
      console.warn(`[uyarı] ${status.problem}\n        → ${missing.map((m) => `ollama pull ${m}`).join(" && ")}`);
      return;
    }
    if (MODE === "rag" && RETRIEVAL === "embedding") {
      const t = Date.now();
      const { fromCache } = await enqueue(() => loadIndex());
      console.log(
        `[hazırlık] SSS vektörleri ${fromCache ? "önbellekten yüklendi" : `hesaplandı (${((Date.now() - t) / 1000).toFixed(1)}sn)`}`,
      );
    } else if (MODE === "full") {
      console.log("[hazırlık] Tüm SSS sistem mesajı olarak işleniyor; ilk seferde birkaç dakika sürebilir…");
    }
    const t = Date.now();
    await enqueue(() => warmUp({ system: MODE === "full" ? FULL_SYSTEM_PROMPT : RULES, numCtx: NUM_CTX }));
    status.ready = true;
    status.problem = null;
    console.log(`[hazır] ${CHAT_MODEL} belleğe alındı (${((Date.now() - t) / 1000).toFixed(1)}sn).`);
  } catch (err) {
    status.problem = err.hint ?? err.message;
    console.warn(`[uyarı] ${err.message}${err.hint ? `\n        → ${err.hint}` : ""}`);
  }
}

server.listen(PORT, () => {
  console.log(`İSPARK asistanı: http://localhost:${PORT}  (Ollama: ${OLLAMA_URL}, model: ${CHAT_MODEL}, mod: ${MODE}${MODE === "rag" ? `/${RETRIEVAL}` : ""})`);
  prepare();
});
