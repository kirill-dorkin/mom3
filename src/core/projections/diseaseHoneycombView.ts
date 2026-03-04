import { knowledgeBase } from "../../book/knowledgeBase";
import type { LifetimePeriodType, LifetimeShadowResult } from "../calculations/lifetimeShadow";
import { calculateSomaticAgeSnapshot, type SomaticDiagramResult } from "../calculations/somaticDiagram";
import { calculateSotaActivationForSnapshot } from "../calculations/sotaActivation";

export interface DiseaseHoneycombYearHouse {
  houseId: number;
  houseName: string;
  bodySystem: string;
  somaColorName: string;
  digit: number;
  colored: boolean;
}

export interface DiseaseHoneycombYear {
  age: number;
  active: boolean;
  triggerHouseIds: number[];
  houses: DiseaseHoneycombYearHouse[];
}

export interface DiseaseHoneycombSotaRow {
  sotaId: number;
  sotaName: string;
  healthFocus: string[];
  houseIds: number[];
  candidateAges: number[];
  confirmedAges: number[];
  excludedAges: number[];
  years: DiseaseHoneycombYear[];
}

export interface DiseaseHoneycombView {
  candidateType: LifetimePeriodType;
  candidateLabel: string;
  candidateDefinition: string;
  rows: DiseaseHoneycombSotaRow[];
  notes: string[];
}

function getDiseaseCandidateType(result: LifetimeShadowResult): LifetimePeriodType {
  return result.currentSurnameBreakdown ? "especially_unfavorable" : "unfavorable";
}

function getCandidateLabel(type: LifetimePeriodType): string {
  switch (type) {
    case "especially_unfavorable":
      return "Особо неблагоприятные годы";
    case "unfavorable":
      return "Неблагоприятные годы";
    default:
      return "Опасные годы";
  }
}

function getCandidateDefinition(type: LifetimePeriodType): string {
  switch (type) {
    case "especially_unfavorable":
      return "Пересечение отрицательных зон";
    case "unfavorable":
      return "Отрицательная зона родовой тени";
    default:
      return "Опасные годы из lifetime-диаграммы";
  }
}

export function buildDiseaseHoneycombView(
  diagram: SomaticDiagramResult,
  lifetimeResult: LifetimeShadowResult
): DiseaseHoneycombView {
  const candidateType = getDiseaseCandidateType(lifetimeResult);
  const candidateYears = lifetimeResult.yearStates.filter((state) => state.type === candidateType);
  const rows = knowledgeBase.sotas
    .map((sota) => {
      const years = candidateYears
        .filter((state) => state.primarySotaId === sota.id)
        .map((state) => {
          const snapshot =
            diagram.snapshots.find((item) => item.age === state.age) ??
            calculateSomaticAgeSnapshot(diagram.baseDigits, state.age);

          const activation = calculateSotaActivationForSnapshot(snapshot)[sota.id];
          return {
            age: state.age,
            active: activation.active,
            triggerHouseIds: activation.triggerHouseIds,
            houses: activation.houses.map((house) => ({
              houseId: house.houseId,
              houseName: knowledgeBase.houses.find((item) => item.id === house.houseId)?.name ?? `Дом ${house.houseId}`,
              bodySystem: knowledgeBase.houses.find((item) => item.id === house.houseId)?.bodySystem ?? "Система не оцифрована",
              somaColorName: knowledgeBase.houses.find((item) => item.id === house.houseId)?.somaColorName ?? "Цвет не указан",
              digit: house.digit,
              colored: house.colored
            }))
          } satisfies DiseaseHoneycombYear;
        });

      return {
        sotaId: sota.id,
        sotaName: sota.name,
        healthFocus: sota.healthFocus,
        houseIds: [...sota.houses],
        candidateAges: years.map((year) => year.age),
        confirmedAges: years.filter((year) => year.active).map((year) => year.age),
        excludedAges: years.filter((year) => !year.active).map((year) => year.age),
        years
      } satisfies DiseaseHoneycombSotaRow;
    })
    .filter((row) => row.candidateAges.length > 0)
    .sort((left, right) => {
      if (right.confirmedAges.length !== left.confirmedAges.length) {
        return right.confirmedAges.length - left.confirmedAges.length;
      }

      return left.candidateAges[0] - right.candidateAges[0];
    });

  const notes = [
    lifetimeResult.currentSurnameBreakdown
      ? "При смене фамилии книга рекомендует проверять прежде всего особо неблагоприятные годы."
      : "Без смены фамилии книга рекомендует проверять неблагоприятные годы родовой тени.",
    "Год подтверждается как риск по соте, только если хотя бы один дом этой соты окрашен.",
    "Неактивная сота снижает вероятность развития болезни даже при наличии опасного периода."
  ];

  if (lifetimeResult.currentSurnameBreakdown) {
    notes.push(
      "Граничные годы lifetime-блока могут попадать в список кандидатов, но затем отсеиваются после проверки активации сот."
    );
  }

  return {
    candidateType,
    candidateLabel: getCandidateLabel(candidateType),
    candidateDefinition: getCandidateDefinition(candidateType),
    rows,
    notes
  };
}
