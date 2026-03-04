import { knowledgeBase } from "../../book/knowledgeBase";
import type { PairedEnergyInfluenceResult } from "../calculations/pairedEnergyInfluence";

export interface PairedInfluenceHouseRow {
  houseId: number;
  houseName: string;
  bodySystem: string;
  baseCount: number;
  influencedCount: number;
  deltaCount: number;
  baseScore: number;
  influencedScore: number;
  deltaScore: number;
  trend: "improved" | "reduced" | "stable";
}

export interface PairedInfluenceSummary {
  improvedHouseIds: number[];
  reducedHouseIds: number[];
  stableHouseIds: number[];
  strongestRiseHouseId: number | null;
  strongestDropHouseId: number | null;
}

export function buildPairedInfluenceHouseRows(result: PairedEnergyInfluenceResult): PairedInfluenceHouseRow[] {
  return knowledgeBase.houses.map((house) => {
    const base = result.primaryBase.houseValues[house.id];
    const influenced = result.houseValues[house.id];
    const deltaScore = influenced.score - base.score;

    return {
      houseId: house.id,
      houseName: house.name,
      bodySystem: house.bodySystem,
      baseCount: base.count,
      influencedCount: influenced.count,
      deltaCount: influenced.count - base.count,
      baseScore: base.score,
      influencedScore: influenced.score,
      deltaScore,
      trend: deltaScore > 0 ? "improved" : deltaScore < 0 ? "reduced" : "stable"
    };
  });
}

export function summarizePairedInfluence(result: PairedEnergyInfluenceResult): PairedInfluenceSummary {
  const rows = buildPairedInfluenceHouseRows(result);
  const improvedRows = rows.filter((row) => row.deltaScore > 0);
  const reducedRows = rows.filter((row) => row.deltaScore < 0);
  const stableRows = rows.filter((row) => row.deltaScore === 0);

  return {
    improvedHouseIds: improvedRows.map((row) => row.houseId),
    reducedHouseIds: reducedRows.map((row) => row.houseId),
    stableHouseIds: stableRows.map((row) => row.houseId),
    strongestRiseHouseId:
      improvedRows.length > 0 ? improvedRows.reduce((best, row) => (row.deltaScore > best.deltaScore ? row : best)).houseId : null,
    strongestDropHouseId:
      reducedRows.length > 0 ? reducedRows.reduce((best, row) => (row.deltaScore < best.deltaScore ? row : best)).houseId : null
  };
}
