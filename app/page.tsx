"use client";

import { useEffect, useMemo, useState } from "react";
import { verbs } from "./data";
import { meaning } from "./spanish";
import { buildTenses, rowLabels, subjects, type Row, type Subject } from "./grammar";
import ClozePractice from "./cloze-practice";
import Phrasebook from "./phrasebook";
import { useSpeakCheck } from "./speak-check";
import ThemeToggle from "./theme-toggle";
import { playVerb, preloadPiper, resumePiper, speakText, subscribeVoice, type VoiceStatus } from "./tts";

type Mode = "cards" | "quiz" | "complete";
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
  const [known, setKnown] = useState<string[]>([]);
  const [subject, setSubject] = useState<Subject>("I");
  const [tenseId, setTenseId] = useState("present");
  const [voice, setVoice] = useState<VoiceStatus>({ state: "idle" });
  const [showEs, setShowEs] = useState(false);

  useEffect(() => {
    try {
      setShowEs(window.localStorage.getItem("show-es") === "1");
    } catch {}
  }, []);

  function toggleEs() {
    setShowEs((current) => {
      try {
        window.localStorage.setItem("show-es", current ? "0" : "1");
      } catch {}
      return !current;
    });
  }

  useEffect(() => {
    resumePiper();
    return subscribeVoice(setVoice);
  }, []);

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
  // Frase de la tarjeta: va rotando entre presente, pasado y presente perfecto.
  const phraseRow = buildTenses(active, "I")[activeIndex % 3].rows[0];
  const phrase = phraseRow.example;
  const pastOk = acceptsAnswer(answerPast, active.past);
  const participleOk = acceptsAnswer(answerParticiple, active.participle);
  const tenses = buildTenses(active, subject);
  const tense = tenses.find((item) => item.id === tenseId) ?? tenses[0];

  useEffect(() => {
    setActiveIndex(0);
    setShowResult(false);
    setAnswerPast("");
    setAnswerParticiple("");
  }, [filtered.length, pattern, query, week]);

  function nextCard() {
    setActiveIndex((current) => (current + 1) % filtered.length);
    setShowResult(false);
    setAnswerPast("");
    setAnswerParticiple("");
  }

  function toggleKnown() {
    const next = known.includes(activeKey)
      ? known.filter((key) => key !== activeKey)
      : [...known, activeKey];
    setKnown(next);
    window.localStorage.setItem("known-verbs", JSON.stringify(next));
  }

  return (
    <main className="shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Ingles practico</p>
          <h1>Speak Up</h1>
          <p className="intro">
            {verbs.length} verbos irregulares por semana y patron: escuchalos, repetilos, completa oraciones
            y aprende frases para situaciones reales: restaurante, aeropuerto, medico y mucho mas.
          </p>
        </div>
        <div className="heroSide">
          <ThemeToggle />
          <div className="stats" aria-label="Resumen">
            <strong>{known.length}</strong>
            <span>dominados</span>
            <strong>{filtered.length}</strong>
            <span>en vista</span>
          </div>
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
        <button className={mode === "complete" ? "active" : ""} onClick={() => setMode("complete")}>Completar oraciones</button>
      </section>

      <section className="practice">
        <article className="card">
          <div className="cardTop">
            <span>Semana {active.week}</span>
            <span>{active.pattern}</span>
          </div>
          <h2>{active.base}</h2>
          <p className="forms">{active.base} / {active.past} / {active.participle}</p>
          <p className="meaning">En español: <strong>{meaning(active.base)}</strong></p>
          {/* En "Completar" la frase de ejemplo se oculta para no dar la respuesta. */}
          {mode !== "complete" && (
            <div className="phrase">
              <p>{phrase}</p>
              {showEs && phraseRow.es && <p className="es">{phraseRow.es}</p>}
            </div>
          )}
          <button className="esToggle" onClick={toggleEs} aria-pressed={showEs}>
            {showEs ? "Ocultar español" : "Ver en español"}
          </button>

          <div className="actions">
            <button onClick={() => playVerb(active)}>Escuchar verbo</button>
            <button onClick={() => playVerb(active, true)}>Verbo lento</button>
            {mode !== "complete" && (
              <>
                <button onClick={() => speakText(phrase)}>Escuchar frase</button>
                <button onClick={() => speakText(phrase, true)}>Frase lenta</button>
              </>
            )}
          </div>

          <p className="voiceStatus">
            {voice.state === "ready" && "Voz HD (Piper) lista para frases."}
            {voice.state === "loading" && `Descargando voz HD... ${voice.progress}% (solo la primera vez). Mientras tanto se usa la voz del navegador.`}
            {voice.state === "error" && "No se pudo cargar la voz HD: las frases usan la voz del navegador."}
            {voice.state === "idle" && (
              <>
                Las frases usan la voz del navegador.{" "}
                <button className="link" onClick={preloadPiper}>Descargar voz HD (63 MB, una sola vez)</button>
              </>
            )}
          </p>

          {mode === "complete" ? (
            <ClozePractice verb={active} showEs={showEs} onNextVerb={nextCard} />
          ) : mode === "cards" ? (
            <div className="repeatBox">
              <p className="instructions">Escuchá y repetí en voz alta: te marco en rojo las palabras que no se entendieron.</p>
              <SpeakTarget label="Verbo" text={`${active.base}, ${active.past.replace("/", ", ")}, ${active.participle.replace("/", ", ")}`} />
              <SpeakTarget label="Frase" text={phrase} />
            </div>
          ) : (
            <div className="quiz">
              <label>
                Past simple de <span>{active.base}</span> ({meaning(active.base)})
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
              <small>{meaning(verb.base)}</small>
            </button>
          ))}
        </aside>
      </section>

      <section className="guide" aria-label="Como usar el verbo en oraciones">
        <div className="guideHead">
          <div>
            <p className="eyebrow">Formatos de oracion</p>
            <h3>Como usar <span>{active.base}</span></h3>
          </div>
          <div className="guideTools">
            <button className="esToggle" onClick={toggleEs} aria-pressed={showEs}>
              {showEs ? "Ocultar español" : "Ver en español"}
            </button>
            <div className="chips" aria-label="Sujeto">
              {subjects.map((item) => (
                <button key={item} className={item === subject ? "active" : ""} onClick={() => setSubject(item)}>{item}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="tabs" role="tablist" aria-label="Tiempo verbal">
          {tenses.map((item) => (
            <button key={item.id} role="tab" aria-selected={item.id === tense.id} className={item.id === tense.id ? "active" : ""} onClick={() => setTenseId(item.id)}>
              {item.label}
            </button>
          ))}
        </div>

        <p className="use"><strong>Cuando se usa:</strong> {tense.use}</p>

        {tense.note ? (
          <p className="note">{tense.note}</p>
        ) : (
          <div className="rows">
            {tense.rows.map((row) => (
              <GuideRow key={row.kind} row={row} showEs={showEs} />
            ))}
          </div>
        )}

        <p className="tip"><strong>Ojo:</strong> {tense.tip}</p>
      </section>

      <Phrasebook />
    </main>
  );
}

function GuideRow({ row, showEs }: { row: Row; showEs: boolean }) {
  const speak = useSpeakCheck(row.example);
  return (
    <div className={`row ${row.kind}`}>
      <span className="rowLabel">{rowLabels[row.kind]}</span>
      <code>{row.formula}</code>
      <p>{row.example}</p>
      {showEs && row.es && <p className="es">{row.es}</p>}
      <div className="rowActions">
        <button className="secondary" onClick={() => speakText(row.example)} aria-label={`Escuchar: ${row.example}`}>Escuchar</button>
        <button className="secondary" onClick={() => speakText(row.example, true)} aria-label={`Escuchar lento: ${row.example}`}>Lento</button>
        {speak.button}
      </div>
      {speak.feedback && <div className="rowFeedback">{speak.feedback}</div>}
    </div>
  );
}

function SpeakTarget({ label, text }: { label: string; text: string }) {
  const speak = useSpeakCheck(text);
  return (
    <div className="speakTarget">
      <div className="speakTargetHead">
        <span className="who">{label}</span>
        {speak.button}
      </div>
      {speak.feedback}
    </div>
  );
}
