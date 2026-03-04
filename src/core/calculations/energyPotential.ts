import { knowledgeBase } from "../../book/knowledgeBase";
import { buildQuersumTriangle } from "../math/cyclic";

export interface HouseValue {
  houseId: number;
  matrixDigit: number;
  count: number;
  score: number;
}

export interface PersonalEnergyPotentialResult {
  birthDate: string;
  digits: number[];
  triangleRows: number[][];
  rootDigit: number;
  digitCounts: Record<number, number>;
  houseValues: Record<number, HouseValue>;
  matrixCounts: number[][];
  matrixScores: number[][];
}

export interface BirthDateParts {
  day: number;
  month: number;
  year: number;
  normalized: string;
  digits: number[];
}

function isLeapYear(year: number): boolean {
  return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
}

function getDaysInMonth(month: number, year: number): number {
  switch (month) {
    case 2:
      return isLeapYear(year) ? 29 : 28;
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
    default:
      return 31;
  }
}

export function parseBirthDateParts(birthDate: string): BirthDateParts {
  const input = birthDate.trim();
  if (input.length === 0) {
    throw new Error("Birth date must not be empty");
  }

  let day: number;
  let month: number;
  let year: number;

  if (/^\d{8}$/.test(input)) {
    day = Number(input.slice(0, 2));
    month = Number(input.slice(2, 4));
    year = Number(input.slice(4, 8));
  } else {
    const parts = input.split(/\D+/).filter(Boolean);
    if (parts.length !== 3) {
      throw new Error(`Birth date must be in DD.MM.YYYY, DD/MM/YYYY, YYYY-MM-DD or 8-digit format, got "${birthDate}"`);
    }

    if (parts[0].length === 4) {
      year = Number(parts[0]);
      month = Number(parts[1]);
      day = Number(parts[2]);
    } else {
      day = Number(parts[0]);
      month = Number(parts[1]);
      year = Number(parts[2]);
    }
  }

  if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) {
    throw new Error(`Birth date contains invalid numeric parts: "${birthDate}"`);
  }

  if (year < 1 || year > 9999) {
    throw new Error(`Birth year must be in range 1..9999, got ${year}`);
  }

  if (month < 1 || month > 12) {
    throw new Error(`Birth month must be in range 1..12, got ${month}`);
  }

  const maxDay = getDaysInMonth(month, year);
  if (day < 1 || day > maxDay) {
    throw new Error(`Birth day must be in range 1..${maxDay} for month ${month} and year ${year}, got ${day}`);
  }

  const normalized = `${String(day).padStart(2, "0")}.${String(month).padStart(2, "0")}.${String(year).padStart(4, "0")}`;
  return {
    day,
    month,
    year,
    normalized,
    digits: normalized.replace(/\D/g, "").split("").map((digit) => Number(digit))
  };
}

export function normalizeBirthDateInput(birthDate: string): string {
  return parseBirthDateParts(birthDate).normalized;
}

export function parseBirthDateDigits(birthDate: string): number[] {
  return parseBirthDateParts(birthDate).digits;
}

export function countDigits(rows: number[][]): Record<number, number> {
  const counts: Record<number, number> = {};
  for (let digit = 0; digit <= 9; digit += 1) {
    counts[digit] = 0;
  }

  for (const row of rows) {
    for (const digit of row) {
      counts[digit] = (counts[digit] ?? 0) + 1;
    }
  }

  return counts;
}

export function countToPersonalScore(count: number): number {
  if (!Number.isInteger(count) || count < 0) {
    throw new Error(`Personal score count must be a non-negative integer, got ${count}`);
  }

  if (count <= 4) {
    return count;
  }

  return -(count - 4);
}

export function buildMatrixFromDigitMap<T>(valuesByDigit: Record<number, T>): T[][] {
  return knowledgeBase.personalMatrixLayout.layout.map((row) =>
    row.map((digit) => {
      if (!(digit in valuesByDigit)) {
        throw new Error(`Missing value for matrix digit ${digit}`);
      }

      return valuesByDigit[digit];
    })
  );
}

export function calculatePersonalEnergyPotential(birthDate: string): PersonalEnergyPotentialResult {
  const digits = parseBirthDateDigits(birthDate);
  const triangleRows = buildQuersumTriangle(digits);
  const digitCounts = countDigits(triangleRows);
  const rootDigit = triangleRows[triangleRows.length - 1][0];

  const houseValues = Object.fromEntries(
    knowledgeBase.houses.map((house) => {
      const count = digitCounts[house.matrixDigit] ?? 0;
      return [
        house.id,
        {
          houseId: house.id,
          matrixDigit: house.matrixDigit,
          count,
          score: countToPersonalScore(count)
        } satisfies HouseValue
      ];
    })
  ) as Record<number, HouseValue>;

  const countByDigit = Object.fromEntries(
    knowledgeBase.houses.map((house) => [house.matrixDigit, houseValues[house.id].count])
  ) as Record<number, number>;

  const scoreByDigit = Object.fromEntries(
    knowledgeBase.houses.map((house) => [house.matrixDigit, houseValues[house.id].score])
  ) as Record<number, number>;

  return {
    birthDate,
    digits,
    triangleRows,
    rootDigit,
    digitCounts,
    houseValues,
    matrixCounts: buildMatrixFromDigitMap(countByDigit),
    matrixScores: buildMatrixFromDigitMap(scoreByDigit)
  };
}
