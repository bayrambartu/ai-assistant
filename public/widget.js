/*!
 * İSPARK'a Sor asistanı - gömülebilir sohbet penceresi
 * Kullanım:
 *   <script src="https://SUNUCU/widget.js" defer></script>
 *   Farklı bir API adresi için: <script src=".../widget.js" data-api="https://SUNUCU/api/chat" defer></script>
 */
(() => {
  if (window.__isparkAsistan) return;
  window.__isparkAsistan = true;

  const script = document.currentScript;
  const API = script?.dataset.api || new URL("/api/chat", script?.src || location.href).href;
  const STORAGE_KEY = "ispark-asistan-v1";
  const MAX_INPUT = 600;
  const MAX_HISTORY = 19; // tek sayı: geçmiş her zaman kullanıcı mesajıyla başlar

  const SUGGESTIONS = [
    "Abone olmak için ne yapmalıyım?",
    "Engelli özel statülü başvuru nasıl yapılır?",
    "Plakamda bana ait olmayan borç görünüyor",
    "Otoparkta aracım hasar gördü",
    "Abonelik ücretini hangi tarihlerde öderim?",
    "Sabiha Gökçen P+R otoparkı hakkında bilgi",
  ];

  const WELCOME =
    "Merhaba! **İSPARK'a Sor** sayfasındaki konularda size yardımcı olabilirim. Sorunuzu yazın ya da aşağıdan bir konu seçin.";

  // Sitedeki Montserrat yazı tipi yoksa yükle (ispark.istanbul zaten yüklüyor).
  if (![...document.querySelectorAll('link[href*="fonts.googleapis.com"]')].some((l) => l.href.includes("Montserrat"))) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }

  const ICONS = {
    chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v12H8l-4 4V4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8 9h8M8 12h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    reset: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.6-5.9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M4 4v5h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    send: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };

  const CSS = `
    :host {
      --blue: #005ea1;
      --blue-dark: #004b81;
      --yellow: #ffda00;
      --gray: #e9e9e9;
      --gray-light: #f4f4f4;
      --border: #e1e1e1;
      --text: #636363;
      --text-strong: #333;
      all: initial;
      font-family: 'Montserrat', Arial, Helvetica, sans-serif;
    }
    *, *::before, *::after { box-sizing: border-box; }
    svg { width: 20px; height: 20px; display: block; }
    button { font: inherit; cursor: pointer; border: 0; }
    button:focus-visible, textarea:focus-visible, a:focus-visible { outline: 2px solid var(--yellow); outline-offset: 2px; }

    .launcher {
      position: fixed; right: 20px; bottom: 20px; z-index: 2147483000;
      display: flex; align-items: stretch; height: 52px; padding: 0;
      background: var(--blue); color: #fff; font-weight: 600; font-size: 14px; letter-spacing: .2px;
      box-shadow: 0 6px 20px rgba(0, 0, 0, .22); border-radius: 3px; overflow: hidden;
      transition: transform .15s ease, background .15s ease;
    }
    .launcher:hover { background: var(--blue-dark); transform: translateY(-2px); }
    .launcher .ico { width: 52px; display: grid; place-items: center; background: var(--blue-dark); color: var(--yellow); }
    .launcher .ico svg { width: 24px; height: 24px; }
    .launcher .label { display: flex; align-items: center; padding: 0 18px 0 14px; }
    .launcher .label b { color: var(--yellow); font-weight: 700; margin-right: 4px; }
    .launcher[aria-expanded="true"] { display: none; }

    .panel {
      position: fixed; right: 20px; bottom: 20px; z-index: 2147483001;
      width: 390px; height: min(640px, calc(100vh - 40px));
      display: flex; flex-direction: column; background: #fff;
      box-shadow: 0 12px 40px rgba(0, 0, 0, .25); border-radius: 3px; overflow: hidden;
      font-size: 14px; color: var(--text);
    }
    .panel[hidden] { display: none; }

    header {
      background: var(--blue); color: #fff; padding: 14px 10px 14px 18px;
      display: flex; align-items: center; gap: 8px; border-bottom: 4px solid var(--yellow);
    }
    header .titles { flex: 1; min-width: 0; }
    header h2 { margin: 0; font-size: 19px; font-weight: 700; color: var(--yellow); line-height: 1.2; }
    header p { margin: 2px 0 0; font-size: 12px; font-weight: 500; opacity: .9; }
    .icon-btn {
      width: 36px; height: 36px; display: grid; place-items: center;
      background: transparent; color: #fff; border-radius: 3px;
    }
    .icon-btn:hover { background: var(--blue-dark); }

    .log { flex: 1; overflow-y: auto; padding: 18px 16px 8px; background: #fff; scroll-behavior: smooth; }
    .msg { display: flex; margin-bottom: 12px; }
    .msg .bubble { max-width: 86%; padding: 11px 14px; line-height: 1.55; border-radius: 3px; word-wrap: break-word; overflow-wrap: anywhere; }
    .msg.bot .bubble { background: var(--gray-light); color: #444; border-left: 3px solid var(--blue); }
    .msg.user { justify-content: flex-end; }
    .msg.user .bubble { background: var(--blue); color: #fff; white-space: pre-wrap; }
    .msg.error .bubble { background: #fff4f4; color: #a12622; border-left-color: #cf2e2e; }
    .bubble p { margin: 0 0 8px; }
    .bubble p:last-child, .bubble ul:last-child { margin-bottom: 0; }
    .bubble ul { margin: 0 0 8px; padding-left: 18px; }
    .bubble li { margin-bottom: 4px; }
    .bubble strong { color: var(--text-strong); font-weight: 600; }
    .bubble a { color: var(--blue); font-weight: 500; text-decoration: underline; text-underline-offset: 2px; word-break: break-all; }
    .bubble a:hover { color: var(--blue-dark); }

    .typing { display: inline-flex; gap: 4px; padding: 4px 0; vertical-align: middle; }
    .typing-text { margin-left: 10px; font-size: 12px; color: #8a8a8a; vertical-align: middle; }
    .typing span { width: 7px; height: 7px; border-radius: 50%; background: var(--blue); opacity: .35; animation: blink 1.2s infinite; }
    .typing span:nth-child(2) { animation-delay: .2s; }
    .typing span:nth-child(3) { animation-delay: .4s; }
    @keyframes blink { 0%, 80%, 100% { opacity: .25; } 40% { opacity: 1; } }

    .suggestions { margin: 4px 0 12px; }
    .suggestions .hint { font-size: 12px; font-weight: 600; color: var(--blue); text-transform: uppercase; letter-spacing: .4px; margin: 0 0 8px; }
    .chip {
      width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 10px;
      min-height: 40px; margin-bottom: 8px; padding: 0 0 0 14px; text-align: left;
      background: var(--gray); color: var(--text); font-size: 13px; font-weight: 500;
    }
    .chip span { padding: 9px 0; line-height: 1.35; }
    .chip i { flex: none; align-self: stretch; width: 40px; display: grid; place-items: center; background: var(--blue); color: #fff; }
    .chip:hover { color: var(--blue); }
    .chip:hover i { background: var(--blue-dark); }

    form { border-top: 1px solid var(--border); padding: 10px 12px; display: flex; gap: 8px; align-items: flex-end; background: #fff; }
    textarea {
      flex: 1; resize: none; min-height: 42px; max-height: 110px; padding: 11px 12px;
      font: inherit; font-size: 14px; color: var(--text-strong); line-height: 1.4;
      border: 1px solid #ddd; border-radius: 3px; background: #fff;
    }
    textarea::placeholder { color: #9a9a9a; }
    textarea:focus { border-color: var(--blue); outline: none; }
    .send { width: 42px; height: 42px; flex: none; display: grid; place-items: center; background: var(--blue); color: var(--yellow); border-radius: 3px; }
    .send:hover { background: var(--blue-dark); }
    .send:disabled { background: #b9c9d6; color: #fff; cursor: not-allowed; }

    .note { margin: 0; padding: 0 12px 10px; font-size: 11px; color: #8a8a8a; line-height: 1.4; }
    .note b { color: var(--blue); }

    @media (max-width: 480px) {
      .panel { right: 0; bottom: 0; width: 100vw; height: 100dvh; border-radius: 0; }
      .launcher { right: 16px; bottom: 16px; }
    }
    @media (prefers-reduced-motion: reduce) {
      .launcher, .log { transition: none; scroll-behavior: auto; }
      .typing span { animation: none; opacity: .6; }
    }
  `;

  // --- DOM ---
  const host = document.createElement("div");
  host.id = "ispark-asistan";
  const root = host.attachShadow({ mode: "open" });
  root.innerHTML = `
    <style>${CSS}</style>
    <button class="launcher" type="button" aria-expanded="false" aria-controls="panel">
      <span class="ico">${ICONS.chat}</span>
      <span class="label"><b>İSPARK'a</b> Sor</span>
    </button>
    <section class="panel" id="panel" role="dialog" aria-labelledby="title" hidden>
      <header>
        <div class="titles">
          <h2 id="title">İSPARK'a Sor</h2>
          <p>Sık sorulan sorular asistanı</p>
        </div>
        <button class="icon-btn reset" type="button" title="Yeni sohbet" aria-label="Yeni sohbet başlat">${ICONS.reset}</button>
        <button class="icon-btn close" type="button" title="Kapat" aria-label="Pencereyi kapat">${ICONS.close}</button>
      </header>
      <div class="log" role="log" aria-live="polite"></div>
      <form>
        <textarea rows="1" maxlength="${MAX_INPUT}" placeholder="Sorunuzu yazın…" aria-label="Sorunuz"></textarea>
        <button class="send" type="submit" aria-label="Gönder">${ICONS.send}</button>
      </form>
      <p class="note">Yanıtlar İSPARK'a Sor sayfasındaki bilgilere dayanır. Diğer konular için <b>ALO 153</b>.</p>
    </section>
  `;
  document.body.appendChild(host);

  const $ = (sel) => root.querySelector(sel);
  const launcher = $(".launcher");
  const panel = $(".panel");
  const log = $(".log");
  const form = $("form");
  const input = $("textarea");
  const sendBtn = $(".send");

  // --- Durum ---
  let history = []; // [{role: "user"|"assistant", content}]
  let busy = false;
  let controller = null;

  const storage = {
    load() {
      try {
        const data = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null");
        if (data && Array.isArray(data.history)) return data;
      } catch {}
      return null;
    },
    save() {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ history, open: !panel.hidden }));
      } catch {}
    },
  };

  // --- Metin biçimlendirme (yalnızca **kalın**, "- " maddeler, bağlantılar) ---
  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  }
  function inline(s) {
    let out = escapeHtml(s);
    // [metin](https://...) biçimindeki bağlantıları önce yer tutucuya al
    const links = [];
    out = out.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, (m, label, url) => {
      links.push(`<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`);
      return `\u0000${links.length - 1}\u0000`;
    });
    out = out.replace(/\bhttps?:\/\/[^\s<\u0000]+/g, (url) => {
      const trail = url.match(/[.,;:!?)*]+$/)?.[0] ?? "";
      const clean = trail ? url.slice(0, -trail.length) : url;
      return `<a href="${clean}" target="_blank" rel="noopener noreferrer">${clean}</a>${trail}`;
    });
    out = out.replace(/(^|[\s(])(www\.ispark\.istanbul[^\s<]*[^\s<.,;:!?)])/g, '$1<a href="https://$2" target="_blank" rel="noopener noreferrer">$2</a>');
    out = out.replace(/(^|[\s(:])([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g, '$1<a href="mailto:$2">$2</a>');
    out = out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    out = out.replace(/\u0000(\d+)\u0000/g, (m, i) => links[Number(i)]);
    return out;
  }
  function formatMessage(text) {
    const html = [];
    let list = null;
    let para = [];
    const flushPara = () => {
      if (para.length) html.push(`<p>${para.map(inline).join("<br>")}</p>`);
      para = [];
    };
    const flushList = () => {
      if (list) html.push(`<ul>${list.map((li) => `<li>${inline(li)}</li>`).join("")}</ul>`);
      list = null;
    };
    for (const raw of text.split("\n")) {
      const line = raw.trimEnd();
      const item = line.match(/^\s*[-•*]\s+(.*)$/);
      if (item) {
        flushPara();
        (list ??= []).push(item[1]);
      } else if (!line.trim()) {
        flushPara();
        flushList();
      } else {
        flushList();
        para.push(line.trim());
      }
    }
    flushPara();
    flushList();
    return html.join("");
  }

  // --- Görünüm ---
  function addMessage(role, text, { error = false } = {}) {
    const wrap = document.createElement("div");
    wrap.className = `msg ${role === "user" ? "user" : "bot"}${error ? " error" : ""}`;
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    if (role === "user") bubble.textContent = text;
    else bubble.innerHTML = formatMessage(text);
    wrap.appendChild(bubble);
    log.appendChild(wrap);
    scrollToEnd();
    return bubble;
  }

  function addTyping() {
    const bubble = addMessage("assistant", "");
    setTyping(bubble, "Yanıt hazırlanıyor…");
    return bubble;
  }

  function setTyping(bubble, text) {
    bubble.innerHTML = `<span class="typing" aria-hidden="true"><span></span><span></span><span></span></span><span class="typing-text">${escapeHtml(text)}</span>`;
  }

  function showSuggestions() {
    const box = document.createElement("div");
    box.className = "suggestions";
    box.innerHTML = '<p class="hint">Sık sorulan konular</p>';
    for (const s of SUGGESTIONS) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.innerHTML = `<span>${escapeHtml(s)}</span><i>${ICONS.chevron}</i>`;
      b.addEventListener("click", () => send(s));
      box.appendChild(b);
    }
    log.appendChild(box);
  }

  function scrollToEnd() {
    log.scrollTop = log.scrollHeight;
  }

  function renderAll() {
    log.innerHTML = "";
    addMessage("assistant", WELCOME);
    if (history.length === 0) showSuggestions();
    for (const m of history) addMessage(m.role, m.content);
  }

  function setBusy(v) {
    busy = v;
    sendBtn.disabled = v || !input.value.trim();
    log.setAttribute("aria-busy", String(v));
  }

  function autosize() {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 110) + "px";
    sendBtn.disabled = busy || !input.value.trim();
  }

  // --- Sunucu ile konuşma (SSE akışı) ---
  async function send(text) {
    text = text.trim().slice(0, MAX_INPUT);
    if (!text || busy) return;

    root.querySelector(".suggestions")?.remove();
    input.value = "";
    autosize();

    history.push({ role: "user", content: text });
    addMessage("user", text);
    const bubble = addTyping();
    setBusy(true);

    let answer = "";
    let frame = 0;
    const paint = () => {
      frame = 0;
      bubble.innerHTML = formatMessage(answer);
      scrollToEnd();
    };
    const schedulePaint = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    controller = new AbortController();
    try {
      const payload = history.slice(-MAX_HISTORY).map((m) => ({
        role: m.role,
        content: m.role === "assistant" ? m.content.slice(0, 4000) : m.content,
      }));
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Şu anda yanıt veremiyorum.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let streamError = null;
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buffer.indexOf("\n\n")) >= 0) {
          const chunk = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 2);
          for (const line of chunk.split("\n")) {
            if (!line.startsWith("data: ")) continue;
            const ev = JSON.parse(line.slice(6));
            if (ev.type === "status") {
              if (!answer) setTyping(bubble, ev.text);
              continue;
            }
            if (ev.type === "delta") answer += ev.text;
            else if (ev.type === "replace") answer = ev.text;
            else if (ev.type === "error") streamError = ev.message;
            schedulePaint();
          }
        }
      }
      if (frame) cancelAnimationFrame(frame);
      paint();
      if (streamError && !answer) throw new Error(streamError);
      if (!answer.trim()) throw new Error("Şu anda yanıt veremiyorum.");
      if (streamError) addMessage("assistant", streamError, { error: true });
      history.push({ role: "assistant", content: answer });
    } catch (err) {
      if (frame) cancelAnimationFrame(frame);
      bubble.parentElement.remove();
      history.pop(); // başarısız soruyu geçmişten çıkar, sıra bozulmasın
      if (err.name !== "AbortError") {
        const msg =
          err instanceof TypeError
            ? "Bağlantı kurulamadı. Lütfen internet bağlantınızı kontrol edip tekrar deneyin."
            : err.message;
        addMessage("assistant", `${msg} Acil durumlar için ALO 153'ü arayabilirsiniz.`, { error: true });
        input.value = text;
        autosize();
      }
    } finally {
      controller = null;
      setBusy(false);
      storage.save();
      if (!panel.hidden) input.focus();
    }
  }

  // --- Aç / kapat ---
  function open() {
    panel.hidden = false;
    launcher.setAttribute("aria-expanded", "true");
    scrollToEnd();
    input.focus();
    storage.save();
  }
  function close() {
    panel.hidden = true;
    launcher.setAttribute("aria-expanded", "false");
    launcher.focus();
    storage.save();
  }

  launcher.addEventListener("click", open);
  $(".close").addEventListener("click", close);
  $(".reset").addEventListener("click", () => {
    controller?.abort();
    history = [];
    renderAll();
    storage.save();
    input.focus();
  });
  panel.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    send(input.value);
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      send(input.value);
    }
  });
  input.addEventListener("input", autosize);

  // --- Başlangıç ---
  const saved = storage.load();
  if (saved) history = saved.history.filter((m) => m && typeof m.content === "string");
  // Kayıtlı geçmiş yarım kaldıysa (son mesaj kullanıcıdaysa) temizle.
  if (history.at(-1)?.role === "user") history.pop();
  renderAll();
  autosize();
  if (saved?.open) open();

  // Sayfadaki başka bir butondan açmak için: window.isparkAsistan.open()
  window.isparkAsistan = { open, close };
})();
