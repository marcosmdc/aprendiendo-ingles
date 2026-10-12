"use client";

import { useState } from "react";
import { recordPractice } from "./progress";
import {
  makePronounQuestion,
  pronounRules,
  pronouns,
  whMistakes,
  whQuiz,
  whRules,
  whWords,
  type Example,
  type PronounQuestion
} from "./rules";
import { speakText } from "./tts";

type Tab = "wh" | "pronouns";

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

function Listen({ text }: { text: string }) {
  return (
    <button className="ico ico-play secondary listenSmall" onClick={() => speakText(text)} aria-label={`Escuchar: ${text}`}>
      Escuchar
    </button>
  );
}

function Examples({ items }: { items: Example[] }) {
  return (
    <ul className="exampleList">
      {items.map((item) => (
        <li key={item.en}>
          <div>
            <p>{item.en}</p>
            <p className="es">{item.es}</p>
          </div>
          <Listen text={item.en} />
        </li>
      ))}
    </ul>
  );
}

export default function RulesScreen() {
  const [tab, setTab] = useState<Tab>("wh");

  return (
    <section className="guide rules" aria-label="Reglas">
      <p className="eyebrow">Reglas</p>
      <h3>{tab === "wh" ? "Preguntas con W" : "Qué cambia con cada pronombre"}</h3>
      <div className="tabs" role="tablist" aria-label="Tema">
        <button role="tab" aria-selected={tab === "wh"} className={tab === "wh" ? "active" : ""} onClick={() => setTab("wh")}>Preguntas con W</button>
        <button role="tab" aria-selected={tab === "pronouns"} className={tab === "pronouns" ? "active" : ""} onClick={() => setTab("pronouns")}>Pronombres</button>
      </div>
      {tab === "wh" ? <WhSection /> : <PronounSection />}
    </section>
  );
}

function WhSection() {
  return (
    <>
      <p className="instructions">
        Las preguntas que piden información (no un sí o un no) empiezan con una palabra con W, y también How.
      </p>

      <h4 className="sectionTitle">Las palabras</h4>
      <div className="tableWrap">
        <table className="rulesTable">
          <thead>
            <tr>
              <th scope="col">Palabra</th>
              <th scope="col">Significa</th>
              <th scope="col">Se usa para</th>
              <th scope="col">Ejemplo</th>
            </tr>
          </thead>
          <tbody>
            {whWords.map((item) => (
              <tr key={item.word}>
                <td><strong className="keyword">{item.word}</strong></td>
                <td>{item.es}</td>
                <td className="statNote">{item.use}</td>
                <td>
                  <div className="exampleCell">
                    <div>
                      <p>{item.example.en}</p>
                      <p className="es">{item.example.es}</p>
                    </div>
                    <Listen text={item.example.en} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h4 className="sectionTitle">Cómo se arma la pregunta</h4>
      <div className="ruleCards">
        {whRules.map((rule) => (
          <div key={rule.title} className="ruleCard">
            <p className="ruleTitle">{rule.title}</p>
            <code>{rule.formula}</code>
            <Examples items={rule.examples} />
            {rule.note && <p className="tip">{rule.note}</p>}
          </div>
        ))}
      </div>

      <h4 className="sectionTitle">Errores comunes</h4>
      <ul className="mistakes">
        {whMistakes.map((item) => (
          <li key={item.wrong}>
            <span className="wrong">{item.wrong}</span>
            <span className="right">{item.right}</span>
            <span className="statNote">{item.why}</span>
          </li>
        ))}
      </ul>

      <h4 className="sectionTitle">Practicá</h4>
      <WhQuiz />
    </>
  );
}

function WhQuiz() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * whQuiz.length));
  const [choice, setChoice] = useState<string | null>(null);
  const [score, setScore] = useState({ ok: 0, total: 0 });
  const item = whQuiz[index];
  const [options, setOptions] = useState(() => makeOptions(item.word));

  function makeOptions(word: string) {
    const others = shuffle(Array.from(new Set(whWords.map((w) => w.word))).filter((w) => w !== word)).slice(0, 3);
    return shuffle([word, ...others]);
  }

  function choose(option: string) {
    if (choice) return;
    const ok = option === item.word;
    setChoice(option);
    setScore((current) => ({ ok: current.ok + (ok ? 1 : 0), total: current.total + 1 }));
    recordPractice(ok);
    speakText(`${item.question.replace("___", item.word)} ${item.answer}`);
  }

  function next() {
    let nextIndex = index;
    while (nextIndex === index) nextIndex = Math.floor(Math.random() * whQuiz.length);
    setIndex(nextIndex);
    setOptions(makeOptions(whQuiz[nextIndex].word));
    setChoice(null);
  }

  return (
    <div className="cloze">
      <div className="clozeTop">
        <span>Elegí la palabra según la respuesta</span>
        <span>{score.ok} / {score.total} correctas</span>
      </div>
      <p className="prompt">{item.question.replace("___", choice ? item.word : "____")}</p>
      <p className="instructions">Respuesta: {item.answer}</p>
      <div className="options optionRow">
        {options.map((option) => (
          <button
            key={option}
            className={`option ${choice && option === item.word ? "correct" : ""} ${option === choice && option !== item.word ? "wrong" : ""}`}
            disabled={choice !== null}
            onClick={() => choose(option)}
          >
            {option}
          </button>
        ))}
      </div>
      {choice && (
        <>
          <p className={choice === item.word ? "ok" : "error"}>{choice === item.word ? "¡Correcto!" : `Era ${item.word}.`}</p>
          <div className="actions">
            <button onClick={next}>Siguiente</button>
          </div>
        </>
      )}
    </div>
  );
}

function PronounSection() {
  return (
    <>
      <p className="instructions">
        En inglés el sujeto siempre se dice (no se puede decir solo &quot;is tired&quot;) y algunos verbos cambian según quién hace la acción.
      </p>

      <h4 className="sectionTitle">Verbos que cambian con el pronombre</h4>
      <div className="tableWrap">
        <table className="rulesTable pronounTable">
          <thead>
            <tr>
              <th scope="col">Pronombre</th>
              <th scope="col">Be (presente)</th>
              <th scope="col">Be (pasado)</th>
              <th scope="col">Have</th>
              <th scope="col">Do</th>
              <th scope="col">Presente simple</th>
            </tr>
          </thead>
          <tbody>
            {pronouns.map((row) => (
              <tr key={row.es} className={["he", "she", "it"].includes(row.en) ? "third" : ""}>
                <td><strong className="keyword">{row.en}</strong><span className="statNote"> {row.es}</span></td>
                <td>{row.be} <span className="statNote">({row.contraction})</span></td>
                <td><strong>{row.bePast}</strong></td>
                <td>{row.have}</td>
                <td>{row.doAux}</td>
                <td>{row.en} {row.verb}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="statNote">Las filas resaltadas (he, she, it) son las que cambian en presente.</p>

      <h4 className="sectionTitle">Formas del pronombre</h4>
      <div className="tableWrap">
        <table className="rulesTable pronounTable">
          <thead>
            <tr>
              <th scope="col">Sujeto</th>
              <th scope="col">Objeto</th>
              <th scope="col">Posesivo + sustantivo</th>
              <th scope="col">Posesivo solo</th>
              <th scope="col">Reflexivo</th>
            </tr>
          </thead>
          <tbody>
            {pronouns.map((row) => (
              <tr key={row.es}>
                <td><strong className="keyword">{row.en}</strong><span className="statNote"> {row.es}</span></td>
                <td>{row.object}</td>
                <td>{row.possessive} book</td>
                <td>{row.pronoun}</td>
                <td>{row.reflexive}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="statNote">Ejemplo con she: She called me. I called her. It&apos;s her book. The book is hers. She did it herself.</p>

      <h4 className="sectionTitle">Las reglas</h4>
      <div className="ruleCards">
        {pronounRules.map((rule) => (
          <div key={rule.title} className="ruleCard">
            <p className="ruleTitle">{rule.title}</p>
            <p className="ruleText">{rule.text}</p>
            <Examples items={rule.examples} />
          </div>
        ))}
      </div>

      <h4 className="sectionTitle">Practicá</h4>
      <PronounQuiz />
    </>
  );
}

function PronounQuiz() {
  const [question, setQuestion] = useState<PronounQuestion>(() => makePronounQuestion());
  const [options, setOptions] = useState(() => shuffle(question.options));
  const [choice, setChoice] = useState<string | null>(null);
  const [score, setScore] = useState({ ok: 0, total: 0 });

  function choose(option: string) {
    if (choice) return;
    const ok = option === question.answer;
    setChoice(option);
    setScore((current) => ({ ok: current.ok + (ok ? 1 : 0), total: current.total + 1 }));
    recordPractice(ok);
    speakText(question.full);
  }

  function next() {
    let nextQuestion = makePronounQuestion();
    while (nextQuestion.full === question.full) nextQuestion = makePronounQuestion();
    setQuestion(nextQuestion);
    setOptions(shuffle(nextQuestion.options));
    setChoice(null);
  }

  return (
    <div className="cloze">
      <div className="clozeTop">
        <span>Elegí la forma correcta</span>
        <span>{score.ok} / {score.total} correctas</span>
      </div>
      <p className="prompt">
        {question.before}
        <span className="blank">{choice ? question.answer : "____"}</span>
        {question.after}
      </p>
      {question.hint && <p className="instructions">Pista: {question.hint}</p>}
      <div className="options optionRow">
        {options.map((option) => (
          <button
            key={option}
            className={`option ${choice && option === question.answer ? "correct" : ""} ${option === choice && option !== question.answer ? "wrong" : ""}`}
            disabled={choice !== null}
            onClick={() => choose(option)}
          >
            {option}
          </button>
        ))}
      </div>
      {choice && (
        <>
          <p className={choice === question.answer ? "ok" : "error"}>{choice === question.answer ? "¡Correcto!" : `Era ${question.answer}.`}</p>
          <div className="actions">
            <button onClick={next}>Siguiente</button>
          </div>
        </>
      )}
    </div>
  );
}
