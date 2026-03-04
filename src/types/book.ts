export type ModuleStatus = "direct" | "lookup_required" | "needs_verification";

export interface BookSource {
  pdfPages: number[];
  notes?: string;
}

export interface MatrixPosition {
  row: number;
  col: number;
}

export interface HouseDefinition {
  id: number;
  matrixDigit: number;
  matrixPosition: MatrixPosition;
  name: string;
  bodySystem: string;
  somaColorName: string;
  source: BookSource;
}

export interface SotaDefinition {
  id: number;
  name: string;
  houses: number[];
  healthFocus: string[];
  source: BookSource;
}

export interface SotaReferenceSystemDefinition {
  title: string;
  organs: string[];
  summary: string;
}

export interface SotaReferenceLifeDefinition {
  coreIdea: string;
  positiveSummary: string;
  negativeSummary: string;
  lesson: string;
}

export interface SotaReferenceDefinition {
  sotaId: number;
  healthSource: BookSource;
  lifeSource: BookSource;
  systems: SotaReferenceSystemDefinition[];
  lifeTitle: string;
  lifeSummary: SotaReferenceLifeDefinition;
}

export interface ArcanaPolarity {
  masculine: number[];
  feminine: number[];
  source: BookSource;
}

export interface MatrixLayoutDefinition {
  layout: number[][];
  source: BookSource;
  notes?: string;
}

export interface EnergogramLayoutDefinition {
  houseOrder: number[];
  minScore: number;
  maxScore: number;
  source: BookSource;
  notes?: string;
}

export interface PersonalEnergyScoreMapEntry {
  count: number;
  score: number;
}

export interface SomaticEnergyScoreMapEntry {
  digit: number;
  energyScore: number;
}

export interface CalculationModuleDefinition {
  id: string;
  status: ModuleStatus;
  source: BookSource;
  inputs: string[];
  outputs: string[];
  notes?: string;
}

export interface VerificationGap {
  id: string;
  severity: "high" | "medium" | "low";
  source: BookSource;
  description: string;
}

export interface TreatmentMistakeDefinition {
  arcana: number;
  factors: string;
  source: BookSource;
}

export interface ArcanaTargetHeadingDefinition {
  arcana: number;
  title: string;
  source: BookSource;
}

export interface ArcanaNameLetterMapEntry {
  value: number;
  letters: string[];
  source: BookSource;
}

export interface BiorhythmLetterMapEntry {
  value: number;
  letters: string[];
  source: BookSource;
}

export interface SleepNeedByAgeGroup {
  label: string;
  ageRange: string;
  hoursLabel: string;
  hoursMin: number;
  hoursMax: number;
}

export interface SleepStageDefinition {
  stage: string;
  phase: string;
  title: string;
  description: string;
}

export interface SleepCycleChangeRow {
  metric: string;
  values: string[];
}

export interface ChildSleepNorm {
  ageRange: string;
  daySleep: string;
  nightSleep: string;
}

export interface SleepDeprivationEffect {
  title: string;
  description: string;
}

export interface CircadianReferencePoint {
  order: number;
  timeLabel: string;
  timelineHour: number;
  title: string;
  description: string;
}

export interface PersonalClockNote {
  title: string;
  description: string;
}

export interface InterzoneReferenceRow {
  direction: "up" | "flat" | "down";
  directionLabel: string;
  positiveZone: string;
  negativeZone: string;
}

export interface InterzoneReference {
  source: BookSource;
  notes: string[];
  rows: InterzoneReferenceRow[];
}

export interface HourlyBiorhythmReference {
  source: BookSource;
  notes: string[];
  sleepNeedByAgeGroups: SleepNeedByAgeGroup[];
  sleepStages: SleepStageDefinition[];
  sleepPreparationTips: string[];
  sleepCycleChangeWithAge: {
    ageColumns: string[];
    rows: SleepCycleChangeRow[];
  };
  childSleepNorms: ChildSleepNorm[];
  sleepDeprivationEffects: SleepDeprivationEffect[];
  circadianReferencePoints: CircadianReferencePoint[];
  personalClockNotes: PersonalClockNote[];
}

export interface ArcanaHealthProfile {
  arcana: number;
  displayLabel: string;
  name: string;
  manifestationSource: BookSource;
  lessonSource: BookSource;
  manifestations: string[];
  lesson: string;
  childLesson: string;
  notes?: string[];
}

export interface SomaticSeriesDefinition {
  id: number;
  key: string;
  order: number;
  sphereName: string;
  healthName: string;
  somaColorName: string | null;
  source: BookSource;
}

export interface SomaticStandardGraphSeriesDefinition {
  seriesId: number;
  lifeLabel: string;
  healthLabel: string;
}

export interface SomaticStandardGraphBandDefinition {
  order: number;
  title: string;
  description: string;
}

export interface SomaticStandardGraphReference {
  source: BookSource;
  axisOrder: number[];
  series: SomaticStandardGraphSeriesDefinition[];
  bands: SomaticStandardGraphBandDefinition[];
}

export interface PersonalEnergyExample {
  birthDate: string;
  digits: number[];
  triangleRows: number[][];
  digitCounts: Record<string, number>;
  houseCounts: Record<string, number>;
  houseScores: Record<string, number>;
  matrixCounts: number[][];
  matrixScores: number[][];
  rootDigit: number;
  source: BookSource;
}

export interface SomaticExample {
  birthDate: string;
  baseDigitsBySeriesId: Record<string, number>;
  ages: Record<string, Record<string, number>>;
  source: BookSource;
}

export interface HourlyBiorhythmBaseExample {
  baseEightValues: number[];
  birthHour: number;
  expandedTwentyFourValues: number[];
  hourlyValuesByHour: Record<string, number>;
  averageLine: number;
  source: BookSource;
}

export interface HourlyBiorhythmIdentityExample {
  birthDate: string;
  fullName: string;
  consonants: string[];
  consonantValueRows: Array<Array<number | null>>;
  baseEightValues: number[];
  source: BookSource;
}

export interface PairedEnergyExample {
  primaryBirthDate: string;
  secondaryBirthDate: string;
  secondaryDoubledDigits: number[];
  combinedDigits: number[];
  triangleRows: number[][];
  digitCounts: Record<string, number>;
  houseCounts: Record<string, number>;
  houseScores: Record<string, number>;
  matrixCounts: number[][];
  matrixScores: number[][];
  deltaScoresByHouseId: Record<string, number>;
  rootDigit: number;
  source: BookSource;
}

export interface LifetimeShadowExample {
  name: string;
  birthSurname: string;
  currentSurname: string;
  surnameChangeAge: number;
  arcanaByWord: {
    name: number;
    birthSurname: number;
    currentSurname: number;
  };
  shadowSteps: {
    birth: number;
    current: number;
  };
  periodTypeAges: Record<string, number[]>;
  source: BookSource;
}

export interface HoneycombFrameExample {
  birthDate: string;
  name: string;
  birthSurname: string;
  baseTones: {
    day: number;
    month: number;
    year: number;
    surname: number;
    name: number;
  };
  metrics: {
    opv: number;
    kch: number;
    eb: number;
    tr: number;
    sz: number;
    sm: number;
    ol: number;
  };
  protectionPolarity: "masculine" | "feminine";
  weakenedSystems: string[];
  treatmentMistakeFactor: string;
  source: BookSource;
}
