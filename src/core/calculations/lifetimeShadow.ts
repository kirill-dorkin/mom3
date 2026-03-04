import { calculateArcanaFromText, type ArcanaTextBreakdown } from "./nameArcana";
import { normalizeClosedTwentyTwo } from "../math/cyclic";

export type LifetimeShadowDirection = "positive" | "negative";
export type LifetimePeriodType =
  | "especially_unfavorable"
  | "unfavorable"
  | "challenging"
  | "depressive"
  | "favorable"
  | "especially_favorable";

export interface LifetimeShadowSegment {
  source: "birth" | "current";
  segmentIndex: number;
  ageFrom: number;
  ageTo: number;
  direction: LifetimeShadowDirection;
  sotaId: number;
  meaning: string;
  stepValue: number;
}

export interface LifetimeYearState {
  age: number;
  primaryDirection: LifetimeShadowDirection;
  primarySotaId: number;
  currentDirection: LifetimeShadowDirection | null;
  currentSotaId: number | null;
  type: LifetimePeriodType;
  label: string;
  definition: string;
}

export interface LifetimeShadowInput {
  name: string;
  birthSurname: string;
  currentSurname?: string | null;
  surnameChangeAge?: number | null;
  maxAge?: number;
}

export interface LifetimeShadowResult {
  nameBreakdown: ArcanaTextBreakdown;
  birthSurnameBreakdown: ArcanaTextBreakdown;
  currentSurnameBreakdown: ArcanaTextBreakdown | null;
  birthShadowStep: number;
  currentShadowStep: number | null;
  surnameChangeAge: number | null;
  birthSegments: LifetimeShadowSegment[];
  currentSegments: LifetimeShadowSegment[];
  yearStates: LifetimeYearState[];
  notes: string[];
}

export const lifetimeShadowMeaningBySotaId: Record<number, string> = {
  1: "Характер",
  2: "Психика",
  3: "Карьера",
  4: "Отношения",
  5: "Карма"
};

function getNextSotaId(current: number): number {
  return current === 5 ? 1 : current + 1;
}

function invertDirection(direction: LifetimeShadowDirection): LifetimeShadowDirection {
  return direction === "negative" ? "positive" : "negative";
}

function getPeriodLabel(type: LifetimePeriodType): string {
  switch (type) {
    case "especially_unfavorable":
      return "Особо неблагоприятный";
    case "unfavorable":
      return "Неблагоприятный";
    case "challenging":
      return "Сложный";
    case "depressive":
      return "Депрессивный";
    case "favorable":
      return "Благоприятный";
    case "especially_favorable":
      return "Особо благоприятный";
  }
}

function buildDefinition(type: LifetimePeriodType, hasCurrentShadow: boolean): string {
  if (!hasCurrentShadow) {
    return type === "unfavorable" ? "Отрицательная зона родовой тени" : "Положительная зона родовой тени";
  }

  switch (type) {
    case "especially_unfavorable":
      return "Пересечение отрицательных зон";
    case "unfavorable":
      return "Красная зона до смены фамилии";
    case "challenging":
      return "Наложение на отрицательную зону положительной";
    case "depressive":
      return "Наложение на положительную зону отрицательной";
    case "favorable":
      return "Зелёная зона до смены фамилии";
    case "especially_favorable":
      return "Пересечение положительных зон";
  }
}

function calculateShadowStep(leftArcana: number, rightArcana: number): number {
  return normalizeClosedTwentyTwo(Math.abs(leftArcana - rightArcana));
}

function buildShadowSegments(options: {
  source: "birth" | "current";
  startingAge: number;
  maxAge: number;
  stepValue: number;
  firstDirection: LifetimeShadowDirection;
  startingSotaId: number;
}): LifetimeShadowSegment[] {
  const { source, startingAge, maxAge, stepValue, firstDirection, startingSotaId } = options;
  const segments: LifetimeShadowSegment[] = [];
  let ageFrom = startingAge;
  let direction = firstDirection;
  let sotaId = startingSotaId;
  let segmentIndex = 1;

  while (ageFrom <= maxAge) {
    const segmentWidth = segmentIndex === 1 ? stepValue : stepValue - 1;
    const ageTo = Math.min(maxAge, ageFrom + Math.max(segmentWidth, 0));

    segments.push({
      source,
      segmentIndex,
      ageFrom,
      ageTo,
      direction,
      sotaId,
      meaning: lifetimeShadowMeaningBySotaId[sotaId],
      stepValue
    });

    ageFrom = ageTo + 1;
    direction = invertDirection(direction);
    sotaId = getNextSotaId(sotaId);
    segmentIndex += 1;
  }

  return segments;
}

function findSegmentForAge(segments: LifetimeShadowSegment[], age: number): LifetimeShadowSegment | null {
  return segments.find((segment) => age >= segment.ageFrom && age <= segment.ageTo) ?? null;
}

function classifyYear(options: {
  primaryDirection: LifetimeShadowDirection;
  currentDirection: LifetimeShadowDirection | null;
  hasCurrentShadow: boolean;
}): LifetimePeriodType {
  const { primaryDirection, currentDirection, hasCurrentShadow } = options;

  if (!hasCurrentShadow || currentDirection === null) {
    return primaryDirection === "negative" ? "unfavorable" : "favorable";
  }

  if (primaryDirection === "negative" && currentDirection === "negative") {
    return "especially_unfavorable";
  }

  if (primaryDirection === "negative" && currentDirection === "positive") {
    return "challenging";
  }

  if (primaryDirection === "positive" && currentDirection === "negative") {
    return "depressive";
  }

  return "especially_favorable";
}

export function calculateLifetimeShadowDiagram(input: LifetimeShadowInput): LifetimeShadowResult {
  const maxAge = input.maxAge ?? 100;
  if (!Number.isInteger(maxAge) || maxAge < 0) {
    throw new Error(`maxAge must be a non-negative integer, got ${maxAge}`);
  }

  const nameBreakdown = calculateArcanaFromText(input.name);
  const birthSurnameBreakdown = calculateArcanaFromText(input.birthSurname);
  const currentSurnameValue = input.currentSurname?.trim() ?? "";
  const hasCurrentShadow = currentSurnameValue.length > 0;
  const currentSurnameBreakdown = hasCurrentShadow ? calculateArcanaFromText(currentSurnameValue) : null;
  const surnameChangeAge = hasCurrentShadow ? input.surnameChangeAge ?? null : null;

  if (hasCurrentShadow && (!Number.isInteger(surnameChangeAge) || (surnameChangeAge as number) < 0)) {
    throw new Error("Для новой фамилии нужен неотрицательный целый возраст смены");
  }

  const birthShadowStep = calculateShadowStep(birthSurnameBreakdown.arcana, nameBreakdown.arcana);
  const currentShadowStep =
    currentSurnameBreakdown !== null ? calculateShadowStep(birthSurnameBreakdown.arcana, currentSurnameBreakdown.arcana) : null;
  const birthSegments = buildShadowSegments({
    source: "birth",
    startingAge: 0,
    maxAge,
    stepValue: birthShadowStep,
    firstDirection: "negative",
    startingSotaId: 1
  });

  const currentSegments =
    currentSurnameBreakdown !== null && surnameChangeAge !== null && surnameChangeAge <= maxAge
      ? (() => {
          const activeBirthSegment = findSegmentForAge(birthSegments, surnameChangeAge);
          if (activeBirthSegment === null) {
            throw new Error(`Не удалось определить соту родовой тени на возрасте ${surnameChangeAge}`);
          }

          return buildShadowSegments({
            source: "current",
            startingAge: surnameChangeAge,
            maxAge,
            stepValue: currentShadowStep as number,
            firstDirection: "positive",
            startingSotaId: activeBirthSegment.sotaId
          });
        })()
      : [];

  const yearStates: LifetimeYearState[] = [];
  for (let age = 0; age <= maxAge; age += 1) {
    const primarySegment = findSegmentForAge(birthSegments, age);
    if (primarySegment === null) {
      throw new Error(`Не удалось определить родовую тень на возрасте ${age}`);
    }

    const currentSegment = findSegmentForAge(currentSegments, age);
    const type = classifyYear({
      primaryDirection: primarySegment.direction,
      currentDirection: currentSegment?.direction ?? null,
      hasCurrentShadow
    });

    yearStates.push({
      age,
      primaryDirection: primarySegment.direction,
      primarySotaId: primarySegment.sotaId,
      currentDirection: currentSegment?.direction ?? null,
      currentSotaId: currentSegment?.sotaId ?? null,
      type,
      label: getPeriodLabel(type),
      definition: buildDefinition(type, hasCurrentShadow)
    });
  }

  const notes: string[] = [];
  if (!hasCurrentShadow) {
    notes.push("Новая фамилия не указана: построена только родовая тень с благоприятными и неблагоприятными периодами.");
  } else if ((surnameChangeAge as number) > maxAge) {
    notes.push("Возраст смены фамилии больше выбранного диапазона: в итоговую диаграмму попала только родовая тень.");
  }

  if (hasCurrentShadow) {
    notes.push(
      "В печатной итоговой таблице на странице 174 строка 29-31 года помечена как III сота, хотя общая логика диапазонов указывает на вероятную типографскую ошибку."
    );
    notes.push(
      "Граничные годы на стыках диапазонов в печатном графике требуют ручной сверки: книга местами показывает их не так, как простое пересечение двух интервальных сеток."
    );
  }

  return {
    nameBreakdown,
    birthSurnameBreakdown,
    currentSurnameBreakdown,
    birthShadowStep,
    currentShadowStep,
    surnameChangeAge,
    birthSegments,
    currentSegments,
    yearStates,
    notes
  };
}
