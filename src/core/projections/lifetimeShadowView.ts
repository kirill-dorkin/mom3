import { sotaById } from "../../book/knowledgeBase";
import {
  calculateLifetimeShadowDiagram,
  lifetimeShadowMeaningBySotaId,
  type LifetimePeriodType,
  type LifetimeShadowResult,
  type LifetimeShadowSegment
} from "../calculations/lifetimeShadow";

export interface LifetimeSummaryRow {
  type: LifetimePeriodType;
  label: string;
  definition: string;
  sotaId: number;
  sotaName: string;
  ages: number[];
}

export interface LifetimeChartSegment {
  ageFrom: number;
  ageTo: number;
  type: LifetimePeriodType;
  label: string;
  sotaId: number;
}

export interface LifetimeChartRow {
  sotaId: number;
  sotaName: string;
  segments: LifetimeChartSegment[];
}

export type LifetimeBookColor = "positive" | "negative" | "resonant";

export interface LifetimeBookAgeCell {
  age: number;
  primarySotaId: number;
  type: LifetimePeriodType;
  color: LifetimeBookColor;
}

export interface LifetimeBookPrimarySegment {
  primarySotaId: number;
  ageFrom: number;
  ageTo: number;
}

export interface LifetimeBookStrip {
  stripIndex: number;
  ageFrom: number;
  ageTo: number;
  ages: LifetimeBookAgeCell[];
  primarySegments: LifetimeBookPrimarySegment[];
}

const periodTypeOrder: LifetimePeriodType[] = [
  "especially_unfavorable",
  "unfavorable",
  "challenging",
  "depressive",
  "favorable",
  "especially_favorable"
];

export function buildLifetimeSummaryRows(result: LifetimeShadowResult): LifetimeSummaryRow[] {
  const groups = new Map<string, LifetimeSummaryRow>();

  for (const state of result.yearStates) {
    const key = `${state.type}:${state.primarySotaId}`;
    const existing = groups.get(key);
    if (existing) {
      existing.ages.push(state.age);
      continue;
    }

    groups.set(key, {
      type: state.type,
      label: state.label,
      definition: state.definition,
      sotaId: state.primarySotaId,
      sotaName: lifetimeShadowMeaningBySotaId[state.primarySotaId] ?? `Сота ${state.primarySotaId}`,
      ages: [state.age]
    });
  }

  return Array.from(groups.values()).sort((left, right) => {
    const typeOrderDiff = periodTypeOrder.indexOf(left.type) - periodTypeOrder.indexOf(right.type);
    if (typeOrderDiff !== 0) {
      return typeOrderDiff;
    }

    return left.ages[0] - right.ages[0];
  });
}

export function buildLifetimeChartRows(result: LifetimeShadowResult): LifetimeChartRow[] {
  return [1, 2, 3, 4, 5].map((sotaId) => {
    const rowStates = result.yearStates.filter((state) => state.primarySotaId === sotaId);
    const segments: LifetimeChartSegment[] = [];

    for (const state of rowStates) {
      const previous = segments[segments.length - 1];
      if (previous && previous.type === state.type && previous.ageTo === state.age - 1) {
        previous.ageTo = state.age;
      } else {
        segments.push({
          ageFrom: state.age,
          ageTo: state.age,
          type: state.type,
          label: state.label,
          sotaId
        });
      }
    }

    return {
      sotaId,
      sotaName: `${sotaById.get(sotaId)?.name ?? `Сота ${sotaId}`} · ${lifetimeShadowMeaningBySotaId[sotaId]}`,
      segments
    };
  });
}

function mapLifetimeTypeToBookColor(type: LifetimePeriodType): LifetimeBookColor {
  if (type === "especially_unfavorable") {
    return "resonant";
  }

  if (type === "favorable" || type === "especially_favorable") {
    return "positive";
  }

  return "negative";
}

export function buildLifetimeBookStrips(result: LifetimeShadowResult, maxYearsPerStrip = 36): LifetimeBookStrip[] {
  if (!Number.isInteger(maxYearsPerStrip) || maxYearsPerStrip <= 0) {
    throw new Error(`maxYearsPerStrip must be a positive integer, got ${maxYearsPerStrip}`);
  }

  const ages = result.yearStates
    .filter((state) => state.age > 0)
    .map((state) => ({
      age: state.age,
      primarySotaId: state.primarySotaId,
      type: state.type,
      color: mapLifetimeTypeToBookColor(state.type)
    }));

  const strips: LifetimeBookStrip[] = [];
  for (let offset = 0; offset < ages.length; offset += maxYearsPerStrip) {
    const chunk = ages.slice(offset, offset + maxYearsPerStrip);
    if (chunk.length === 0) {
      continue;
    }

    const primarySegments: LifetimeBookPrimarySegment[] = [];
    for (const ageState of chunk) {
      const previous = primarySegments[primarySegments.length - 1];
      if (previous && previous.primarySotaId === ageState.primarySotaId && previous.ageTo === ageState.age - 1) {
        previous.ageTo = ageState.age;
      } else {
        primarySegments.push({
          primarySotaId: ageState.primarySotaId,
          ageFrom: ageState.age,
          ageTo: ageState.age
        });
      }
    }

    strips.push({
      stripIndex: strips.length,
      ageFrom: chunk[0].age,
      ageTo: chunk[chunk.length - 1].age,
      ages: chunk,
      primarySegments
    });
  }

  return strips;
}

export function buildLifetimeShadowRanges(result: LifetimeShadowResult): {
  birthSegments: LifetimeShadowSegment[];
  currentSegments: LifetimeShadowSegment[];
} {
  return {
    birthSegments: result.birthSegments,
    currentSegments: result.currentSegments
  };
}

export type LifetimeShadowView = ReturnType<typeof calculateLifetimeShadowDiagram>;
