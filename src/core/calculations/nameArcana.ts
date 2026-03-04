import { arcanaNameLetterValueByLetter } from "../../book/knowledgeBase";
import { normalizeClosedTwentyTwo } from "../math/cyclic";

const NAME_SEPARATOR_PATTERN = /[\s-]+/g;
const ALLOWED_NAME_PATTERN = /^[А-ЯЁ\s-]+$/u;

export interface ArcanaTextLetter {
  letter: string;
  value: number;
}

export interface ArcanaTextBreakdown {
  original: string;
  normalized: string;
  letters: ArcanaTextLetter[];
  rawSum: number;
  arcana: number;
}

export function normalizeArcanaTextInput(value: string): string {
  return value
    .trim()
    .replace(/[–—]+/g, "-")
    .replace(/\s+/g, " ")
    .toUpperCase();
}

export function extractArcanaLetters(value: string): string[] {
  const normalized = normalizeArcanaTextInput(value);
  if (normalized.length === 0) {
    throw new Error("Текст для аркана не может быть пустым");
  }

  if (!ALLOWED_NAME_PATTERN.test(normalized)) {
    throw new Error("Допустимы только русские буквы, пробелы и дефис");
  }

  const letters = normalized.replace(NAME_SEPARATOR_PATTERN, "").split("");
  if (letters.length === 0) {
    throw new Error("После очистки не осталось букв для расчёта");
  }

  for (const letter of letters) {
    if (!arcanaNameLetterValueByLetter.has(letter)) {
      throw new Error(`В таблице книги нет значения для буквы ${letter}`);
    }
  }

  return letters;
}

export function calculateArcanaFromText(value: string): ArcanaTextBreakdown {
  const normalized = normalizeArcanaTextInput(value);
  const letters = extractArcanaLetters(normalized).map((letter) => ({
    letter,
    value: arcanaNameLetterValueByLetter.get(letter) as number
  }));
  const rawSum = letters.reduce((sum, item) => sum + item.value, 0);

  return {
    original: value,
    normalized,
    letters,
    rawSum,
    arcana: normalizeClosedTwentyTwo(rawSum)
  };
}
