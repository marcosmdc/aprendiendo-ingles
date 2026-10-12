"use client";

import { useState } from "react";
import Review from "./review";
import { useSpeakCheck } from "./speak-check";
import { speakText } from "./tts";
import {
  dayKey,
  difficultWords,
  dueItems,
  GOALS,
  LEARNED_BOX,
  resetProgress,
  setGoal,
  streak,
  useProgress,
  type ItemId
} from "./progress";

const weekday = new Intl.DateTimeFormat("es", { weekday: "short" });

function lastDays(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (count - 1 - index));
    return { key: dayKey(date), label: index === count - 1 ? "hoy" : weekday.format(date).replace(".", "") };
  });
}

export default function ProgressScreen({ showEs }: { showEs: boolean }) {
  const progress = useProgress();
  const [reviewing, setReviewing] = useState<ItemId[] | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const today = progress.days[dayKey()] ?? { answers: 0, ok: 0 };
  const due = dueItems(progress);
  const items = Object.values(progress.items);
  const learned = items.filter((item) => item.box >= LEARNED_BOX).length;
  const totals = Object.values(progress.days).reduce(
    (sum, day) => ({ answers: sum.answers + day.answers, ok: sum.ok + day.ok }),
    { answers: 0, ok: 0 }
  );
  const days = lastDays(7).map((day) => ({ ...day, answers: progress.days[day.key]?.answers ?? 0 }));
  const maxDay = Math.max(progress.goal, ...days.map((day) => day.answers));
  const words = difficultWords(progress);
  const streakDays = streak(progress);
  const goalPercent = Math.min(100, Math.round((today.answers * 100) / progress.goal));

  if (reviewing) {
    return (
      <section className="guide" aria-label="Repaso">
        <p className="eyebrow">Repaso espaciado</p>
        <h3>Repaso de hoy</h3>
        <Review items={reviewing} showEs={showEs} onExit={() => setReviewing(null)} />
      </section>
    );
  }

  return (
    <>
      <section className="guide" aria-label="Tu progreso">
        <p className="eyebrow">Progreso</p>
        <h3>Tu práctica</h3>

        <div className="statGrid">
          <div className="statTile">
            <span className="statLabel">Hoy</span>
            <strong>{today.answers}<small> / {progress.goal}</small></strong>
            <div className="goalBar" role="progressbar" aria-valuenow={goalPercent} aria-valuemin={0} aria-valuemax={100} aria-label="Meta diaria">
              <span style={{ width: `${goalPercent}%` }} />
            </div>
            <span className="statNote">{today.answers >= progress.goal ? "¡Meta cumplida!" : "respuestas para la meta"}</span>
          </div>
          <div className="statTile">
            <span className="statLabel">Racha</span>
            <strong>{streakDays}<small> {streakDays === 1 ? "día" : "días"}</small></strong>
            <span className="statNote">seguidos practicando</span>
          </div>
          <div className="statTile">
            <span className="statLabel">Aprendidos</span>
            <strong>{learned}<small> / {items.length}</small></strong>
            <span className="statNote">acertados {LEARNED_BOX}+ veces seguidas</span>
          </div>
          <div className="statTile">
            <span className="statLabel">Aciertos</span>
            <strong>{totals.answers ? Math.round((totals.ok * 100) / totals.answers) : 0}<small>%</small></strong>
            <span className="statNote">de {totals.answers} respuestas</span>
          </div>
        </div>

        <div className="reviewBox">
          <div>
            <p className="prompt">{due.length ? `${due.length} para repasar hoy` : "Nada para repasar hoy"}</p>
            <p className="instructions">
              {due.length
                ? "Verbos y frases que fallaste o que toca volver a ver. Cada acierto los aleja unos días."
                : "Cuando practiques, lo que falles va a aparecer acá para repasarlo."}
            </p>
          </div>
          <button onClick={() => setReviewing(due)} disabled={!due.length}>Empezar repaso</button>
        </div>

        <h4 className="sectionTitle">Últimos 7 días</h4>
        <div className="weekChart" role="img" aria-label={days.map((day) => `${day.label}: ${day.answers} respuestas`).join(", ")}>
          {days.map((day) => (
            <div key={day.key} className="weekDay" title={`${day.label}: ${day.answers} respuestas`}>
              <div className="weekTrack">
                {day.answers > 0 && (
                  <span className="weekValue" style={{ bottom: `${(day.answers * 100) / maxDay}%` }}>{day.answers}</span>
                )}
                <span className="weekBar" style={{ height: `${(day.answers * 100) / maxDay}%` }} />
                <span className="weekGoal" style={{ bottom: `${(progress.goal * 100) / maxDay}%` }} />
              </div>
              <span className="weekLabel">{day.label}</span>
            </div>
          ))}
        </div>
        <p className="statNote">La línea punteada es tu meta diaria.</p>
      </section>

      <section className="guide" aria-label="Palabras dificiles">
        <p className="eyebrow">Pronunciación</p>
        <h3>Tus palabras difíciles</h3>
        {words.length ? (
          <>
            <p className="instructions">Las palabras que más veces salieron en rojo al usar Decir. Cuando la aciertes más de lo que la fallás, sale de la lista.</p>
            <ul className="wordList">
              {words.map((item) => (
                <WordRow key={item.word} word={item.word} miss={item.miss} />
              ))}
            </ul>
          </>
        ) : (
          <p className="instructions">Todavía no hay. Usá el botón Decir en las oraciones y frases: las palabras que no se entiendan van a aparecer acá.</p>
        )}
      </section>

      <section className="guide" aria-label="Ajustes del progreso">
        <p className="eyebrow">Ajustes</p>
        <div className="settingsRow">
          <span>Meta diaria</span>
          <div className="chips">
            {GOALS.map((goal) => (
              <button key={goal} className={goal === progress.goal ? "active" : ""} onClick={() => setGoal(goal)}>{goal}</button>
            ))}
          </div>
        </div>
        <div className="settingsRow">
          <span>El progreso se guarda solo en este navegador.</span>
          <button
            className={confirmReset ? "danger" : "secondary"}
            onClick={() => {
              if (!confirmReset) return setConfirmReset(true);
              resetProgress();
              setConfirmReset(false);
            }}
            onBlur={() => setConfirmReset(false)}
          >
            {confirmReset ? "¿Seguro? Tocá de nuevo" : "Borrar progreso"}
          </button>
        </div>
      </section>
    </>
  );
}

function WordRow({ word, miss }: { word: string; miss: number }) {
  const speak = useSpeakCheck(word);
  return (
    <li className="phraseItem">
      <div>
        <p>{word}</p>
        <span className="statNote">falló {miss} {miss === 1 ? "vez" : "veces"}</span>
      </div>
      <div className="rowActions">
        <button className="secondary" onClick={() => speakText(word)}>Escuchar</button>
        <button className="secondary" onClick={() => speakText(word, true)}>Lento</button>
        {speak.button}
      </div>
      {speak.feedback && <div className="phraseFeedback">{speak.feedback}</div>}
    </li>
  );
}
