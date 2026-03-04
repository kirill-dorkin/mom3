import { knowledgeBase } from "../../book/knowledgeBase";
import type { SomaticAgeSnapshot } from "../calculations/somaticDiagram";

export interface SomaticStandardGraphColumn {
  seriesId: number;
  lifeLabel: string;
  healthLabel: string;
  digit: number;
  energyScore: number;
  axisIndex: number;
}

export interface SomaticStandardGraphBandView {
  order: number;
  title: string;
  description: string;
  tone: "positive" | "negative";
  axisIndexFrom: number;
  axisIndexTo: number;
}

export interface SomaticStandardGraphView {
  age: number;
  axisOrder: number[];
  columns: SomaticStandardGraphColumn[];
  bands: SomaticStandardGraphBandView[];
  zeroAxisIndex: number;
}

function resolveAxisIndex(axisOrder: number[], digit: number): number {
  const axisIndex = axisOrder.indexOf(digit);

  if (axisIndex === -1) {
    throw new Error(`Digit ${digit} is missing from the standard somatic graph axis`);
  }

  return axisIndex;
}

export function buildSomaticStandardGraphView(snapshot: SomaticAgeSnapshot): SomaticStandardGraphView {
  const reference = knowledgeBase.somaticStandardGraphReference;
  const axisOrder = [...reference.axisOrder];

  return {
    age: snapshot.age,
    axisOrder,
    zeroAxisIndex: resolveAxisIndex(axisOrder, 0),
    columns: reference.series.map((series) => {
      const value = snapshot.values[series.seriesId];

      if (!value) {
        throw new Error(`Missing somatic snapshot value for standard graph series ${series.seriesId}`);
      }

      return {
        seriesId: series.seriesId,
        lifeLabel: series.lifeLabel,
        healthLabel: series.healthLabel,
        digit: value.digit,
        energyScore: value.energyScore,
        axisIndex: resolveAxisIndex(axisOrder, value.digit)
      };
    }),
    bands: reference.bands.map((band) => ({
      order: band.order,
      title: band.title,
      description: band.description,
      tone: band.order <= 3 ? "positive" : "negative",
      axisIndexFrom: band.order,
      axisIndexTo: band.order + 1
    }))
  };
}
