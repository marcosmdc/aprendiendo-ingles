// Reconocimiento de voz del navegador (Chrome, Edge, Safari). En Chrome el audio
// se procesa en los servidores de Google, asi que necesita conexion.

type SpeechRecognitionConstructor = new () => SpeechRecognition;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }

  interface SpeechRecognition extends EventTarget {
    lang: string;
    interimResults: boolean;
    maxAlternatives: number;
    continuous: boolean;
    start: () => void;
    stop: () => void;
    abort: () => void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onend: (() => void) | null;
    onerror: ((event: { error: string }) => void) | null;
  }

  interface SpeechRecognitionEvent {
    results: SpeechRecognitionResultList;
  }
}

export class SpeechError extends Error {}

const messages: Record<string, string> = {
  "not-allowed": "Permití el uso del micrófono para practicar.",
  "service-not-allowed": "Permití el uso del micrófono para practicar.",
  "no-speech": "No te escuché. Tocá Decir y hablá apenas aparezca \"Escuchando...\".",
  "audio-capture": "No se encontró un micrófono.",
  network: "El reconocimiento de voz necesita conexión a internet."
};

let active: SpeechRecognition | null = null;

export function speechSupported() {
  return typeof window !== "undefined" && Boolean(window.SpeechRecognition ?? window.webkitSpeechRecognition);
}

/** Escucha una frase y devuelve las transcripciones posibles, de la mas probable a la menos. */
export function recognize(): Promise<string[]> {
  const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
  if (!Recognition) {
    return Promise.reject(new SpeechError("Tu navegador no reconoce voz. Probá con Chrome, Edge o Safari."));
  }

  active?.abort();
  const recognition = new Recognition();
  active = recognition;
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.continuous = false;
  recognition.maxAlternatives = 5;

  return new Promise((resolve, reject) => {
    let alternatives: string[] = [];
    let failed = false;

    recognition.onresult = (event) => {
      const result = event.results[0];
      alternatives = Array.from({ length: result.length }, (_, index) => result[index].transcript);
    };
    recognition.onerror = (event) => {
      failed = true;
      // "aborted": se empezo otra escucha, no es un error para mostrar.
      if (event.error === "aborted") reject(new SpeechError(""));
      else reject(new SpeechError(messages[event.error] ?? "No se pudo usar el micrófono."));
    };
    recognition.onend = () => {
      if (active === recognition) active = null;
      if (failed) return;
      if (alternatives.length) resolve(alternatives);
      else reject(new SpeechError(messages["no-speech"]));
    };
    recognition.start();
  });
}
