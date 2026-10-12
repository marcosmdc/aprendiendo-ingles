"use client";

import { useEffect, useRef, useState } from "react";
import type { Verb } from "./data";
import { checkAnswer, makeExercise, type Exercise } from "./cloze";
import { recordAnswer } from "./progress";
import { speakText } from "./tts";

// En modo repaso hay un solo ejercicio por verbo: "Siguiente" pasa al proximo repaso.
type Props = { verb: Verb; showEs: boolean; onNextVerb: () => void; review?: boolean };

export default function ClozePractice({ verb, showEs, onNextVerb, review = false }: Props) {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [value, setValue] = useState("");
  const [result, setResult] = useState<"ok" | "error" | null>(null);
  const [score, setScore] = useState({ ok: 0, total: 0 });
  const input = useRef<HTMLInputElement>(null);

  function newExercise() {
    setExercise(makeExercise(verb));
    setValue("");
    setResult(null);
    input.current?.focus();
  }

  // Se arma en el cliente (es al azar) y cada vez que cambia el verbo.
  useEffect(newExercise, [verb]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!exercise) return null;

  function check() {
    if (!exercise || result || !value.trim()) return;
    const ok = checkAnswer(exercise, value);
    setResult(ok ? "ok" : "error");
    setScore((current) => ({ ok: current.ok + (ok ? 1 : 0), total: current.total + 1 }));
    recordAnswer(`verb:${verb.base}`, ok);
    speakText(exercise.example);
  }

  return (
    <div className="cloze">
      <div className="clozeTop">
        <span>{exercise.label}</span>
        <span>{score.ok} / {score.total} correctas</span>
      </div>

      <p className="clozeSentence">
        {exercise.before}
        <input
          ref={input}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;
            if (!result) check();
            else if (review) onNextVerb();
            else newExercise();
          }}
          readOnly={result !== null}
          className={result ?? ""}
          size={Math.max(exercise.answer.length, 4)}
          aria-label={`Completar con ${exercise.hint}`}
          autoCapitalize="off"
          autoComplete="off"
          spellCheck={false}
        />
        <span className="clozeHint">({exercise.hint})</span>
        {exercise.after}
      </p>
      {showEs && exercise.es && <p className="es">{exercise.es}</p>}

      {result && (
        <p className={result}>
          {result === "ok" ? "¡Correcto!" : <>La respuesta es: <strong>{exercise.answer}</strong></>}
          {exercise.accepted.length > 1 && ` (también vale: ${exercise.accepted.join(" / ")})`}
        </p>
      )}

      <div className="actions">
        {result ? (
          <button onClick={review ? onNextVerb : newExercise}>{review ? "Siguiente" : "Otra oración"}</button>
        ) : (
          <button onClick={check} disabled={!value.trim()}>Comprobar</button>
        )}
        <button className="secondary" onClick={() => speakText(exercise.example)} disabled={!result}>Escuchar</button>
        {!review && <button className="secondary" onClick={onNextVerb}>Otro verbo</button>}
      </div>
    </div>
  );
}
