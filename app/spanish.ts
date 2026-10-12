// Traduccion al espanol de las oraciones de la guia (rioplatense: "vos").
// Cada verbo en ingles se asocia a un verbo en espanol y se conjuga con reglas + excepciones.

import type { Subject } from "./grammar";

type EsVerb = {
  inf: string; // infinitivo sin "se"
  c?: string; // complemento; {o} se adapta al genero/numero (cansado, cansada, cansados)
  m?: string; // significado para mostrar (por defecto, el infinitivo)
  refl?: boolean; // verbo pronominal: sentarse, despertarse...
  cl?: string; // pronombre fijo antes del verbo ("les cuesta")
  stem?: "ie" | "ue"; // cambio de raiz en presente: cerrar -> cierro
  ir3?: boolean; // -ir con cambio en 3ra persona del preterito y gerundio: sintio, durmiendo
  pres?: string[]; // [yo, -, el, nosotros, ellos] (el "vos" se arma con reglas)
  pret?: string[]; // [yo, vos, el, nosotros, ellos]
  fut?: string; // raiz del futuro: pondr-, har-
  part?: string;
  ger?: string;
};

const poner = {
  inf: "poner",
  pres: ["pongo", "", "pone", "ponemos", "ponen"],
  pret: ["puse", "pusiste", "puso", "pusimos", "pusieron"],
  fut: "pondr",
  part: "puesto"
};
const decir = {
  inf: "decir",
  pres: ["digo", "", "dice", "decimos", "dicen"],
  pret: ["dije", "dijiste", "dijo", "dijimos", "dijeron"],
  fut: "dir",
  part: "dicho",
  ger: "diciendo"
};
const hacer = {
  inf: "hacer",
  pres: ["hago", "", "hace", "hacemos", "hacen"],
  pret: ["hice", "hiciste", "hizo", "hicimos", "hicieron"],
  fut: "har",
  part: "hecho"
};

const es: Record<string, EsVerb> = {
  cut: { inf: "cortar", c: "el pan" },
  hit: { inf: "golpear", c: "la pelota" },
  put: { ...poner, c: "las llaves sobre la mesa" },
  cost: { inf: "costar", c: "mucho dinero", cl: "les", stem: "ue" },
  hurt: { inf: "herir", c: "sus sentimientos", m: "lastimar, herir", stem: "ie", ir3: true },
  let: { inf: "dejar", c: "jugar a los chicos", m: "dejar, permitir" },
  set: { ...poner, c: "la mesa", m: "poner, establecer" },
  shut: { inf: "cerrar", c: "la puerta", stem: "ie" },
  split: { inf: "dividir", c: "el pastel" },
  spread: { inf: "difundir", c: "la noticia", m: "difundir, esparcir" },
  bring: {
    inf: "traer",
    c: "el almuerzo",
    pres: ["traigo", "", "trae", "traemos", "traen"],
    pret: ["traje", "trajiste", "trajo", "trajimos", "trajeron"],
    ger: "trayendo"
  },
  buy: { inf: "comprar", c: "pan" },
  catch: { inf: "tomar", c: "el colectivo", m: "atrapar, agarrar, tomar" },
  teach: { inf: "enseñar", c: "inglés" },
  think: { inf: "pensar", c: "en eso", stem: "ie" },
  fight: { inf: "luchar", c: "por la libertad", m: "pelear, luchar" },
  begin: { inf: "empezar", c: "la clase", stem: "ie" },
  drink: { inf: "beber", c: "agua", m: "beber, tomar" },
  ring: { inf: "tocar", c: "la campana", m: "sonar, tocar (timbre)" },
  sing: { inf: "cantar", c: "una canción" },
  sink: { inf: "hundir", c: "el barco", m: "hundir(se)" },
  swim: { inf: "nadar", c: "en el mar" },
  feel: { inf: "sentir", c: "cansad{o}", m: "sentir(se)", refl: true, stem: "ie", ir3: true },
  keep: { inf: "quedar", c: "con el vuelto", m: "guardar, quedarse con", refl: true },
  leave: {
    inf: "salir",
    c: "de casa",
    m: "irse, salir, dejar",
    pres: ["salgo", "", "sale", "salimos", "salen"],
    fut: "saldr"
  },
  meet: { inf: "conocer", c: "gente nueva", m: "conocer, encontrarse con", pres: ["conozco", "", "conoce", "conocemos", "conocen"] },
  sleep: { inf: "dormir", c: "ocho horas", stem: "ue", ir3: true },
  sweep: { inf: "barrer", c: "el piso" },
  deal: { inf: "repartir", c: "las cartas", m: "repartir, tratar con" },
  lend: { inf: "prestar", c: "dinero" },
  send: { inf: "enviar", c: "un correo", pres: ["envío", "", "envía", "enviamos", "envían"] },
  spend: { inf: "gastar", c: "dinero", m: "gastar, pasar (tiempo)" },
  break: { inf: "romper", c: "el vaso", part: "roto" },
  choose: {
    inf: "elegir",
    c: "un color",
    pres: ["elijo", "", "elige", "elegimos", "eligen"],
    pret: ["elegí", "elegiste", "eligió", "elegimos", "eligieron"],
    ger: "eligiendo"
  },
  speak: { inf: "hablar", c: "inglés" },
  steal: { inf: "robar", c: "el dinero" },
  freeze: { inf: "congelar", c: "la carne" },
  wake: { inf: "despertar", c: "temprano", m: "despertar(se)", refl: true, stem: "ie" },
  bite: { inf: "morder", c: "el sándwich", stem: "ue" },
  drive: { inf: "manejar", c: "un auto", m: "manejar, conducir" },
  eat: { inf: "comer", c: "una manzana" },
  write: { inf: "escribir", c: "una carta", part: "escrito" },
  be: {
    inf: "estar",
    c: "en casa",
    m: "ser, estar",
    pres: ["estoy", "", "está", "estamos", "están"],
    pret: ["estuve", "estuviste", "estuvo", "estuvimos", "estuvieron"]
  },
  go: {
    inf: "ir",
    c: "al parque",
    pres: ["voy", "", "va", "vamos", "van"],
    pret: ["fui", "fuiste", "fue", "fuimos", "fueron"],
    ger: "yendo"
  },
  have: { inf: "desayunar", m: "tener (have breakfast = desayunar)" },
  do: { ...hacer, c: "la tarea" },
  see: {
    inf: "ver",
    c: "las montañas",
    pres: ["veo", "", "ve", "vemos", "ven"],
    pret: ["vi", "viste", "vio", "vimos", "vieron"],
    part: "visto"
  },
  come: {
    inf: "venir",
    c: "a casa",
    pres: ["vengo", "", "viene", "venimos", "vienen"],
    pret: ["vine", "viniste", "vino", "vinimos", "vinieron"],
    fut: "vendr",
    ger: "viniendo"
  },
  get: {
    inf: "conseguir",
    c: "un teléfono nuevo",
    m: "conseguir, obtener, recibir",
    pres: ["consigo", "", "consigue", "conseguimos", "consiguen"],
    pret: ["conseguí", "conseguiste", "consiguió", "conseguimos", "consiguieron"],
    ger: "consiguiendo"
  },
  make: { inf: "preparar", c: "la cena", m: "hacer, preparar" },
  take: { inf: "tomar", c: "un taxi", m: "tomar, llevar" },
  give: {
    inf: "dar",
    c: "un regalo",
    pres: ["doy", "", "da", "damos", "dan"],
    pret: ["di", "diste", "dio", "dimos", "dieron"]
  },
  blow: { inf: "soplar", c: "las velas" },
  draw: { inf: "dibujar", c: "un dibujo" },
  fly: { inf: "volar", c: "a Miami", stem: "ue" },
  grow: { inf: "cultivar", c: "tomates", m: "crecer, cultivar" },
  know: {
    inf: "saber",
    c: "la respuesta",
    m: "saber, conocer",
    pres: ["sé", "", "sabe", "sabemos", "saben"],
    pret: ["supe", "supiste", "supo", "supimos", "supieron"],
    fut: "sabr"
  },
  throw: { inf: "tirar", c: "la pelota", m: "tirar, lanzar" },
  show: { inf: "mostrar", c: "las fotos", stem: "ue" },
  find: { inf: "encontrar", c: "las llaves", stem: "ue" },
  hold: { inf: "cargar", c: "al bebé", m: "sostener, sujetar" },
  lead: { inf: "liderar", c: "el equipo", m: "guiar, liderar" },
  lose: { inf: "perder", c: "el partido", stem: "ie" },
  pay: { inf: "pagar", c: "la cuenta" },
  say: { ...decir, c: "hola" },
  sell: { inf: "vender", c: "el auto" },
  tell: { ...decir, c: "la verdad", m: "decir, contar" },
  win: { inf: "ganar", c: "la carrera" },
  stand: { ...hacer, c: "fila", m: "estar de pie, pararse" },
  burn: { inf: "quemar", c: "la tostada" },
  dream: { inf: "soñar", c: "con la playa", stem: "ue" },
  learn: { inf: "aprender", c: "inglés" },
  smell: { inf: "oler", c: "las flores", pres: ["huelo", "", "huele", "olemos", "huelen"] },
  spell: { inf: "deletrear", c: "la palabra" },
  spill: { inf: "derramar", c: "el café" },
  spoil: { inf: "arruinar", c: "la sorpresa", m: "arruinar, malcriar" },
  become: { inf: "volver", c: "famos{o}", m: "volverse, convertirse en", refl: true, stem: "ue", part: "vuelto" },
  bet: { inf: "apostar", c: "diez dólares", stem: "ue" },
  bleed: { inf: "sangrar", c: "mucho" },
  build: {
    inf: "construir",
    c: "una casa",
    pres: ["construyo", "", "construye", "construimos", "construyen"],
    pret: ["construí", "construiste", "construyó", "construimos", "construyeron"],
    ger: "construyendo"
  },
  can: { inf: "poder", c: "nadar", m: "poder", stem: "ue", ger: "pudiendo", fut: "podr" },
  fall: { inf: "quedar", c: "dormid{o}", m: "caer(se)", refl: true },
  forget: { inf: "olvidar", c: "la contraseña" },
  forgive: { inf: "perdonar", c: "el error" },
  hang: { inf: "colgar", c: "el cuadro en la pared", stem: "ue" },
  hear: {
    inf: "oír",
    c: "la música",
    pres: ["oigo", "", "oye", "oímos", "oyen"],
    pret: ["oí", "oíste", "oyó", "oímos", "oyeron"],
    fut: "oir",
    ger: "oyendo"
  },
  hide: { inf: "esconder", c: "el regalo" },
  lay: { ...poner, c: "las cartas sobre la mesa", m: "poner, colocar, tender" },
  light: { inf: "encender", c: "un fuego", m: "encender, prender", stem: "ie" },
  mean: { inf: "hablar", c: "en serio", m: "significar, querer decir" },
  read: {
    inf: "leer",
    c: "un libro",
    pret: ["leí", "leíste", "leyó", "leímos", "leyeron"],
    ger: "leyendo"
  },
  ride: {
    inf: "andar",
    c: "en bicicleta",
    m: "andar en, montar",
    pret: ["anduve", "anduviste", "anduvo", "anduvimos", "anduvieron"]
  },
  rise: { inf: "levantar", c: "temprano", m: "subir, levantarse", refl: true },
  run: { inf: "correr", c: "en el parque" },
  shake: { inf: "agitar", c: "la botella", m: "sacudir, agitar" },
  shine: { inf: "brillar", c: "con fuerza" },
  shoot: { inf: "filmar", c: "un video", m: "disparar, filmar" },
  sit: { inf: "sentar", c: "en el sillón", m: "sentarse", refl: true, stem: "ie" },
  stick: { inf: "pegar", c: "la nota en la heladera" },
  understand: { inf: "entender", c: "la lección", stem: "ie" },
  upset: { inf: "molestar", c: "a la gente", m: "molestar, disgustar" },
  wear: { inf: "llevar", c: "una campera", m: "usar, llevar puesto" }
};

const pronouns: Record<Subject, string> = { I: "yo", you: "vos", he: "él", she: "ella", we: "nosotros", they: "ellos" };
const person: Record<Subject, number> = { I: 0, you: 1, he: 2, she: 2, we: 3, they: 4 };
const reflexive = ["me", "te", "se", "nos", "se"];

const cap = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
const join = (...parts: (string | undefined)[]) => parts.filter(Boolean).join(" ");

// Cambia la ultima vocal e/o de la raiz: cerr -> cierr, dorm -> duerm.
function changeStem(stem: string, from: RegExp, to: (vowel: string) => string) {
  const reversed = stem.split("").reverse().join("").search(from);
  if (reversed < 0) return stem;
  const last = stem.length - 1 - reversed;
  return stem.slice(0, last) + to(stem[last]) + stem.slice(last + 1);
}

const ending = (inf: string) => inf.replace("í", "i").slice(-2) as "ar" | "er" | "ir";
const stemOf = (inf: string) => inf.replace("í", "i").slice(0, -2);

function present(v: EsVerb, p: number) {
  if (p === 1) {
    if (v.inf === "ir") return "vas";
    if (v.inf === "dar") return "das";
    if (v.inf === "ver") return "ves";
    const end = ending(v.inf);
    return `${stemOf(v.inf)}${{ ar: "ás", er: "és", ir: "ís" }[end]}`;
  }
  if (v.pres) return v.pres[p];
  const end = ending(v.inf);
  let stem = stemOf(v.inf);
  if (v.stem && p !== 3) {
    stem = changeStem(stem, /[eo]/, (vowel) => (vowel === "e" ? "ie" : "ue"));
  }
  const endings = { ar: ["o", "", "a", "amos", "an"], er: ["o", "", "e", "emos", "en"], ir: ["o", "", "e", "imos", "en"] };
  return stem + endings[end][p];
}

function preterite(v: EsVerb, p: number) {
  if (v.pret) return v.pret[p];
  const end = ending(v.inf);
  let stem = stemOf(v.inf);
  if (end === "ar") {
    if (p === 0) stem = stem.replace(/c$/, "qu").replace(/g$/, "gu").replace(/z$/, "c");
    return stem + ["é", "aste", "ó", "amos", "aron"][p];
  }
  if (v.ir3 && (p === 2 || p === 4)) stem = changeStem(stem, /[eo]/, (vowel) => (vowel === "e" ? "i" : "u"));
  return stem + ["í", "iste", "ió", "imos", "ieron"][p];
}

function future(v: EsVerb, p: number) {
  return (v.fut ?? v.inf) + ["é", "ás", "á", "emos", "án"][p];
}

function participle(v: EsVerb) {
  if (v.part) return v.part;
  const stem = stemOf(v.inf);
  if (ending(v.inf) === "ar") return `${stem}ado`;
  return /[aeo]$/.test(stem) ? `${stem}ído` : `${stem}ido`;
}

function gerund(v: EsVerb) {
  if (v.ger) return v.ger;
  let stem = stemOf(v.inf);
  if (ending(v.inf) === "ar") return `${stem}ando`;
  if (v.ir3) stem = changeStem(stem, /[eo]/, (vowel) => (vowel === "e" ? "i" : "u"));
  return /[aeo]$/.test(stem) ? `${stem}yendo` : `${stem}iendo`;
}

const haber = ["he", "has", "ha", "hemos", "han"];
const estar = ["estoy", "estás", "está", "estamos", "están"];
const deberia = ["debería", "deberías", "debería", "deberíamos", "deberían"];
const podia = ["podía", "podías", "podía", "podíamos", "podían"];

export type EsTense = "present" | "past" | "perfect" | "future" | "continuous" | "modal" | "couldPast";

/** Significado del verbo en espanol para mostrar en la tarjeta y la lista. */
export function meaning(base: string) {
  const v = es[base];
  if (!v) return "";
  return v.m ?? (v.refl ? `${v.inf.replace("í", "i")}se` : v.inf);
}

type EsOptions = { marker?: string; affPre?: string; negPre?: string; qPre?: string; wh: string };

/** Traduce las 5 filas de un tiempo verbal: afirmar, negar, preguntar, responder, Wh-. */
export function translate(base: string, subject: Subject, tense: EsTense, options: EsOptions) {
  const v = es[base];
  if (!v) return null;
  const p = person[subject];
  const pronoun = pronouns[subject];
  const gender = subject === "she" ? "a" : subject === "we" || subject === "they" ? "os" : "o";
  const complement = v.c?.replace("{o}", gender);
  const clitic = v.refl ? reflexive[p] : v.cl;
  const infinitive = v.refl ? `${v.inf.replace("í", "i")}${reflexive[p]}` : v.inf;

  const conjugated: Record<EsTense, string> = {
    present: join(clitic, present(v, p)),
    past: join(clitic, preterite(v, p)),
    perfect: join(clitic, haber[p], participle(v)),
    future: join(clitic, future(v, p)),
    continuous: join(clitic, estar[p], gerund(v)),
    // Con modal el pronombre va pegado al infinitivo: deberia sentarme.
    modal: join(deberia[p], v.refl ? infinitive : `${v.inf}${v.cl ?? ""}`),
    couldPast: podia[p]
  };
  const verb = conjugated[tense];
  const tail = join(complement, options.marker?.replace("{o}", gender));
  const answer = pronouns[subject === "you" ? "I" : subject === "I" ? "you" : subject];

  return {
    affirmative: `${cap(join(pronoun, options.affPre, verb, tail))}.`,
    negative: `${cap(join(pronoun, options.negPre ?? "no", verb, tail))}.`,
    question: `¿${cap(join(pronoun, options.qPre, verb, tail))}?`,
    short: `Sí, ${answer} sí. / No, ${answer} no.`,
    wh: `¿${cap(join(options.wh, verb, pronoun, complement))}?`
  };
}
