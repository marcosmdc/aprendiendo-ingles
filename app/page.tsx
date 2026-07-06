"use client";

import { useEffect, useMemo, useState } from "react";
import { verbs, type Verb } from "./data";

type Mode = "cards" | "quiz";
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
    start: () => void;
    stop: () => void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onend: (() => void) | null;
    onerror: (() => void) | null;
  }

  interface SpeechRecognitionEvent {
    results: SpeechRecognitionResultList;
  }
}

const examples = [
  (verb: Verb) => `I ${verb.base} it every week.`,
  (verb: Verb) => `Yesterday I ${verb.past.split("/")[0]} it.`,
  (verb: Verb) => `I have ${verb.participle.split("/")[0]} it before.`
];

const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ");

const acceptsAnswer = (answer: string, expected: string) => {
  const normalized = normalize(answer);
  return expected.split("/").map(normalize).includes(normalized);
};

export default function Home() {
  const weeks = useMemo(() => Array.from(new Set(verbs.map((verb) => verb.week))), []);
  const patterns = useMemo(() => Array.from(new Set(verbs.map((verb) => verb.pattern))), []);
  const [week, setWeek] = useState("all");
  const [pattern, setPattern] = useState("all");
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<Mode>("cards");
  const [activeIndex, setActiveIndex] = useState(0);
  const [answerPast, setAnswerPast] = useState("");
  const [answerParticiple, setAnswerParticiple] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [heard, setHeard] = useState("");
  const [listening, setListening] = useState(false);
  const [known, setKnown] = useState<string[]>([]);

  useEffect(() => {
    const saved = window.localStorage.getItem("known-verbs");
    if (saved) setKnown(JSON.parse(saved));
  }, []);

  const filtered = useMemo(() => {
    return verbs.filter((verb) => {
      const text = `${verb.base} ${verb.past} ${verb.participle}`.toLowerCase();
      return (
        (week === "all" || verb.week === Number(week)) &&
        (pattern === "all" || verb.pattern === pattern) &&
        text.includes(query.toLowerCase())
      );
    });
  }, [pattern, query, week]);

  const active = filtered[activeIndex] ?? filtered[0] ?? verbs[0];
  const activeKey = `${active.base}-${active.week}`;
  const phrase = examples[activeIndex % examples.length](active);
  const pastOk = acceptsAnswer(answerPast, active.past);
  const participleOk = acceptsAnswer(answerParticiple, active.participle);

  useEffect(() => {
    setActiveIndex(0);
    setShowResult(false);
    setAnswerPast("");
    setAnswerParticiple("");
    setHeard("");
  }, [filtered.length, pattern, query, week]);

  function speak(text: string, slow = false) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = slow ? 0.72 : 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }

  function nextCard() {
    setActiveIndex((current) => (current + 1) % filtered.length);
    setShowResult(false);
    setAnswerPast("");
    setAnswerParticiple("");
    setHeard("");
  }

  function toggleKnown() {
    const next = known.includes(activeKey)
      ? known.filter((key) => key !== activeKey)
      : [...known, activeKey];
    setKnown(next);
    window.localStorage.setItem("known-verbs", JSON.stringify(next));
  }

  function listenToUser() {
    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Recognition) {
      setHeard("Tu navegador no soporta reconocimiento de voz. Probalo en Chrome.");
      return;
    }

    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => setHeard(event.results[0][0].transcript);
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    setListening(true);
    recognition.start();
  }

  return (
    <main className="shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Plan desde Excel</p>
          <h1>Practica verbos irregulares en ingles escuchando, repitiendo y escribiendo.</h1>
          <p className="intro">
            {verbs.length} verbos organizados por semanas y patrones. Ideal para estudiar un grupo chico,
            escuchar pronunciacion americana y comprobar pasado simple y participio.
          </p>
        </div>
        <div className="stats" aria-label="Resumen">
          <strong>{known.length}</strong>
          <span>dominados</span>
          <strong>{filtered.length}</strong>
          <span>en vista</span>
        </div>
      </section>

      <section className="toolbar" aria-label="Filtros">
        <label>
          Semana
          <select value={week} onChange={(event) => setWeek(event.target.value)}>
            <option value="all">Todas</option>
            {weeks.map((item) => (
              <option key={item} value={item}>Semana {item}</option>
            ))}
          </select>
        </label>
        <label>
          Patron
          <select value={pattern} onChange={(event) => setPattern(event.target.value)}>
            <option value="all">Todos</option>
            {patterns.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          Buscar
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="write, went, broken..." />
        </label>
      </section>

      <section className="modeSwitch" aria-label="Modo de practica">
        <button className={mode === "cards" ? "active" : ""} onClick={() => setMode("cards")}>Tarjetas</button>
        <button className={mode === "quiz" ? "active" : ""} onClick={() => setMode("quiz")}>Mini quiz</button>
      </section>

      <section className="practice">
        <article className="card">
          <div className="cardTop">
            <span>Semana {active.week}</span>
            <span>{active.pattern}</span>
          </div>
          <h2>{active.base}</h2>
          <p className="forms">{active.base} / {active.past} / {active.participle}</p>
          <p className="phrase">{phrase}</p>

          <div className="actions">
            <button onClick={() => speak(`${active.base}. ${active.past}. ${active.participle}.`)}>Escuchar verbo</button>
            <button onClick={() => speak(phrase)}>Escuchar frase</button>
            <button onClick={() => speak(`${active.base}. ${active.past}. ${active.participle}.`, true)}>Lento</button>
          </div>

          {mode === "cards" ? (
            <div className="repeatBox">
              <button className="secondary" onClick={listenToUser}>{listening ? "Escuchando..." : "Practicar con microfono"}</button>
              <p>{heard || "Repeti el verbo o la frase y compara lo que entendio el navegador."}</p>
            </div>
          ) : (
            <div className="quiz">
              <label>
                Past simple de <span>{active.base}</span>
                <input value={answerPast} onChange={(event) => setAnswerPast(event.target.value)} />
              </label>
              <label>
                Past participle de <span>{active.base}</span>
                <input value={answerParticiple} onChange={(event) => setAnswerParticiple(event.target.value)} />
              </label>
              <button onClick={() => setShowResult(true)}>Corregir</button>
              {showResult && (
                <p className={pastOk && participleOk ? "ok" : "error"}>
                  {pastOk && participleOk
                    ? "Correcto. Segui con la proxima tarjeta."
                    : `Respuesta: ${active.past} / ${active.participle}`}
                </p>
              )}
            </div>
          )}

          <div className="footerActions">
            <button className="secondary" onClick={toggleKnown}>
              {known.includes(activeKey) ? "Quitar dominado" : "Marcar dominado"}
            </button>
            <button onClick={nextCard}>Siguiente</button>
          </div>
        </article>

        <aside className="list" aria-label="Lista de verbos filtrados">
          {filtered.map((verb, index) => (
            <button key={`${verb.week}-${verb.base}`} className={index === activeIndex ? "selected" : ""} onClick={() => setActiveIndex(index)}>
              <strong>{verb.base}</strong>
              <span>{verb.past} / {verb.participle}</span>
            </button>
          ))}
        </aside>
      </section>
    </main>
  );
}
