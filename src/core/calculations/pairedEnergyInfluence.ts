import { knowledgeBase } from "../../book/knowledgeBase";
import type { HouseValue, PersonalEnergyPotentialResult } from "./energyPotential";
import {
  buildMatrixFromDigitMap,
  calculatePersonalEnergyPotential,
  countDigits,
  countToPersonalScore,
  normalizeBirthDateInput,
  parseBirthDateDigits
} from "./energyPotential";
import { buildQuersumTriangle, normalizeZeroToNine } from "../math/cyclic";

export interface PairedEnergyInfluenceResult {
  primaryBirthDate: string;
  secondaryBirthDate: string;
  primaryBase: PersonalEnergyPotentialResult;
  secondaryDoubledDigits: number[];
  combinedDigits: number[];
  triangleRows: number[][];
  rootDigit: number;
  digitCounts: Record<number, number>;
  houseValues: Record<number, HouseValue>;
  matrixCounts: number[][];
  matrixScores: number[][];
  deltaScoresByHouseId: Record<number, number>;
  deltaCountsByHouseId: Record<number, number>;
  deltaMatrixScores: number[][];
}

export function multiplyBirthDateDigits(birthDate: string, factor = 2): number[] {
  if (!Number.isInteger(factor) || factor < 1) {
    throw new Error(`factor must be a positive integer, got ${factor}`);
  }

  const digitString = normalizeBirthDateInput(birthDate).replace(/\D/g, "");
  const multiplied = (BigInt(digitString) * BigInt(factor)).toString().padStart(digitString.length, "0");
  return multiplied.split("").map((digit) => Number(digit));
}

export function combinePrimaryAndSecondaryDigits(primaryDigits: number[], secondaryDigits: number[]): number[] {
  if (primaryDigits.length !== secondaryDigits.length) {
    throw new Error(`Digit arrays must have equal length, got ${primaryDigits.length} and ${secondaryDigits.length}`);
  }

  return primaryDigits.map((digit, index) => normalizeZeroToNine(digit + secondaryDigits[index]));
}

export function calculatePairedEnergyInfluence(primaryBirthDate: string, secondaryBirthDate: string): PairedEnergyInfluenceResult {
  const primaryBase = calculatePersonalEnergyPotential(primaryBirthDate);
  const secondaryDoubledDigits = multiplyBirthDateDigits(secondaryBirthDate, 2);
  const combinedDigits = combinePrimaryAndSecondaryDigits(parseBirthDateDigits(primaryBirthDate), secondaryDoubledDigits);
  const triangleRows = buildQuersumTriangle(combinedDigits);
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
  const deltaScoresByHouseId = Object.fromEntries(
    knowledgeBase.houses.map((house) => [house.id, houseValues[house.id].score - primaryBase.houseValues[house.id].score])
  ) as Record<number, number>;
  const deltaCountsByHouseId = Object.fromEntries(
    knowledgeBase.houses.map((house) => [house.id, houseValues[house.id].count - primaryBase.houseValues[house.id].count])
  ) as Record<number, number>;
  const deltaMatrixByDigit = Object.fromEntries(
    knowledgeBase.houses.map((house) => [house.matrixDigit, deltaScoresByHouseId[house.id]])
  ) as Record<number, number>;

  return {
    primaryBirthDate,
    secondaryBirthDate,
    primaryBase,
    secondaryDoubledDigits,
    combinedDigits,
    triangleRows,
    rootDigit,
    digitCounts,
    houseValues,
    matrixCounts: buildMatrixFromDigitMap(countByDigit),
    matrixScores: buildMatrixFromDigitMap(scoreByDigit),
    deltaScoresByHouseId,
    deltaCountsByHouseId,
    deltaMatrixScores: buildMatrixFromDigitMap(deltaMatrixByDigit)
  };
}
