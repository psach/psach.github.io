import { CreateMLCEngine, CreateServiceWorkerMLCEngine, prebuiltAppConfig } from "https://esm.run/@mlc-ai/web-llm";

const DEFAULT_MODEL = "Llama-3.2-1B-Instruct-q4f16_1-MLC";
const STORAGE_KEY = "webllm-offline-chat-v1";
const STATE_KEY = "webllm-offline-chat-state-v1";

const app = document.getElementById("app");
app.innerHTML = `
  <div class="shell">
    <section class="card topbar">
      <div>
        <h1 class="title">WebLLM Offline Chat</h1>
        <p class="subtitle">
          Runs fully in the browser with WebGPU. The first model download is cached locally;
          after that, the app can keep working offline.
        </p>
      </div>
      <div class="badges">
        <div class="badge"><span id="netDot" class="dot"></span><span id="netText">Checking network…</span></div>
        <div class="badge"><span id="modelDot" class="dot"></span><span id="modelText">Engine not loaded</span></div>
      </div>
    </section>

    <section class="card controls">
      <input id="modelId" class="input span2" value="${DEFAULT_MODEL}" aria-label="Model ID" />
      <select id="cacheBackend" class="select" aria-label="Cache backend">
        <option value="indexeddb" selected>IndexedDB cache</option>
        <option value="cache">Cache API</option>
      </select>
      <button id="loadBtn" class="btn">Load model</button>
      <button id="clearBtn" class="btn secondary">Reset chat</button>
      <button id="exportBtn" class="btn secondary">Export</button>
    </section>

    <section class="card chat">
      <div id="messages" class="messages"></div>
      <div style="padding: 14px; border-top: 1px solid rgba(148,163,184,.14);">
        <textarea id="prompt" class="textarea" placeholder="Ask something…" aria-label="Message"></textarea>
        <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:10px; flex-wrap:wrap;">
          <button id="sendBtn" class="btn">Send</button>
        </div>
      </div>
    </section>

    <section class="card footerbar">
      <div>Offline-first PWA shell with service worker and cached model artifacts.</div>
      <div id="statusText">Ready</div>
    </section>
  </div>
`;

const $ = (id) => document.getElementById(id);
const messagesEl = $("messages");
const promptEl = $("prompt");
const modelIdEl = $("modelId");
const cacheBackendEl = $("cacheBackend");
const loadBtn = $("loadBtn");
const sendBtn = $("sendBtn");
const clearBtn = $("clearBtn");
const exportBtn = $("exportBtn");
const statusText = $("statusText");
const netDot = $("netDot");
const netText = $("netText");
const modelDot = $("modelDot");
const modelText = $("modelText");

let engine = null;
let engineKind = "none";
let messages = loadState().messages ?? [
  { role: "system", content: "You are a helpful assistant running locally in the browser." },
  { role: "assistant", content: "Model is not loaded yet. Tap 'Load model' to begin." }
];

function updateNetworkBadge() {
  const online = navigator.onLine;
  netDot.className = `dot ${online ? "ok" : "err"}`;
  netText.textContent = online ? "Online" : "Offline";
}
window.addEventListener("online", updateNetworkBadge);
window.addEventListener("offline", updateNetworkBadge);

function saveState() {
  localStorage.setItem(STATE_KEY, JSON.stringify({
    messages,
    modelId: modelIdEl.value.trim(),
    cacheBackend: cacheBackendEl.value
  }));
}

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STATE_KEY) || "{}");
  } catch {
    return {};
  }
}

function persistUiState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    modelId: modelIdEl.value.trim(),
    cacheBackend: cacheBackendEl.value
  }));
}

function restoreUiState() {
  const state = loadState();
  if (state.modelId) modelIdEl.value = state.modelId;
  if (state.cacheBackend) cacheBackendEl.value = state.cacheBackend;
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function renderMessages() {
  messagesEl.innerHTML = messages.map((msg, index) => {
    const cls = msg.role === "user" ? "user" : msg.role === "assistant" ? "assistant" : "system";
    const body = escapeHtml(msg.content || "");
    const meta = msg.role === "assistant" ? `<div class="meta">assistant</div>` : msg.role === "user" ? `<div class="meta">you</div>` : `<div class="meta">system</div>`;
    return `<div class="msg ${cls}" data-index="${index}">${body}${meta}</div>`;
  }).join("");
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function setStatus(text, kind = "neutral") {
  statusText.textContent = text;
  modelDot.className = `dot ${kind === "ok" ? "ok" : kind === "err" ? "err" : ""}`;
  modelText.textContent = text;
}

function setBusy(busy) {
  loadBtn.disabled = busy;
  sendBtn.disabled = busy;
  clearBtn.disabled = busy;
  exportBtn.disabled = busy;
  modelIdEl.disabled = busy;
  cacheBackendEl.disabled = busy;
}

function ensureWelcome() {
  if (!messages.length) {
    messages = [
      { role: "system", content: "You are a helpful assistant running locally in the browser." },
      { role: "assistant", content: "Hello. Load a model and start chatting." }
    ];
  }
  renderMessages();
}

function getAppConfig() {
  return { ...prebuiltAppConfig, cacheBackend: cacheBackendEl.value };
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return false;
  try {
    await navigator.serviceWorker.register("/sw.js", { type: "module" });
    await navigator.serviceWorker.ready;
    return true;
  } catch (error) {
    console.warn("Service worker registration failed:", error);
    return false;
  }
}

async function loadModel() {
  const modelId = modelIdEl.value.trim() || DEFAULT_MODEL;
  persistUiState();
  setBusy(true);
  setStatus("Loading model…");

  try {
    const appConfig = getAppConfig();
    const initProgressCallback = (report) => {
      if (report?.text) setStatus(report.text);
    };

    if (!engine) {
      const swReady = await registerServiceWorker();
      if (swReady && "serviceWorker" in navigator) {
        engine = await CreateServiceWorkerMLCEngine(modelId, {
          appConfig,
          initProgressCallback,
        });
        engineKind = "service-worker";
      } else {
        engine = await CreateMLCEngine(modelId, {
          appConfig,
          initProgressCallback,
        });
        engineKind = "direct";
      }
    } else {
      await engine.reload(modelId);
    }

    setStatus(`Ready (${engineKind})`, "ok");
  } catch (error) {
    console.error(error);
    setStatus(`Model load failed: ${error?.message || error}`, "err");
    messages.push({
      role: "assistant",
      content: `I could not load the model.\n\n${error?.message || String(error)}`
    });
    saveState();
    renderMessages();
  } finally {
    setBusy(false);
    saveState();
  }
}

async function sendMessage() {
  const text = promptEl.value.trim();
  if (!text) return;
  if (!engine) {
    messages.push({ role: "assistant", content: "Load a model first." });
    saveState();
    renderMessages();
    return;
  }

  promptEl.value = "";
  messages.push({ role: "user", content: text });
  const assistant = { role: "assistant", content: "" };
  messages.push(assistant);
  renderMessages();
  setBusy(true);
  setStatus("Generating…");

  try {
    const reply = await engine.chat.completions.create({
      messages: messages.filter((m) => m.role !== "system"),
      temperature: 0.7,
    });
    const content = reply?.choices?.[0]?.message?.content ?? "(no response)";
    assistant.content = content;
    setStatus("Ready", "ok");
  } catch (error) {
    console.error(error);
    assistant.content = `Generation failed: ${error?.message || String(error)}`;
    setStatus("Generation failed", "err");
  } finally {
    saveState();
    renderMessages();
    setBusy(false);
  }
}

function resetChat() {
  messages = [
    { role: "system", content: "You are a helpful assistant running locally in the browser." },
    { role: "assistant", content: "Chat cleared. Load or reload a model to continue." }
  ];
  saveState();
  renderMessages();
}

function exportChat() {
  const blob = new Blob([JSON.stringify({
    exportedAt: new Date().toISOString(),
    modelId: modelIdEl.value.trim(),
    messages
  }, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "webllm-chat-export.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

modelIdEl.addEventListener("change", persistUiState);
cacheBackendEl.addEventListener("change", persistUiState);
loadBtn.addEventListener("click", loadModel);
sendBtn.addEventListener("click", sendMessage);
clearBtn.addEventListener("click", resetChat);
exportBtn.addEventListener("click", exportChat);
promptEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    sendMessage();
  }
});

updateNetworkBadge();
restoreUiState();
renderMessages();
setStatus("Ready");
saveState();

if (messages.some((m) => m.role === "assistant" && m.content.includes("Load"))) {
  setStatus("Ready", "neutral");
}
