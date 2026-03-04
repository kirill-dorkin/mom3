import { knowledgeBase } from "../../book/knowledgeBase";
import { calculatePersonalEnergyPotential, countDigits, parseBirthDateDigits } from "./energyPotential";
import { buildQuersumTriangle } from "../math/cyclic";

export interface SomaticSeriesValue {
  seriesId: number;
  digit: number;
  energyScore: number;
}

export interface SomaticAgeSnapshot {
  age: number;
  values: Record<number, SomaticSeriesValue>;
}

export interface SomaticDiagramResult {
  birthDate: string;
  baseDigits: Record<number, number>;
  snapshots: SomaticAgeSnapshot[];
}

export function normalizeSomaticBaseDigit(count: number): number {
  if (!Number.isInteger(count) || count < 0) {
    throw new Error(`Somatic base digit must be a non-negative integer, got ${count}`);
  }

  return Math.min(count, 9);
}

export function digitToSomaticEnergyScore(digit: number): number {
  if (!Number.isInteger(digit) || digit < 0 || digit > 9) {
    throw new Error(`Somatic digit must be in range 0..9, got ${digit}`);
  }

  if (digit <= 4) {
    return digit + 1;
  }

  return -(digit - 4);
}

export function rotateSomaticDigit(baseDigit: number, age: number): number {
  if (!Number.isInteger(baseDigit) || baseDigit < 0 || baseDigit > 9) {
    throw new Error(`Base digit must be in range 0..9, got ${baseDigit}`);
  }
  if (!Number.isInteger(age) || age < 0) {
    throw new Error(`Age must be a non-negative integer, got ${age}`);
  }

  return (baseDigit + age) % 10;
}

export function calculateSomaticBaseDigits(birthDate: string): Record<number, number> {
  const digits = parseBirthDateDigits(birthDate);
  const triangleRows = buildQuersumTriangle(digits);
  const digitCounts = countDigits(triangleRows);
  const personal = calculatePersonalEnergyPotential(birthDate);

  const baseDigits: Record<number, number> = {
    0: personal.rootDigit
  };

  for (const house of knowledgeBase.houses) {
    baseDigits[house.id] = normalizeSomaticBaseDigit(digitCounts[house.matrixDigit] ?? 0);
  }

  return baseDigits;
}

export function calculateSomaticAgeSnapshot(baseDigits: Record<number, number>, age: number): SomaticAgeSnapshot {
  const values: Record<number, SomaticSeriesValue> = {};
  for (const series of knowledgeBase.somaticSeries) {
    const baseDigit = baseDigits[series.id];
    if (baseDigit === undefined) {
      throw new Error(`Missing somatic base digit for series ${series.id}`);
    }

    const digit = rotateSomaticDigit(baseDigit, age);
    values[series.id] = {
      seriesId: series.id,
      digit,
      energyScore: digitToSomaticEnergyScore(digit)
    };
  }

  return { age, values };
}

export function calculateSomaticDiagram(birthDate: string, maxAgeInclusive: number): SomaticDiagramResult {
  if (!Number.isInteger(maxAgeInclusive) || maxAgeInclusive < 0) {
    throw new Error(`maxAgeInclusive must be a non-negative integer, got ${maxAgeInclusive}`);
  }

  const baseDigits = calculateSomaticBaseDigits(birthDate);
  const snapshots: SomaticAgeSnapshot[] = [];
  for (let age = 0; age <= maxAgeInclusive; age += 1) {
    snapshots.push(calculateSomaticAgeSnapshot(baseDigits, age));
  }

  return {
    birthDate,
    baseDigits,
    snapshots
  };
}
