import { knowledgeBase } from "../../book/knowledgeBase";
import type { SomaticAgeSnapshot, SomaticDiagramResult, SomaticSeriesValue } from "../calculations/somaticDiagram";
import { calculateSomaticDiagram, rotateSomaticDigit } from "../calculations/somaticDiagram";
import { calculateSotaActivationForSnapshot } from "../calculations/sotaActivation";

export interface SomaticTableCell {
  seriesId: number;
  digit: number;
  energyScore: number;
}

export interface SomaticTableRow {
  age: number;
  cells: Record<number, SomaticTableCell>;
}

export interface SomaticSeriesPoint {
  age: number;
  digit: number;
  energyScore: number;
}

export interface SomaticSeriesTrajectory {
  seriesId: number;
  points: SomaticSeriesPoint[];
}

export interface SomaticSliceAtlasEntry {
  seriesId: number;
  sphereName: string;
  healthName: string;
  trajectory: SomaticSeriesTrajectory;
  positiveYears: number;
  negativeYears: number;
}

export interface SomaticAgeView {
  age: number;
  values: Record<number, SomaticSeriesValue>;
  sotaActivation: ReturnType<typeof calculateSotaActivationForSnapshot>;
}

export interface SomaticQuickRollRow {
  age: number;
  values: Record<number, number>;
}

export interface SomaticQuickRollDerivationStep {
  seriesId: number;
  sphereName: string;
  healthName: string;
  sourceDigit: number;
  resultDigit: number;
}

export interface SomaticQuickRollDerivation {
  targetAge: number;
  lookupOrder: number[];
  lookupRow: Record<number, number>;
  steps: SomaticQuickRollDerivationStep[];
}

export const SOMATIC_BOOK_DIGIT_ORDER = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0] as const;

function mapSnapshotToTableRow(snapshot: SomaticAgeSnapshot): SomaticTableRow {
  return {
    age: snapshot.age,
    cells: Object.fromEntries(
      Object.entries(snapshot.values).map(([seriesId, value]) => [
        Number(seriesId),
        {
          seriesId: value.seriesId,
          digit: value.digit,
          energyScore: value.energyScore
        } satisfies SomaticTableCell
      ])
    ) as Record<number, SomaticTableCell>
  };
}

export function buildSomaticAgeView(snapshot: SomaticAgeSnapshot): SomaticAgeView {
  return {
    age: snapshot.age,
    values: snapshot.values,
    sotaActivation: calculateSotaActivationForSnapshot(snapshot)
  };
}

export function buildSomaticTableRows(diagram: SomaticDiagramResult, ageFrom: number, ageTo: number): SomaticTableRow[] {
  if (ageFrom < 0 || ageTo < ageFrom) {
    throw new Error(`Invalid age range ${ageFrom}..${ageTo}`);
  }

  return diagram.snapshots
    .filter((snapshot) => snapshot.age >= ageFrom && snapshot.age <= ageTo)
    .map(mapSnapshotToTableRow);
}

export function buildSomaticSeriesTrajectory(diagram: SomaticDiagramResult, seriesId: number, ageFrom: number, ageTo: number): SomaticSeriesTrajectory {
  if (!knowledgeBase.somaticSeries.some((series) => series.id === seriesId)) {
    throw new Error(`Unknown somatic series ${seriesId}`);
  }

  if (ageFrom < 0 || ageTo < ageFrom) {
    throw new Error(`Invalid age range ${ageFrom}..${ageTo}`);
  }

  return {
    seriesId,
    points: diagram.snapshots
      .filter((snapshot) => snapshot.age >= ageFrom && snapshot.age <= ageTo)
      .map((snapshot) => ({
        age: snapshot.age,
        digit: snapshot.values[seriesId].digit,
        energyScore: snapshot.values[seriesId].energyScore
      }))
  };
}

export function buildSomaticSliceAtlas(diagram: SomaticDiagramResult, ageFrom: number, ageTo: number): SomaticSliceAtlasEntry[] {
  if (ageFrom < 0 || ageTo < ageFrom) {
    throw new Error(`Invalid age range ${ageFrom}..${ageTo}`);
  }

  return knowledgeBase.somaticSeries.map((series) => {
    const trajectory = buildSomaticSeriesTrajectory(diagram, series.id, ageFrom, ageTo);

    return {
      seriesId: series.id,
      sphereName: series.sphereName,
      healthName: series.healthName,
      trajectory,
      positiveYears: trajectory.points.filter((point) => point.digit <= 4).length,
      negativeYears: trajectory.points.filter((point) => point.digit >= 5).length
    };
  });
}

export function buildSomaticQuickRollRows(maxAge = 100): SomaticQuickRollRow[] {
  if (!Number.isInteger(maxAge) || maxAge < 0) {
    throw new Error(`maxAge must be a non-negative integer, got ${maxAge}`);
  }

  return Array.from({ length: maxAge + 1 }, (_, age) => ({
    age,
    values: Object.fromEntries(
      Array.from({ length: 10 }, (_, baseDigit) => [baseDigit, rotateSomaticDigit(baseDigit, age)])
    ) as Record<number, number>
  }));
}

export function buildSomaticQuickRollDerivation(baseDigits: Record<number, number>, targetAge: number): SomaticQuickRollDerivation {
  if (!Number.isInteger(targetAge) || targetAge < 0) {
    throw new Error(`targetAge must be a non-negative integer, got ${targetAge}`);
  }

  const lookupRow = Object.fromEntries(
    Array.from({ length: 10 }, (_, baseDigit) => [baseDigit, rotateSomaticDigit(baseDigit, targetAge)])
  ) as Record<number, number>;

  return {
    targetAge,
    lookupOrder: [...SOMATIC_BOOK_DIGIT_ORDER],
    lookupRow,
    steps: knowledgeBase.somaticSeries.map((series) => {
      const sourceDigit = baseDigits[series.id];

      if (sourceDigit === undefined) {
        throw new Error(`Missing somatic base digit for series ${series.id}`);
      }

      return {
        seriesId: series.id,
        sphereName: series.sphereName,
        healthName: series.healthName,
        sourceDigit,
        resultDigit: lookupRow[sourceDigit]
      };
    })
  };
}

export function buildSomaticDecadeView(birthDate: string, startingAge = 0): {
  tableRows: SomaticTableRow[];
  seriesTrajectories: SomaticSeriesTrajectory[];
} {
  if (!Number.isInteger(startingAge) || startingAge < 0) {
    throw new Error(`startingAge must be a non-negative integer, got ${startingAge}`);
  }

  const diagram = calculateSomaticDiagram(birthDate, startingAge + 9);

  return {
    tableRows: buildSomaticTableRows(diagram, startingAge, startingAge + 9),
    seriesTrajectories: knowledgeBase.somaticSeries.map((series) =>
      buildSomaticSeriesTrajectory(diagram, series.id, startingAge, startingAge + 9)
    )
  };
}
