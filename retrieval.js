// Her soru için en ilgili SSS maddelerini bulur. Bulunan maddeler sistem mesajına girer.
//
// RETRIEVAL=lexical (varsayılan): modelsiz kelime araması (BM25). Bellekte ek model tutmaz;
//   8 GB makinede sohbet modeli bellekten atılmaz ve Ollama önbelleği korunur.
// RETRIEVAL=embedding: bge-m3 ile anlamsal arama. Daha isabetli ama ~1,2 GB ek bellek ister.

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FAQ } from "./faq.js";
import { embed, EMBED_MODEL } from "./ollama.js";

export const METHOD = process.env.RETRIEVAL === "embedding" ? "embedding" : "lexical";

// ---------- Kelime araması (BM25) ----------

const STOPWORDS = new Set(
  "ve veya ile icin bir bu su o da de mi mu ne nasil nedir neden nere nereye nerede ben benim bana siz size sizin var yok olan olarak gibi daha cok en ama fakat ki hangi kac acaba lutfen merhaba istiyorum yapabilirim yapmaliyim yapmam gerekiyor peki ispark otopark otoparki otoparkta otoparklar".split(" "),
);

function normalize(text) {
  return text
    .toLocaleLowerCase("tr")
    .replace(/[çğıöşüâî]/g, (c) => ({ ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", â: "a", î: "i" })[c])
    .replace(/[^a-z0-9\s]/g, " ");
}

// Türkçe ekleri kabaca atmak için kelimenin ilk 5 harfi kullanılır ("borcumu" -> "borcu").
const tokens = (text) =>
  normalize(text)
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w))
    .map((w) => (/^\d+$/.test(w) ? w : w.slice(0, 5)));

// Soru ve anahtar kelimeler cevaptan daha belirleyici olduğu için iki kez sayılır.
const lexDocs = FAQ.map((f) => tokens(`${f.soru} ${f.anahtar ?? ""} ${f.soru} ${f.anahtar ?? ""} ${f.cevap}`));
const avgLen = lexDocs.reduce((n, d) => n + d.length, 0) / lexDocs.length;
const df = new Map();
for (const d of lexDocs) for (const t of new Set(d)) df.set(t, (df.get(t) ?? 0) + 1);
const tf = lexDocs.map((d) => d.reduce((m, t) => m.set(t, (m.get(t) ?? 0) + 1), new Map()));

function bm25(query) {
  const q = [...new Set(tokens(query))];
  const N = lexDocs.length, k1 = 1.2, b = 0.75;
  return lexDocs.map((d, i) => {
    let score = 0;
    for (const t of q) {
      const f = tf[i].get(t);
      if (!f) continue;
      const idf = Math.log(1 + (N - df.get(t) + 0.5) / (df.get(t) + 0.5));
      score += (idf * f * (k1 + 1)) / (f + k1 * (1 - b + (b * d.length) / avgLen));
    }
    return score;
  });
}

// ---------- Anlamsal arama (bge-m3) ----------

const here = path.dirname(fileURLToPath(import.meta.url));
const CACHE_FILE = path.join(here, ".cache", "faq-embeddings.json");
const docText = (item) => `${item.soru}\n${item.cevap}`;
let vectors = null;

function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / Math.sqrt(na * nb);
}

export async function loadIndex() {
  if (METHOD !== "embedding") return { fromCache: true };
  const hash = createHash("sha256")
    .update(EMBED_MODEL + "\n" + FAQ.map(docText).join("\n---\n"))
    .digest("hex");
  try {
    const cached = JSON.parse(await readFile(CACHE_FILE, "utf8"));
    if (cached.hash === hash && cached.vectors.length === FAQ.length) {
      vectors = cached.vectors;
      return { fromCache: true };
    }
  } catch {}
  vectors = await embed(FAQ.map(docText));
  await mkdir(path.dirname(CACHE_FILE), { recursive: true });
  await writeFile(CACHE_FILE, JSON.stringify({ hash, model: EMBED_MODEL, vectors }));
  return { fromCache: false };
}

// ---------- Ortak ----------

export async function findRelevant(query, k) {
  let scores;
  if (METHOD === "embedding") {
    if (!vectors) await loadIndex();
    const [q] = await embed(query);
    scores = vectors.map((v) => cosine(q, v));
  } else {
    scores = bm25(query);
  }
  return scores
    .map((score, i) => ({ item: FAQ[i], score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
