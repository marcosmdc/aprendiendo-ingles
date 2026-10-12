// Audio de la app:
// 1. Verbos: mp3 generados con Piper (scripts/generate_audio.py) en public/audio/verbs.
// 2. Frases: Piper corriendo en el navegador (se descarga la voz una vez y queda guardada).
// 3. Si Piper no esta listo o falla: la voz del navegador (speechSynthesis).

import type { TtsSession } from "@mintplex-labs/piper-tts-web";

const VOICE_ID = "en_US-lessac-medium";
const SLOW_RATE = 0.75;
const MAX_CACHE = 200;
const STORED_KEY = "piper-voice-stored";

export type VoiceStatus =
  | { state: "idle" }
  | { state: "loading"; progress: number }
  | { state: "ready" }
  | { state: "error" };

let status: VoiceStatus = { state: "idle" };
const listeners = new Set<(status: VoiceStatus) => void>();
let sessionPromise: Promise<TtsSession> | null = null;
let current: HTMLAudioElement | null = null;
// Cada pedido de audio tiene un numero: si llega otro, el anterior ya no suena.
let lastRequest = 0;
const cache = new Map<string, string>();

function setStatus(next: VoiceStatus) {
  status = next;
  listeners.forEach((listener) => listener(status));
}

export function subscribeVoice(listener: (status: VoiceStatus) => void) {
  listeners.add(listener);
  listener(status);
  return () => {
    listeners.delete(listener);
  };
}

function stop() {
  current?.pause();
  current = null;
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

function play(src: string, slow = false) {
  stop();
  const audio = new Audio(src);
  audio.playbackRate = slow ? SLOW_RATE : 1;
  current = audio;
  return audio.play();
}

function bestBrowserVoice() {
  const voices = window.speechSynthesis.getVoices().filter((voice) => voice.lang.replace("_", "-").startsWith("en-US"));
  return (
    voices.find((voice) => /natural|neural/i.test(voice.name)) ??
    voices.find((voice) => /google us english|samantha|aria|jenny/i.test(voice.name)) ??
    voices[0]
  );
}

function speakWithBrowser(text: string, slow: boolean) {
  if (!("speechSynthesis" in window)) return;
  stop();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.voice = bestBrowserVoice() ?? null;
  utterance.rate = slow ? 0.72 : 0.9;
  window.speechSynthesis.speak(utterance);
}

function loadPiper() {
  if (!sessionPromise) {
    setStatus({ state: "loading", progress: 0 });
    sessionPromise = import("@mintplex-labs/piper-tts-web")
      .then(({ TtsSession }) =>
        TtsSession.create({
          voiceId: VOICE_ID,
          progress: ({ loaded, total }) => {
            if (total) setStatus({ state: "loading", progress: Math.round((loaded * 100) / total) });
          }
        })
      )
      .then((session) => {
        try {
          window.localStorage.setItem(STORED_KEY, "1");
        } catch {}
        setStatus({ state: "ready" });
        return session;
      })
      .catch((error) => {
        console.error("No se pudo cargar Piper", error);
        sessionPromise = null;
        setStatus({ state: "error" });
        throw error;
      });
  }
  return sessionPromise;
}

async function piperUrl(text: string) {
  const cached = cache.get(text);
  if (cached) return cached;
  const session = await loadPiper();
  const url = URL.createObjectURL(await session.predict(text));
  if (cache.size >= MAX_CACHE) {
    const [oldest, oldUrl] = cache.entries().next().value as [string, string];
    URL.revokeObjectURL(oldUrl);
    cache.delete(oldest);
  }
  cache.set(text, url);
  return url;
}

/** Frases: Piper si la voz ya esta descargada; mientras se descarga, la voz del navegador. */
export async function speakText(text: string, slow = false) {
  const request = ++lastRequest;
  if (status.state !== "ready") {
    // Arranca la descarga en segundo plano y responde ya con la voz del navegador.
    loadPiper().catch(() => undefined);
    speakWithBrowser(text, slow);
    return;
  }
  try {
    const url = await piperUrl(text);
    if (request !== lastRequest) return;
    await play(url, slow);
  } catch (error) {
    // AbortError: otro audio lo interrumpio a proposito.
    if (request !== lastRequest || (error as Error).name === "AbortError") return;
    console.error("Piper fallo, uso la voz del navegador", error);
    speakWithBrowser(text, slow);
  }
}

/** Verbo (base, past, participle) pregrabado con Piper. */
export async function playVerb(verb: { base: string; past: string; participle: string }, slow = false) {
  const request = ++lastRequest;
  try {
    await play(`/audio/verbs/${verb.base}${slow ? "-slow" : ""}.mp3`);
  } catch (error) {
    if (request !== lastRequest || (error as Error).name === "AbortError") return;
    speakText(`${verb.base}. ${verb.past.replace("/", " or ")}. ${verb.participle.replace("/", " or ")}.`, slow);
  }
}

/** Descarga la voz de Piper sin esperar a que se use. */
export function preloadPiper() {
  loadPiper().catch(() => undefined);
}

/** Si la voz ya se descargo antes, la carga de nuevo al abrir la app. */
export function resumePiper() {
  try {
    if (window.localStorage.getItem(STORED_KEY)) preloadPiper();
  } catch {}
}

/** Corta cualquier audio (y los pedidos pendientes), por ejemplo antes de usar el microfono. */
export function stopAudio() {
  lastRequest++;
  stop();
}
