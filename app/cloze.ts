// Ejercicios de completar: se toma una oracion de la guia y se oculta el verbo.

import type { Verb } from "./data";
import { buildTenses, ingForm, rowLabels, subjects, thirdPerson, type RowKind, type Subject } from "./grammar";

export type Exercise = {
  label: string; // "Pasado · Preguntar"
  before: string;
  after: string;
  hint: string; // verbo base entre parentesis
  answer: string; // forma usada en el ejemplo
  accepted: string[]; // todas las formas validas (burnt / burned)
  example: string;
  es?: string;
};

const kinds: RowKind[] = ["affirmative", "negative", "question", "wh"];
const variants = (form: string) => form.split("/").map((item) => item.trim());
const isThird = (subject: Subject) => subject === "he" || subject === "she";

// Que palabra se completa en cada tiempo y tipo de oracion.
function target(verb: Verb, tenseId: string, kind: RowKind, subject: Subject): string[] | null {
  const { base } = verb;
  const affirmative = kind === "affirmative";

  if (base === "be") {
    if (tenseId === "present") return [subject === "I" ? "am" : isThird(subject) ? "is" : "are"];
    if (tenseId === "past") return [subject === "I" || isThird(subject) ? "was" : "were"];
  }
  if (base === "can") {
    if (tenseId === "present") return ["can"];
    if (tenseId === "past") return ["could"];
    if (tenseId === "future") return ["be able to"];
  }

  switch (tenseId) {
    case "present":
      return [affirmative && isThird(subject) ? thirdPerson(base) : base];
    case "past":
      return affirmative ? variants(verb.past) : [base];
    case "perfect":
      return variants(verb.participle);
    case "continuous":
      return [ingForm(base)];
    default:
      return [base];
  }
}

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function locate(sentence: string, word: string) {
  // Palabra completa ("was" no coincide dentro de "wasn't") y la ultima aparicion:
  // en "Do you do the homework?" se completa el verbo, no el auxiliar.
  const pattern = new RegExp(String.raw`(?<![\w'])${escape(word)}(?![\w'])`, "gi");
  let index = -1;
  for (const match of Array.from(sentence.matchAll(pattern))) index = match.index ?? index;
  return index;
}

function build(verb: Verb, subject: Subject, tenseIndex: number, kind: RowKind): Exercise | null {
  const tense = buildTenses(verb, subject)[tenseIndex];
  const row = tense.rows.find((item) => item.kind === kind);
  const accepted = target(verb, tense.id, kind, subject);
  if (!row || !accepted) return null;

  const index = locate(row.example, accepted[0]);
  if (index < 0) return null;
  const end = index + accepted[0].length;

  return {
    label: `${tense.label} · ${rowLabels[kind]}`,
    before: row.example.slice(0, index),
    after: row.example.slice(end),
    hint: verb.base,
    // Tal cual aparece en la oracion (con mayuscula si va al principio).
    answer: row.example.slice(index, end),
    accepted,
    example: row.example,
    es: row.es
  };
}

const randomIndex = (length: number) => Math.floor(Math.random() * length);

export function makeExercise(verb: Verb): Exercise {
  const tenseCount = buildTenses(verb, "I").length;
  for (let attempt = 0; attempt < 30; attempt++) {
    const exercise = build(
      verb,
      subjects[randomIndex(subjects.length)],
      randomIndex(tenseCount),
      kinds[randomIndex(kinds.length)]
    );
    if (exercise) return exercise;
  }
  // Si el azar no encontro nada, se recorre todo en orden.
  for (const subject of subjects) {
    for (let tenseIndex = 0; tenseIndex < tenseCount; tenseIndex++) {
      for (const kind of kinds) {
        const exercise = build(verb, subject, tenseIndex, kind);
        if (exercise) return exercise;
      }
    }
  }
  throw new Error(`No hay ejercicios para ${verb.base}`);
}

const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ").replace(/’/g, "'");

export function checkAnswer(exercise: Exercise, value: string) {
  return exercise.accepted.map(normalize).includes(normalize(value));
}
