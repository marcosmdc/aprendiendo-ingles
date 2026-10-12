"use client";

import { useEffect, useState } from "react";
import type { Phrase } from "./phrases";
import { useSpeakCheck } from "./speak-check";
import { speakText } from "./tts";

type Kind = "build" | "listen" | "speak";
type Tile = { id: number; word: string };
type Question =
  | { kind: "build"; phrase: Phrase; tiles: Tile[] }
  | { kind: "listen"; phrase: Phrase; options: string[] }
  | { kind: "speak"; phrase: Phrase };

// En "Decir la frase" cuenta como correcta si el primer intento llega a este puntaje.
const SPEAK_PASS = 80;

const randomItem = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function makeQuestion(kind: Kind, phrases: Phrase[], previous?: Phrase): Question {
  // Para armar, frases de al menos 3 palabras (si no, no hay nada que ordenar).
  const usable = kind === "build" ? phrases.filter((item) => item.en.split(" ").length >= 3) : phrases;
  const pool = usable.length > 1 ? usable.filter((item) => item !== previous) : usable;
  const phrase = randomItem(pool);

  if (kind === "build") {
    const tiles = phrase.en.split(" ").map((word, id) => ({ id, word }));
    // Mezcladas, pero nunca en el orden correcto.
    let shuffled = shuffle(tiles);
    for (let i = 0; i < 5 && tiles.length > 1 && shuffled.every((tile, index) => tile.id === index); i++) {
      shuffled = shuffle(tiles);
    }
    return { kind, phrase, tiles: shuffled };
  }

  if (kind === "speak") return { kind, phrase };

  const wrong = shuffle(Array.from(new Set(phrases.map((item) => item.es))).filter((es) => es !== phrase.es)).slice(0, 3);
  return { kind, phrase, options: shuffle([phrase.es, ...wrong]) };
}

export default function PhrasePractice({ phrases }: { phrases: Phrase[] }) {
  const [kind, setKind] = useState<Kind>("build");
  const [question, setQuestion] = useState<Question>(() => makeQuestion("build", phrases));
  const [picked, setPicked] = useState<Tile[]>([]);
  const [choice, setChoice] = useState<string | null>(null);
  const [result, setResult] = useState<"ok" | "error" | null>(null);
  const [score, setScore] = useState({ ok: 0, total: 0 });
  // Solo el primer intento suma al puntaje; despues se puede seguir practicando.
  const speak = useSpeakCheck(question.phrase.en, (value) => {
    if (question.kind === "speak" && !result) grade(value >= SPEAK_PASS);
  });

  function next(nextKind = kind) {
    const nextQuestion = makeQuestion(nextKind, phrases, question.phrase);
    setQuestion(nextQuestion);
    setPicked([]);
    setChoice(null);
    setResult(null);
    if (nextQuestion.kind === "listen") speakText(nextQuestion.phrase.en);
  }

  function changeKind(value: Kind) {
    setKind(value);
    next(value);
  }

  function grade(ok: boolean) {
    setResult(ok ? "ok" : "error");
    setScore((current) => ({ ok: current.ok + (ok ? 1 : 0), total: current.total + 1 }));
  }

  function checkBuild() {
    grade(picked.map((tile) => tile.word).join(" ") === question.phrase.en);
    speakText(question.phrase.en);
  }

  function choose(option: string) {
    if (result) return;
    setChoice(option);
    grade(option === question.phrase.es);
  }

  // Enter = comprobar / siguiente, para practicar rapido con teclado.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Enter" || (event.target as HTMLElement).tagName === "BUTTON") return;
      if (result) next();
      else if (question.kind === "build" && picked.length === question.tiles.length) checkBuild();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const remaining = question.kind === "build" ? question.tiles.filter((tile) => !picked.includes(tile)) : [];

  return (
    <div className="phrasePractice">
      <div className="practiceBar">
        <div className="chips" aria-label="Tipo de ejercicio">
          <button className={kind === "build" ? "active" : ""} onClick={() => changeKind("build")}>Armar la frase</button>
          <button className={kind === "listen" ? "active" : ""} onClick={() => changeKind("listen")}>Escuchar y elegir</button>
          <button className={kind === "speak" ? "active" : ""} onClick={() => changeKind("speak")}>Decir la frase</button>
        </div>
        <span className="score">{score.ok} / {score.total} correctas</span>
      </div>

      <div className="cloze">
        {question.phrase.who && <span className="who">Lo dice: {question.phrase.who}</span>}

        {question.kind === "build" ? (
          <>
            <p className="prompt">{question.phrase.es}</p>
            <p className="instructions">Toca las palabras en orden para armar la frase en ingles.</p>

            <div className={`answerLine ${result ?? ""}`} aria-label="Tu respuesta">
              {picked.length === 0 && <span className="placeholder">Tu respuesta</span>}
              {picked.map((tile) => (
                <button key={tile.id} className="tile" disabled={result !== null} onClick={() => setPicked(picked.filter((item) => item !== tile))}>
                  {tile.word}
                </button>
              ))}
            </div>
            <div className="tiles" aria-label="Palabras disponibles">
              {remaining.map((tile) => (
                <button key={tile.id} className="tile" disabled={result !== null} onClick={() => setPicked([...picked, tile])}>
                  {tile.word}
                </button>
              ))}
            </div>
          </>
        ) : question.kind === "speak" ? (
          <>
            <p className="prompt">{question.phrase.en}</p>
            <p className="es">{question.phrase.es}</p>
            <p className="instructions">Escuchala, después tocá Decir y repetila en voz alta. Con {SPEAK_PASS}% o más, cuenta como correcta.</p>
            <div className="actions">
              <button className="secondary" onClick={() => speakText(question.phrase.en)}>Escuchar</button>
              <button className="secondary" onClick={() => speakText(question.phrase.en, true)}>Lento</button>
              {speak.button}
            </div>
            {speak.feedback}
          </>
        ) : (
          <>
            <p className="instructions">Escucha la frase y elegi que significa.</p>
            <div className="actions">
              <button onClick={() => speakText(question.phrase.en)}>Escuchar</button>
              <button className="secondary" onClick={() => speakText(question.phrase.en, true)}>Lento</button>
            </div>
            <div className="options">
              {question.options.map((option) => (
                <button
                  key={option}
                  className={`option ${result && option === question.phrase.es ? "correct" : ""} ${option === choice && result === "error" ? "wrong" : ""}`}
                  disabled={result !== null}
                  onClick={() => choose(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        )}

        {result && question.kind !== "speak" && (
          <div className="feedback">
            <p className={result}>{result === "ok" ? "¡Correcto!" : "No era esa."}</p>
            <p className="answerText">
              <strong>{question.phrase.en}</strong>
              <span className="es">{question.phrase.es}</span>
            </p>
          </div>
        )}

        <div className="actions">
          {result ? (
            <button onClick={() => next()}>Siguiente</button>
          ) : question.kind === "speak" ? (
            <button className="secondary" onClick={() => next()}>Saltar</button>
          ) : question.kind === "build" ? (
            <>
              <button onClick={checkBuild} disabled={picked.length !== question.tiles.length}>Comprobar</button>
              <button className="secondary" onClick={() => setPicked([])} disabled={!picked.length}>Borrar</button>
              <button className="secondary" onClick={() => speakText(question.phrase.en)}>Pista: escuchar</button>
            </>
          ) : null}
          {result && question.kind !== "speak" && (
            <button className="secondary" onClick={() => speakText(question.phrase.en)}>Escuchar de nuevo</button>
          )}
        </div>
      </div>
    </div>
  );
}
