import { knowledgeBase } from "../../book/knowledgeBase";
import type { SomaticAgeSnapshot } from "./somaticDiagram";

export interface SotaActivationHouse {
  houseId: number;
  digit: number;
  colored: boolean;
}

export interface SotaActivationState {
  sotaId: number;
  active: boolean;
  triggerHouseIds: number[];
  houses: SotaActivationHouse[];
}

export function isColoredSomaticDigit(digit: number): boolean {
  if (!Number.isInteger(digit) || digit < 0 || digit > 9) {
    throw new Error(`Somatic digit must be in range 0..9, got ${digit}`);
  }

  return digit >= 5;
}

export function calculateSotaActivationForSnapshot(snapshot: SomaticAgeSnapshot): Record<number, SotaActivationState> {
  const activations: Record<number, SotaActivationState> = {};

  for (const sota of knowledgeBase.sotas) {
    const houses = sota.houses.map((houseId) => {
      const value = snapshot.values[houseId];
      if (!value) {
        throw new Error(`Missing house ${houseId} in somatic snapshot for age ${snapshot.age}`);
      }

      return {
        houseId,
        digit: value.digit,
        colored: isColoredSomaticDigit(value.digit)
      };
    });

    const triggerHouseIds = houses.filter((house) => house.colored).map((house) => house.houseId);
    activations[sota.id] = {
      sotaId: sota.id,
      active: triggerHouseIds.length > 0,
      triggerHouseIds,
      houses
    };
  }

  return activations;
}
