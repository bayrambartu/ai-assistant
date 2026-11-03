// Ollama HTTP API ile konuşan küçük istemci (ek paket gerektirmez).
// Belgeler: https://docs.ollama.com/api

export const OLLAMA_URL = (process.env.OLLAMA_URL ?? "http://127.0.0.1:11434").replace(/\/$/, "");
export const CHAT_MODEL = process.env.OLLAMA_MODEL ?? "qwen3:4b-instruct";
export const EMBED_MODEL = process.env.OLLAMA_EMBED_MODEL ?? "bge-m3";
// Model boştayken bellekte ne kadar kalsın. Kısa tutmak 8 GB makinede belleği geri verir.
export const KEEP_ALIVE = process.env.OLLAMA_KEEP_ALIVE ?? "30m";

export class OllamaError extends Error {
  constructor(message, { status, hint } = {}) {
    super(message);
    this.status = status;
    this.hint = hint;
  }
}

async function post(path, body, signal) {
  let res;
  try {
    res = await fetch(`${OLLAMA_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new OllamaError(`Ollama'ya bağlanılamadı (${OLLAMA_URL})`, {
      hint: "Ollama uygulamasını açın ya da terminalde `ollama serve` çalıştırın.",
    });
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let msg = text;
    try {
      msg = JSON.parse(text).error ?? text;
    } catch {}
    const missing = res.status === 404 && /not found/i.test(msg);
    throw new OllamaError(`Ollama ${res.status}: ${msg}`, {
      status: res.status,
      hint: missing ? `Modeli indirin: ollama pull ${body.model}` : undefined,
    });
  }
  return res;
}

export async function listModels() {
  let res;
  try {
    res = await fetch(`${OLLAMA_URL}/api/tags`);
  } catch {
    throw new OllamaError(`Ollama'ya bağlanılamadı (${OLLAMA_URL})`, {
      hint: "Ollama uygulamasını açın ya da terminalde `ollama serve` çalıştırın.",
    });
  }
  const data = await res.json();
  return (data.models ?? []).map((m) => m.name);
}

export async function embed(input) {
  const res = await post("/api/embed", { model: EMBED_MODEL, input, keep_alive: KEEP_ALIVE });
  const data = await res.json();
  return data.embeddings;
}

// Sohbet yanıtını parça parça üretir (NDJSON akışı). Son parçada istatistikler gelir.
export async function* chatStream({ messages, numCtx, signal }) {
  const res = await post(
    "/api/chat",
    {
      model: CHAT_MODEL,
      messages,
      stream: true,
      keep_alive: KEEP_ALIVE,
      options: {
        num_ctx: numCtx,
        temperature: 0.3,
        num_predict: 450,
      },
    },
    signal,
  );
  const decoder = new TextDecoder();
  let buffer = "";
  for await (const chunk of res.body) {
    buffer += decoder.decode(chunk, { stream: true });
    let idx;
    while ((idx = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, idx).trim();
      buffer = buffer.slice(idx + 1);
      if (!line) continue;
      const event = JSON.parse(line);
      if (event.error) throw new OllamaError(`Ollama: ${event.error}`);
      yield event;
    }
  }
}

// Modeli belleğe yükler (ve verilen sistem istemini önbelleğe alır), böylece ilk kullanıcı beklemez.
export async function warmUp({ system, numCtx }) {
  const messages = system ? [{ role: "system", content: system }, { role: "user", content: "merhaba" }] : [];
  const res = await post("/api/chat", {
    model: CHAT_MODEL,
    messages,
    stream: false,
    keep_alive: KEEP_ALIVE,
    options: { num_ctx: numCtx, num_predict: 1 },
  });
  return res.json();
}
