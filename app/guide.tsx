"use client";

import { useState } from "react";
import type { Verb } from "./data";
import { buildTenses, rowLabels, subjects, type Row, type Subject } from "./grammar";
import { meaning } from "./spanish";
import { useSpeakCheck } from "./speak-check";
import { speakText } from "./tts";

type Props = {
  verb: Verb;
  verbs: Verb[];
  onVerbChange: (base: string) => void;
  showEs: boolean;
  toggleEs: () => void;
};

/** Como usar un verbo en oraciones: afirmar, negar, preguntar y responder en cada tiempo. */
export default function Guide({ verb, verbs, onVerbChange, showEs, toggleEs }: Props) {
  const [subject, setSubject] = useState<Subject>("I");
  const [tenseId, setTenseId] = useState("present");
  const tenses = buildTenses(verb, subject);
  const tense = tenses.find((item) => item.id === tenseId) ?? tenses[0];

  return (
    <section className="guide" aria-label="Como usar el verbo en oraciones">
      <div className="guideHead">
        <div>
          <p className="eyebrow">Formatos de oracion</p>
          <h3>Como usar <span>{verb.base}</span></h3>
        </div>
        <div className="guideTools">
          <label className="verbPicker">
            Verbo
            <select value={verb.base} onChange={(event) => onVerbChange(event.target.value)}>
              {verbs.map((item) => (
                <option key={item.base} value={item.base}>{item.base} ({meaning(item.base)})</option>
              ))}
            </select>
          </label>
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
        <button className="ico ico-play secondary" onClick={() => speakText(row.example)} aria-label={`Escuchar: ${row.example}`}>Escuchar</button>
        <button className="ico ico-slow secondary" onClick={() => speakText(row.example, true)} aria-label={`Escuchar lento: ${row.example}`}>Lento</button>
        {speak.button}
      </div>
      {speak.feedback && <div className="rowFeedback">{speak.feedback}</div>}
    </div>
  );
}
