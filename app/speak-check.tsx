"use client";

import { useEffect, useState } from "react";
import { comparePronunciation, type Comparison } from "./pronunciation";
import { recordSpeech } from "./progress";
import { recognize, SpeechError } from "./speech";
import { stopAudio } from "./tts";

type State =
  | { status: "idle" }
  | { status: "listening" }
  | { status: "done"; result: Comparison }
  | { status: "error"; message: string };

/**
 * Practica de pronunciacion: escucha al usuario y compara con `target`.
 * Devuelve el boton y el bloque de resultado por separado, para ubicarlos donde convenga.
 */
export const SPEAK_PASS = 80;

type Options = {
  onResult?: (score: number) => void;
  // false cuando el ejercicio ya suma su propia respuesta (para no contarla dos veces).
  countAnswer?: boolean;
};

export function useSpeakCheck(target: string, { onResult, countAnswer = true }: Options = {}) {
  const [state, setState] = useState<State>({ status: "idle" });

  // Si cambia la frase (otro sujeto, otro verbo), se borra el resultado anterior.
  useEffect(() => setState({ status: "idle" }), [target]);

  async function start() {
    stopAudio();
    setState({ status: "listening" });
    try {
      const result = comparePronunciation(target, await recognize());
      setState({ status: "done", result });
      recordSpeech(result.words, result.score >= SPEAK_PASS, countAnswer);
      onResult?.(result.score);
    } catch (error) {
      const message = error instanceof SpeechError ? error.message : "No se pudo usar el micrófono.";
      setState(message ? { status: "error", message } : { status: "idle" });
    }
  }

  const listening = state.status === "listening";
  const button = (
    <button className={`secondary speakButton ${listening ? "listening" : ""}`} onClick={start} disabled={listening} aria-label={`Decir en voz alta: ${target}`}>
      {listening ? "Escuchando..." : "Decir"}
    </button>
  );

  const feedback = state.status === "done" || state.status === "error" ? <SpeakFeedback state={state} /> : null;
  return { button, feedback, listening };
}

function verdict(score: number) {
  if (score >= 90) return { tone: "ok", text: "¡Excelente pronunciación!" };
  if (score >= 70) return { tone: "ok", text: "Muy bien. Repetí las palabras en rojo." };
  return { tone: "error", text: "Probá de nuevo: escuchala lento y repetila." };
}

function SpeakFeedback({ state }: { state: Extract<State, { status: "done" | "error" }> }) {
  if (state.status === "error") {
    return <p className="speakFeedback error" role="status">{state.message}</p>;
  }

  const { score, words, heard } = state.result;
  const { tone, text } = verdict(score);
  return (
    <div className="speakFeedback" role="status">
      <p className="speakWords">
        {words.map((word, index) => (
          <span key={index} className={word.ok ? "wordOk" : "wordMiss"}>{word.text} </span>
        ))}
      </p>
      <p className={tone}>
        {score}% · {text}
      </p>
      <p className="heard">Te entendí: “{heard}”</p>
    </div>
  );
}
