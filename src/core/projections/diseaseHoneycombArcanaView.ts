import type { HoneycombMetricId, HoneycombFrameResult } from "../calculations/honeycombFrame";
import type { LifetimeShadowResult } from "../calculations/lifetimeShadow";
import type { DiseaseHoneycombView } from "./diseaseHoneycombView";

const TIMED_METRIC_BY_SOTA_ID: Record<number, HoneycombMetricId> = {
  1: "opv",
  2: "kch",
  3: "sz",
  4: "eb",
  5: "tr"
};

const METRIC_LABEL_BY_ID: Record<HoneycombMetricId, string> = {
  opv: "ОПВ",
  kch: "КЧХ",
  eb: "ЭБ",
  tr: "Тр",
  sz: "СЗ",
  sm: "СМ",
  ol: "ОЛ"
};

export interface DiseaseHoneycombArcanaYearLink {
  age: number;
  currentSegmentLabel: string;
  metricId: HoneycombMetricId;
  metricLabel: string;
  arcana: number;
  targetHeading: string | null;
  triggerHouseIds: number[];
  coloredHouses: {
    houseId: number;
    houseName: string;
    bodySystem: string;
  }[];
  supportingSystems: string[];
  previousSegmentLabel: string | null;
  previousSotaId: number | null;
  previousSotaName: string | null;
  previousMetricId: HoneycombMetricId | null;
  previousMetricLabel: string | null;
  previousArcana: number | null;
  previousTargetHeading: string | null;
}

export interface DiseaseHoneycombArcanaRow {
  sotaId: number;
  sotaName: string;
  healthFocus: string[];
  metricId: HoneycombMetricId;
  metricLabel: string;
  arcana: number;
  targetHeading: string | null;
  confirmedAges: number[];
  riskFlags: string[];
  yearLinks: DiseaseHoneycombArcanaYearLink[];
}

export interface DiseaseHoneycombArcanaView {
  rows: DiseaseHoneycombArcanaRow[];
  notes: string[];
}

function getTimedMetricId(sotaId: number): HoneycombMetricId {
  const metricId = TIMED_METRIC_BY_SOTA_ID[sotaId];
  if (!metricId) {
    throw new Error(`Missing timed honeycomb metric mapping for sota ${sotaId}`);
  }

  return metricId;
}

export function buildDiseaseHoneycombArcanaView(
  diseaseView: DiseaseHoneycombView,
  lifetimeResult: LifetimeShadowResult,
  honeycombResult: HoneycombFrameResult
): DiseaseHoneycombArcanaView {
  const rows = diseaseView.rows
    .filter((row) => row.confirmedAges.length > 0)
    .map((row) => {
      const metricId = getTimedMetricId(row.sotaId);
      const metric = honeycombResult.metrics[metricId];
      const riskFlags = new Set<string>();

      if (metric.arcana === honeycombResult.metrics.sm.arcana) {
        riskFlags.add("Аркан ячейки совпадает с СМ");
      }

      if (metric.arcana === 12 || metric.arcana === 15) {
        riskFlags.add(`В основной соте стоит аркан ${metric.arcana}`);
      }

      const yearLinks = row.confirmedAges.map((age) => {
        const segmentIndex = lifetimeResult.birthSegments.findIndex((segment) => age >= segment.ageFrom && age <= segment.ageTo);
        if (segmentIndex === -1) {
          throw new Error(`Missing birth-shadow segment for disease-honeycomb age ${age}`);
        }

        const currentSegment = lifetimeResult.birthSegments[segmentIndex];
        const previousSegment = segmentIndex > 0 ? lifetimeResult.birthSegments[segmentIndex - 1] : null;
        const previousMetricId = previousSegment ? getTimedMetricId(previousSegment.sotaId) : null;
        const previousMetric = previousMetricId ? honeycombResult.metrics[previousMetricId] : null;
        const sourceYear = row.years.find((year) => year.age === age);
        const coloredHouses =
          sourceYear?.houses
            .filter((house) => house.colored)
            .map((house) => ({
              houseId: house.houseId,
              houseName: house.houseName,
              bodySystem: house.bodySystem
            })) ?? [];
        const supportingSystems = Array.from(new Set(coloredHouses.map((house) => house.bodySystem)));

        return {
          age,
          currentSegmentLabel: `${currentSegment.ageFrom}-${currentSegment.ageTo}`,
          metricId,
          metricLabel: METRIC_LABEL_BY_ID[metricId],
          arcana: metric.arcana,
          targetHeading: metric.targetHeading,
          triggerHouseIds: sourceYear?.triggerHouseIds ?? [],
          coloredHouses,
          supportingSystems,
          previousSegmentLabel: previousSegment ? `${previousSegment.ageFrom}-${previousSegment.ageTo}` : null,
          previousSotaId: previousSegment?.sotaId ?? null,
          previousSotaName:
            previousSegment ? diseaseView.rows.find((item) => item.sotaId === previousSegment.sotaId)?.sotaName ?? `Сота ${previousSegment.sotaId}` : null,
          previousMetricId,
          previousMetricLabel: previousMetricId ? METRIC_LABEL_BY_ID[previousMetricId] : null,
          previousArcana: previousMetric?.arcana ?? null,
          previousTargetHeading: previousMetric?.targetHeading ?? null
        } satisfies DiseaseHoneycombArcanaYearLink;
      });

      return {
        sotaId: row.sotaId,
        sotaName: row.sotaName,
        healthFocus: row.healthFocus,
        metricId,
        metricLabel: METRIC_LABEL_BY_ID[metricId],
        arcana: metric.arcana,
        targetHeading: metric.targetHeading,
        confirmedAges: row.confirmedAges,
        riskFlags: Array.from(riskFlags),
        yearLinks
      } satisfies DiseaseHoneycombArcanaRow;
    })
    .sort((left, right) => left.sotaId - right.sotaId);

  return {
    rows,
    notes: [
      "Порядок временных ячеек снят со страницы 217: I сота -> ОПВ, II -> КЧХ, III -> СЗ, IV -> ЭБ, V -> Тр.",
      "Если болезнь обнаружена на тяжёлой стадии, книга рекомендует смотреть не только текущую ячейку, но и предыдущую временную ячейку.",
      "Этот слой не диагностирует заболевание, а показывает арканные органы-мишени и факторы риска, которые книга советует проверять вместе с соматической диаграммой."
    ]
  };
}
