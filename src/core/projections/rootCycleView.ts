import { knowledgeBase } from "../../book/knowledgeBase";
import type { SomaticDiagramResult } from "../calculations/somaticDiagram";

export interface RootCycleState {
  age: number;
  rootDigit: number;
}

export interface RootRepeatGroup {
  remainder: number;
  ages: number[];
}

export interface RootPolarPoint {
  remainder: number;
  ages: number[];
  rootDigit: number;
}

export interface InsertedBlockPoint {
  age: number;
  globalOffset: number;
  digit: number;
  kind: "series" | "transition";
  seriesId: number | null;
  seriesLabel: string;
}

export interface InsertedBlockYear {
  age: number;
  rootDigit: number;
  globalOffsetFrom: number;
  globalOffsetTo: number;
  points: InsertedBlockPoint[];
  transitionToNext: InsertedBlockPoint | null;
}

export interface InsertedBlockTimeline {
  ageFrom: number;
  ageTo: number;
  totalColumns: number;
  years: InsertedBlockYear[];
  flattenedPoints: InsertedBlockPoint[];
}

export function buildRootCycleStates(rootDigit: number, maxAge = 100): RootCycleState[] {
  if (!Number.isInteger(rootDigit) || rootDigit < 0 || rootDigit > 9) {
    throw new Error(`rootDigit must be in range 0..9, got ${rootDigit}`);
  }

  if (!Number.isInteger(maxAge) || maxAge < 0) {
    throw new Error(`maxAge must be a non-negative integer, got ${maxAge}`);
  }

  return Array.from({ length: maxAge + 1 }, (_, age) => ({
    age,
    rootDigit: (rootDigit + age) % 10
  }));
}

export function buildRootRepeatGroups(maxAge = 100): RootRepeatGroup[] {
  if (!Number.isInteger(maxAge) || maxAge < 0) {
    throw new Error(`maxAge must be a non-negative integer, got ${maxAge}`);
  }

  return Array.from({ length: 10 }, (_, remainder) => ({
    remainder,
    ages: Array.from({ length: Math.floor((maxAge - remainder) / 10) + 1 }, (_, index) => remainder + index * 10).filter((age) => age <= maxAge)
  }));
}

export function buildRootPolarPoints(rootDigit: number, maxAge = 100): RootPolarPoint[] {
  if (!Number.isInteger(rootDigit) || rootDigit < 0 || rootDigit > 9) {
    throw new Error(`rootDigit must be in range 0..9, got ${rootDigit}`);
  }

  return buildRootRepeatGroups(maxAge).map((group) => ({
    remainder: group.remainder,
    ages: group.ages,
    rootDigit: (rootDigit + group.remainder) % 10
  }));
}

export function buildInsertedBlockTimeline(
  diagram: SomaticDiagramResult,
  ageFrom: number,
  ageTo: number
): InsertedBlockTimeline {
  if (!Number.isInteger(ageFrom) || ageFrom < 0 || !Number.isInteger(ageTo) || ageTo < ageFrom) {
    throw new Error(`Invalid inserted-block age range ${ageFrom}..${ageTo}`);
  }

  const years = diagram.snapshots
    .filter((snapshot) => snapshot.age >= ageFrom && snapshot.age <= ageTo)
    .map((snapshot, yearIndex, filtered) => {
      const globalOffsetFrom = yearIndex * 11;
      const points = knowledgeBase.somaticSeries.map((series, localIndex) => ({
        age: snapshot.age,
        globalOffset: globalOffsetFrom + localIndex,
        digit: snapshot.values[series.id].digit,
        kind: "series" as const,
        seriesId: series.id,
        seriesLabel: `${series.id}. ${series.sphereName}`
      }));
      const nextSnapshot = filtered[yearIndex + 1];
      const nextRootDigit = nextSnapshot?.values[0]?.digit;

      return {
        age: snapshot.age,
        rootDigit: snapshot.values[0].digit,
        globalOffsetFrom,
        globalOffsetTo: globalOffsetFrom + 9,
        points,
        transitionToNext:
          nextSnapshot && nextRootDigit !== undefined
            ? {
                age: nextSnapshot.age,
                globalOffset: globalOffsetFrom + 10,
                digit: nextRootDigit,
                kind: "transition",
                seriesId: null,
                seriesLabel: `Корень ${nextSnapshot.age} года`
              }
            : null
      } satisfies InsertedBlockYear;
    });

  return {
    ageFrom,
    ageTo,
    totalColumns: years.length > 0 ? years.length * 10 + (years.length - 1) : 0,
    years,
    flattenedPoints: years.flatMap((year) => (year.transitionToNext ? [...year.points, year.transitionToNext] : year.points))
  };
}
