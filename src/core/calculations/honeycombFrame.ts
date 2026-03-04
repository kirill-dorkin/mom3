import { arcanaTargetHeadingByArcana, getArcanaPolarity, treatmentMistakeByArcana } from "../../book/knowledgeBase";
import type { ArcanaTextBreakdown } from "./nameArcana";
import { calculateArcanaFromText } from "./nameArcana";
import { parseBirthDateParts } from "./energyPotential";
import { normalizeClosedTwentyTwo } from "../math/cyclic";

export type HoneycombMetricId = "opv" | "kch" | "eb" | "tr" | "sz" | "sm" | "ol";
export type HoneycombToneId = "dt" | "mt" | "gt" | "ft" | "it";

export interface HoneycombTone {
  id: HoneycombToneId;
  label: string;
  description: string;
  rawValue: number;
  arcana: number;
}

export interface HoneycombMetric {
  id: HoneycombMetricId;
  label: string;
  description: string;
  formula: string;
  rawValue: number;
  arcana: number;
  targetHeading: string | null;
}

export interface HoneycombFrameInput {
  birthDate: string;
  name: string;
  birthSurname: string;
}

export interface HoneycombFrameResult {
  birthDate: string;
  name: string;
  birthSurname: string;
  dayTone: HoneycombTone;
  monthTone: HoneycombTone;
  yearTone: HoneycombTone;
  surnameTone: HoneycombTone;
  nameTone: HoneycombTone;
  nameBreakdown: ArcanaTextBreakdown;
  birthSurnameBreakdown: ArcanaTextBreakdown;
  metrics: Record<HoneycombMetricId, HoneycombMetric>;
  protectionPolarity: "masculine" | "feminine" | null;
  weakenedSystems: string[];
  treatmentMistakeFactor: string | null;
  notes: string[];
}

function sumDigits(value: number): number {
  return String(value)
    .split("")
    .reduce((sum, digit) => sum + Number(digit), 0);
}

function createTone(id: HoneycombToneId, label: string, description: string, rawValue: number): HoneycombTone {
  return {
    id,
    label,
    description,
    rawValue,
    arcana: normalizeClosedTwentyTwo(rawValue)
  };
}

function createDifferenceMetric(id: HoneycombMetricId, label: string, description: string, formula: string, left: number, right: number): HoneycombMetric {
  const rawValue = Math.abs(left - right);
  const arcana = rawValue === 0 ? 22 : rawValue;

  return {
    id,
    label,
    description,
    formula,
    rawValue,
    arcana,
    targetHeading: arcanaTargetHeadingByArcana.get(arcana)?.title ?? null
  };
}

function createSumMetric(id: HoneycombMetricId, label: string, description: string, formula: string, values: number[]): HoneycombMetric {
  const rawValue = values.reduce((sum, value) => sum + value, 0);
  const arcana = normalizeClosedTwentyTwo(rawValue);

  return {
    id,
    label,
    description,
    formula,
    rawValue,
    arcana,
    targetHeading: arcanaTargetHeadingByArcana.get(arcana)?.title ?? null
  };
}

export function calculateHoneycombFrame(input: HoneycombFrameInput): HoneycombFrameResult {
  const birthDate = parseBirthDateParts(input.birthDate).normalized;
  const nameBreakdown = calculateArcanaFromText(input.name);
  const birthSurnameBreakdown = calculateArcanaFromText(input.birthSurname);
  const dateParts = parseBirthDateParts(birthDate);

  const dayTone = createTone("dt", "Дт", "Тон дня рождения", dateParts.day);
  const monthTone = createTone("mt", "Мт", "Тон месяца рождения", dateParts.month);
  const yearTone = createTone("gt", "Гт", "Тон года по сумме цифр года рождения", sumDigits(dateParts.year));
  const surnameTone = createTone("ft", "Фт", "Тон родовой фамилии", birthSurnameBreakdown.rawSum);
  const nameTone = createTone("it", "Ит", "Тон имени", nameBreakdown.rawSum);

  const metrics = {
    opv: createDifferenceMetric("opv", "ОПВ", "Ошибка прошлого воплощения", "|Дт - Мт|", dayTone.arcana, monthTone.arcana),
    kch: createDifferenceMetric("kch", "КЧХ", "Кармическая черта характера", "|Дт - Гт|", dayTone.arcana, yearTone.arcana),
    eb: createDifferenceMetric("eb", "ЭБ", "Эфирная болезнь", "|Мт - Гт|", monthTone.arcana, yearTone.arcana),
    tr: createDifferenceMetric("tr", "Тр", "Тень родовой фамилии", "|Фт - Ит|", surnameTone.arcana, nameTone.arcana),
    sz: createSumMetric("sz", "СЗ", "Социальная задача", "Дт + Мт + Гт", [dayTone.arcana, monthTone.arcana, yearTone.arcana]),
    sm: createSumMetric("sm", "СМ", "Слабое место защиты организма", "ОПВ + КЧХ + ЭБ + СЗ", []),
    ol: createSumMetric("ol", "ОЛ", "Ошибки лечения", "СМ + Тр", [])
  } satisfies Record<HoneycombMetricId, HoneycombMetric>;

  metrics.sm = createSumMetric(
    "sm",
    "СМ",
    "Слабое место защиты организма",
    "ОПВ + КЧХ + ЭБ + СЗ",
    [metrics.opv.arcana, metrics.kch.arcana, metrics.eb.arcana, metrics.sz.arcana]
  );
  metrics.ol = createSumMetric("ol", "ОЛ", "Ошибки лечения", "СМ + Тр", [metrics.sm.arcana, metrics.tr.arcana]);

  const protectionPolarity = getArcanaPolarity(metrics.sm.arcana);
  const weakenedSystems =
    protectionPolarity === "masculine"
      ? ["Иммунная система", "Лимфатическая система"]
      : protectionPolarity === "feminine"
        ? ["Эндокринная система"]
        : [];

  const notes = [
    "СМ и ОЛ по книге считаются бессрочными и оказывают влияние на протяжении всей жизни.",
    "Значения Дт, Мт и Гт в этой реализации опираются на рабочий пример 18.03.1964 из книги: день, месяц и сумма цифр года рождения в закрытой 22-арканной системе."
  ];

  return {
    birthDate,
    name: nameBreakdown.normalized,
    birthSurname: birthSurnameBreakdown.normalized,
    dayTone,
    monthTone,
    yearTone,
    surnameTone,
    nameTone,
    nameBreakdown,
    birthSurnameBreakdown,
    metrics,
    protectionPolarity,
    weakenedSystems,
    treatmentMistakeFactor: treatmentMistakeByArcana.get(metrics.ol.arcana)?.factors ?? null,
    notes
  };
}
