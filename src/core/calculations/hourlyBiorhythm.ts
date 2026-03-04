import { biorhythmLetterValueByLetter } from "../../book/knowledgeBase";
import { normalizeArcanaTextInput } from "./nameArcana";
import { parseBirthDateDigits } from "./energyPotential";
import { normalizeOneToNine, normalizeZeroToNine } from "../math/cyclic";

const BIORHYTHM_CONSONANT_PATTERN = /[БВГДЖЗЙКЛМНПРСТФХЦЧШЩ]/u;
const BIORHYTHM_ALLOWED_TEXT_PATTERN = /^[А-ЯЁ\s-]+$/u;

export type BiorhythmIdentityMode = "book_strict" | "published_table";

export interface HourlyValue {
  hour: number;
  value: number;
}

export interface HourlyZone {
  hour: number;
  value: number;
  standardBand: "passive" | "normal" | "overload";
  relativeToAverage: "below_average" | "above_average" | "on_average";
}

export interface HourlyRecommendationWindow {
  kind: "sleep_onset" | "activity";
  startHour: number;
  endHourExclusive: number;
  hours: number[];
  durationHours: number;
  label: string;
  minValue: number;
  maxValue: number;
  averageValue: number;
}

export interface HourlyRecommendationSummary {
  sleepWindows: HourlyRecommendationWindow[];
  activityWindows: HourlyRecommendationWindow[];
}

export interface HourlyCompatibilityWindow {
  kind: "shared_passive" | "shared_activity";
  startHour: number;
  endHourExclusive: number;
  hours: number[];
  durationHours: number;
  label: string;
  primaryMinValue: number;
  primaryMaxValue: number;
  primaryAverageValue: number;
  secondaryMinValue: number;
  secondaryMaxValue: number;
  secondaryAverageValue: number;
}

export interface HourlyCompatibilitySummary {
  sharedPassiveWindows: HourlyCompatibilityWindow[];
  sharedActivityWindows: HourlyCompatibilityWindow[];
}

export interface HourlyBiorhythmResult {
  baseEightValues: number[];
  expandedTwentyFourValues: number[];
  hourlyValuesByHour: Record<number, number>;
  hourlyValuesOrdered: HourlyValue[];
  averageLine: number;
  zones: HourlyZone[];
}

export interface BiorhythmAlignedRow<T> {
  rowIndex: number;
  values: Array<T | null>;
}

export interface HourlyBiorhythmIdentityResult extends HourlyBiorhythmResult {
  mode: BiorhythmIdentityMode;
  birthDate: string;
  birthHour: number;
  fullName: string;
  normalizedFullName: string;
  dateDigits: number[];
  consonants: string[];
  consonantValues: number[];
  consonantRows: BiorhythmAlignedRow<string>[];
  consonantValueRows: BiorhythmAlignedRow<number>[];
  notes: string[];
}

export function normalizeBiorhythmNameInput(value: string): string {
  return normalizeArcanaTextInput(value);
}

export function extractBiorhythmConsonants(fullName: string): string[] {
  const normalized = normalizeBiorhythmNameInput(fullName);
  if (normalized.length === 0) {
    throw new Error("ФИО для бионумерологического ритма не может быть пустым");
  }

  if (!BIORHYTHM_ALLOWED_TEXT_PATTERN.test(normalized)) {
    throw new Error("Для бионумерологического ритма допустимы только русские буквы, пробелы и дефис");
  }

  const consonants = normalized
    .replace(/[\s-]+/g, "")
    .split("")
    .filter((letter) => BIORHYTHM_CONSONANT_PATTERN.test(letter));

  if (consonants.length === 0) {
    throw new Error("В ФИО не найдено согласных букв для построения ритма");
  }

  return consonants;
}

export function transcribeBiorhythmConsonants(consonants: string[]): number[] {
  return consonants.map((letter) => {
    const value = biorhythmLetterValueByLetter.get(letter);
    if (value === undefined) {
      throw new Error(`В таблице бионумерологических ритмов нет значения для буквы ${letter}`);
    }

    return value;
  });
}

export function buildAlignedRows<T>(values: T[], width: number): BiorhythmAlignedRow<T>[] {
  if (!Number.isInteger(width) || width <= 0) {
    throw new Error(`Width must be a positive integer, got ${width}`);
  }

  const rows: BiorhythmAlignedRow<T>[] = [];
  for (let index = 0; index < values.length; index += width) {
    const rowValues = values.slice(index, index + width);
    rows.push({
      rowIndex: rows.length,
      values: [...rowValues, ...Array.from({ length: width - rowValues.length }, () => null)]
    });
  }

  return rows;
}

export function reduceBiorhythmColumn(values: number[]): number {
  if (values.length === 0) {
    throw new Error("Biorhythm column must contain at least one value");
  }

  return values.reduce((accumulator, value) => normalizeZeroToNine(accumulator + value), 0);
}

export function calculateBiorhythmBaseFromIdentity(birthDate: string, fullName: string): {
  mode: BiorhythmIdentityMode;
  birthDate: string;
  fullName: string;
  normalizedFullName: string;
  dateDigits: number[];
  consonants: string[];
  consonantValues: number[];
  consonantRows: BiorhythmAlignedRow<string>[];
  consonantValueRows: BiorhythmAlignedRow<number>[];
  baseEightValues: number[];
} {
  return calculateBiorhythmBaseFromIdentityByMode(birthDate, fullName, "published_table");
}

export function calculateBiorhythmBaseFromIdentityByMode(
  birthDate: string,
  fullName: string,
  mode: BiorhythmIdentityMode
): {
  mode: BiorhythmIdentityMode;
  birthDate: string;
  fullName: string;
  normalizedFullName: string;
  dateDigits: number[];
  consonants: string[];
  consonantValues: number[];
  consonantRows: BiorhythmAlignedRow<string>[];
  consonantValueRows: BiorhythmAlignedRow<number>[];
  baseEightValues: number[];
} {
  if (mode === "book_strict") {
    throw new Error(
      "Строгий режим по книге не выполняет автосборку восьмерки по ФИО: в этой книге нужно вводить базовую восьмерку вручную."
    );
  }

  const dateDigits = parseBirthDateDigits(birthDate);
  const consonants = extractBiorhythmConsonants(fullName);
  const consonantValues = transcribeBiorhythmConsonants(consonants);
  const consonantRows = buildAlignedRows(consonants, dateDigits.length);
  const consonantValueRows = buildAlignedRows(consonantValues, dateDigits.length);
  const baseEightValues = dateDigits.map((dateDigit, columnIndex) => {
    const columnValues = [dateDigit];
    for (const row of consonantValueRows) {
      const value = row.values[columnIndex];
      if (value !== null) {
        columnValues.push(value);
      }
    }

    const columnResult = reduceBiorhythmColumn(columnValues);
    if (columnResult === 0) {
      throw new Error(`Столбец ${columnIndex + 1} дал 0. Для построения ритма нужна полная раскладка согласных ФИО.`);
    }

    return columnResult;
  });

  return {
    mode,
    birthDate,
    fullName,
    normalizedFullName: normalizeBiorhythmNameInput(fullName),
    dateDigits,
    consonants,
    consonantValues,
    consonantRows,
    consonantValueRows,
    baseEightValues
  };
}

export function expandBiorhythmBaseValues(baseEightValues: number[]): number[] {
  if (baseEightValues.length !== 8) {
    throw new Error(`Biorhythm base must contain exactly 8 values, got ${baseEightValues.length}`);
  }

  for (const value of baseEightValues) {
    if (!Number.isInteger(value) || value < 1 || value > 9) {
      throw new Error(`Base biorhythm values must be integers in range 1..9, got ${value}`);
    }
  }

  const expanded: number[] = [];
  for (let cycleOffset = 0; cycleOffset < 3; cycleOffset += 1) {
    for (const value of baseEightValues) {
      expanded.push(normalizeOneToNine(value + cycleOffset));
    }
  }

  return expanded;
}

export function mapExpandedValuesToHours(expandedTwentyFourValues: number[], birthHour: number): Record<number, number> {
  if (expandedTwentyFourValues.length !== 24) {
    throw new Error(`Expanded biorhythm must contain exactly 24 values, got ${expandedTwentyFourValues.length}`);
  }
  if (!Number.isInteger(birthHour) || birthHour < 0 || birthHour > 23) {
    throw new Error(`birthHour must be an integer in range 0..23, got ${birthHour}`);
  }

  const byHour: Record<number, number> = {};
  expandedTwentyFourValues.forEach((value, index) => {
    byHour[(birthHour + index) % 24] = value;
  });

  return byHour;
}

export function calculateAverageLine(hourlyValuesByHour: Record<number, number>): number {
  const values = Object.values(hourlyValuesByHour);
  if (values.length !== 24) {
    throw new Error(`Expected 24 hourly values, got ${values.length}`);
  }

  const sum = values.reduce((accumulator, value) => accumulator + value, 0);
  return Math.round((sum / 24) * 10) / 10;
}

export function getStandardBand(value: number): "passive" | "normal" | "overload" {
  if (!Number.isInteger(value) || value < 1 || value > 9) {
    throw new Error(`Hourly value must be in range 1..9, got ${value}`);
  }

  if (value <= 3) {
    return "passive";
  }

  if (value <= 6) {
    return "normal";
  }

  return "overload";
}

export function buildHourlyZones(hourlyValuesByHour: Record<number, number>, averageLine: number): HourlyZone[] {
  const zones: HourlyZone[] = [];

  for (let hour = 0; hour < 24; hour += 1) {
    const value = hourlyValuesByHour[hour];
    if (value === undefined) {
      throw new Error(`Missing hourly value for hour ${hour}`);
    }

    zones.push({
      hour,
      value,
      standardBand: getStandardBand(value),
      relativeToAverage: value < averageLine ? "below_average" : value > averageLine ? "above_average" : "on_average"
    });
  }

  return zones;
}

function formatWindowLabel(startHour: number, endHourExclusive: number): string {
  return `${String(startHour).padStart(2, "0")}:00-${String(endHourExclusive).padStart(2, "0")}:00`;
}

function buildHourSegments(matchingHours: Set<number>): number[][] {
  if (matchingHours.size === 0) {
    return [];
  }

  const segments: number[][] = [];
  for (let hour = 0; hour < 24; hour += 1) {
    if (!matchingHours.has(hour)) {
      continue;
    }

    const previousHour = (hour + 23) % 24;
    if (matchingHours.has(previousHour)) {
      continue;
    }

    const segmentHours = [hour];
    let currentHour = hour;
    while (true) {
      const nextHour = (currentHour + 1) % 24;
      if (nextHour === hour || !matchingHours.has(nextHour)) {
        break;
      }

      segmentHours.push(nextHour);
      currentHour = nextHour;
    }

    segments.push(segmentHours);
  }

  if (segments.length === 0 && matchingHours.size === 24) {
    segments.push(Array.from({ length: 24 }, (_, hour) => hour));
  }

  return segments;
}

function buildRecommendationWindows(
  zones: HourlyZone[],
  kind: "sleep_onset" | "activity",
  predicate: (zone: HourlyZone) => boolean
): HourlyRecommendationWindow[] {
  if (zones.length !== 24) {
    throw new Error(`Expected 24 hourly zones, got ${zones.length}`);
  }

  const zoneByHour = new Map(zones.map((zone) => [zone.hour, zone]));
  const matchingHours = new Set(zones.filter(predicate).map((zone) => zone.hour));

  if (matchingHours.size === 0) {
    return [];
  }

  return buildHourSegments(matchingHours).map((hours) => {
    const values = hours.map((hour) => {
      const zone = zoneByHour.get(hour);
      if (!zone) {
        throw new Error(`Missing hourly zone for hour ${hour}`);
      }

      return zone.value;
    });
    const endHourExclusive = (hours[hours.length - 1] + 1) % 24;

    return {
      kind,
      startHour: hours[0],
      endHourExclusive,
      hours,
      durationHours: hours.length,
      label: formatWindowLabel(hours[0], endHourExclusive),
      minValue: Math.min(...values),
      maxValue: Math.max(...values),
      averageValue: Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10
    };
  });
}

export function buildHourlyRecommendationSummary(result: HourlyBiorhythmResult): HourlyRecommendationSummary {
  return {
    sleepWindows: buildRecommendationWindows(
      result.zones,
      "sleep_onset",
      (zone) => zone.standardBand === "passive" && zone.relativeToAverage === "below_average"
    ),
    activityWindows: buildRecommendationWindows(result.zones, "activity", (zone) => zone.relativeToAverage === "above_average")
  };
}

function buildCompatibilityWindows(
  primary: HourlyBiorhythmResult,
  secondary: HourlyBiorhythmResult,
  kind: "shared_passive" | "shared_activity",
  predicate: (primaryZone: HourlyZone, secondaryZone: HourlyZone) => boolean
): HourlyCompatibilityWindow[] {
  if (primary.zones.length !== 24 || secondary.zones.length !== 24) {
    throw new Error("Hourly compatibility requires two complete 24-hour graphs");
  }

  const primaryZoneByHour = new Map(primary.zones.map((zone) => [zone.hour, zone]));
  const secondaryZoneByHour = new Map(secondary.zones.map((zone) => [zone.hour, zone]));
  const matchingHours = new Set<number>();

  for (let hour = 0; hour < 24; hour += 1) {
    const primaryZone = primaryZoneByHour.get(hour);
    const secondaryZone = secondaryZoneByHour.get(hour);

    if (!primaryZone || !secondaryZone) {
      throw new Error(`Missing hourly zone for hour ${hour}`);
    }

    if (predicate(primaryZone, secondaryZone)) {
      matchingHours.add(hour);
    }
  }

  return buildHourSegments(matchingHours).map((hours) => {
    const primaryValues = hours.map((hour) => primaryZoneByHour.get(hour)?.value ?? 0);
    const secondaryValues = hours.map((hour) => secondaryZoneByHour.get(hour)?.value ?? 0);
    const endHourExclusive = (hours[hours.length - 1] + 1) % 24;

    return {
      kind,
      startHour: hours[0],
      endHourExclusive,
      hours,
      durationHours: hours.length,
      label: formatWindowLabel(hours[0], endHourExclusive),
      primaryMinValue: Math.min(...primaryValues),
      primaryMaxValue: Math.max(...primaryValues),
      primaryAverageValue: Math.round((primaryValues.reduce((sum, value) => sum + value, 0) / primaryValues.length) * 10) / 10,
      secondaryMinValue: Math.min(...secondaryValues),
      secondaryMaxValue: Math.max(...secondaryValues),
      secondaryAverageValue: Math.round((secondaryValues.reduce((sum, value) => sum + value, 0) / secondaryValues.length) * 10) / 10
    };
  });
}

export function buildHourlyCompatibilitySummary(
  primary: HourlyBiorhythmResult,
  secondary: HourlyBiorhythmResult
): HourlyCompatibilitySummary {
  return {
    sharedPassiveWindows: buildCompatibilityWindows(
      primary,
      secondary,
      "shared_passive",
      (primaryZone, secondaryZone) =>
        primaryZone.relativeToAverage === "below_average" && secondaryZone.relativeToAverage === "below_average"
    ),
    sharedActivityWindows: buildCompatibilityWindows(
      primary,
      secondary,
      "shared_activity",
      (primaryZone, secondaryZone) =>
        primaryZone.relativeToAverage === "above_average" && secondaryZone.relativeToAverage === "above_average"
    )
  };
}

export function calculateHourlyBiorhythmFromBase(baseEightValues: number[], birthHour: number): HourlyBiorhythmResult {
  const expandedTwentyFourValues = expandBiorhythmBaseValues(baseEightValues);
  const hourlyValuesByHour = mapExpandedValuesToHours(expandedTwentyFourValues, birthHour);
  const averageLine = calculateAverageLine(hourlyValuesByHour);
  const hourlyValuesOrdered = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    value: hourlyValuesByHour[hour]
  }));

  return {
    baseEightValues,
    expandedTwentyFourValues,
    hourlyValuesByHour,
    hourlyValuesOrdered,
    averageLine,
    zones: buildHourlyZones(hourlyValuesByHour, averageLine)
  };
}

export function calculateHourlyBiorhythmFromIdentity(
  birthDate: string,
  fullName: string,
  birthHour: number,
  mode: BiorhythmIdentityMode = "published_table"
): HourlyBiorhythmIdentityResult {
  const identity = calculateBiorhythmBaseFromIdentityByMode(birthDate, fullName, mode);
  const result = calculateHourlyBiorhythmFromBase(identity.baseEightValues, birthHour);

  return {
    ...result,
    mode: identity.mode,
    birthDate: identity.birthDate,
    birthHour,
    fullName,
    normalizedFullName: identity.normalizedFullName,
    dateDigits: identity.dateDigits,
    consonants: identity.consonants,
    consonantValues: identity.consonantValues,
    consonantRows: identity.consonantRows,
    consonantValueRows: identity.consonantValueRows,
    notes: [
      "Автоматический расчёт берёт только согласные буквы ФИО, раскладывает их по восьми цифрам даты рождения и сворачивает каждый столбец кверсуммой.",
      "Этот режим использует опубликованную авторами таблицу транскрипции 1..9 как внешний справочник, а не строгую буквенную таблицу из данного тома.",
      "В печатном примере Шапковой на страницах 322-323 есть расхождение с прямой буквенной транскрипцией; поэтому ручная восьмёрка и авторасчёт могут не совпасть."
    ]
  };
}
