import type { SomaticSeriesTrajectory } from "./somaticView";

export interface InterzoneMonthPoint {
  offset: number;
  monthNumber: number;
  monthLabel: string;
  axisValue: number;
}

export interface InterzoneCrossing {
  exactOffset: number;
  lowerOffset: number;
  upperOffset: number;
  lowerMonthNumber: number;
  upperMonthNumber: number;
  lowerMonthLabel: string;
  upperMonthLabel: string;
}

export interface InterzoneSegment {
  segmentIndex: number;
  ageFrom: number;
  ageTo: number;
  startDigit: number;
  endDigit: number;
  startAxisValue: number;
  endAxisValue: number;
  direction: "up" | "down" | "flat";
  crossing: InterzoneCrossing | null;
  monthlyPoints: InterzoneMonthPoint[];
}

export interface InterzoneBookPoint extends InterzoneMonthPoint {
  globalOffset: number;
  segmentOffset: number;
  segmentIndex: number;
}

export interface InterzoneBookSegment {
  segmentIndex: number;
  ageFrom: number;
  ageTo: number;
  startDigit: number;
  endDigit: number;
  direction: InterzoneSegment["direction"];
  globalOffsetFrom: number;
  globalOffsetTo: number;
  crossingGlobalOffset: number | null;
  crossingLowerMonthLabel: string | null;
  crossingUpperMonthLabel: string | null;
  points: InterzoneBookPoint[];
}

export interface InterzoneBookOverview {
  totalMonths: number;
  segments: InterzoneBookSegment[];
}

const MONTH_LABELS = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];

export function digitToInterzoneAxisValue(digit: number): number {
  if (!Number.isInteger(digit) || digit < 0 || digit > 9) {
    throw new Error(`Interzone digit must be in range 0..9, got ${digit}`);
  }

  if (digit <= 4) {
    return digit;
  }

  return -(digit - 4);
}

export function isInterzoneDigitTransition(startDigit: number, endDigit: number): boolean {
  if (!Number.isInteger(startDigit) || startDigit < 0 || startDigit > 9) {
    throw new Error(`startDigit must be in range 0..9, got ${startDigit}`);
  }

  if (!Number.isInteger(endDigit) || endDigit < 0 || endDigit > 9) {
    throw new Error(`endDigit must be in range 0..9, got ${endDigit}`);
  }

  const startPositiveZone = startDigit <= 4;
  const endPositiveZone = endDigit <= 4;

  return startPositiveZone !== endPositiveZone;
}

function monthAtOffset(birthMonth: number, offset: number): { monthNumber: number; monthLabel: string } {
  const monthNumber = ((birthMonth - 1 + offset) % 12) + 1;
  return {
    monthNumber,
    monthLabel: MONTH_LABELS[monthNumber - 1]
  };
}

export function buildInterzoneMonthlyPoints(startDigit: number, endDigit: number, birthMonth: number): InterzoneMonthPoint[] {
  if (!Number.isInteger(birthMonth) || birthMonth < 1 || birthMonth > 12) {
    throw new Error(`birthMonth must be in range 1..12, got ${birthMonth}`);
  }

  const startAxisValue = digitToInterzoneAxisValue(startDigit);
  const endAxisValue = digitToInterzoneAxisValue(endDigit);

  return Array.from({ length: 13 }, (_, offset) => {
    const { monthNumber, monthLabel } = monthAtOffset(birthMonth, offset);
    const t = offset / 12;

    return {
      offset,
      monthNumber,
      monthLabel,
      axisValue: startAxisValue + (endAxisValue - startAxisValue) * t
    };
  });
}

export function calculateInterzoneCrossing(startDigit: number, endDigit: number, birthMonth: number): InterzoneCrossing | null {
  if (!isInterzoneDigitTransition(startDigit, endDigit)) {
    return null;
  }

  const startAxisValue = digitToInterzoneAxisValue(startDigit);
  const endAxisValue = digitToInterzoneAxisValue(endDigit);
  const exactOffset = startAxisValue === endAxisValue ? 0 : (startAxisValue / (startAxisValue - endAxisValue)) * 12;
  const lowerOffset = Math.max(0, Math.min(12, Math.floor(exactOffset)));
  const upperOffset = Math.max(0, Math.min(12, Math.ceil(exactOffset)));
  const lowerMonth = monthAtOffset(birthMonth, lowerOffset);
  const upperMonth = monthAtOffset(birthMonth, upperOffset);

  return {
    exactOffset,
    lowerOffset,
    upperOffset,
    lowerMonthNumber: lowerMonth.monthNumber,
    upperMonthNumber: upperMonth.monthNumber,
    lowerMonthLabel: lowerMonth.monthLabel,
    upperMonthLabel: upperMonth.monthLabel
  };
}

export function buildInterzoneSegments(trajectory: SomaticSeriesTrajectory, birthMonth: number): InterzoneSegment[] {
  if (!Number.isInteger(birthMonth) || birthMonth < 1 || birthMonth > 12) {
    throw new Error(`birthMonth must be in range 1..12, got ${birthMonth}`);
  }

  const segments: InterzoneSegment[] = [];

  for (let index = 0; index < trajectory.points.length - 1; index += 1) {
    const startPoint = trajectory.points[index];
    const endPoint = trajectory.points[index + 1];

    if (!isInterzoneDigitTransition(startPoint.digit, endPoint.digit)) {
      continue;
    }

    const startAxisValue = digitToInterzoneAxisValue(startPoint.digit);
    const endAxisValue = digitToInterzoneAxisValue(endPoint.digit);

    segments.push({
      segmentIndex: index + 1,
      ageFrom: startPoint.age,
      ageTo: endPoint.age,
      startDigit: startPoint.digit,
      endDigit: endPoint.digit,
      startAxisValue,
      endAxisValue,
      direction: endAxisValue > startAxisValue ? "up" : endAxisValue < startAxisValue ? "down" : "flat",
      crossing: calculateInterzoneCrossing(startPoint.digit, endPoint.digit, birthMonth),
      monthlyPoints: buildInterzoneMonthlyPoints(startPoint.digit, endPoint.digit, birthMonth)
    });
  }

  return segments;
}

export function buildInterzoneBookOverview(segments: InterzoneSegment[]): InterzoneBookOverview {
  return {
    totalMonths: segments.length * 12,
    segments: segments.map((segment, order) => {
      const globalOffsetFrom = order * 12;

      return {
        segmentIndex: segment.segmentIndex,
        ageFrom: segment.ageFrom,
        ageTo: segment.ageTo,
        startDigit: segment.startDigit,
        endDigit: segment.endDigit,
        direction: segment.direction,
        globalOffsetFrom,
        globalOffsetTo: globalOffsetFrom + 12,
        crossingGlobalOffset: segment.crossing ? globalOffsetFrom + segment.crossing.exactOffset : null,
        crossingLowerMonthLabel: segment.crossing?.lowerMonthLabel ?? null,
        crossingUpperMonthLabel: segment.crossing?.upperMonthLabel ?? null,
        points: segment.monthlyPoints.map((point) => ({
          ...point,
          globalOffset: globalOffsetFrom + point.offset,
          segmentOffset: point.offset,
          segmentIndex: segment.segmentIndex
        }))
      } satisfies InterzoneBookSegment;
    })
  };
}
