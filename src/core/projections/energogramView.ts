import { knowledgeBase } from "../../book/knowledgeBase";
import type { HouseValue } from "../calculations/energyPotential";

export interface EnergogramPoint {
  rowIndex: number;
  houseId: number;
  houseName: string;
  bodySystem: string;
  score: number;
  count: number;
}

export interface EnergogramProjection {
  houseOrder: number[];
  minScore: number;
  maxScore: number;
  points: EnergogramPoint[];
}

export function buildEnergogramProjection(houseValues: Record<number, HouseValue>): EnergogramProjection {
  const { houseOrder, minScore, maxScore } = knowledgeBase.energogramLayout;

  return {
    houseOrder,
    minScore,
    maxScore,
    points: houseOrder.map((houseId, rowIndex) => {
      const house = knowledgeBase.houses.find((item) => item.id === houseId);
      const value = houseValues[houseId];
      if (!house || !value) {
        throw new Error(`Missing energogram source data for house ${houseId}`);
      }

      return {
        rowIndex,
        houseId,
        houseName: house.name,
        bodySystem: house.bodySystem,
        score: value.score,
        count: value.count
      };
    })
  };
}
