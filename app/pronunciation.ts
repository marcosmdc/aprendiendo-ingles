// Compara lo que se queria decir con lo que entendio el reconocimiento de voz, palabra por palabra.

const contractions: Record<string, string> = {
  "i'm": "i am", "you're": "you are", "we're": "we are", "they're": "they are",
  "he's": "he is", "she's": "she is", "it's": "it is", "that's": "that is", "what's": "what is",
  "there's": "there is", "here's": "here is", "let's": "let us", "where's": "where is",
  "don't": "do not", "doesn't": "does not", "didn't": "did not", "can't": "can not", "cannot": "can not",
  "won't": "will not", "isn't": "is not", "aren't": "are not", "wasn't": "was not", "weren't": "were not",
  "haven't": "have not", "hasn't": "has not", "couldn't": "could not", "shouldn't": "should not",
  "wouldn't": "would not", "i'll": "i will", "you'll": "you will", "we'll": "we will", "they'll": "they will",
  "he'll": "he will", "she'll": "she will", "i'd": "i would", "you'd": "you would", "i've": "i have",
  "you've": "you have", "we've": "we have", "they've": "they have", "okay": "ok"
};

const units = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve",
  "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

function numberWords(value: string): string {
  const number = Number(value);
  // Numeros largos (911, 402) se dicen digito por digito.
  if (number > 99) return value.split("").map((digit) => units[Number(digit)]).join(" ");
  if (number < 20) return units[number];
  return [tens[Math.floor(number / 10)], number % 10 ? units[number % 10] : ""].filter(Boolean).join(" ");
}

/** Pasa un texto a palabras comparables: minusculas, sin puntuacion, contracciones y numeros expandidos. */
export function normalizeWords(text: string): string[] {
  const prepared = text
    .toLowerCase()
    .replace(/[’`]/g, "'")
    .replace(/\$(\d+)/g, "$1 dollars")
    .replace(/(\d+):(\d+)/g, "$1 $2")
    .replace(/(\d+)%/g, "$1 percent")
    .replace(/[-–—/]/g, " ")
    .replace(/[^a-z0-9'\s]/g, " ");

  return prepared
    .split(/\s+/)
    .filter(Boolean)
    .flatMap((word) => {
      const clean = word.replace(/^'+|'+$/g, "");
      if (!clean) return [];
      if (/^\d+$/.test(clean)) return numberWords(clean).split(" ");
      return (contractions[clean] ?? clean).split(" ");
    });
}

export type WordMark = { text: string; ok: boolean };
export type Comparison = { score: number; words: WordMark[]; heard: string };

// Que palabras normalizadas de la frase aparecen, en orden, en lo escuchado (subsecuencia comun mas larga).
function matched(target: string[], heard: string[]) {
  const table = Array.from({ length: target.length + 1 }, () => new Array<number>(heard.length + 1).fill(0));
  for (let i = target.length - 1; i >= 0; i--) {
    for (let j = heard.length - 1; j >= 0; j--) {
      table[i][j] = target[i] === heard[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
    }
  }
  const flags = new Array<boolean>(target.length).fill(false);
  let i = 0;
  let j = 0;
  while (i < target.length && j < heard.length) {
    if (target[i] === heard[j]) {
      flags[i] = true;
      i++;
      j++;
    } else if (table[i + 1][j] >= table[i][j + 1]) i++;
    else j++;
  }
  return flags;
}

function compareOne(target: string, heard: string): Comparison {
  // Cada palabra visible se marca bien solo si todas sus partes normalizadas coinciden.
  const display = target.split(/\s+/).filter(Boolean);
  const parts = display.map((word) => normalizeWords(word));
  const flat = parts.flat();
  const flags = matched(flat, normalizeWords(heard));

  let offset = 0;
  const words = display.map((text, index) => {
    const size = parts[index].length;
    const ok = flags.slice(offset, offset + size).every(Boolean);
    offset += size;
    return { text, ok };
  });
  const hits = flags.filter(Boolean).length;
  return { score: flat.length ? Math.round((hits * 100) / flat.length) : 0, words, heard };
}

/** Elige, entre las transcripciones posibles, la que mejor coincide con la frase. */
export function comparePronunciation(target: string, alternatives: string[]): Comparison {
  return alternatives
    .map((heard) => compareOne(target, heard))
    .reduce((best, current) => (current.score > best.score ? current : best));
}
