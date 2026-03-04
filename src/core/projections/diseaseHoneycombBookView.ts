import { knowledgeBase } from "../../book/knowledgeBase";
import { calculateSomaticAgeSnapshot, type SomaticDiagramResult } from "../calculations/somaticDiagram";
import { calculateSotaActivationForSnapshot } from "../calculations/sotaActivation";
import type { DiseaseHoneycombSotaRow, DiseaseHoneycombView } from "./diseaseHoneycombView";

const SOTA_ROMAN_LABELS: Record<number, string> = {
  1: "I",
  2: "II",
  3: "III",
  4: "IV",
  5: "V"
};

export type DiseaseHoneycombBookOffsetStatus = "none" | "confirmed" | "excluded" | "mixed";

export interface DiseaseHoneycombBookAgeCell {
  offset: number;
  ages: number[];
  status: DiseaseHoneycombBookOffsetStatus;
}

export interface DiseaseHoneycombBookHousePoint {
  offset: number;
  digit: number;
  colored: boolean;
  candidateAges: number[];
  candidateStatus: DiseaseHoneycombBookOffsetStatus;
}

export interface DiseaseHoneycombBookHouseRow {
  houseId: number;
  houseName: string;
  bodySystem: string;
  somaColorName: string;
  points: DiseaseHoneycombBookHousePoint[];
}

export interface DiseaseHoneycombBookSotaPlate {
  sotaId: number;
  romanLabel: string;
  sotaName: string;
  healthFocus: string[];
  houseIds: number[];
  candidateAges: number[];
  confirmedAges: number[];
  excludedAges: number[];
  ageCells: DiseaseHoneycombBookAgeCell[];
  houses: DiseaseHoneycombBookHouseRow[];
}

export interface DiseaseHoneycombBookView {
  rows: DiseaseHoneycombBookSotaPlate[];
  notes: string[];
}

function getOffsetStatus(row: DiseaseHoneycombSotaRow, offset: number): DiseaseHoneycombBookOffsetStatus {
  const yearsAtOffset = row.years.filter((year) => year.age % 10 === offset);
  if (yearsAtOffset.length === 0) {
    return "none";
  }

  const hasConfirmed = yearsAtOffset.some((year) => year.active);
  const hasExcluded = yearsAtOffset.some((year) => !year.active);
  if (hasConfirmed && hasExcluded) {
    return "mixed";
  }

  return hasConfirmed ? "confirmed" : "excluded";
}

function buildAgeCells(row: DiseaseHoneycombSotaRow): DiseaseHoneycombBookAgeCell[] {
  return Array.from({ length: 10 }, (_, offset) => ({
    offset,
    ages: row.candidateAges.filter((age) => age % 10 === offset).sort((left, right) => left - right),
    status: getOffsetStatus(row, offset)
  }));
}

function buildHouseRows(
  diagram: SomaticDiagramResult,
  row: DiseaseHoneycombSotaRow,
  ageCells: DiseaseHoneycombBookAgeCell[]
): DiseaseHoneycombBookHouseRow[] {
  return row.houseIds.map((houseId) => {
    const house = knowledgeBase.houses.find((item) => item.id === houseId);

    return {
      houseId,
      houseName: house?.name ?? `Дом ${houseId}`,
      bodySystem: house?.bodySystem ?? "Система не оцифрована",
      somaColorName: house?.somaColorName ?? "Цвет не указан",
      points: Array.from({ length: 10 }, (_, offset) => {
        const snapshot = diagram.snapshots.find((item) => item.age === offset) ?? calculateSomaticAgeSnapshot(diagram.baseDigits, offset);
        const sotaState = calculateSotaActivationForSnapshot(snapshot)[row.sotaId];
        const value = sotaState.houses.find((entry) => entry.houseId === houseId);
        if (!value) {
          throw new Error(`Missing disease-honeycomb book value for sota ${row.sotaId}, house ${houseId}, offset ${offset}`);
        }

        return {
          offset,
          digit: value.digit,
          colored: value.colored,
          candidateAges: ageCells[offset]?.ages ?? [],
          candidateStatus: ageCells[offset]?.status ?? "none"
        } satisfies DiseaseHoneycombBookHousePoint;
      })
    } satisfies DiseaseHoneycombBookHouseRow;
  });
}

export function buildDiseaseHoneycombBookView(
  diagram: SomaticDiagramResult,
  diseaseView: DiseaseHoneycombView
): DiseaseHoneycombBookView {
  return {
    rows: diseaseView.rows.map((row) => {
      const ageCells = buildAgeCells(row);

      return {
        sotaId: row.sotaId,
        romanLabel: SOTA_ROMAN_LABELS[row.sotaId] ?? String(row.sotaId),
        sotaName: row.sotaName,
        healthFocus: row.healthFocus,
        houseIds: row.houseIds,
        candidateAges: row.candidateAges,
        confirmedAges: row.confirmedAges,
        excludedAges: row.excludedAges,
        ageCells,
        houses: buildHouseRows(diagram, row, ageCells)
      } satisfies DiseaseHoneycombBookSotaPlate;
    }),
    notes: [
      "Круговая схема строится по десятичному ряду 0-9 лет: книга отдельно напоминает, что 0=10=20 и так далее.",
      "Розовая линия повторяет цифры дома по годам 0-9, а нижняя таблица показывает эти же цифры в книжной табличной форме.",
      "Если на одном остатке по десятку попали и подтвержденные, и исключенные годы, ячейка отмечается как смешанная и требует ручной сверки."
    ]
  };
}
