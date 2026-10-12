// Progreso guardado en el navegador: repaso espaciado, meta diaria, racha y palabras dificiles.

import { useSyncExternalStore } from "react";

/** Una cosa que se practica: "verb:cut" o "phrase:Can I see the menu, please?". */
export type ItemId = `verb:${string}` | `phrase:${string}`;
type ItemState = { box: number; due: number; ok: number; fail: number };
type DayStats = { answers: number; ok: number };
type WordStats = { miss: number; ok: number };

export type Progress = {
  goal: number;
  items: Record<string, ItemState>;
  days: Record<string, DayStats>;
  words: Record<string, WordStats>;
};

const KEY = "speakup-progress";
// Dias hasta el proximo repaso segun la caja (sistema Leitner): cada acierto la espera crece.
const INTERVALS = [0, 1, 2, 4, 8, 16];
export const LEARNED_BOX = 3;
export const GOALS = [10, 20, 40];

const empty = (): Progress => ({ goal: 20, items: {}, days: {}, words: {} });

let state: Progress | null = null;
const listeners = new Set<() => void>();

function load(): Progress {
  if (state) return state;
  try {
    const saved = window.localStorage.getItem(KEY);
    state = saved ? { ...empty(), ...JSON.parse(saved) } : empty();
  } catch {
    state = empty();
  }
  return state as Progress;
}

function save(next: Progress) {
  state = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  listeners.forEach((listener) => listener());
}

/** Numero de dia local (para comparar fechas sin horas). */
export function dayNumber(date = new Date()) {
  return Math.floor((date.getTime() - date.getTimezoneOffset() * 60000) / 86400000);
}

export function dayKey(date = new Date()) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function countAnswer(progress: Progress, ok: boolean): Progress["days"] {
  const key = dayKey();
  const today = progress.days[key] ?? { answers: 0, ok: 0 };
  return { ...progress.days, [key]: { answers: today.answers + 1, ok: today.ok + (ok ? 1 : 0) } };
}

/** Registra una respuesta de un ejercicio: mueve el item de caja y suma a la meta del dia. */
export function recordAnswer(id: ItemId, ok: boolean) {
  const progress = load();
  const item = progress.items[id] ?? { box: 0, due: dayNumber(), ok: 0, fail: 0 };
  const box = ok ? Math.min(item.box + 1, INTERVALS.length - 1) : 0;
  save({
    ...progress,
    items: {
      ...progress.items,
      [id]: { box, due: dayNumber() + INTERVALS[box], ok: item.ok + (ok ? 1 : 0), fail: item.fail + (ok ? 0 : 1) }
    },
    days: countAnswer(progress, ok)
  });
}

const cleanWord = (text: string) => text.toLowerCase().replace(/[^a-z0-9']/g, "");

/** Registra un intento de pronunciacion: suma a la meta y guarda que palabras fallaron. */
export function recordSpeech(words: { text: string; ok: boolean }[], passed: boolean, countsAsAnswer = true) {
  const progress = load();
  const stats = { ...progress.words };
  for (const word of words) {
    const key = cleanWord(word.text);
    if (!key) continue;
    const current = stats[key] ?? { miss: 0, ok: 0 };
    stats[key] = word.ok ? { ...current, ok: current.ok + 1 } : { ...current, miss: current.miss + 1 };
  }
  save({ ...progress, words: stats, days: countsAsAnswer ? countAnswer(progress, passed) : progress.days });
}

/** Respuesta de un ejercicio sin repaso (por ejemplo, las reglas): solo suma a la meta del dia. */
export function recordPractice(ok: boolean) {
  const progress = load();
  save({ ...progress, days: countAnswer(progress, ok) });
}

export function setGoal(goal: number) {
  save({ ...load(), goal });
}

export function resetProgress() {
  save(empty());
}

/** Ids para repasar hoy: primero los que estan en las cajas mas bajas (los que mas cuestan). */
export function dueItems(progress: Progress, today = dayNumber()) {
  return Object.entries(progress.items)
    .filter(([, item]) => item.due <= today)
    .sort(([, a], [, b]) => a.box - b.box || a.due - b.due)
    .map(([id]) => id as ItemId);
}

/** Dias seguidos practicando, hasta hoy (o hasta ayer si hoy todavia no se practico). */
export function streak(progress: Progress) {
  let count = 0;
  const date = new Date();
  if (!progress.days[dayKey(date)]?.answers) date.setDate(date.getDate() - 1);
  while (progress.days[dayKey(date)]?.answers) {
    count++;
    date.setDate(date.getDate() - 1);
  }
  return count;
}

/** Palabras que mas se fallan al hablar (mas fallos que aciertos). */
export function difficultWords(progress: Progress, limit = 12) {
  return Object.entries(progress.words)
    .filter(([, stats]) => stats.miss > stats.ok)
    .sort(([, a], [, b]) => b.miss - a.miss || a.ok - b.ok)
    .slice(0, limit)
    .map(([word, stats]) => ({ word, ...stats }));
}

const serverSnapshot = empty();

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Otra pestaña con la app abierta tambien actualiza el progreso.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== KEY) return;
    state = null;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useProgress() {
  return useSyncExternalStore(subscribe, load, () => serverSnapshot);
}
