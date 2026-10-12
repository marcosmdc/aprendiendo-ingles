import type { Verb } from "./data";

export type Subject = "I" | "you" | "he" | "she" | "we" | "they";

export const subjects: Subject[] = ["I", "you", "he", "she", "we", "they"];

export type RowKind = "affirmative" | "negative" | "question" | "short" | "wh";

export const rowLabels: Record<RowKind, string> = {
  affirmative: "Afirmar",
  negative: "Negar",
  question: "Preguntar",
  short: "Responder",
  wh: "Preguntar con Wh-"
};

export type Row = { kind: RowKind; formula: string; example: string };

export type Tense = {
  id: string;
  label: string;
  use: string;
  tip: string;
  rows: Row[];
  note?: string;
};

// Complementos para que las frases suenen naturales con cada verbo.
const complements: Record<string, string> = {
  cut: "the bread", hit: "the ball", put: "the keys on the table", cost: "them a lot of money",
  hurt: "their feelings", let: "the kids play", set: "the table", shut: "the door", split: "the cake",
  spread: "the news", bring: "lunch", buy: "bread", catch: "the bus", teach: "English",
  think: "about it", fight: "for freedom", begin: "the class", drink: "water", ring: "the bell",
  sing: "a song", sink: "the boat", swim: "in the sea", feel: "tired", keep: "the change",
  leave: "the house", meet: "new people", sleep: "eight hours", sweep: "the floor", deal: "the cards",
  lend: "money", send: "an email", spend: "money", break: "the glass", choose: "a color",
  speak: "English", steal: "the money", freeze: "the meat", wake: "up early", bite: "the sandwich",
  drive: "a car", eat: "an apple", write: "a letter", be: "at home", go: "to the park",
  have: "breakfast", do: "the homework", see: "the mountains", come: "home", get: "a new phone",
  make: "dinner", take: "the bus", give: "a gift", blow: "the candles", draw: "a picture",
  fly: "to Miami", grow: "tomatoes", know: "the answer", throw: "the ball", show: "the photos",
  find: "the keys", hold: "the baby", lead: "the team", lose: "the game", pay: "the bill",
  say: "hello", sell: "the car", tell: "the truth", win: "the race", stand: "in line",
  burn: "the toast", dream: "about the beach", learn: "English", smell: "the flowers",
  spell: "the word", spill: "the coffee", spoil: "the surprise", become: "a teacher",
  bet: "ten dollars", bleed: "a lot", build: "a house", can: "swim", fall: "asleep",
  forget: "the password", forgive: "the mistake", hang: "the picture on the wall", hear: "the music",
  hide: "the gift", lay: "the cards on the table", light: "a fire", mean: "it", read: "a book",
  ride: "a bike", rise: "early", run: "in the park", shake: "the bottle", shine: "brightly",
  shoot: "a video", sit: "on the sofa", stick: "the note on the fridge", understand: "the lesson",
  upset: "people", wear: "a jacket"
};

// Verbos de estado: no se suelen usar en forma continua.
const stative = new Set(["be", "can", "know", "understand", "mean", "hear", "cost"]);

const doubleFinal = new Set([
  "cut", "hit", "put", "let", "set", "shut", "split", "begin", "swim", "get", "win", "sit", "run",
  "forget", "bet", "upset"
]);

const first = (form: string) => form.split("/")[0];
const cap = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
const isThird = (subject: Subject) => subject === "he" || subject === "she";

// Quien responde: si te preguntan "you", respondes "I" y al reves.
const answerer = (subject: Subject): Subject =>
  subject === "you" ? "I" : subject === "I" ? "you" : subject;

export function thirdPerson(base: string) {
  if (base === "have") return "has";
  if (base === "be") return "is";
  if (/(s|sh|ch|x|z|o)$/.test(base)) return `${base}es`;
  if (/[^aeiou]y$/.test(base)) return `${base.slice(0, -1)}ies`;
  return `${base}s`;
}

export function ingForm(base: string) {
  if (base === "be") return "being";
  if (base.endsWith("ie")) return `${base.slice(0, -2)}ying`;
  if (base.endsWith("ee")) return `${base}ing`;
  if (base.endsWith("e")) return `${base.slice(0, -1)}ing`;
  if (doubleFinal.has(base)) return `${base}${base.slice(-1)}ing`;
  return `${base}ing`;
}

const beNow = (s: Subject) => (s === "I" ? "am" : isThird(s) ? "is" : "are");
const beNowNeg = (s: Subject) => (s === "I" ? "I'm not" : `${s} ${isThird(s) ? "isn't" : "aren't"}`);
const bePast = (s: Subject) => (s === "I" || isThird(s) ? "was" : "were");

const shortAnswer = (s: Subject, yes: string, no: string) => {
  const a = answerer(s);
  return `Yes, ${a} ${yes}. / No, ${no.startsWith("I'm") ? no : `${a} ${no}`}.`;
};

function presentSimple(verb: Verb, s: Subject, c: string): Tense {
  const base = { id: "present", label: "Presente", use: "Habitos, rutinas y verdades generales." };

  if (verb.base === "be") {
    const a = answerer(s);
    return {
      ...base,
      tip: "Con be no se usa do/does: se invierte el verbo para preguntar.",
      rows: [
        { kind: "affirmative", formula: "Sujeto + am / is / are", example: `${cap(s)} ${beNow(s)} ${c}.` },
        { kind: "negative", formula: "Sujeto + am not / isn't / aren't", example: `${cap(beNowNeg(s))} ${c}.` },
        { kind: "question", formula: "Am / Is / Are + sujeto + ...?", example: `${cap(beNow(s))} ${s} ${c}?` },
        { kind: "short", formula: "Yes, sujeto + am/is/are. / No, sujeto + 'm not/isn't/aren't.", example: shortAnswer(s, beNow(a), a === "I" ? "I'm not" : isThird(a) ? "isn't" : "aren't") },
        { kind: "wh", formula: "Wh- + am / is / are + sujeto + ...?", example: `Why ${beNow(s)} ${s} ${c}?` }
      ]
    };
  }

  if (verb.base === "can") {
    return {
      ...base,
      tip: "Can no cambia con he/she y el verbo que sigue va en base, sin to.",
      rows: [
        { kind: "affirmative", formula: "Sujeto + can + verbo base", example: `${cap(s)} can ${c}.` },
        { kind: "negative", formula: "Sujeto + can't + verbo base", example: `${cap(s)} can't ${c}.` },
        { kind: "question", formula: "Can + sujeto + verbo base + ?", example: `Can ${s} ${c}?` },
        { kind: "short", formula: "Yes, sujeto + can. / No, sujeto + can't.", example: shortAnswer(s, "can", "can't") },
        { kind: "wh", formula: "Wh- + can + sujeto + verbo base + ?", example: `Where can ${s} ${c}?` }
      ]
    };
  }

  const aux = isThird(s) ? "does" : "do";
  const auxNeg = isThird(s) ? "doesn't" : "don't";
  const v = isThird(s) ? thirdPerson(verb.base) : verb.base;
  return {
    ...base,
    tip: "Con he/she el verbo suma -s, pero con does/doesn't vuelve a su forma base.",
    rows: [
      { kind: "affirmative", formula: "Sujeto + verbo (+s con he/she)", example: `${cap(s)} ${v} ${c} every day.` },
      { kind: "negative", formula: "Sujeto + don't / doesn't + verbo base", example: `${cap(s)} ${auxNeg} ${verb.base} ${c} every day.` },
      { kind: "question", formula: "Do / Does + sujeto + verbo base + ?", example: `${cap(aux)} ${s} ${verb.base} ${c} every day?` },
      { kind: "short", formula: "Yes, sujeto + do/does. / No, sujeto + don't/doesn't.", example: shortAnswer(s, aux, auxNeg) },
      { kind: "wh", formula: "Wh- + do / does + sujeto + verbo base + ?", example: `Why ${aux} ${s} ${verb.base} ${c}?` }
    ]
  };
}

function pastSimple(verb: Verb, s: Subject, c: string): Tense {
  const base = { id: "past", label: "Pasado", use: "Acciones terminadas en un momento del pasado." };
  const past = first(verb.past);

  if (verb.base === "be") {
    const a = answerer(s);
    return {
      ...base,
      tip: "Be tiene dos pasados: was (I, he, she, it) y were (you, we, they).",
      rows: [
        { kind: "affirmative", formula: "Sujeto + was / were", example: `${cap(s)} ${bePast(s)} ${c} yesterday.` },
        { kind: "negative", formula: "Sujeto + wasn't / weren't", example: `${cap(s)} ${bePast(s)}n't ${c} yesterday.` },
        { kind: "question", formula: "Was / Were + sujeto + ...?", example: `${cap(bePast(s))} ${s} ${c} yesterday?` },
        { kind: "short", formula: "Yes, sujeto + was/were. / No, sujeto + wasn't/weren't.", example: shortAnswer(s, bePast(a), `${bePast(a)}n't`) },
        { kind: "wh", formula: "Wh- + was / were + sujeto + ...?", example: `When ${bePast(s)} ${s} ${c}?` }
      ]
    };
  }

  if (verb.base === "can") {
    return {
      ...base,
      tip: "Could es el pasado de can y funciona igual: sin did.",
      rows: [
        { kind: "affirmative", formula: "Sujeto + could + verbo base", example: `${cap(s)} could ${c} as a child.` },
        { kind: "negative", formula: "Sujeto + couldn't + verbo base", example: `${cap(s)} couldn't ${c} as a child.` },
        { kind: "question", formula: "Could + sujeto + verbo base + ?", example: `Could ${s} ${c} as a child?` },
        { kind: "short", formula: "Yes, sujeto + could. / No, sujeto + couldn't.", example: shortAnswer(s, "could", "couldn't") },
        { kind: "wh", formula: "Wh- + could + sujeto + verbo base + ?", example: `Where could ${s} ${c}?` }
      ]
    };
  }

  return {
    ...base,
    tip: `Con didn't y Did el verbo vuelve a la base: "Did you ${verb.base}?", nunca "Did you ${past}?".`,
    rows: [
      { kind: "affirmative", formula: "Sujeto + verbo en pasado (2da columna)", example: `${cap(s)} ${past} ${c} yesterday.` },
      { kind: "negative", formula: "Sujeto + didn't + verbo base", example: `${cap(s)} didn't ${verb.base} ${c} yesterday.` },
      { kind: "question", formula: "Did + sujeto + verbo base + ?", example: `Did ${s} ${verb.base} ${c} yesterday?` },
      { kind: "short", formula: "Yes, sujeto + did. / No, sujeto + didn't.", example: shortAnswer(s, "did", "didn't") },
      { kind: "wh", formula: "Wh- + did + sujeto + verbo base + ?", example: `When did ${s} ${verb.base} ${c}?` }
    ]
  };
}

function presentPerfect(verb: Verb, s: Subject, c: string): Tense {
  const participle = first(verb.participle);
  const have = isThird(s) ? "has" : "have";
  const a = answerer(s);
  const answerHave = isThird(a) ? "has" : "have";
  return {
    id: "perfect",
    label: "Presente perfecto",
    use: "Experiencias de vida o acciones pasadas que importan ahora.",
    tip: "Aca se usa el participio (3ra columna). Palabras tipicas: already, yet, ever, never.",
    rows: [
      { kind: "affirmative", formula: "Sujeto + have / has + participio", example: `${cap(s)} ${have} already ${participle} ${c}.` },
      { kind: "negative", formula: "Sujeto + haven't / hasn't + participio", example: `${cap(s)} ${have}n't ${participle} ${c} yet.` },
      { kind: "question", formula: "Have / Has + sujeto + participio + ?", example: `${cap(have)} ${s} ever ${participle} ${c}?` },
      { kind: "short", formula: "Yes, sujeto + have/has. / No, sujeto + haven't/hasn't.", example: shortAnswer(s, answerHave, `${answerHave}n't`) },
      { kind: "wh", formula: "Wh- + have / has + sujeto + participio + ?", example: `Why ${have} ${s} ${participle} ${c}?` }
    ]
  };
}

function future(verb: Verb, s: Subject, c: string): Tense {
  const v = verb.base === "can" ? "be able to" : verb.base;
  return {
    id: "future",
    label: "Futuro",
    use: "Predicciones, promesas y decisiones del momento.",
    tip: verb.base === "can"
      ? "Can no tiene futuro propio: se usa will be able to."
      : "Will no cambia con ninguna persona y el verbo va en base.",
    rows: [
      { kind: "affirmative", formula: "Sujeto + will + verbo base", example: `${cap(s)} will ${v} ${c} tomorrow.` },
      { kind: "negative", formula: "Sujeto + won't + verbo base", example: `${cap(s)} won't ${v} ${c} tomorrow.` },
      { kind: "question", formula: "Will + sujeto + verbo base + ?", example: `Will ${s} ${v} ${c} tomorrow?` },
      { kind: "short", formula: "Yes, sujeto + will. / No, sujeto + won't.", example: shortAnswer(s, "will", "won't") },
      { kind: "wh", formula: "Wh- + will + sujeto + verbo base + ?", example: `When will ${s} ${v} ${c}?` }
    ]
  };
}

function presentContinuous(verb: Verb, s: Subject, c: string): Tense {
  const base = {
    id: "continuous",
    label: "Ahora mismo",
    use: "Lo que esta pasando en este momento (presente continuo).",
    tip: "Siempre lleva am / is / are + verbo con -ing."
  };

  if (stative.has(verb.base)) {
    return {
      ...base,
      rows: [],
      note: `"${verb.base}" es un verbo de estado: normalmente no se usa con -ing. Para hablar de ahora se usa el presente simple.`
    };
  }

  const ing = ingForm(verb.base);
  const a = answerer(s);
  return {
    ...base,
    rows: [
      { kind: "affirmative", formula: "Sujeto + am / is / are + verbo-ing", example: `${cap(s)} ${beNow(s)} ${ing} ${c} right now.` },
      { kind: "negative", formula: "Sujeto + 'm not / isn't / aren't + verbo-ing", example: `${cap(beNowNeg(s))} ${ing} ${c} right now.` },
      { kind: "question", formula: "Am / Is / Are + sujeto + verbo-ing + ?", example: `${cap(beNow(s))} ${s} ${ing} ${c} right now?` },
      { kind: "short", formula: "Yes, sujeto + am/is/are. / No, sujeto + 'm not/isn't/aren't.", example: shortAnswer(s, beNow(a), a === "I" ? "I'm not" : isThird(a) ? "isn't" : "aren't") },
      { kind: "wh", formula: "Wh- + am / is / are + sujeto + verbo-ing + ?", example: `Why ${beNow(s)} ${s} ${ing} ${c}?` }
    ]
  };
}

function modal(verb: Verb, s: Subject, c: string): Tense {
  const base = {
    id: "modal",
    label: "Con modales",
    use: "Consejos, obligaciones y posibilidades.",
    tip: "Mismo esquema con can, could, should, must, might y would: modal + verbo base, sin to."
  };

  if (verb.base === "can") {
    return { ...base, rows: [], note: "Can ya es un modal: mira las pestanas Presente y Pasado." };
  }

  return {
    ...base,
    rows: [
      { kind: "affirmative", formula: "Sujeto + should + verbo base", example: `${cap(s)} should ${verb.base} ${c}.` },
      { kind: "negative", formula: "Sujeto + shouldn't + verbo base", example: `${cap(s)} shouldn't ${verb.base} ${c}.` },
      { kind: "question", formula: "Should + sujeto + verbo base + ?", example: `Should ${s} ${verb.base} ${c}?` },
      { kind: "short", formula: "Yes, sujeto + should. / No, sujeto + shouldn't.", example: shortAnswer(s, "should", "shouldn't") },
      { kind: "wh", formula: "Wh- + should + sujeto + verbo base + ?", example: `Why should ${s} ${verb.base} ${c}?` }
    ]
  };
}

export function buildTenses(verb: Verb, subject: Subject): Tense[] {
  const c = complements[verb.base] ?? "it";
  return [
    presentSimple(verb, subject, c),
    pastSimple(verb, subject, c),
    presentPerfect(verb, subject, c),
    future(verb, subject, c),
    presentContinuous(verb, subject, c),
    modal(verb, subject, c)
  ];
}
