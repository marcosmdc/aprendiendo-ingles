// Service worker: la app funciona sin conexion despues de la primera visita.
const CACHE = "speakup-v1";
const AUDIO_INDEX = "/audio/verbs/index.json";
const PRECACHE = ["/", "/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon-512.png"];

// Archivos de Piper que se bajan de CDNs (el modelo de voz lo guarda la propia libreria).
const CDN_HOSTS = ["cdnjs.cloudflare.com", "cdn.jsdelivr.net"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
      .then(() => cacheAllAudio())
  );
});

// Guarda los mp3 de los verbos en segundo plano para poder escucharlos sin conexion.
async function cacheAllAudio() {
  try {
    const cache = await caches.open(CACHE);
    const files = await fetch(AUDIO_INDEX).then((response) => response.json());
    for (const file of files) {
      if (!(await cache.match(file))) await cache.add(file);
    }
  } catch (error) {
    console.warn("No se pudieron guardar los audios", error);
  }
}

// El <audio> pide rangos (respuesta 206) que no se pueden guardar: se guarda el archivo entero.
async function audioFile(url) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(url.pathname);
  if (cached) return cached;
  const response = await fetch(url.pathname);
  if (response.ok) cache.put(url.pathname, response.clone());
  return response;
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(CACHE);
    cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return (await cache.match(request)) ?? (await cache.match("/"));
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  const sameOrigin = url.origin === self.location.origin;
  if (sameOrigin && url.pathname.endsWith(".mp3")) {
    event.respondWith(audioFile(url));
    return;
  }

  const immutable = sameOrigin && /^\/(_next\/static|audio|icons)\//.test(url.pathname);
  if (immutable || CDN_HOSTS.includes(url.hostname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (sameOrigin) event.respondWith(networkFirst(request));
});
