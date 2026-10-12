// Contenido de la pantalla "Reglas": preguntas con W (Wh-) y lo que cambia segun el pronombre.

export type Example = { en: string; es: string };

// ---------- Preguntas con W ----------

export const whWords: { word: string; es: string; use: string; example: Example }[] = [
  { word: "What", es: "qué / cuál", use: "cosas, acciones, información", example: { en: "What do you do?", es: "¿A qué te dedicás?" } },
  { word: "Where", es: "dónde", use: "lugar", example: { en: "Where do you live?", es: "¿Dónde vivís?" } },
  { word: "When", es: "cuándo", use: "momento (día, mes, año)", example: { en: "When does the movie start?", es: "¿Cuándo empieza la película?" } },
  { word: "What time", es: "a qué hora", use: "hora exacta", example: { en: "What time is it?", es: "¿Qué hora es?" } },
  { word: "Who", es: "quién", use: "personas", example: { en: "Who is your teacher?", es: "¿Quién es tu profesor?" } },
  { word: "Whose", es: "de quién", use: "a quién pertenece algo", example: { en: "Whose phone is this?", es: "¿De quién es este teléfono?" } },
  { word: "Which", es: "cuál", use: "elegir entre pocas opciones", example: { en: "Which one do you want, the red one or the blue one?", es: "¿Cuál querés, el rojo o el azul?" } },
  { word: "Why", es: "por qué", use: "la razón; se responde con because", example: { en: "Why are you tired? Because I didn't sleep.", es: "¿Por qué estás cansado? Porque no dormí." } },
  { word: "How", es: "cómo", use: "la manera o cómo está alguien", example: { en: "How do you get to work?", es: "¿Cómo vas al trabajo?" } },
  { word: "How much", es: "cuánto", use: "cosas que no se cuentan y precios", example: { en: "How much is this jacket?", es: "¿Cuánto sale esta campera?" } },
  { word: "How many", es: "cuántos", use: "cosas que se cuentan", example: { en: "How many brothers do you have?", es: "¿Cuántos hermanos tenés?" } },
  { word: "How old", es: "qué edad", use: "edad", example: { en: "How old are you?", es: "¿Cuántos años tenés?" } },
  { word: "How long", es: "cuánto tiempo", use: "duración", example: { en: "How long does the trip take?", es: "¿Cuánto dura el viaje?" } },
  { word: "How often", es: "cada cuánto", use: "frecuencia", example: { en: "How often do you go to the gym?", es: "¿Cada cuánto vas al gimnasio?" } }
];

export const whRules: { title: string; formula: string; examples: Example[]; note?: string }[] = [
  {
    title: "Con el verbo be (am, is, are, was, were)",
    formula: "W + am / is / are / was / were + sujeto",
    examples: [
      { en: "Where is the bathroom?", es: "¿Dónde está el baño?" },
      { en: "Why were you late?", es: "¿Por qué llegaste tarde?" }
    ]
  },
  {
    title: "Con cualquier otro verbo, en presente",
    formula: "W + do / does + sujeto + verbo base",
    examples: [
      { en: "What do you want?", es: "¿Qué querés?" },
      { en: "Where does she work?", es: "¿Dónde trabaja ella?" }
    ],
    note: "Does va con he, she, it. El verbo queda sin -s: \"Where does she work?\", no \"works\"."
  },
  {
    title: "En pasado",
    formula: "W + did + sujeto + verbo base",
    examples: [
      { en: "When did you arrive?", es: "¿Cuándo llegaste?" },
      { en: "What did they say?", es: "¿Qué dijeron?" }
    ],
    note: "Did ya marca el pasado, así que el verbo va en base: \"did you go\", nunca \"did you went\"."
  },
  {
    title: "Con have, will, can, should...",
    formula: "W + auxiliar + sujeto + verbo",
    examples: [
      { en: "Where have you been?", es: "¿Dónde estuviste?" },
      { en: "What will you do tomorrow?", es: "¿Qué vas a hacer mañana?" },
      { en: "How can I help you?", es: "¿Cómo te puedo ayudar?" }
    ]
  },
  {
    title: "Cuando Who o What es el sujeto: sin do / does / did",
    formula: "Who / What + verbo",
    examples: [
      { en: "Who called you?", es: "¿Quién te llamó?" },
      { en: "What happened?", es: "¿Qué pasó?" },
      { en: "Who did you call?", es: "¿A quién llamaste?" }
    ],
    note: "\"Who called you?\" pregunta quién hizo la acción. \"Who did you call?\" pregunta a quién se la hiciste: ahí sí va did."
  },
  {
    title: "La preposición va al final",
    formula: "W + ... + preposición?",
    examples: [
      { en: "Where are you from?", es: "¿De dónde sos?" },
      { en: "Who are you talking to?", es: "¿Con quién estás hablando?" },
      { en: "What are you looking for?", es: "¿Qué estás buscando?" }
    ]
  }
];

export const whMistakes: { wrong: string; right: string; why: string }[] = [
  { wrong: "Where you live?", right: "Where do you live?", why: "Falta el auxiliar do." },
  { wrong: "Why you are late?", right: "Why are you late?", why: "Con be, el verbo va antes del sujeto." },
  { wrong: "Where did you went?", right: "Where did you go?", why: "Después de did, verbo base." },
  { wrong: "What means \"cheap\"?", right: "What does \"cheap\" mean?", why: "Mean no es el sujeto: lleva does." },
  { wrong: "How many money do you have?", right: "How much money do you have?", why: "Money no se cuenta: much." },
  { wrong: "From where are you?", right: "Where are you from?", why: "La preposición va al final." }
];

/** Ejercicio: elegir la palabra con W segun la respuesta. */
export const whQuiz: { question: string; answer: string; word: string }[] = [
  { question: "___ do you live?", answer: "In Buenos Aires.", word: "Where" },
  { question: "___ did you arrive?", answer: "Yesterday.", word: "When" },
  { question: "___ is it?", answer: "It's nine thirty.", word: "What time" },
  { question: "___ is that woman?", answer: "She's my sister.", word: "Who" },
  { question: "___ are you sad?", answer: "Because I lost my job.", word: "Why" },
  { question: "___ do you go to work?", answer: "By bus.", word: "How" },
  { question: "___ is this coffee?", answer: "Three dollars.", word: "How much" },
  { question: "___ sisters do you have?", answer: "Two.", word: "How many" },
  { question: "___ are you?", answer: "I'm thirty years old.", word: "How old" },
  { question: "___ does the flight take?", answer: "About two hours.", word: "How long" },
  { question: "___ do you play soccer?", answer: "Twice a week.", word: "How often" },
  { question: "___ car is this?", answer: "It's Maria's.", word: "Whose" },
  { question: "___ do you want, tea or coffee?", answer: "Coffee, please.", word: "Which" },
  { question: "___ do you want for dinner?", answer: "Pizza.", word: "What" },
  { question: "___ are you?", answer: "I'm fine, thanks.", word: "How" },
  { question: "___ is your birthday?", answer: "In May.", word: "When" },
  { question: "___ called you?", answer: "My boss.", word: "Who" },
  { question: "___ are you from?", answer: "I'm from Argentina.", word: "Where" }
];

// ---------- Pronombres ----------

export type PronounRow = {
  en: string;
  es: string;
  be: string;
  contraction: string;
  bePast: string;
  have: string;
  doAux: string;
  verb: string;
  object: string;
  possessive: string;
  pronoun: string;
  reflexive: string;
};

export const pronouns: PronounRow[] = [
  { en: "I", es: "yo", be: "am", contraction: "I'm", bePast: "was", have: "have", doAux: "do / don't", verb: "work", object: "me", possessive: "my", pronoun: "mine", reflexive: "myself" },
  { en: "you", es: "vos / tú / usted", be: "are", contraction: "you're", bePast: "were", have: "have", doAux: "do / don't", verb: "work", object: "you", possessive: "your", pronoun: "yours", reflexive: "yourself" },
  { en: "he", es: "él", be: "is", contraction: "he's", bePast: "was", have: "has", doAux: "does / doesn't", verb: "works", object: "him", possessive: "his", pronoun: "his", reflexive: "himself" },
  { en: "she", es: "ella", be: "is", contraction: "she's", bePast: "was", have: "has", doAux: "does / doesn't", verb: "works", object: "her", possessive: "her", pronoun: "hers", reflexive: "herself" },
  { en: "it", es: "eso (cosa o animal)", be: "is", contraction: "it's", bePast: "was", have: "has", doAux: "does / doesn't", verb: "works", object: "it", possessive: "its", pronoun: "—", reflexive: "itself" },
  { en: "we", es: "nosotros", be: "are", contraction: "we're", bePast: "were", have: "have", doAux: "do / don't", verb: "work", object: "us", possessive: "our", pronoun: "ours", reflexive: "ourselves" },
  { en: "you", es: "ustedes", be: "are", contraction: "you're", bePast: "were", have: "have", doAux: "do / don't", verb: "work", object: "you", possessive: "your", pronoun: "yours", reflexive: "yourselves" },
  { en: "they", es: "ellos / ellas", be: "are", contraction: "they're", bePast: "were", have: "have", doAux: "do / don't", verb: "work", object: "them", possessive: "their", pronoun: "theirs", reflexive: "themselves" }
];

export const pronounRules: { title: string; text: string; examples: Example[] }[] = [
  {
    title: "Was o were",
    text: "Was va con I, he, she, it. Were va con you, we, they. You siempre lleva were, aunque sea una sola persona.",
    examples: [
      { en: "I was at home. She was tired.", es: "Yo estaba en casa. Ella estaba cansada." },
      { en: "You were right. They were late.", es: "Tenías razón. Ellos llegaron tarde." }
    ]
  },
  {
    title: "Am, is o are",
    text: "Am solo con I. Is con he, she, it. Are con you, we, they.",
    examples: [
      { en: "I am a student. He is my brother. We are friends.", es: "Soy estudiante. Él es mi hermano. Somos amigos." }
    ]
  },
  {
    title: "He, she, it: la tercera persona cambia en presente",
    text: "En presente simple, con he, she, it el verbo suma -s, do pasa a does y have pasa a has. Con todos los demás, queda igual.",
    examples: [
      { en: "I work. She works.", es: "Yo trabajo. Ella trabaja." },
      { en: "Do you like it? Does he like it?", es: "¿Te gusta? ¿A él le gusta?" },
      { en: "They have a car. He has a car.", es: "Ellos tienen auto. Él tiene auto." }
    ]
  },
  {
    title: "Cómo se agrega la -s",
    text: "Casi siempre +s (works). Si termina en s, sh, ch, x u o: +es (watches, goes). Consonante + y: cambia a -ies (study, studies). Have es irregular: has.",
    examples: [
      { en: "She watches TV. He goes to school. She studies English.", es: "Ella mira tele. Él va a la escuela. Ella estudia inglés." }
    ]
  },
  {
    title: "Con does, doesn't y did, el verbo vuelve a la base",
    text: "La -s ya la lleva does. Por eso es \"she doesn't work\", no \"she doesn't works\".",
    examples: [
      { en: "She doesn't work on Sundays. Does he speak English?", es: "Ella no trabaja los domingos. ¿Él habla inglés?" }
    ]
  },
  {
    title: "Lo que no cambia con el pronombre",
    text: "El pasado (salvo was/were), will, can, could, should, must y would son iguales para todos.",
    examples: [
      { en: "I went. She went. They will call. He can swim.", es: "Yo fui. Ella fue. Ellos van a llamar. Él sabe nadar." }
    ]
  },
  {
    title: "Sujeto, objeto y posesivo",
    text: "El sujeto hace la acción (she), el objeto la recibe (her), el posesivo va antes de un sustantivo (her book) y el pronombre posesivo lo reemplaza (it's hers).",
    examples: [
      { en: "She called me. I called her.", es: "Ella me llamó. Yo la llamé." },
      { en: "This is my book. This book is mine.", es: "Este es mi libro. Este libro es mío." }
    ]
  },
  {
    title: "It y they",
    text: "It es para cosas y animales (en español casi siempre se omite: \"llueve\" = it's raining). They es el plural de he, she e it.",
    examples: [
      { en: "It's cold. It's my phone.", es: "Hace frío. Es mi teléfono." },
      { en: "Where are my keys? They're on the table.", es: "¿Dónde están mis llaves? Están en la mesa." }
    ]
  }
];

/** Ejercicio de pronombres: oracion con un hueco y opciones que dependen del pronombre. */
export type PronounQuestion = { before: string; after: string; options: string[]; answer: string; hint?: string; full: string };

const capital = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];
const subjectRows = pronouns.filter((row) => row.es !== "ustedes");

type Template = (row: PronounRow) => Omit<PronounQuestion, "full"> | null;

const templates: Template[] = [
  (row) => ({ before: `${capital(row.en)} `, after: " at home yesterday.", options: ["was", "were"], answer: row.bePast }),
  (row) => ({ before: `${capital(row.en)} `, after: " very happy today.", options: ["am", "is", "are"], answer: row.be }),
  (row) => (row.en === "it" ? null : { before: "", after: ` ${row.en} like coffee?`, options: ["Do", "Does"], answer: row.doAux.startsWith("does") ? "Does" : "Do" }),
  (row) => (row.en === "it" ? null : { before: `${capital(row.en)} `, after: " like coffee.", options: ["don't", "doesn't"], answer: row.doAux.endsWith("doesn't") ? "doesn't" : "don't" }),
  (row) => (row.en === "it" ? null : { before: `${capital(row.en)} `, after: " two brothers.", options: ["have", "has"], answer: row.have }),
  (row) => (row.en === "it" ? null : { before: `${capital(row.en)} `, after: " in an office.", options: ["work", "works"], answer: row.verb }),
  (row) => (row.en === "I" || row.en === "it" ? null : { before: "Can you help ", after: "?", options: [row.en, row.object, row.possessive].filter((v, i, a) => a.indexOf(v) === i), answer: row.object, hint: `a ${row.es.split(" ")[0]}` }),
  (row) => (row.en === "it" ? null : { before: "This is ", after: " phone.", options: [row.en === "I" ? "I" : row.en, row.object, row.possessive].filter((v, i, a) => a.indexOf(v) === i), answer: row.possessive, hint: `de ${row.es.split(" ")[0]}`.replace("de yo", "mío") }),
  (row) => (row.pronoun === "—" ? null : { before: "This phone is ", after: ".", options: [row.possessive, row.pronoun, row.object].filter((v, i, a) => a.indexOf(v) === i), answer: row.pronoun, hint: "posesivo, sin sustantivo después" })
];

export function makePronounQuestion(): PronounQuestion {
  for (;;) {
    const question = pick(templates)(pick(subjectRows));
    if (question && question.options.length > 1) {
      return { ...question, full: `${question.before}${question.answer}${question.after}` };
    }
  }
}
