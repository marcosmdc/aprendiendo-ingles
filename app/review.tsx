"use client";

import { useState } from "react";
import ClozePractice from "./cloze-practice";
import { verbs } from "./data";
import { places, type Phrase } from "./phrases";
import { recordAnswer, type ItemId } from "./progress";
import { useSpeakCheck } from "./speak-check";
import { speakText } from "./tts";

const phrasesByText = new Map<string, Phrase>(
  places.flatMap((place) => [...place.groups.flatMap((group) => group.phrases), ...place.dialogue]).map((phrase) => [phrase.en, phrase])
);

// Los ids guardados pueden quedar viejos si cambia el contenido: esos se saltean.
function resolve(id: ItemId) {
  if (id.startsWith("verb:")) {
    const verb = verbs.find((item) => item.base === id.slice(5));
    return verb ? { kind: "verb" as const, verb } : null;
  }
  const phrase = phrasesByText.get(id.slice(7));
  return phrase ? { kind: "phrase" as const, phrase } : null;
}

/** Repaso del dia: recorre una sola vez la lista que habia al empezar. */
export default function Review({ items, showEs, onExit }: { items: ItemId[]; showEs: boolean; onExit: () => void }) {
  const [queue] = useState(() => items.filter((id) => resolve(id)));
  const [index, setIndex] = useState(0);
  const next = () => setIndex((current) => current + 1);

  if (index >= queue.length) {
    return (
      <div className="cloze reviewDone">
        <p className="prompt">¡Repaso terminado!</p>
        <p className="instructions">Lo que fallaste vuelve a aparecer hoy; lo que acertaste, en unos días.</p>
        <div className="actions">
          <button onClick={onExit}>Volver al progreso</button>
        </div>
      </div>
    );
  }

  const id = queue[index];
  const item = resolve(id)!;
  return (
    <div className="review">
      <div className="clozeTop">
        <span>Repaso {index + 1} de {queue.length}</span>
        <button className="link" onClick={onExit}>Terminar</button>
      </div>
      {item.kind === "verb" ? (
        <>
          <p className="instructions">Verbo <strong>{item.verb.base}</strong>: completá la oración.</p>
          <ClozePractice key={id} verb={item.verb} showEs={showEs} onNextVerb={next} review />
        </>
      ) : (
        <PhraseCard key={id} phrase={item.phrase} onDone={next} />
      )}
    </div>
  );
}

/** Tarjeta de frase: ves el espanol, intentas decirla en ingles y despues te calificas. */
function PhraseCard({ phrase, onDone }: { phrase: Phrase; onDone: () => void }) {
  const [revealed, setRevealed] = useState(false);
  const speak = useSpeakCheck(phrase.en, { countAnswer: false });

  function answer(ok: boolean) {
    recordAnswer(`phrase:${phrase.en}`, ok);
    onDone();
  }

  return (
    <div className="cloze">
      {phrase.who && <span className="who">Lo dice: {phrase.who}</span>}
      <p className="prompt">{phrase.es}</p>
      {!revealed ? (
        <>
          <p className="instructions">¿Cómo se dice en inglés? Pensalo (o decilo en voz alta) y después mirá la respuesta.</p>
          <div className="actions">
            <button onClick={() => setRevealed(true)}>Ver respuesta</button>
          </div>
        </>
      ) : (
        <>
          <p className="answerReveal">{phrase.en}</p>
          <div className="actions">
            <button className="ico ico-play secondary" onClick={() => speakText(phrase.en)}>Escuchar</button>
            <button className="ico ico-slow secondary" onClick={() => speakText(phrase.en, true)}>Lento</button>
            {speak.button}
          </div>
          {speak.feedback}
          <p className="instructions">¿Te la sabías?</p>
          <div className="actions">
            <button className="secondary" onClick={() => answer(false)}>No me la sabía</button>
            <button onClick={() => answer(true)}>Me la sabía</button>
          </div>
        </>
      )}
    </div>
  );
}
