"use client";

import { useState } from "react";
import { places, type Phrase } from "./phrases";
import { speakText } from "./tts";

function PhraseRow({ phrase, hideEs }: { phrase: Phrase; hideEs: boolean }) {
  return (
    <li className="phraseItem">
      <div>
        {phrase.who && <span className="who">{phrase.who}</span>}
        <p>{phrase.en}</p>
        {!hideEs && <p className="es">{phrase.es}</p>}
      </div>
      <div className="rowActions">
        <button className="secondary" onClick={() => speakText(phrase.en)} aria-label={`Escuchar: ${phrase.en}`}>Escuchar</button>
        <button className="secondary" onClick={() => speakText(phrase.en, true)} aria-label={`Escuchar lento: ${phrase.en}`}>Lento</button>
      </div>
    </li>
  );
}

export default function Phrasebook() {
  const [placeId, setPlaceId] = useState(places[0].id);
  const [hideEs, setHideEs] = useState(false);
  const place = places.find((item) => item.id === placeId) ?? places[0];

  return (
    <section className="guide phrasebook" aria-label="Frases habituales">
      <div className="guideHead">
        <div>
          <p className="eyebrow">Frases habituales</p>
          <h3>Para usar en la vida real</h3>
        </div>
        <button className="esToggle" onClick={() => setHideEs((current) => !current)} aria-pressed={hideEs}>
          {hideEs ? "Mostrar español" : "Ocultar español"}
        </button>
      </div>

      <div className="tabs" role="tablist" aria-label="Lugar">
        {places.map((item) => (
          <button key={item.id} role="tab" aria-selected={item.id === place.id} className={item.id === place.id ? "active" : ""} onClick={() => setPlaceId(item.id)}>
            {item.label}
          </button>
        ))}
      </div>

      <div className="phraseGroups">
        {place.groups.map((group) => (
          <div key={group.title} className="phraseGroup">
            <h4>{group.title}</h4>
            <ul>
              {group.phrases.map((phrase) => (
                <PhraseRow key={phrase.en} phrase={phrase} hideEs={hideEs} />
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="phraseGroup dialogue">
        <h4>Dialogo de ejemplo</h4>
        <ul>
          {place.dialogue.map((line, index) => (
            <PhraseRow key={index} phrase={line} hideEs={hideEs} />
          ))}
        </ul>
      </div>
    </section>
  );
}
