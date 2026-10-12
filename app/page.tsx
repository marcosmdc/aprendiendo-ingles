"use client";

import { useEffect, useMemo, useState } from "react";
import { verbs } from "./data";
import { meaning } from "./spanish";
import { buildTenses } from "./grammar";
import ClozePractice from "./cloze-practice";
import Guide from "./guide";
import { ipa, ipaLabel } from "./ipa";
import Phrasebook from "./phrasebook";
import ProgressScreen from "./progress-screen";
import { dueItems, recordAnswer, useProgress } from "./progress";
import { useSpeakCheck } from "./speak-check";
import ThemeToggle from "./theme-toggle";
import VerbTable from "./verb-table";
import { playVerb, preloadPiper, resumePiper, speakText, subscribeVoice, type VoiceStatus } from "./tts";

type Mode = "cards" | "quiz" | "complete" | "list";
type Screen = "verbos" | "oraciones" | "frases" | "progreso";

const screens: { id: Screen; label: string }[] = [
  { id: "verbos", label: "Verbos" },
  { id: "oraciones", label: "Oraciones" },
  { id: "frases", label: "Frases" },
  { id: "progreso", label: "Progreso" }
];

const isScreen = (value: string): value is Screen => screens.some((screen) => screen.id === value);

const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ");

const acceptsAnswer = (answer: string, expected: string) => {
  const normalized = normalize(answer);
  return expected.split("/").map(normalize).includes(normalized);
};

export default function Home() {
  const weeks = useMemo(() => Array.from(new Set(verbs.map((verb) => verb.week))), []);
  const patterns = useMemo(() => Array.from(new Set(verbs.map((verb) => verb.pattern))), []);
  const [screen, setScreen] = useState<Screen>("verbos");
  const [week, setWeek] = useState("all");
  const [pattern, setPattern] = useState("all");
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<Mode>("cards");
  const [activeBase, setActiveBase] = useState(verbs[0].base);
  const [answerPast, setAnswerPast] = useState("");
  const [answerParticiple, setAnswerParticiple] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [known, setKnown] = useState<string[]>([]);
  const [voice, setVoice] = useState<VoiceStatus>({ state: "idle" });
  const [showEs, setShowEs] = useState(false);
  const progress = useProgress();
  const dueCount = dueItems(progress).length;

  // La pantalla va en la URL (#frases) para que funcione el boton "atras" del celular.
  useEffect(() => {
    const fromHash = () => {
      const value = window.location.hash.slice(1);
      setScreen(isScreen(value) ? value : "verbos");
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  function goTo(value: Screen) {
    if (value !== screen) window.location.hash = value;
    window.scrollTo({ top: 0 });
  }

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
    try {
      const saved = window.localStorage.getItem("known-verbs");
      if (saved) setKnown(JSON.parse(saved));
    } catch {}
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

  const active = verbs.find((verb) => verb.base === activeBase) ?? verbs[0];
  const activeIndex = Math.max(0, filtered.indexOf(active));
  const activeKey = `${active.base}-${active.week}`;
  // Frase de la tarjeta: va rotando entre presente, pasado y presente perfecto.
  const phraseRow = buildTenses(active, "I")[activeIndex % 3].rows[0];
  const phrase = phraseRow.example;
  const activeIpa = ipa(active.base);
  const pastOk = acceptsAnswer(answerPast, active.past);
  const participleOk = acceptsAnswer(answerParticiple, active.participle);

  function selectVerb(base: string) {
    setActiveBase(base);
    setShowResult(false);
    setAnswerPast("");
    setAnswerParticiple("");
  }

  // Al cambiar los filtros, la tarjeta pasa al primer verbo de la lista.
  useEffect(() => {
    if (filtered.length) selectVerb(filtered[0].base);
  }, [filtered]); // eslint-disable-line react-hooks/exhaustive-deps

  function nextCard() {
    if (!filtered.length) return;
    selectVerb(filtered[(activeIndex + 1) % filtered.length].base);
  }

  function checkQuiz() {
    // Solo la primera correccion de cada tarjeta cuenta para el progreso.
    if (!showResult) recordAnswer(`verb:${active.base}`, pastOk && participleOk);
    setShowResult(true);
  }

  function toggleKnown() {
    const next = known.includes(activeKey)
      ? known.filter((key) => key !== activeKey)
      : [...known, activeKey];
    setKnown(next);
    try {
      window.localStorage.setItem("known-verbs", JSON.stringify(next));
    } catch {}
  }

  return (
    <>
      <header className="appHeader">
        <div className="appHeaderInner">
          <span className="brand">Speak Up</span>
          <nav className="appNav" aria-label="Secciones">
            {screens.map((item) => (
              <button
                key={item.id}
                className={item.id === screen ? "active" : ""}
                aria-current={item.id === screen ? "page" : undefined}
                onClick={() => goTo(item.id)}
              >
                {item.label}
                {item.id === "progreso" && dueCount > 0 && <span className="badge" aria-label={`${dueCount} para repasar`}>{dueCount}</span>}
              </button>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main className="shell">
        {screen === "verbos" && (
          <>
            <section className="hero">
              <div>
                <p className="eyebrow">Ingles practico</p>
                <h1>Verbos irregulares</h1>
                <p className="intro">
                  {verbs.length} verbos por semana y patron: escuchalos, repetilos y completá oraciones. En
                  Oraciones ves cómo usarlos, en Frases tenés situaciones reales y en Progreso repasás lo que fallaste.
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
              <button className={mode === "complete" ? "active" : ""} onClick={() => setMode("complete")}>Completar oraciones</button>
              <button className={mode === "list" ? "active" : ""} onClick={() => setMode("list")}>Lista completa</button>
            </section>

            {mode === "list" ? (
              <VerbTable
                verbs={filtered}
                onOpen={(base) => {
                  selectVerb(base);
                  setMode("cards");
                }}
              />
            ) : (
              <section className="practice">
                <article className="card">
                  <div className="cardTop">
                    <span>Semana {active.week}</span>
                    <span>{active.pattern}</span>
                  </div>
                  <h2>{active.base}</h2>
                  <p className="forms">{active.base} / {active.past} / {active.participle}</p>
                  {activeIpa && <p className="ipa cardIpa">{activeIpa.map(ipaLabel).join("  ·  ")}</p>}
                  <p className="meaning">En español: <strong>{meaning(active.base)}</strong></p>
                  {/* En "Completar" la frase de ejemplo se oculta para no dar la respuesta. */}
                  {mode !== "complete" && (
                    <div className="phrase">
                      <p>{phrase}</p>
                      {showEs && phraseRow.es && <p className="es">{phraseRow.es}</p>}
                    </div>
                  )}
                  <div className="cardLinks">
                    <button className="esToggle" onClick={toggleEs} aria-pressed={showEs}>
                      {showEs ? "Ocultar español" : "Ver en español"}
                    </button>
                    <button className="esToggle" onClick={() => goTo("oraciones")}>Cómo usarlo en oraciones</button>
                  </div>

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
                      <button onClick={checkQuiz}>Corregir</button>
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
                  {filtered.map((verb) => (
                    <button key={`${verb.week}-${verb.base}`} className={verb === active ? "selected" : ""} onClick={() => selectVerb(verb.base)}>
                      <strong>{verb.base}</strong>
                      <span>{verb.past} / {verb.participle}</span>
                      <small>{meaning(verb.base)}</small>
                    </button>
                  ))}
                </aside>
              </section>
            )}
          </>
        )}

        {screen === "oraciones" && (
          <Guide verb={active} verbs={verbs} onVerbChange={selectVerb} showEs={showEs} toggleEs={toggleEs} />
        )}

        {screen === "frases" && <Phrasebook />}

        {screen === "progreso" && <ProgressScreen showEs={showEs} />}
      </main>
    </>
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
