import { Suspense, lazy, startTransition, useDeferredValue, useMemo, useRef, useState } from "react";
import {
  calculateBiorhythmBaseFromIdentity,
  buildDiseaseHoneycombArcanaView,
  buildDiseaseHoneycombBookView,
  buildEnergogramProjection,
  buildDiseaseHoneycombView,
  buildHourlyCompatibilitySummary,
  buildHourlyRecommendationSummary,
  buildHoneycombChartCells,
  buildHoneycombMetricRows,
  buildHoneycombToneRows,
  buildInterzoneBookOverview,
  buildInterzoneSegments,
  buildInsertedBlockTimeline,
  buildRootCycleStates,
  buildRootPolarPoints,
  buildLifetimeBookStrips,
  buildLifetimeChartRows,
  buildLifetimeShadowRanges,
  buildLifetimeSummaryRows,
  buildPairedInfluenceHouseRows,
  buildRootRepeatGroups,
  buildSomaticQuickRollDerivation,
  buildSomaticQuickRollRows,
  buildSomaticSliceAtlas,
  buildSomaticSeriesTrajectory,
  buildSomaticStandardGraphView,
  buildSomaticTableRows,
  calculateArcanaFromText,
  calculateHoneycombFrame,
  calculateHourlyBiorhythmFromIdentity,
  calculateHourlyBiorhythmFromBase,
  calculateLifetimeShadowDiagram,
  calculatePairedEnergyInfluence,
  calculatePersonalEnergyPotential,
  calculateSomaticDiagram,
  calculateSotaActivationForSnapshot,
  knowledgeBase,
  normalizeArcanaTextInput,
  normalizeBiorhythmNameInput,
  normalizeBirthDateInput,
  parseBirthDateParts,
  summarizePairedInfluence
} from "../index";
import { BookMethodGuide } from "./components/BookMethodGuide";
import { DecadeHeatTable } from "./components/DecadeHeatTable";
import { DiseaseHoneycombArcanaBoard } from "./components/DiseaseHoneycombArcanaBoard";
import { DiseaseHoneycombCards } from "./components/DiseaseHoneycombCards";
import { DiseaseHoneycombFocusBoard } from "./components/DiseaseHoneycombFocusBoard";
import { DiseaseHoneycombTable } from "./components/DiseaseHoneycombTable";
import { EnergogramChart } from "./components/EnergogramChart";
import { HourlyRecommendationWindows } from "./components/HourlyRecommendationWindows";
import { HourlyRhythmChart } from "./components/HourlyRhythmChart";
import { HourlyZoneTable } from "./components/HourlyZoneTable";
import { HoneycombFrameChart } from "./components/HoneycombFrameChart";
import { HoneycombMetricTable } from "./components/HoneycombMetricTable";
import { HoneycombToneTable } from "./components/HoneycombToneTable";
import { InfluenceDeltaChart } from "./components/InfluenceDeltaChart";
import { InfluenceExplainCard } from "./components/InfluenceExplainCard";
import { InfluenceHouseTable } from "./components/InfluenceHouseTable";
import { InsertedBlockReferenceTable } from "./components/InsertedBlockReferenceTable";
import { InsertedBlockTimelineChart } from "./components/InsertedBlockTimelineChart";
import { LifetimeShadowChart } from "./components/LifetimeShadowChart";
import { LifetimeShadowRangesTable } from "./components/LifetimeShadowRangesTable";
import { LifetimeSummaryTable } from "./components/LifetimeSummaryTable";
import { MatrixGrid } from "./components/MatrixGrid";
import { NameArcanaCard } from "./components/NameArcanaCard";
import { QuersumTriangle } from "./components/QuersumTriangle";
import { RootRepeatTable } from "./components/RootRepeatTable";
import { RootCycleWaveChart } from "./components/RootCycleWaveChart";
import { RootRepeatPolarChart } from "./components/RootRepeatPolarChart";
import { SliceAtlasCard } from "./components/SliceAtlasCard";
import { SomaticBookPolarChart } from "./components/SomaticBookPolarChart";
import { SomaticBookStripChart } from "./components/SomaticBookStripChart";
import { SomaticSliceDiagramBook } from "./components/SomaticSliceDiagramBook";
import { SomaticStandardGraphBook } from "./components/SomaticStandardGraphBook";
import { SotaStateCards } from "./components/SotaStateCards";
import { SotaReferenceAtlas, type SotaReferenceFocusContext } from "./components/SotaReferenceAtlas";
import { SomaticPrimerTable } from "./components/SomaticPrimerTable";
import { SomaticQuickRollExplainBook } from "./components/SomaticQuickRollExplainBook";
import { SomaticQuickRollTable } from "./components/SomaticQuickRollTable";
import { SomaticWheel } from "./components/SomaticWheel";
import type { ArcanaAtlasFocusContext } from "./components/ArcanaHealthAtlas";

const LazyArcanaHealthAtlas = lazy(() =>
  import("./components/ArcanaHealthAtlas").then((module) => ({ default: module.ArcanaHealthAtlas }))
);

const LazyBiorhythmReferenceBoard = lazy(() =>
  import("./components/BiorhythmReferenceBoard").then((module) => ({ default: module.BiorhythmReferenceBoard }))
);

const LazyBookCoverageBoard = lazy(() =>
  import("./components/BookCoverageBoard").then((module) => ({ default: module.BookCoverageBoard }))
);

const LazyDiseaseHoneycombBookPlates = lazy(() =>
  import("./components/DiseaseHoneycombBookPlates").then((module) => ({ default: module.DiseaseHoneycombBookPlates }))
);

const LazyBiorhythmConstructionTable = lazy(() =>
  import("./components/BiorhythmConstructionTable").then((module) => ({ default: module.BiorhythmConstructionTable }))
);

const LazyHourlyCompatibilityChart = lazy(() =>
  import("./components/HourlyCompatibilityChart").then((module) => ({ default: module.HourlyCompatibilityChart }))
);

const LazyHourlyCompatibilityWindows = lazy(() =>
  import("./components/HourlyCompatibilityWindows").then((module) => ({ default: module.HourlyCompatibilityWindows }))
);

const LazyHourlyGuidanceBoard = lazy(() =>
  import("./components/HourlyGuidanceBoard").then((module) => ({ default: module.HourlyGuidanceBoard }))
);

const LazyInterzoneBookOverviewChart = lazy(() =>
  import("./components/InterzoneBookOverviewChart").then((module) => ({ default: module.InterzoneBookOverviewChart }))
);

const LazyInterzoneInterpretationTable = lazy(() =>
  import("./components/InterzoneInterpretationTable").then((module) => ({ default: module.InterzoneInterpretationTable }))
);

const LazyInterzoneSegmentChart = lazy(() =>
  import("./components/InterzoneSegmentChart").then((module) => ({ default: module.InterzoneSegmentChart }))
);

const LazyInterzoneSummaryTable = lazy(() =>
  import("./components/InterzoneSummaryTable").then((module) => ({ default: module.InterzoneSummaryTable }))
);

type BiorhythmMode = "book_strict" | "published_table";

const BIORHYTHM_MODE_OPTIONS: Array<{
  id: BiorhythmMode;
  label: string;
  description: string;
}> = [
  {
    id: "book_strict",
    label: "Строго по книге",
    description: "Ручные восьмёрки и часы рождения, без внешней буквенной таблицы."
  },
  {
    id: "published_table",
    label: "Авто по таблице авторов",
    description: "ФИО -> восьмёрка по опубликованной таблице 1..9, отдельно от строгого режима книги."
  }
];

const calculationModulePagesById = new Map(
  knowledgeBase.calculationModules.map((module) => [module.id, module.source.pdfPages] as const)
);

const STATIC_ROOT_REPEAT_GROUPS = buildRootRepeatGroups();
const STATIC_QUICK_ROLL_ROWS = buildSomaticQuickRollRows();

function getModulePages(moduleId: string): number[] {
  return calculationModulePagesById.get(moduleId) ?? [];
}

function parseBaseValues(input: string): number[] {
  const values = input
    .split(/[,\s]+/)
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => Number(value));

  if (values.length !== 8 || values.some((value) => !Number.isInteger(value) || value < 1 || value > 9)) {
    throw new Error("Нужно ровно 8 целых значений от 1 до 9");
  }

  return values;
}

interface FieldValidation {
  status: "empty" | "incomplete" | "valid" | "invalid";
  normalized: string | null;
  helperText: string;
  error: string | null;
}

interface NumericFieldValidation extends FieldValidation {
  numericValue: number | null;
}

function createDormantValidation(helperText: string): FieldValidation {
  return {
    status: "empty",
    normalized: null,
    helperText,
    error: null
  };
}

function formatDateInputForTyping(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  }

  return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`;
}

function analyzeDateInput(value: string): FieldValidation {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return {
      status: "empty",
      normalized: null,
      helperText: "Формат: ДД.ММ.ГГГГ",
      error: null
    };
  }

  const digitCount = trimmed.replace(/\D/g, "").length;
  if (digitCount < 8) {
    return {
      status: "incomplete",
      normalized: null,
      helperText: "Продолжайте ввод: нужно 8 цифр даты",
      error: null
    };
  }

  try {
    const normalized = normalizeBirthDateInput(trimmed);
    return {
      status: "valid",
      normalized,
      helperText: `Дата принята: ${normalized}`,
      error: null
    };
  } catch (error) {
    return {
      status: "invalid",
      normalized: null,
      helperText: error instanceof Error ? error.message : "Некорректная дата",
      error: error instanceof Error ? error.message : "Некорректная дата"
    };
  }
}

function analyzeHourlyBaseInput(value: string): FieldValidation {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return {
      status: "empty",
      normalized: null,
      helperText: "Введите 8 значений от 1 до 9",
      error: null
    };
  }

  try {
    const parsed = parseBaseValues(trimmed);
    return {
      status: "valid",
      normalized: parsed.join(", "),
      helperText: `Принято значений: ${parsed.length}`,
      error: null
    };
  } catch (error) {
    return {
      status: "invalid",
      normalized: null,
      helperText: error instanceof Error ? error.message : "Некорректная восьмёрка",
      error: error instanceof Error ? error.message : "Некорректная восьмёрка"
    };
  }
}

function analyzeOptionalHourlyBaseInput(value: string, emptyHelper: string): FieldValidation {
  if (value.trim().length === 0) {
    return createDormantValidation(emptyHelper);
  }

  return analyzeHourlyBaseInput(value);
}

function analyzeBiorhythmNameInput(value: string): FieldValidation {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return {
      status: "empty",
      normalized: null,
      helperText: "Введите полное ФИО для автосборки ритма",
      error: null
    };
  }

  try {
    const normalized = normalizeBiorhythmNameInput(trimmed);
    const identity = calculateBiorhythmBaseFromIdentity("11.11.1111", normalized);

    return {
      status: "valid",
      normalized,
      helperText: `Согласных найдено: ${identity.consonants.length}`,
      error: null
    };
  } catch (error) {
    return {
      status: "invalid",
      normalized: null,
      helperText: error instanceof Error ? error.message : "Некорректное ФИО",
      error: error instanceof Error ? error.message : "Некорректное ФИО"
    };
  }
}

function hasHourlyIdentityMetadata(
  value: unknown
): value is {
  normalizedFullName: string;
  birthDate: string;
  birthHour: number;
} {
  return (
    typeof value === "object" &&
    value !== null &&
    "normalizedFullName" in value &&
    "birthDate" in value &&
    "birthHour" in value
  );
}

function analyzeArcanaNameInput(value: string, options: { required: boolean; emptyHelper: string }): FieldValidation {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return {
      status: "empty",
      normalized: null,
      helperText: options.emptyHelper,
      error: options.required ? "Поле обязательно для расчёта" : null
    };
  }

  try {
    const breakdown = calculateArcanaFromText(trimmed);
    return {
      status: "valid",
      normalized: breakdown.normalized,
      helperText: `Аркан ${breakdown.arcana} из суммы ${breakdown.rawSum}`,
      error: null
    };
  } catch (error) {
    return {
      status: "invalid",
      normalized: null,
      helperText: error instanceof Error ? error.message : "Некорректный текст",
      error: error instanceof Error ? error.message : "Некорректный текст"
    };
  }
}

function analyzeIntegerInput(value: string, options: { required: boolean; emptyHelper: string; min: number; max: number }): NumericFieldValidation {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return {
      status: "empty",
      normalized: null,
      helperText: options.emptyHelper,
      error: options.required ? "Поле обязательно для расчёта" : null,
      numericValue: null
    };
  }

  if (!/^-?\d+$/.test(trimmed)) {
    return {
      status: "invalid",
      normalized: null,
      helperText: "Нужно целое число",
      error: "Нужно целое число",
      numericValue: null
    };
  }

  const numericValue = Number(trimmed);
  if (!Number.isInteger(numericValue) || numericValue < options.min || numericValue > options.max) {
    return {
      status: "invalid",
      normalized: null,
      helperText: `Допустим диапазон ${options.min}-${options.max}`,
      error: `Допустим диапазон ${options.min}-${options.max}`,
      numericValue: null
    };
  }

  return {
    status: "valid",
    normalized: String(numericValue),
    helperText: `Возраст принят: ${numericValue}`,
    error: null,
    numericValue
  };
}

function clampInteger(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(max, Math.max(min, Math.trunc(value)));
}

function captureCalculation<T>(builder: () => T): { data: T | null; error: string | null } {
  try {
    return {
      data: builder(),
      error: null
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Неизвестная ошибка расчёта"
    };
  }
}

export function App() {
  const defaultHourlyExample = knowledgeBase.examples.hourlyBiorhythmBase18031964;
  const defaultLifetimeExample = knowledgeBase.examples.lifetimeShadowShapkovaIrinaRoanova19;
  const hourlyReference = knowledgeBase.hourlyBiorhythmReference;
  const arcanaAtlasSectionRef = useRef<HTMLElement | null>(null);
  const somaticSectionRef = useRef<HTMLElement | null>(null);
  const sotaAtlasSectionRef = useRef<HTMLElement | null>(null);

  const [birthDate, setBirthDate] = useState("18.03.1964");
  const [secondaryBirthDate, setSecondaryBirthDate] = useState("15.01.1978");
  const [personName, setPersonName] = useState(defaultLifetimeExample.name);
  const [birthSurname, setBirthSurname] = useState(defaultLifetimeExample.birthSurname);
  const [currentSurname, setCurrentSurname] = useState(defaultLifetimeExample.currentSurname);
  const [surnameChangeAgeInput, setSurnameChangeAgeInput] = useState(String(defaultLifetimeExample.surnameChangeAge));
  const [decadeStart, setDecadeStart] = useState(0);
  const [focusAge, setFocusAge] = useState(5);
  const [selectedSeriesId, setSelectedSeriesId] = useState(0);
  const [birthHour, setBirthHour] = useState(defaultHourlyExample.birthHour);
  const [biorhythmMode, setBiorhythmMode] = useState<BiorhythmMode>("book_strict");
  const [biorhythmFullName, setBiorhythmFullName] = useState("Шапкова Ирина Владимировна");
  const [secondaryBiorhythmFullName, setSecondaryBiorhythmFullName] = useState("");
  const [secondaryBirthHour, setSecondaryBirthHour] = useState(defaultHourlyExample.birthHour);
  const [hourlyBaseInput, setHourlyBaseInput] = useState(defaultHourlyExample.baseEightValues.join(", "));
  const [secondaryHourlyBaseInput, setSecondaryHourlyBaseInput] = useState("");
  const [selectedArcanaReference, setSelectedArcanaReference] = useState(22);
  const [arcanaAtlasFocusContext, setArcanaAtlasFocusContext] = useState<ArcanaAtlasFocusContext | null>(null);
  const [selectedSotaAtlasId, setSelectedSotaAtlasId] = useState(1);
  const [sotaAtlasFocusContext, setSotaAtlasFocusContext] = useState<SotaReferenceFocusContext | null>(null);
  const [showArcanaAtlas, setShowArcanaAtlas] = useState(false);
  const [showBiorhythmReference, setShowBiorhythmReference] = useState(false);
  const [showCoverage, setShowCoverage] = useState(false);

  const selectedSeries = useMemo(
    () => knowledgeBase.somaticSeries.find((item) => item.id === selectedSeriesId) ?? knowledgeBase.somaticSeries[0],
    [selectedSeriesId]
  );
  const safeDecadeStart = useMemo(() => clampInteger(decadeStart, 0, 90), [decadeStart]);
  const safeFocusAge = useMemo(() => clampInteger(focusAge, 0, 100), [focusAge]);
  const safeBirthHour = useMemo(() => clampInteger(birthHour, 0, 23), [birthHour]);
  const safeSecondaryBirthHour = useMemo(() => clampInteger(secondaryBirthHour, 0, 23), [secondaryBirthHour]);
  const isBookStrictBiorhythmMode = biorhythmMode === "book_strict";
  const birthDateValidation = useMemo(() => analyzeDateInput(birthDate), [birthDate]);
  const secondaryDateValidation = useMemo(() => analyzeDateInput(secondaryBirthDate), [secondaryBirthDate]);
  const nameValidation = useMemo(
    () => analyzeArcanaNameInput(personName, { required: true, emptyHelper: "Введите имя" }),
    [personName]
  );
  const birthSurnameValidation = useMemo(
    () => analyzeArcanaNameInput(birthSurname, { required: true, emptyHelper: "Введите родовую фамилию" }),
    [birthSurname]
  );
  const currentSurnameValidation = useMemo(
    () =>
      analyzeArcanaNameInput(currentSurname, {
        required: false,
        emptyHelper: "Оставьте пустым, если фамилия не менялась"
      }),
    [currentSurname]
  );
  const surnameChangeAgeValidation = useMemo(
    () =>
      analyzeIntegerInput(surnameChangeAgeInput, {
        required: currentSurnameValidation.status === "valid",
        emptyHelper:
          currentSurnameValidation.status === "valid"
            ? "Укажите возраст смены фамилии"
            : "Нужен только если указана новая фамилия",
        min: 0,
        max: 120
      }),
    [currentSurnameValidation.status, surnameChangeAgeInput]
  );
  const biorhythmFullNameValidation = useMemo(
    () =>
      isBookStrictBiorhythmMode
        ? createDormantValidation("В строгом режиме по книге ФИО для авторасчёта не используется")
        : analyzeBiorhythmNameInput(biorhythmFullName),
    [biorhythmFullName, isBookStrictBiorhythmMode]
  );
  const secondaryBiorhythmFullNameValidation = useMemo(
    () =>
      isBookStrictBiorhythmMode
        ? createDormantValidation("В строгом режиме второй график строится по второй ручной восьмёрке")
        : analyzeBiorhythmNameInput(secondaryBiorhythmFullName),
    [secondaryBiorhythmFullName, isBookStrictBiorhythmMode]
  );
  const hourlyBaseValidation = useMemo(() => analyzeHourlyBaseInput(hourlyBaseInput), [hourlyBaseInput]);
  const secondaryHourlyBaseValidation = useMemo(
    () =>
      isBookStrictBiorhythmMode
        ? analyzeOptionalHourlyBaseInput(secondaryHourlyBaseInput, "Оставьте пустым, если пока нужен только один график")
        : createDormantValidation("Во внешнем режиме второй график считается по ФИО, дате и часу рождения"),
    [isBookStrictBiorhythmMode, secondaryHourlyBaseInput]
  );
  const normalizedBirthDate = useMemo(() => birthDateValidation.normalized ?? birthDate, [birthDate, birthDateValidation.normalized]);
  const normalizedSecondaryBirthDate = useMemo(
    () => secondaryDateValidation.normalized ?? secondaryBirthDate,
    [secondaryBirthDate, secondaryDateValidation.normalized]
  );
  const normalizedPersonName = useMemo(() => nameValidation.normalized ?? personName, [nameValidation.normalized, personName]);
  const normalizedBirthSurname = useMemo(
    () => birthSurnameValidation.normalized ?? birthSurname,
    [birthSurname, birthSurnameValidation.normalized]
  );
  const normalizedCurrentSurname = useMemo(
    () => currentSurnameValidation.normalized ?? currentSurname,
    [currentSurname, currentSurnameValidation.normalized]
  );
  const normalizedBiorhythmFullName = useMemo(
    () => biorhythmFullNameValidation.normalized ?? biorhythmFullName,
    [biorhythmFullName, biorhythmFullNameValidation.normalized]
  );
  const normalizedSecondaryBiorhythmFullName = useMemo(
    () => secondaryBiorhythmFullNameValidation.normalized ?? secondaryBiorhythmFullName,
    [secondaryBiorhythmFullName, secondaryBiorhythmFullNameValidation.normalized]
  );

  const deferredBirthDateIsValid = useDeferredValue(birthDateValidation.status === "valid");
  const deferredSecondaryBirthDateIsValid = useDeferredValue(secondaryDateValidation.status === "valid");
  const deferredNameIsValid = useDeferredValue(nameValidation.status === "valid");
  const deferredBirthSurnameIsValid = useDeferredValue(birthSurnameValidation.status === "valid");
  const deferredCurrentSurnameStatus = useDeferredValue(currentSurnameValidation.status);
  const deferredSurnameChangeAgeStatus = useDeferredValue(surnameChangeAgeValidation.status);
  const deferredHourlyBaseStatus = useDeferredValue(hourlyBaseValidation.status);
  const deferredSecondaryHourlyBaseStatus = useDeferredValue(secondaryHourlyBaseValidation.status);
  const deferredBiorhythmFullNameStatus = useDeferredValue(biorhythmFullNameValidation.status);
  const deferredSecondaryBiorhythmFullNameStatus = useDeferredValue(secondaryBiorhythmFullNameValidation.status);
  const deferredNormalizedBirthDate = useDeferredValue(normalizedBirthDate);
  const deferredNormalizedSecondaryBirthDate = useDeferredValue(normalizedSecondaryBirthDate);
  const deferredNormalizedPersonName = useDeferredValue(normalizedPersonName);
  const deferredNormalizedBirthSurname = useDeferredValue(normalizedBirthSurname);
  const deferredNormalizedCurrentSurname = useDeferredValue(normalizedCurrentSurname);
  const deferredNormalizedBiorhythmFullName = useDeferredValue(normalizedBiorhythmFullName);
  const deferredNormalizedSecondaryBiorhythmFullName = useDeferredValue(normalizedSecondaryBiorhythmFullName);
  const deferredSafeDecadeStart = useDeferredValue(safeDecadeStart);
  const deferredSafeFocusAge = useDeferredValue(safeFocusAge);
  const deferredSelectedSeriesId = useDeferredValue(selectedSeriesId);
  const deferredSelectedSeries = useMemo(
    () => knowledgeBase.somaticSeries.find((item) => item.id === deferredSelectedSeriesId) ?? knowledgeBase.somaticSeries[0],
    [deferredSelectedSeriesId]
  );
  const deferredSafeBirthHour = useDeferredValue(safeBirthHour);
  const deferredSafeSecondaryBirthHour = useDeferredValue(safeSecondaryBirthHour);
  const deferredHourlyBaseInput = useDeferredValue(hourlyBaseInput);
  const deferredSecondaryHourlyBaseInput = useDeferredValue(secondaryHourlyBaseInput);
  const deferredIsBookStrictBiorhythmMode = useDeferredValue(isBookStrictBiorhythmMode);
  const normalizeDateField = (value: string, setter: (next: string) => void): void => {
    try {
      setter(normalizeBirthDateInput(value));
    } catch {
      // Keep the raw value visible until the user finishes fixing it.
    }
  };
  const normalizeArcanaField = (value: string, setter: (next: string) => void): void => {
    try {
      setter(normalizeArcanaTextInput(value));
    } catch {
      // Keep the raw value visible until the user finishes fixing it.
    }
  };
  const handleDateChange = (value: string, setter: (next: string) => void): void => {
    setter(formatDateInputForTyping(value));
  };
  const handleDatePaste = (pastedValue: string, setter: (next: string) => void): void => {
    try {
      setter(normalizeBirthDateInput(pastedValue));
    } catch {
      setter(formatDateInputForTyping(pastedValue));
    }
  };
  const handleArcanaReferenceJump = (arcana: number): void => {
    startTransition(() => {
      setSelectedArcanaReference(arcana);
      setArcanaAtlasFocusContext(null);
      setShowArcanaAtlas(true);
    });
    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        arcanaAtlasSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };
  const handleArcanaReferenceFocus = (context: ArcanaAtlasFocusContext): void => {
    startTransition(() => {
      setSelectedArcanaReference(context.arcana);
      setArcanaAtlasFocusContext(context);
      setShowArcanaAtlas(true);
    });
    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        arcanaAtlasSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };
  const handleArcanaAtlasSelect = (arcana: number): void => {
    startTransition(() => {
      setSelectedArcanaReference(arcana);
      setArcanaAtlasFocusContext(null);
    });
  };
  const handleArcanaFocusReset = (): void => {
    startTransition(() => {
      setArcanaAtlasFocusContext(null);
    });
  };
  const handleSomaticDrilldown = (age: number, seriesId: number): void => {
    startTransition(() => {
      setFocusAge(age);
      setDecadeStart(clampInteger(Math.floor(age / 10) * 10, 0, 90));
      setSelectedSeriesId(seriesId);
    });
    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        somaticSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };
  const handleSotaReferenceJump = (sotaId: number): void => {
    startTransition(() => {
      setSelectedSotaAtlasId(sotaId);
      setSotaAtlasFocusContext(null);
    });
    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        sotaAtlasSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };
  const handleSotaReferenceFocus = (context: SotaReferenceFocusContext): void => {
    startTransition(() => {
      setSelectedSotaAtlasId(context.sotaId);
      setSotaAtlasFocusContext(context);
    });
    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        sotaAtlasSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  const personalState = useMemo(
    () =>
      deferredBirthDateIsValid
        ? captureCalculation(() => calculatePersonalEnergyPotential(deferredNormalizedBirthDate))
        : { data: null, error: null },
    [deferredBirthDateIsValid, deferredNormalizedBirthDate]
  );
  const pairedState = useMemo(
    () =>
      deferredBirthDateIsValid && deferredSecondaryBirthDateIsValid
        ? captureCalculation(() => {
          const forward = calculatePairedEnergyInfluence(deferredNormalizedBirthDate, deferredNormalizedSecondaryBirthDate);
          const reverse = calculatePairedEnergyInfluence(deferredNormalizedSecondaryBirthDate, deferredNormalizedBirthDate);

          return {
            forward,
            reverse,
            personalEnergogram: buildEnergogramProjection(forward.primaryBase.houseValues),
            forwardEnergogram: buildEnergogramProjection(forward.houseValues),
            reversePersonalEnergogram: buildEnergogramProjection(reverse.primaryBase.houseValues),
            reverseEnergogram: buildEnergogramProjection(reverse.houseValues),
            forwardRows: buildPairedInfluenceHouseRows(forward),
            reverseRows: buildPairedInfluenceHouseRows(reverse),
            forwardSummary: summarizePairedInfluence(forward),
            reverseSummary: summarizePairedInfluence(reverse)
          };
        })
        : { data: null, error: null },
    [deferredBirthDateIsValid, deferredNormalizedBirthDate, deferredNormalizedSecondaryBirthDate, deferredSecondaryBirthDateIsValid]
  );
  const somaticState = useMemo(
    () =>
      deferredBirthDateIsValid
        ? captureCalculation(() => {
          const diagram = calculateSomaticDiagram(
            deferredNormalizedBirthDate,
            Math.max(deferredSafeDecadeStart + 9, deferredSafeFocusAge)
          );
          const tableRows = buildSomaticTableRows(diagram, deferredSafeDecadeStart, deferredSafeDecadeStart + 9);
          const sliceAtlas = buildSomaticSliceAtlas(diagram, deferredSafeDecadeStart, deferredSafeDecadeStart + 9);
          const selectedSlice = sliceAtlas.find((item) => item.seriesId === deferredSelectedSeries.id) ?? sliceAtlas[0];
          const selectedTrajectory =
            selectedSlice?.trajectory ??
            buildSomaticSeriesTrajectory(diagram, deferredSelectedSeries.id, deferredSafeDecadeStart, deferredSafeDecadeStart + 9);
          const focusSnapshot = diagram.snapshots.find((item) => item.age === deferredSafeFocusAge) ?? diagram.snapshots[0];
          const birthMonth = parseBirthDateParts(deferredNormalizedBirthDate).month;
          const interzoneSegments = buildInterzoneSegments(selectedTrajectory, birthMonth);

          return {
            diagram,
            insertedBlockTimeline: buildInsertedBlockTimeline(diagram, deferredSafeDecadeStart, deferredSafeDecadeStart + 2),
            primerRows: buildSomaticTableRows(diagram, 0, 2),
            rootCycleStates: buildRootCycleStates(diagram.baseDigits[0], 100),
            rootPolarPoints: buildRootPolarPoints(diagram.baseDigits[0]),
            rootRepeatGroups: STATIC_ROOT_REPEAT_GROUPS,
            standardGraph: buildSomaticStandardGraphView(focusSnapshot),
            tableRows,
            quickRollDerivation: buildSomaticQuickRollDerivation(diagram.baseDigits, deferredSafeFocusAge),
            quickRollRows: STATIC_QUICK_ROLL_ROWS,
            sliceAtlas,
            selectedTrajectory,
            selectedBaseDigit: diagram.baseDigits[deferredSelectedSeries.id],
            focusSnapshot,
            focusSotas: calculateSotaActivationForSnapshot(focusSnapshot),
            interzoneSegments,
            interzoneOverview: buildInterzoneBookOverview(interzoneSegments)
          };
        })
        : { data: null, error: null },
    [
      deferredBirthDateIsValid,
      deferredNormalizedBirthDate,
      deferredSafeDecadeStart,
      deferredSafeFocusAge,
      deferredSelectedSeries,
    ]
  );
  const lifetimeState = useMemo(
    () =>
      deferredNameIsValid &&
      deferredBirthSurnameIsValid &&
      (deferredCurrentSurnameStatus === "valid" || deferredCurrentSurnameStatus === "empty") &&
      (deferredCurrentSurnameStatus !== "valid" || deferredSurnameChangeAgeStatus === "valid")
        ? captureCalculation(() => {
          const result = calculateLifetimeShadowDiagram({
            name: deferredNormalizedPersonName,
            birthSurname: deferredNormalizedBirthSurname,
            currentSurname: deferredCurrentSurnameStatus === "valid" ? deferredNormalizedCurrentSurname : null,
            surnameChangeAge: surnameChangeAgeValidation.numericValue,
            maxAge: 100
          });

          return {
            result,
            bookStrips: buildLifetimeBookStrips(result),
            chartRows: buildLifetimeChartRows(result),
            summaryRows: buildLifetimeSummaryRows(result),
            ranges: buildLifetimeShadowRanges(result)
          };
        })
        : { data: null, error: null },
    [
      deferredNameIsValid,
      deferredBirthSurnameIsValid,
      deferredCurrentSurnameStatus,
      deferredSurnameChangeAgeStatus,
      deferredNormalizedPersonName,
      deferredNormalizedBirthSurname,
      deferredNormalizedCurrentSurname,
      surnameChangeAgeValidation.numericValue
    ]
  );
  const diseaseHoneycombState = useMemo(
    () => {
      const somaticData = somaticState.data;
      const lifetimeData = lifetimeState.data;

      if (!somaticData || !lifetimeData) {
        return { data: null, error: null };
      }

      return captureCalculation(() => buildDiseaseHoneycombView(somaticData.diagram, lifetimeData.result));
    },
    [lifetimeState.data, somaticState.data]
  );
  const diseaseHoneycombBookState = useMemo(
    () => {
      const somaticData = somaticState.data;
      const diseaseHoneycombData = diseaseHoneycombState.data;

      if (!somaticData || !diseaseHoneycombData) {
        return { data: null, error: null };
      }

      return captureCalculation(() => buildDiseaseHoneycombBookView(somaticData.diagram, diseaseHoneycombData));
    },
    [diseaseHoneycombState.data, somaticState.data]
  );
  const honeycombState = useMemo(
    () =>
      deferredBirthDateIsValid && deferredNameIsValid && deferredBirthSurnameIsValid
        ? captureCalculation(() => {
          const result = calculateHoneycombFrame({
            birthDate: deferredNormalizedBirthDate,
            name: deferredNormalizedPersonName,
            birthSurname: deferredNormalizedBirthSurname
          });

          return {
            result,
            chartCells: buildHoneycombChartCells(result),
            toneRows: buildHoneycombToneRows(result),
            metricRows: buildHoneycombMetricRows(result)
          };
        })
        : { data: null, error: null },
    [deferredBirthDateIsValid, deferredNameIsValid, deferredBirthSurnameIsValid, deferredNormalizedBirthDate, deferredNormalizedBirthSurname, deferredNormalizedPersonName]
  );
  const diseaseHoneycombArcanaState = useMemo(
    () => {
      const diseaseHoneycombData = diseaseHoneycombState.data;
      const lifetimeData = lifetimeState.data;
      const honeycombData = honeycombState.data;

      if (!diseaseHoneycombData || !lifetimeData || !honeycombData) {
        return { data: null, error: null };
      }

      return captureCalculation(() =>
        buildDiseaseHoneycombArcanaView(diseaseHoneycombData, lifetimeData.result, honeycombData.result)
      );
    },
    [diseaseHoneycombState.data, honeycombState.data, lifetimeState.data]
  );
  const hourlyState = useMemo(
    () =>
      deferredHourlyBaseStatus === "valid"
        ? captureCalculation(() => calculateHourlyBiorhythmFromBase(parseBaseValues(deferredHourlyBaseInput), deferredSafeBirthHour))
        : { data: null, error: null },
    [deferredHourlyBaseInput, deferredHourlyBaseStatus, deferredSafeBirthHour]
  );
  const hourlyIdentityState = useMemo(
    () =>
      !deferredIsBookStrictBiorhythmMode && deferredBirthDateIsValid && deferredBiorhythmFullNameStatus === "valid"
        ? captureCalculation(() =>
            calculateHourlyBiorhythmFromIdentity(
              deferredNormalizedBirthDate,
              deferredNormalizedBiorhythmFullName,
              deferredSafeBirthHour
            )
          )
        : { data: null, error: null },
    [
      deferredIsBookStrictBiorhythmMode,
      deferredBirthDateIsValid,
      deferredBiorhythmFullNameStatus,
      deferredNormalizedBirthDate,
      deferredNormalizedBiorhythmFullName,
      deferredSafeBirthHour
    ]
  );
  const hourlyPartnerState = useMemo(
    () =>
      deferredIsBookStrictBiorhythmMode
        ? deferredSecondaryHourlyBaseStatus === "valid"
          ? captureCalculation(() =>
              calculateHourlyBiorhythmFromBase(parseBaseValues(deferredSecondaryHourlyBaseInput), deferredSafeSecondaryBirthHour)
            )
          : { data: null, error: null }
        : deferredSecondaryBirthDateIsValid && deferredSecondaryBiorhythmFullNameStatus === "valid"
          ? captureCalculation(() =>
            calculateHourlyBiorhythmFromIdentity(
              deferredNormalizedSecondaryBirthDate,
              deferredNormalizedSecondaryBiorhythmFullName,
              deferredSafeSecondaryBirthHour
            )
          )
          : { data: null, error: null },
    [
      deferredIsBookStrictBiorhythmMode,
      deferredSecondaryHourlyBaseStatus,
      deferredSecondaryHourlyBaseInput,
      deferredSafeSecondaryBirthHour,
      deferredSecondaryBirthDateIsValid,
      deferredSecondaryBiorhythmFullNameStatus,
      deferredNormalizedSecondaryBirthDate,
      deferredNormalizedSecondaryBiorhythmFullName
    ]
  );
  const manualHourlyBaseValues = useMemo(
    () => (hourlyBaseValidation.status === "valid" ? parseBaseValues(hourlyBaseInput) : null),
    [hourlyBaseInput, hourlyBaseValidation.status]
  );
  const autoHourlyData = hourlyIdentityState.data;
  const partnerHourlyData = hourlyPartnerState.data;
  const publishedPartnerHourlyData = !isBookStrictBiorhythmMode && hasHourlyIdentityMetadata(partnerHourlyData) ? partnerHourlyData : null;
  const manualHourlyRecommendations = useMemo(
    () => (hourlyState.data ? buildHourlyRecommendationSummary(hourlyState.data) : null),
    [hourlyState.data]
  );
  const partnerHourlyRecommendations = useMemo(
    () => (partnerHourlyData ? buildHourlyRecommendationSummary(partnerHourlyData) : null),
    [partnerHourlyData]
  );
  const autoHourlyRecommendations = useMemo(
    () => (autoHourlyData ? buildHourlyRecommendationSummary(autoHourlyData) : null),
    [autoHourlyData]
  );
  const primaryCompatibilityHourlyData = isBookStrictBiorhythmMode ? hourlyState.data : autoHourlyData;
  const hourlyCompatibilitySummary = useMemo(
    () =>
      primaryCompatibilityHourlyData && partnerHourlyData
        ? buildHourlyCompatibilitySummary(primaryCompatibilityHourlyData, partnerHourlyData)
        : null,
    [partnerHourlyData, primaryCompatibilityHourlyData]
  );
  const selectedArcanaTargetHeading =
    knowledgeBase.arcanaTargetHeadings.find((item) => item.arcana === selectedArcanaReference)?.title ?? null;
  const selectedArcanaTreatmentMistake =
    knowledgeBase.treatmentMistakes.find((item) => item.arcana === selectedArcanaReference)?.factors ?? null;
  const currentArcanaMatches = honeycombState.data
    ? [
        ...honeycombState.data.toneRows
          .filter((row) => row.arcana === selectedArcanaReference)
          .map((row) => ({ label: row.label, description: row.description })),
        ...honeycombState.data.metricRows
          .filter((row) => row.arcana === selectedArcanaReference)
          .map((row) => ({ label: row.label, description: row.description }))
      ]
    : [];
  const hourlyBaseMismatch =
    !isBookStrictBiorhythmMode && manualHourlyBaseValues !== null && autoHourlyData
      ? manualHourlyBaseValues.join(",") !== autoHourlyData.baseEightValues.join(",")
      : false;
  const hourlyGuideResult = isBookStrictBiorhythmMode ? hourlyState.data : autoHourlyData ?? hourlyState.data;
  const hourlyGuideBirthHour = !isBookStrictBiorhythmMode && autoHourlyData ? autoHourlyData.birthHour : safeBirthHour;

  const positiveCount = useMemo(
    () => (personalState.data ? Object.values(personalState.data.houseValues).filter((item) => item.score > 0).length : 0),
    [personalState.data]
  );
  const negativeCount = useMemo(
    () => (personalState.data ? Object.values(personalState.data.houseValues).filter((item) => item.score < 0).length : 0),
    [personalState.data]
  );
  const activeSotas = useMemo(
    () => (somaticState.data ? Object.values(somaticState.data.focusSotas).filter((item) => item.active).length : 0),
    [somaticState.data]
  );
  const directModules = knowledgeBase.calculationModules.filter((item) => item.status === "direct").length;
  const lookupModules = knowledgeBase.calculationModules.filter((item) => item.status === "lookup_required").length;
  const errorMessages = useMemo(
    () =>
      Array.from(
        new Set(
          [
            birthDateValidation.error,
            secondaryDateValidation.error,
            nameValidation.error,
            birthSurnameValidation.error,
            currentSurnameValidation.error,
            surnameChangeAgeValidation.error,
            hourlyBaseValidation.error,
            isBookStrictBiorhythmMode ? secondaryHourlyBaseValidation.error : null,
            !isBookStrictBiorhythmMode ? biorhythmFullNameValidation.error : null,
            !isBookStrictBiorhythmMode ? secondaryBiorhythmFullNameValidation.error : null,
            personalState.error,
            pairedState.error,
            somaticState.error,
            lifetimeState.error,
            diseaseHoneycombState.error,
            diseaseHoneycombArcanaState.error,
            honeycombState.error,
            hourlyState.error,
            !isBookStrictBiorhythmMode ? hourlyIdentityState.error : null,
            hourlyPartnerState.error
          ].filter(Boolean) as string[]
        )
      ),
    [
      birthDateValidation.error,
      secondaryDateValidation.error,
      nameValidation.error,
      birthSurnameValidation.error,
      currentSurnameValidation.error,
      surnameChangeAgeValidation.error,
      hourlyBaseValidation.error,
      secondaryHourlyBaseValidation.error,
      biorhythmFullNameValidation.error,
      secondaryBiorhythmFullNameValidation.error,
      personalState.error,
      pairedState.error,
      somaticState.error,
      lifetimeState.error,
      diseaseHoneycombState.error,
      diseaseHoneycombArcanaState.error,
      honeycombState.error,
      hourlyState.error,
      hourlyIdentityState.error,
      hourlyPartnerState.error,
      isBookStrictBiorhythmMode
    ]
  );
  const focusedSomaticSeriesValue = somaticState.data?.focusSnapshot.values[selectedSeries.id] ?? null;
  const honeycombOpvRow = honeycombState.data?.metricRows.find((row) => row.id === "opv") ?? null;
  const honeycombKchRow = honeycombState.data?.metricRows.find((row) => row.id === "kch") ?? null;
  const honeycombEbRow = honeycombState.data?.metricRows.find((row) => row.id === "eb") ?? null;
  const honeycombTrRow = honeycombState.data?.metricRows.find((row) => row.id === "tr") ?? null;
  const honeycombSzRow = honeycombState.data?.metricRows.find((row) => row.id === "sz") ?? null;
  const honeycombSmRow = honeycombState.data?.metricRows.find((row) => row.id === "sm") ?? null;
  const honeycombOlRow = honeycombState.data?.metricRows.find((row) => row.id === "ol") ?? null;
  const firstInterzoneSegment = somaticState.data?.interzoneSegments[0] ?? null;
  const selectedQuickRollStep =
    somaticState.data?.quickRollDerivation.steps.find((step) => step.seriesId === selectedSeries.id) ?? null;
  const selectedSliceEntry =
    somaticState.data?.sliceAtlas.find((entry) => entry.seriesId === selectedSeries.id) ?? null;
  const activeSotaNames = somaticState.data
    ? knowledgeBase.sotas
        .filter((sota) => somaticState.data!.focusSotas[sota.id]?.active)
        .map((sota) => `${sota.id}. ${sota.name}`)
    : [];
  const diseaseHoneycombCandidateAges = diseaseHoneycombState.data?.rows.flatMap((row) => row.candidateAges) ?? [];
  const diseaseHoneycombCandidateText =
    diseaseHoneycombCandidateAges.length > 0
      ? `${diseaseHoneycombState.data?.candidateLabel}: ${diseaseHoneycombCandidateAges.join(", ")}.`
      : "На текущем наборе данных книга не даёт опасных лет для проверки по сотам.";
  const diseaseHoneycombSplitText =
    diseaseHoneycombState.data && diseaseHoneycombState.data.rows.length > 0
      ? diseaseHoneycombState.data.rows
          .map((row) => `${row.sotaId} сота -> ${row.candidateAges.join(", ")}`)
          .join(" · ")
      : "Опасные годы не распределились по сотам.";
  const diseaseHoneycombConfirmedText =
    diseaseHoneycombState.data && diseaseHoneycombState.data.rows.length > 0
      ? diseaseHoneycombState.data.rows
          .map((row) => `${row.sotaId} сота: ${row.confirmedAges.join(", ") || "—"}`)
          .join(" · ")
      : "Подтверждённых опасных лет нет.";
  const diseaseHoneycombExcludedText =
    diseaseHoneycombState.data?.rows.some((row) => row.excludedAges.length > 0)
      ? diseaseHoneycombState.data.rows
          .filter((row) => row.excludedAges.length > 0)
          .map((row) => `${row.sotaId} сота: ${row.excludedAges.join(", ")}`)
          .join(" · ")
      : "Для текущего набора данных исключённых лет нет.";
  const diseaseArcanaMappingText =
    diseaseHoneycombArcanaState.data && diseaseHoneycombArcanaState.data.rows.length > 0
      ? diseaseHoneycombArcanaState.data.rows
          .map((row) => `${row.sotaId} сота -> ${row.metricLabel}=${row.arcana}`)
          .join(" · ")
      : "Для подтверждённых опасных лет временные ячейки ещё не определены.";
  const diseaseArcanaFlagText =
    diseaseHoneycombArcanaState.data && diseaseHoneycombArcanaState.data.rows.some((row) => row.riskFlags.length > 0)
      ? diseaseHoneycombArcanaState.data.rows
          .filter((row) => row.riskFlags.length > 0)
          .map((row) => `${row.sotaId} сота: ${row.riskFlags.join(", ")}`)
          .join(" · ")
      : "Совпадений с СМ и арканов 12/15 для подтверждённых сот книга здесь не выделяет.";

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero__copy">
          <span className="hero__eyebrow">Нумерология как профессия · книга 9</span>
          <h1>Энергосистема человека</h1>
          <p>
            Рабочий визуальный слой для книги: матрицы, цветовые таблицы, возрастные графики, круговые схемы и суточные
            ритмы, построенные из расчётного ядра, а не вручную.
          </p>
        </div>
        <div className="hero__metrics">
          <div className="metric-card">
            <span>Корень даты</span>
            <strong>{personalState.data?.rootDigit ?? "—"}</strong>
          </div>
          <div className="metric-card">
            <span>Прямых модулей</span>
            <strong>{directModules}</strong>
          </div>
          <div className="metric-card">
            <span>Модулей со справочниками</span>
            <strong>{lookupModules}</strong>
          </div>
          <div className="metric-card">
            <span>Активных сот</span>
            <strong>{activeSotas}</strong>
          </div>
        </div>
      </section>

      <section className="control-panel">
        <div className="control-group">
          <label>
            Дата рождения
            <input
              className={birthDateValidation.status === "invalid" ? "control-input--invalid" : birthDateValidation.status === "valid" ? "control-input--valid" : ""}
              value={birthDate}
              onChange={(event) => handleDateChange(event.target.value, setBirthDate)}
              onBlur={(event) => normalizeDateField(event.target.value, setBirthDate)}
              onPaste={(event) => {
                event.preventDefault();
                handleDatePaste(event.clipboardData.getData("text"), setBirthDate);
              }}
              placeholder="18.03.1964 или 1964-03-18"
              inputMode="numeric"
              maxLength={10}
              aria-invalid={birthDateValidation.status === "invalid"}
            />
            <span className={`control-field__hint control-field__hint--${birthDateValidation.status}`}>
              {birthDateValidation.helperText}
            </span>
          </label>
          <label>
            Дата второго человека
            <input
              className={
                secondaryDateValidation.status === "invalid"
                  ? "control-input--invalid"
                  : secondaryDateValidation.status === "valid"
                    ? "control-input--valid"
                    : ""
              }
              value={secondaryBirthDate}
              onChange={(event) => handleDateChange(event.target.value, setSecondaryBirthDate)}
              onBlur={(event) => normalizeDateField(event.target.value, setSecondaryBirthDate)}
              onPaste={(event) => {
                event.preventDefault();
                handleDatePaste(event.clipboardData.getData("text"), setSecondaryBirthDate);
              }}
              placeholder="15.01.1978 или 1978-01-15"
              inputMode="numeric"
              maxLength={10}
              aria-invalid={secondaryDateValidation.status === "invalid"}
            />
            <span className={`control-field__hint control-field__hint--${secondaryDateValidation.status}`}>
              {secondaryDateValidation.helperText}
            </span>
          </label>
          <label>
            Старт декады
            <input
              type="number"
              min={0}
              max={90}
              value={decadeStart}
              onChange={(event) => setDecadeStart(Number(event.target.value))}
            />
          </label>
          <label>
            Фокусный возраст
            <input
              type="number"
              min={0}
              max={100}
              value={focusAge}
              onChange={(event) => setFocusAge(Number(event.target.value))}
            />
          </label>
          <label>
            Фокусная серия
            <select value={selectedSeriesId} onChange={(event) => setSelectedSeriesId(Number(event.target.value))}>
              {knowledgeBase.somaticSeries.map((series) => (
                <option key={series.id} value={series.id}>
                  {series.sphereName} · {series.healthName}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="control-group control-group--four">
          <label>
            Имя
            <input
              className={nameValidation.status === "invalid" ? "control-input--invalid" : nameValidation.status === "valid" ? "control-input--valid" : ""}
              value={personName}
              onChange={(event) => setPersonName(event.target.value)}
              onBlur={(event) => normalizeArcanaField(event.target.value, setPersonName)}
              placeholder="Ирина"
              aria-invalid={nameValidation.status === "invalid"}
            />
            <span className={`control-field__hint control-field__hint--${nameValidation.status}`}>{nameValidation.helperText}</span>
          </label>
          <label>
            Родовая фамилия
            <input
              className={
                birthSurnameValidation.status === "invalid"
                  ? "control-input--invalid"
                  : birthSurnameValidation.status === "valid"
                    ? "control-input--valid"
                    : ""
              }
              value={birthSurname}
              onChange={(event) => setBirthSurname(event.target.value)}
              onBlur={(event) => normalizeArcanaField(event.target.value, setBirthSurname)}
              placeholder="Шапкова"
              aria-invalid={birthSurnameValidation.status === "invalid"}
            />
            <span className={`control-field__hint control-field__hint--${birthSurnameValidation.status}`}>
              {birthSurnameValidation.helperText}
            </span>
          </label>
          <label>
            Новая фамилия
            <input
              className={
                currentSurnameValidation.status === "invalid"
                  ? "control-input--invalid"
                  : currentSurnameValidation.status === "valid"
                    ? "control-input--valid"
                    : ""
              }
              value={currentSurname}
              onChange={(event) => setCurrentSurname(event.target.value)}
              onBlur={(event) => normalizeArcanaField(event.target.value, setCurrentSurname)}
              placeholder="Роанова"
              aria-invalid={currentSurnameValidation.status === "invalid"}
            />
            <span className={`control-field__hint control-field__hint--${currentSurnameValidation.status}`}>
              {currentSurnameValidation.helperText}
            </span>
          </label>
          <label>
            Возраст смены фамилии
            <input
              className={
                surnameChangeAgeValidation.status === "invalid"
                  ? "control-input--invalid"
                  : surnameChangeAgeValidation.status === "valid"
                    ? "control-input--valid"
                    : ""
              }
              value={surnameChangeAgeInput}
              onChange={(event) => setSurnameChangeAgeInput(event.target.value)}
              placeholder="19"
              inputMode="numeric"
              aria-invalid={surnameChangeAgeValidation.status === "invalid"}
            />
            <span className={`control-field__hint control-field__hint--${surnameChangeAgeValidation.status}`}>
              {surnameChangeAgeValidation.helperText}
            </span>
          </label>
        </div>
        <div className="control-group control-group--wide">
          <div className="mode-chip-row" role="tablist" aria-label="Режим суточного биоритма">
            {BIORHYTHM_MODE_OPTIONS.map((option) => (
              <button
                aria-selected={biorhythmMode === option.id}
                className={`mode-chip ${biorhythmMode === option.id ? "mode-chip--active" : ""}`}
                key={option.id}
                onClick={() => setBiorhythmMode(option.id)}
                role="tab"
                type="button"
              >
                <strong>{option.label}</strong>
                <span>{option.description}</span>
              </button>
            ))}
          </div>
        </div>
        {isBookStrictBiorhythmMode ? (
          <>
            <div className="control-group control-group--two">
              <label>
                Час рождения первого человека
                <input type="number" min={0} max={23} value={birthHour} onChange={(event) => setBirthHour(Number(event.target.value))} />
              </label>
              <label>
                Час рождения второго человека
                <input
                  type="number"
                  min={0}
                  max={23}
                  value={secondaryBirthHour}
                  onChange={(event) => setSecondaryBirthHour(Number(event.target.value))}
                />
              </label>
            </div>
            <div className="control-group control-group--two">
              <label>
                Базовая восьмёрка первого человека
                <input
                  className={
                    hourlyBaseValidation.status === "invalid"
                      ? "control-input--invalid"
                      : hourlyBaseValidation.status === "valid"
                        ? "control-input--valid"
                        : ""
                  }
                  value={hourlyBaseInput}
                  onChange={(event) => setHourlyBaseInput(event.target.value)}
                  aria-invalid={hourlyBaseValidation.status === "invalid"}
                />
                <span className={`control-field__hint control-field__hint--${hourlyBaseValidation.status}`}>
                  {hourlyBaseValidation.helperText}
                </span>
              </label>
              <label>
                Базовая восьмёрка второго человека
                <input
                  className={
                    secondaryHourlyBaseValidation.status === "invalid"
                      ? "control-input--invalid"
                      : secondaryHourlyBaseValidation.status === "valid"
                        ? "control-input--valid"
                        : ""
                  }
                  value={secondaryHourlyBaseInput}
                  onChange={(event) => setSecondaryHourlyBaseInput(event.target.value)}
                  aria-invalid={secondaryHourlyBaseValidation.status === "invalid"}
                  placeholder="Оставьте пустым, если нужен один график"
                />
                <span className={`control-field__hint control-field__hint--${secondaryHourlyBaseValidation.status}`}>
                  {secondaryHourlyBaseValidation.helperText}
                </span>
              </label>
            </div>
          </>
        ) : (
          <>
            <div className="control-group control-group--four">
              <label>
                ФИО для авторасчёта ритма
                <input
                  className={
                    biorhythmFullNameValidation.status === "invalid"
                      ? "control-input--invalid"
                      : biorhythmFullNameValidation.status === "valid"
                        ? "control-input--valid"
                        : ""
                  }
                  value={biorhythmFullName}
                  onChange={(event) => setBiorhythmFullName(event.target.value)}
                  onBlur={(event) => {
                    try {
                      setBiorhythmFullName(normalizeBiorhythmNameInput(event.target.value));
                    } catch {
                      // Keep raw input until the user fixes it.
                    }
                  }}
                  placeholder="Шапкова Ирина Владимировна"
                  aria-invalid={biorhythmFullNameValidation.status === "invalid"}
                />
                <span className={`control-field__hint control-field__hint--${biorhythmFullNameValidation.status}`}>
                  {biorhythmFullNameValidation.helperText}
                </span>
              </label>
              <label>
                ФИО второго человека для наложения
                <input
                  className={
                    secondaryBiorhythmFullNameValidation.status === "invalid"
                      ? "control-input--invalid"
                      : secondaryBiorhythmFullNameValidation.status === "valid"
                        ? "control-input--valid"
                        : ""
                  }
                  value={secondaryBiorhythmFullName}
                  onChange={(event) => setSecondaryBiorhythmFullName(event.target.value)}
                  onBlur={(event) => {
                    try {
                      setSecondaryBiorhythmFullName(normalizeBiorhythmNameInput(event.target.value));
                    } catch {
                      // Keep raw input until the user fixes it.
                    }
                  }}
                  placeholder="Необязательно, только для совместимости"
                  aria-invalid={secondaryBiorhythmFullNameValidation.status === "invalid"}
                />
                <span className={`control-field__hint control-field__hint--${secondaryBiorhythmFullNameValidation.status}`}>
                  {secondaryBiorhythmFullNameValidation.status === "empty"
                    ? "Оставьте пустым, если пока нужен только один суточный график"
                    : secondaryBiorhythmFullNameValidation.helperText}
                </span>
              </label>
              <label>
                Час рождения первого человека
                <input type="number" min={0} max={23} value={birthHour} onChange={(event) => setBirthHour(Number(event.target.value))} />
              </label>
              <label>
                Час рождения второго человека
                <input
                  type="number"
                  min={0}
                  max={23}
                  value={secondaryBirthHour}
                  onChange={(event) => setSecondaryBirthHour(Number(event.target.value))}
                />
              </label>
            </div>
            <div className="control-group control-group--wide">
              <label>
                Базовая восьмёрка для ручной сверки
                <input
                  className={
                    hourlyBaseValidation.status === "invalid"
                      ? "control-input--invalid"
                      : hourlyBaseValidation.status === "valid"
                        ? "control-input--valid"
                        : ""
                  }
                  value={hourlyBaseInput}
                  onChange={(event) => setHourlyBaseInput(event.target.value)}
                  aria-invalid={hourlyBaseValidation.status === "invalid"}
                />
                <span className={`control-field__hint control-field__hint--${hourlyBaseValidation.status}`}>
                  {hourlyBaseValidation.helperText}
                </span>
              </label>
            </div>
          </>
        )}
        <div className="control-group control-group--wide">
          <p className="control-note">
            {isBookStrictBiorhythmMode
              ? "Строгий режим главы 3 использует только ручные восьмёрки и часы рождения. Так человек, читавший книгу, может полностью проверить расчёт без внешней буквенной таблицы. Для наложения двух суточных графиков здесь же вводится вторая ручная восьмёрка."
              : "Этот вспомогательный режим использует опубликованную авторами таблицу 1..9 для автосборки восьмёрки по полному ФИО. Он удобен для быстрого расчёта, но не считается строгим режимом именно по этой книге. Дата второго человека нужна и для блока направленного влияния, и для совместных энергограмм."}
          </p>
        </div>
      </section>

      {errorMessages.length > 0 ? (
        <section className="section-block section-block--alert">
          <div className="section-block__header">
            <h2>Ошибки входных данных</h2>
            <p>Расчётный слой не додумывает данные. Если ввод некорректный, визуализации останавливаются и явно показывают причину.</p>
          </div>
          <div className="alert-list">
            {errorMessages.map((message) => (
              <article className="alert-card" key={message}>
                {message}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {personalState.data ? (
        <section className="section-block">
          <div className="section-block__header">
            <h2>1. Энергопотенциал и сворачивание даты</h2>
            <p>
              Здесь уже есть полный расчёт главы 1: треугольник кверсум-рядов, количество цифр, баланс положительных и отрицательных зон.
              Положительных зон: {positiveCount}. Отрицательных зон: {negativeCount}.
            </p>
          </div>
          <BookMethodGuide
            defaultOpen
            intro="Этот блок должен проверяться вручную ровно так же, как человек делает это по книге: дата -> кверсум-ряд -> частоты цифр -> баллы домов -> матрица."
            pages={getModulePages("personal-energy-potential")}
            steps={[
              {
                label: "1. Берём восемь цифр даты",
                description: `${normalizedBirthDate} -> ${personalState.data.digits.join(" ")}.`
              },
              {
                label: "2. Строим кверсум-ряд",
                description: `Каждый следующий ряд получается попарным сворачиванием предыдущего. Последняя цифра даёт корень ${personalState.data.rootDigit}.`,
                formula: `${personalState.data.triangleRows[0].join(" ")} -> … -> ${personalState.data.rootDigit}`
              },
              {
                label: "3. Считаем, сколько раз встретилась каждая цифра",
                description: `Например, цифра 1 встретилась ${personalState.data.digitCounts[1]} раз, цифра 4 — ${personalState.data.digitCounts[4]} раз, цифра 9 — ${personalState.data.digitCounts[9]} раз.`
              },
              {
                label: "4. Переводим количество в баллы по книге",
                description: `Для дома 1 сейчас получилось ${personalState.data.houseValues[1].count} повторов -> ${personalState.data.houseValues[1].score > 0 ? `+${personalState.data.houseValues[1].score}` : personalState.data.houseValues[1].score} балла.`,
                formula: "0..4 => 0..4; 5 => -1; 6 => -2; 7 => -3; 8 => -4; 9 => -5"
              },
              {
                label: "5. Заполняем итоговую матрицу 3×3",
                description: "Каждый дом берётся по своей матричной цифре и попадает в квадрат 3×3 ниже. Это уже не новая математика, а раскладка результата по книжной схеме."
              }
            ]}
            title="Как проверить расчёт вручную"
          />
          <div className="section-grid section-grid--two section-grid--paired">
            <QuersumTriangle rows={personalState.data.triangleRows} rootDigit={personalState.data.rootDigit} />
            <div className="chart-card">
              <div className="chart-card__header">
                <h3>Матрица энергопотенциала</h3>
                <p>Квадрат 3×3 по домам, количеству повторов и переводу в баллы по книге.</p>
              </div>
              <MatrixGrid counts={personalState.data.matrixCounts} scores={personalState.data.matrixScores} />
            </div>
          </div>
        </section>
      ) : null}

      {pairedState.data ? (
        <section className="section-block">
          <div className="section-block__header">
            <h2>2. Направленное влияние другого человека</h2>
            <p>
              Этот блок не считает обычную совместимость. Он считает именно направленное влияние одной даты на другую, как в примере
              книги на стр. 99-101.
            </p>
          </div>
          <BookMethodGuide
            intro="Человек, читавший книгу, должен видеть, что сайт делает ровно тот же алгоритм: удвоение второй даты, поразрядное сложение, новый кверсум-ряд и сравнение домов."
            pages={getModulePages("paired-energy-influence")}
            steps={[
              {
                label: "1. Удваиваем вторую дату",
                description: `${normalizedSecondaryBirthDate} × 2 -> ${pairedState.data.forward.secondaryDoubledDigits.join(" ")}.`
              },
              {
                label: "2. Складываем её с первой датой поразрядно",
                description: `${normalizedBirthDate} + удвоенная дата -> ${pairedState.data.forward.combinedDigits.join(" ")}.`,
                formula: "Сложение идёт поразрядно в замкнутом цикле, где 10 превращается в 0."
              },
              {
                label: "3. Строим кверсум-ряд уже для новой строки",
                description: `Новая строка сворачивается до корня ${pairedState.data.forward.rootDigit}.`
              },
              {
                label: "4. Снова считаем дома и баллы",
                description: `Например, дом 1 изменился на ${pairedState.data.forward.deltaScoresByHouseId[1] > 0 ? "+" : ""}${pairedState.data.forward.deltaScoresByHouseId[1]}, дом 4 — на ${pairedState.data.forward.deltaScoresByHouseId[4] > 0 ? "+" : ""}${pairedState.data.forward.deltaScoresByHouseId[4]}.`
              },
              {
                label: "5. Сравниваем только в одном направлении",
                description: "Это принципиально не симметричная совместимость. Блок ниже отдельно считает обратное направление и поэтому показывает две разные карты."
              }
            ]}
            title="Как проверить направленное влияние вручную"
          />
          <div className="section-grid section-grid--two">
            <div className="comparison-shell">
              <div className="comparison-shell__header">
                <h3>{normalizedSecondaryBirthDate} влияет на {normalizedBirthDate}</h3>
                <p>
                  Рост домов: {pairedState.data.forwardSummary.improvedHouseIds.join(", ") || "нет"}. Просадка домов:{" "}
                  {pairedState.data.forwardSummary.reducedHouseIds.join(", ") || "нет"}.
                </p>
              </div>
              <div className="comparison-shell__content">
                <InfluenceExplainCard
                  secondaryDoubledDigits={pairedState.data.forward.secondaryDoubledDigits}
                  combinedDigits={pairedState.data.forward.combinedDigits}
                />
                <QuersumTriangle rows={pairedState.data.forward.triangleRows} rootDigit={pairedState.data.forward.rootDigit} />
                <div className="comparison-matrices">
                  <div className="chart-card">
                    <div className="chart-card__header">
                      <h3>Базовая карта</h3>
                      <p>Исходный энергопотенциал первого человека.</p>
                    </div>
                    <MatrixGrid counts={pairedState.data.forward.primaryBase.matrixCounts} scores={pairedState.data.forward.primaryBase.matrixScores} />
                  </div>
                  <div className="chart-card">
                    <div className="chart-card__header">
                      <h3>Карта после влияния</h3>
                      <p>Та же карта после наложения удвоенной даты второго человека.</p>
                    </div>
                    <MatrixGrid counts={pairedState.data.forward.matrixCounts} scores={pairedState.data.forward.matrixScores} />
                  </div>
                </div>
                <InfluenceDeltaChart rows={pairedState.data.forwardRows} title="Дельта влияния по домам" />
                <InfluenceHouseTable rows={pairedState.data.forwardRows} />
              </div>
            </div>
            <div className="comparison-shell">
              <div className="comparison-shell__header">
                <h3>{normalizedBirthDate} влияет на {normalizedSecondaryBirthDate}</h3>
                <p>
                  Рост домов: {pairedState.data.reverseSummary.improvedHouseIds.join(", ") || "нет"}. Просадка домов:{" "}
                  {pairedState.data.reverseSummary.reducedHouseIds.join(", ") || "нет"}.
                </p>
              </div>
              <div className="comparison-shell__content">
                <InfluenceExplainCard
                  secondaryDoubledDigits={pairedState.data.reverse.secondaryDoubledDigits}
                  combinedDigits={pairedState.data.reverse.combinedDigits}
                />
                <QuersumTriangle rows={pairedState.data.reverse.triangleRows} rootDigit={pairedState.data.reverse.rootDigit} />
                <div className="comparison-matrices">
                  <div className="chart-card">
                    <div className="chart-card__header">
                      <h3>Базовая карта</h3>
                      <p>Исходный энергопотенциал второго человека.</p>
                    </div>
                    <MatrixGrid counts={pairedState.data.reverse.primaryBase.matrixCounts} scores={pairedState.data.reverse.primaryBase.matrixScores} />
                  </div>
                  <div className="chart-card">
                    <div className="chart-card__header">
                      <h3>Карта после влияния</h3>
                      <p>Результат после направленного наложения первой даты на вторую.</p>
                    </div>
                    <MatrixGrid counts={pairedState.data.reverse.matrixCounts} scores={pairedState.data.reverse.matrixScores} />
                  </div>
                </div>
                <InfluenceDeltaChart rows={pairedState.data.reverseRows} title="Обратная дельта по домам" />
                <InfluenceHouseTable rows={pairedState.data.reverseRows} />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {pairedState.data ? (
        <section className="section-block">
          <div className="section-block__header">
            <h2>3. Личная и совместная энергограмма</h2>
            <p>
              Порядок узлов снят с шаблона книги: `9-8-5-4-2-3-6-7-1`. Положительные баллы откладываются вправо, отрицательные влево.
            </p>
          </div>
          <BookMethodGuide
            intro="Энергограмма не считает новые цифры. Она берёт уже посчитанные баллы домов и переносит их на книжный порядок узлов тела и сфер."
            pages={[101, 103]}
            steps={[
              {
                label: "1. Сначала считаем обычную матрицу домов",
                description: "Для личной энергограммы берутся баллы из энергопотенциала. Для совместной — из блока направленного влияния."
              },
              {
                label: "2. Переставляем дома в книжный порядок",
                description: `Сейчас используется порядок ${pairedState.data.personalEnergogram.houseOrder.join("-")}.`
              },
              {
                label: "3. Для каждой точки берём уже готовый балл дома",
                description: `Например, в личной энергограмме дом ${pairedState.data.personalEnergogram.points[0]?.houseId} даёт ${pairedState.data.personalEnergogram.points[0]?.score ?? "—"}, а дом ${pairedState.data.personalEnergogram.points[1]?.houseId} даёт ${pairedState.data.personalEnergogram.points[1]?.score ?? "—"}.`
              },
              {
                label: "4. Плюс откладываем вправо, минус влево",
                description: "Это не новая шкала: используется тот же знак балла, который уже был получен в матрице."
              },
              {
                label: "5. Соединяем точки по шаблону энергограммы",
                description: "Именно поэтому энергограмму можно проверить вручную: достаточно взять баллы домов и нанести их на схему книги в том же порядке."
              }
            ]}
            title="Как проверить энергограмму вручную"
          />
          <div className="section-grid section-grid--three">
            <EnergogramChart
              projection={pairedState.data.personalEnergogram}
              title={`Личная энергограмма ${normalizedBirthDate}`}
              subtitle="Базовая карта первого человека"
              variant="personal"
            />
            <EnergogramChart
              projection={pairedState.data.forwardEnergogram}
              title={`${normalizedSecondaryBirthDate} -> ${normalizedBirthDate}`}
              subtitle="Совместная энергограмма: влияние второго на первого"
              variant="paired"
            />
            <EnergogramChart
              projection={pairedState.data.reverseEnergogram}
              title={`${normalizedBirthDate} -> ${normalizedSecondaryBirthDate}`}
              subtitle="Совместная энергограмма: обратное направление"
              variant="paired"
            />
          </div>
        </section>
      ) : null}

      {somaticState.data ? (
        <>
          <section className="section-block" ref={somaticSectionRef}>
            <div className="section-block__header">
              <h2>4. Соматическая таблица по возрастам</h2>
              <p>Цветовая прокрутка на десятилетие, из которой строятся возрастные графики, срезы энергограмм и круговые схемы.</p>
            </div>
            <BookMethodGuide
              intro="Здесь человек должен уметь взять исходные соматические цифры и сам получить любой возраст без скрытой математики."
              pages={getModulePages("somato-energodiagram")}
              steps={[
                {
                  label: "1. Собираем базовые соматические цифры",
                  description: `Корень даты даёт серию 0 = ${somaticState.data.diagram.baseDigits[0]}, а для выбранной серии ${selectedSeries.id} базовая цифра равна ${somaticState.data.selectedBaseDigit}.`
                },
                {
                  label: "2. Для соматики количество не переводим через -4",
                  description: "В отличие от энергопотенциала здесь берётся само количество цифр, только с ограничением сверху до 9."
                },
                {
                  label: "3. Прокручиваем возраст по модулю 10",
                  description: `Для серии ${selectedSeries.id} на возрасте ${safeFocusAge}: (${somaticState.data.selectedBaseDigit} + ${safeFocusAge}) % 10 = ${focusedSomaticSeriesValue?.digit ?? "—"}.`,
                  formula: `(${somaticState.data.selectedBaseDigit} + ${safeFocusAge}) % 10 = ${focusedSomaticSeriesValue?.digit ?? "—"}`
                },
                {
                  label: "4. Переводим цифру возраста в энергетический балл",
                  description: `Для той же серии ${focusedSomaticSeriesValue?.digit ?? "—"} -> ${focusedSomaticSeriesValue ? `${focusedSomaticSeriesValue.energyScore > 0 ? "+" : ""}${focusedSomaticSeriesValue.energyScore}` : "—"}.`,
                  formula: "0..4 => +1..+5; 5..9 => -1..-5"
                },
                {
                  label: "5. Любой возраст можно проверить двумя путями",
                  description: "Либо формулой выше, либо через книжную таблицу быстрой прокрутки и пошаговый разбор ниже по странице."
                }
              ]}
              title="Как проверить соматический возраст вручную"
            />
            <DecadeHeatTable rows={somaticState.data.tableRows} highlightedSeriesId={selectedSeriesId} />
          </section>

          <section className="section-block">
            <div className="section-block__header">
              <h2>Стартовая таблица 0-2 лет</h2>
              <p>
                Верхняя таблица книги связывает `10` серий со сферами жизни и системами здоровья, а затем показывает стартовые строки
                прокрутки для возраста `0`, `1`, `2`.
              </p>
            </div>
            <BookMethodGuide
              intro="Эта таблица нужна как стартовая опора для всего соматического блока: в ней человек видит, какие серии вообще участвуют в расчёте и какие значения стоят на первых трёх возрастах."
              pages={[134, 136]}
              steps={[
                {
                  label: "1. Нулевая строка берётся из базовых соматических цифр",
                  description: `Для выбранной серии ${selectedSeries.id} в 0 лет стоит ${somaticState.data.diagram.baseDigits[selectedSeries.id]}.`
                },
                {
                  label: "2. Строки 1 и 2 года получаются обычной прокруткой по модулю 10",
                  description: `Для той же серии: 1 год -> ${somaticState.data.primerRows[1]?.cells[selectedSeries.id]?.digit ?? "—"}, 2 года -> ${somaticState.data.primerRows[2]?.cells[selectedSeries.id]?.digit ?? "—"}.`
                },
                {
                  label: "3. Эти же серии потом живут во всех следующих диаграммах",
                  description: "То есть таблица 0-2 лет не отдельная механика, а просто первые строки общей соматической прокрутки."
                }
              ]}
              title="Как проверить стартовую таблицу вручную"
            />
            <SomaticPrimerTable rows={somaticState.data.primerRows} series={knowledgeBase.somaticSeries} selectedSeriesId={selectedSeriesId} />
          </section>

          <section className="section-block">
            <div className="section-block__header">
              <h2>Книжный график выбранного возраста</h2>
              <p>
                Стандартный шаблон страницы {`154`}: выбранный возраст показывается одной ломаной сразу по системам, а справа идут
                книжные смысловые полосы значений.
              </p>
            </div>
            <BookMethodGuide
              intro="Этот график полностью проверяется по одной строке возраста: берём цифры всех 10 серий на выбранный год и переносим их на ось книги в специальном порядке."
              pages={[154]}
              steps={[
                {
                  label: "1. Берём одну возрастную строку",
                  description: `Сейчас это возраст ${somaticState.data.standardGraph.age}.`
                },
                {
                  label: "2. Ось книги не идёт по порядку 0-9",
                  description: `Используется порядок ${somaticState.data.standardGraph.axisOrder.join("-")}.`
                },
                {
                  label: "3. Каждая серия ставится на ось по своей цифре возраста",
                  description: `Например, серия ${somaticState.data.standardGraph.columns[0]?.seriesId} имеет цифру ${somaticState.data.standardGraph.columns[0]?.digit ?? "—"}, а серия ${somaticState.data.standardGraph.columns[1]?.seriesId} — ${somaticState.data.standardGraph.columns[1]?.digit ?? "—"}.`
                },
                {
                  label: "4. Ломаная соединяет уже нанесённые позиции серий",
                  description: "То есть график не вычисляет новую производную величину, а просто собирает строку возраста в книжный шаблон."
                },
                {
                  label: "5. Правые смысловые полосы не считают цифры, а интерпретируют зоны",
                  description: "Их нужно читать только после того, как возрастная линия уже построена."
                }
              ]}
              title="Как проверить стандартный возрастной график вручную"
            />
            <SomaticStandardGraphBook view={somaticState.data.standardGraph} />
          </section>

          <section className="section-block">
            <div className="section-block__header">
              <h2>5. Возрастные графики и круговые схемы</h2>
              <p>
                Один и тот же столбец соматической таблицы книга показывает как полосовой график, круговую схему и возрастной круговой срез.
                Серию можно переключать сверху или карточками срезов ниже.
              </p>
            </div>
            <BookMethodGuide
              intro="Здесь три вида графики строятся из одного и того же ряда по выбранной серии. Проверка простая: если ряд цифр совпал, все три картинки обязаны совпасть по форме."
              pages={[148, 152]}
              steps={[
                {
                  label: "1. Выбираем одну серию",
                  description: `${selectedSeries.id}. ${selectedSeries.sphereName} / ${selectedSeries.healthName}.`
                },
                {
                  label: "2. Берём её десятилетний ряд цифр",
                  description: `${somaticState.data.selectedTrajectory.points.map((point) => point.digit).join(" -> ")}.`
                },
                {
                  label: "3. Полосовой график просто показывает этот ряд по годам",
                  description: `Начало текущего ряда: ${somaticState.data.selectedTrajectory.points[0]?.age ?? "—"} лет -> ${somaticState.data.selectedTrajectory.points[0]?.digit ?? "—"}, затем ${somaticState.data.selectedTrajectory.points[1]?.age ?? "—"} лет -> ${somaticState.data.selectedTrajectory.points[1]?.digit ?? "—"}.`
                },
                {
                  label: "4. Круговая схема берёт тот же ряд, но раскладывает его по окружности",
                  description: "Проверять надо не по красоте круга, а по тому, что набор цифр и возрастов совпадает с полосовым графиком."
                },
                {
                  label: "5. Возрастной круговой срез — это тот же снимок возраста, но сразу по всем сериям",
                  description: "Поэтому он должен согласовываться и с текущей строкой возраста, и с выбранной серией."
                }
              ]}
              title="Как проверить возрастные графики вручную"
            />
            <div className="section-grid section-grid--three">
              <SomaticBookStripChart trajectory={somaticState.data.selectedTrajectory} title={`${selectedSeries.sphereName} · ${selectedSeries.healthName}`} />
              <SomaticBookPolarChart trajectory={somaticState.data.selectedTrajectory} title={`Круговая схема: ${selectedSeries.sphereName}`} />
              <SomaticWheel snapshot={somaticState.data.focusSnapshot} />
            </div>
          </section>

          <section className="section-block">
            <div className="section-block__header">
              <h2>6. Срез энергограмм по системам</h2>
              <p>
                В книге этот блок строится как отдельная радиальная диаграмма для каждого столбца соматической таблицы. Текущая фокусная
                серия подсвечена в таблице выше, а ниже можно быстро переключать системы без пересчёта всей декады.
              </p>
            </div>
            <BookMethodGuide
              intro="Срез энергограммы должен проверяться по двум вещам: верхней десятилетней таблице выбранной серии и той же десятилетней траектории, перенесённой в круг."
              pages={[152, 161]}
              steps={[
                {
                  label: "1. Берём выделенную серию из общей таблицы",
                  description: `Сейчас это ${selectedSeries.id}. ${selectedSeries.sphereName} / ${selectedSeries.healthName}.`
                },
                {
                  label: "2. Выписываем её цифры на десятилетии",
                  description: selectedSliceEntry
                    ? selectedSliceEntry.trajectory.points.map((point) => `${point.age}:${point.digit}`).join(" · ")
                    : "Серия не найдена."
                },
                {
                  label: "3. Верхняя таблица в этом блоке обязана повторять те же цифры",
                  description: "Это просто компактный книжный срез по выбранному столбцу, а не отдельный расчёт."
                },
                {
                  label: "4. Круг снизу строится из тех же возрастов и тех же цифр",
                  description: "Если вручную сверить десятилетний ряд, круг автоматически проверяется по тем же точкам."
                },
                {
                  label: "5. Переключение серии не должно менять десятилетие, только выбранный столбец",
                  description: "Именно поэтому ниже можно быстро листать весь атлас без пересчёта всей диаграммы."
                }
              ]}
              title="Как проверить срез энергограммы вручную"
            />
            <SomaticSliceDiagramBook
              rows={somaticState.data.tableRows}
              trajectory={somaticState.data.selectedTrajectory}
              selectedSeriesId={selectedSeriesId}
              title={`Срез энергограммы: ${selectedSeries.sphereName} / ${selectedSeries.healthName}`}
            />
            <div className="slice-atlas">
              {somaticState.data.sliceAtlas.map((entry) => (
                <SliceAtlasCard
                  entry={entry}
                  key={`slice-atlas-${entry.seriesId}`}
                  onSelect={setSelectedSeriesId}
                  selected={entry.seriesId === selectedSeriesId}
                />
              ))}
            </div>
          </section>

          <section className="section-block">
            <div className="section-block__header">
              <h2>Книжный атлас графиков по системам</h2>
              <p>
                Страницы {`153-161`} повторяют один и тот же шаблон для разных систем организма. Здесь он строится сразу для всех серий
                текущего десятилетия, без ручного перелистывания.
              </p>
            </div>
            <div className="slice-diagram-atlas">
              {somaticState.data.sliceAtlas.map((entry) => (
                <SomaticSliceDiagramBook
                  key={`slice-book-atlas-${entry.seriesId}`}
                  rows={somaticState.data!.tableRows}
                  trajectory={entry.trajectory}
                  selectedSeriesId={entry.seriesId}
                  title={`${entry.sphereName} / ${entry.healthName}`}
                />
              ))}
            </div>
          </section>

          <section className="section-block">
            <div className="section-block__header">
              <h2>7. Межзонье</h2>
              <p>
                Разворачиваю в месяцы только те годовые сомы выбранной серии, которые проходят и через положительную, и через отрицательную
                зоны. Начало каждой сомы берётся от месяца рождения.
              </p>
            </div>
            <BookMethodGuide
              intro="Проверка межзонья руками строится от годовой линии: сначала ищем только переходы между плюсом и минусом, потом разворачиваем их на 12 месяцев от месяца рождения."
              pages={[130, 133]}
              steps={[
                {
                  label: "1. Берём одну серию и её годовые значения",
                  description: `Сейчас выбрана серия ${selectedSeries.id}: ${selectedSeries.sphereName} / ${selectedSeries.healthName}.`
                },
                {
                  label: "2. Ищем только те соседние годы, где меняется зона",
                  description: firstInterzoneSegment
                    ? `Первый найденный переход: ${firstInterzoneSegment.ageFrom}-${firstInterzoneSegment.ageTo} лет, цифры ${firstInterzoneSegment.startDigit} -> ${firstInterzoneSegment.endDigit}.`
                    : "На выбранном десятилетии таких переходов нет, поэтому межзонье не строится."
                },
                {
                  label: "3. Старт межзонной сомы всегда идёт от месяца рождения",
                  description: `Для даты ${normalizedBirthDate} стартовым месяцем будет ${String(parseBirthDateParts(normalizedBirthDate).month).padStart(2, "0")}.`
                },
                {
                  label: "4. Раздвигаем эту сому на 12 месяцев",
                  description: firstInterzoneSegment
                    ? `Для первого перехода книга даёт пересечение около ${firstInterzoneSegment.crossing?.lowerMonthLabel ?? "—"}/${firstInterzoneSegment.crossing?.upperMonthLabel ?? "—"}.`
                    : "Когда переходов нет, раздвигать нечего."
                },
                {
                  label: "5. Проверяем направление линии отдельно от зоны",
                  description: "В книге важно не только где плюс и минус, но и идёт линия вверх, вниз или горизонтально. Это толкование берётся уже после месячной раздвижки и выбора строки в книжной таблице ниже."
                }
              ]}
              title="Как проверить межзонье вручную"
            />
            {somaticState.data.interzoneSegments.length > 0 ? (
              <>
                <Suspense fallback={<div className="note-card note-card--single">Загружаю книжный обзор межзонья…</div>}>
                  <LazyInterzoneBookOverviewChart
                    overview={somaticState.data.interzoneOverview}
                    seriesLabel={`${selectedSeries.sphereName} / ${selectedSeries.healthName}`}
                  />
                </Suspense>
                <Suspense fallback={<div className="note-card note-card--single">Загружаю книжную таблицу трактовок…</div>}>
                  <LazyInterzoneInterpretationTable reference={knowledgeBase.interzoneReference} />
                </Suspense>
                <Suspense fallback={<div className="note-card note-card--single">Загружаю сводную таблицу межзонья…</div>}>
                  <LazyInterzoneSummaryTable segments={somaticState.data.interzoneSegments} />
                </Suspense>
                <div className="interzone-book-plate-list">
                  {somaticState.data.interzoneSegments.map((segment) => (
                    <Suspense key={`interzone-${segment.segmentIndex}`} fallback={<div className="note-card note-card--single">Загружаю книжную plate-сому…</div>}>
                      <LazyInterzoneSegmentChart
                        segment={segment}
                        trajectory={somaticState.data!.selectedTrajectory}
                        interpretation={knowledgeBase.interzoneReference.rows.find((row) => row.direction === segment.direction) ?? null}
                      />
                    </Suspense>
                  ))}
                </div>
              </>
            ) : (
              <div className="note-card note-card--single">
                У выбранной серии на этом десятилетии межзонных сом нет: переходы не пересекают границу между положительной и отрицательной зонами.
              </div>
            )}
          </section>

          <section className="section-block">
            <div className="section-block__header">
              <h2>Книжная таблица прокрутки 0-100 лет</h2>
              <p>
                Это справочная матрица со страниц {`134-139`}: вместо ручной прокрутки можно взять цифру серии в нулевом году и найти её
                значение на нужном возрасте.
              </p>
            </div>
            <BookMethodGuide
              intro="Эта таблица нужна именно для ручной работы по книге: знаешь базовую цифру серии — сразу находишь её значение на нужном возрасте без полного пересчёта."
              pages={[134, 139]}
              steps={[
                {
                  label: "1. Берём базовую цифру серии в 0 лет",
                  description: `Для выбранной серии ${selectedSeries.id} базовая цифра = ${somaticState.data.selectedBaseDigit}.`
                },
                {
                  label: "2. Открываем строку нужного возраста",
                  description: `Сейчас это возраст ${somaticState.data.focusSnapshot.age}.`
                },
                {
                  label: "3. На пересечении возраста и базовой цифры читаем результат",
                  description: `Книга даст ${selectedQuickRollStep?.resultDigit ?? "—"} для серии ${selectedSeries.id}.`
                },
                {
                  label: "4. Сверяем с прямой прокруткой",
                  description: `Это должно совпасть с тем, что уже посчитано в соматической строке возраста: ${focusedSomaticSeriesValue?.digit ?? "—"}.`
                }
              ]}
              title="Как пользоваться таблицей 0-100 вручную"
            />
            <SomaticQuickRollTable
              rows={somaticState.data.quickRollRows}
              selectedAge={somaticState.data.focusSnapshot.age}
              selectedBaseDigit={somaticState.data.selectedBaseDigit}
              selectedSeriesLabel={`${selectedSeries.sphereName} / ${selectedSeries.healthName}`}
            />
          </section>

          <section className="section-block">
            <div className="section-block__header">
              <h2>Как книга получает строку выбранного возраста</h2>
              <p>
                Это шаблон страниц {`147-150`}: берём строку `0 лет`, затем в справочной строке выбранного возраста ищем каждую базовую
                цифру и сразу получаем готовую строку возраста по всем системам.
              </p>
            </div>
            <BookMethodGuide
              intro="Это уже чистая ручная техника книги: от строки 0 лет и справочной строки возраста получаем всю строку выбранного года без новых формул."
              pages={[147, 150]}
              steps={[
                {
                  label: "1. Смотрим строку 0 лет",
                  description: `Для выбранной серии ${selectedSeries.id} источник = ${selectedQuickRollStep?.sourceDigit ?? "—"}.`
                },
                {
                  label: "2. Открываем справочную строку возраста",
                  description: `Для возраста ${somaticState.data.quickRollDerivation.targetAge} нужная строка уже показана ниже в книжном порядке ${somaticState.data.quickRollDerivation.lookupOrder.join("-")}.`
                },
                {
                  label: "3. Находим в ней исходную цифру серии",
                  description: `Для серии ${selectedSeries.id}: ${selectedQuickRollStep?.sourceDigit ?? "—"} -> ${selectedQuickRollStep?.resultDigit ?? "—"}.`
                },
                {
                  label: "4. Повторяем то же для всех 10 серий",
                  description: "Так получается полная строка возраста без пересчёта каждой серии отдельно."
                },
                {
                  label: "5. Сверяем итог со строкой соматической таблицы сверху",
                  description: "Обе строки обязаны совпасть, потому что это два способа получить один и тот же возраст."
                }
              ]}
              title="Как проверить получение строки возраста вручную"
            />
            <SomaticQuickRollExplainBook derivation={somaticState.data.quickRollDerivation} selectedSeriesId={selectedSeriesId} />
          </section>

          <section className="section-block">
            <div className="section-block__header">
              <h2>Корневой цикл и вставные блоки</h2>
              <p>
                По страницам {`146-149`} книга связывает годовые графики через корень очередного года и отдельно показывает повторение
                возраста по модулю `10`.
              </p>
            </div>
            <BookMethodGuide
              intro="Этот блок должен проверяться по очень простой арифметике: корень даты каждый год сдвигается на единицу по кругу 0..9, а между годами вставляется корень следующего года."
              pages={[146, 149]}
              steps={[
                {
                  label: "1. Берём корень даты как нулевую точку",
                  description: `Для ${normalizedBirthDate} корень = ${somaticState.data.diagram.baseDigits[0]}.`
                },
                {
                  label: "2. Каждый следующий год сдвигаем корень на 1",
                  description: `Например: 0 лет -> ${somaticState.data.rootCycleStates[0]?.rootDigit}, 1 год -> ${somaticState.data.rootCycleStates[1]?.rootDigit}, 2 года -> ${somaticState.data.rootCycleStates[2]?.rootDigit}.`,
                  formula: `(${somaticState.data.diagram.baseDigits[0]} + возраст) % 10`
                },
                {
                  label: "3. Повторы по остаткам идут каждые 10 лет",
                  description: `Возраст ${safeFocusAge} попадает в остаток ${safeFocusAge % 10}, поэтому стоит в той же группе, что и ${somaticState.data.rootRepeatGroups[safeFocusAge % 10]?.ages.slice(0, 4).join(", ") ?? "—"}.`
                },
                {
                  label: "4. Между годовыми строками вставляем корень следующего года",
                  description: `В текущем фрагменте переходы идут так: ${somaticState.data.insertedBlockTimeline.years.map((year) => `${year.age}->${year.transitionToNext?.digit ?? "—"}`).join(" · ")}.`
                },
                {
                  label: "5. Текущий экран показывает упрощённый проверяемый слой",
                  description: "Он подходит для ручной проверки корневого перехода, но полная тема вставных сом ещё отдельно добивается до книги."
                }
              ]}
              title="Как проверить корневой цикл вручную"
            />
            <div className="section-grid section-grid--two">
              <InsertedBlockTimelineChart
                timeline={somaticState.data.insertedBlockTimeline}
                title={`Упрощённый переход ${safeDecadeStart}-${safeDecadeStart + 2} лет`}
              />
              <RootRepeatTable groups={somaticState.data.rootRepeatGroups} highlightedAge={somaticState.data.focusSnapshot.age} />
            </div>
            <InsertedBlockReferenceTable timeline={somaticState.data.insertedBlockTimeline} />
          </section>

          <section className="section-block">
            <div className="section-block__header">
              <h2>Корневые синусы и полярная схема</h2>
              <p>
                По страницам {`155-156`} корень можно показывать как непрерывную волну на всей возрастной оси и как полярную схему по
                остаткам `0..9`, потому что каждые `10` лет позиции повторяются.
              </p>
            </div>
            <div className="section-grid section-grid--two">
              <RootCycleWaveChart
                states={somaticState.data.rootCycleStates}
                highlightedAge={somaticState.data.focusSnapshot.age}
                title={`Корневой синус ${somaticState.data.diagram.baseDigits[0]} · 0-100 лет`}
              />
              <RootRepeatPolarChart
                points={somaticState.data.rootPolarPoints}
                highlightedAge={somaticState.data.focusSnapshot.age}
                title="Полярная схема остатков 0-9"
              />
            </div>
          </section>

          <section className="section-block">
            <div className="section-block__header">
              <h2>10. Активация сот на выбранный возраст</h2>
              <p>Возраст {somaticState.data.focusSnapshot.age}: включения сот считаются напрямую из окрашенных домов соматической диаграммы.</p>
            </div>
            <BookMethodGuide
              intro="Этот блок позволяет вручную проверить базовую активацию сот: смотрим цифры домов, отмечаем окрашенные и сразу видим, какая сота включилась."
              pages={[175, 214]}
              steps={[
                {
                  label: "1. Берём цифры домов на выбранном возрасте",
                  description: `Сейчас выбран возраст ${somaticState.data.focusSnapshot.age}. Для любой соты берутся цифры её домов прямо из соматической диаграммы этого возраста.`
                },
                {
                  label: "2. Считаем окрашенными дома с цифрами 5-9",
                  description: "В текущем проверяемом слое цветной дом = отрицательная зона соматики."
                },
                {
                  label: "3. Если в соте есть хотя бы один окрашенный дом, сота активна",
                  description: activeSotaNames.length > 0
                    ? `Сейчас активны: ${activeSotaNames.join(", ")}.`
                    : "Сейчас ни одна сота не активна."
                },
                {
                  label: "4. Проверяем это по домам внутри карточки соты",
                  description: "Под каждой сотой ниже уже показаны её дома и текущие цифры, поэтому ручная сверка идёт без скрытых вычислений."
                },
                {
                  label: "5. Это пока именно базовая активация, а не весь модуль сот болезней",
                  description: "Полные книжные опасные периоды и логика “шариков” ещё должны быть дожаты отдельно."
                }
              ]}
              title="Как проверить активацию сот вручную"
            />
            <SotaStateCards age={somaticState.data.focusSnapshot.age} states={somaticState.data.focusSotas} />
          </section>
        </>
      ) : null}

      {lifetimeState.data ? (
        <section className="section-block">
          <div className="section-block__header">
            <h2>8. Диаграмма соматического состояния на всю жизнь</h2>
            <p>
              Здесь строится родовая тень по имени и фамилии, при необходимости добавляется вторая тень после смены фамилии, затем обе
              линии накладываются друг на друга и дают итоговые типы жизненных периодов.
            </p>
          </div>
          <BookMethodGuide
            intro="Этот блок особенно важен для ручной проверки: пользователь должен видеть перевод ФИО в арканы, шаг тени и логику разметки возрастов."
            pages={getModulePages("lifetime-shadow-diagram")}
            steps={[
              {
                label: "1. Переводим имя и фамилии в арканы",
                description: `Имя ${lifetimeState.data.result.nameBreakdown.normalized} -> ${lifetimeState.data.result.nameBreakdown.arcana}; родовая фамилия ${lifetimeState.data.result.birthSurnameBreakdown.normalized} -> ${lifetimeState.data.result.birthSurnameBreakdown.arcana}${lifetimeState.data.result.currentSurnameBreakdown ? `; новая фамилия ${lifetimeState.data.result.currentSurnameBreakdown.normalized} -> ${lifetimeState.data.result.currentSurnameBreakdown.arcana}` : ""}.`
              },
              {
                label: "2. Считаем шаг родовой тени",
                description: `Тр = |${lifetimeState.data.result.birthSurnameBreakdown.arcana} - ${lifetimeState.data.result.nameBreakdown.arcana}| = ${lifetimeState.data.result.birthShadowStep}.`,
                formula: `Тр = |${lifetimeState.data.result.birthSurnameBreakdown.arcana} - ${lifetimeState.data.result.nameBreakdown.arcana}| = ${lifetimeState.data.result.birthShadowStep}`
              },
              {
                label: "3. Размечаем родовую тень по возрастам",
                description: `Первая полоса всегда стартует в отрицательной I соте. Первый интервал сейчас: ${lifetimeState.data.result.birthSegments[0]?.ageFrom}-${lifetimeState.data.result.birthSegments[0]?.ageTo} лет, ${lifetimeState.data.result.birthSegments[0]?.meaning}.`
              },
              {
                label: "4. При смене фамилии запускаем вторую тень",
                description: lifetimeState.data.result.currentSurnameBreakdown && lifetimeState.data.result.currentShadowStep !== null && lifetimeState.data.result.surnameChangeAge !== null
                  ? `Тн = |${lifetimeState.data.result.birthSurnameBreakdown.arcana} - ${lifetimeState.data.result.currentSurnameBreakdown.arcana}| = ${lifetimeState.data.result.currentShadowStep}, старт в ${lifetimeState.data.result.surnameChangeAge} лет из активной в этот год соты.`
                  : "Новая фамилия не указана, поэтому строится только родовая тень."
              },
              {
                label: "5. Наложением теней получаем тип периода",
                description: "Итоговая таблица ниже уже показывает, где книга считает период особо неблагоприятным, сложным, депрессивным, благоприятным или особо благоприятным."
              }
            ]}
            title="Как проверить lifetime-диаграмму вручную"
          />
          <div className="section-grid section-grid--three">
            <NameArcanaCard breakdown={lifetimeState.data.result.nameBreakdown} onSelectArcana={handleArcanaReferenceJump} selectedArcana={selectedArcanaReference} title="Имя" />
            <NameArcanaCard
              breakdown={lifetimeState.data.result.birthSurnameBreakdown}
              onSelectArcana={handleArcanaReferenceJump}
              selectedArcana={selectedArcanaReference}
              title="Родовая фамилия"
            />
            {lifetimeState.data.result.currentSurnameBreakdown ? (
              <NameArcanaCard
                breakdown={lifetimeState.data.result.currentSurnameBreakdown}
                onSelectArcana={handleArcanaReferenceJump}
                selectedArcana={selectedArcanaReference}
                title="Новая фамилия"
              />
            ) : (
              <div className="note-card note-card--single">
                Новая фамилия не указана. В этом режиме книга даёт только родовую тень и два типа периодов: благоприятный и неблагоприятный.
              </div>
            )}
          </div>
          <div className="section-grid section-grid--three">
            <div className="note-card">
              <strong>Тень по родовой фамилии</strong>
              <p>
                `Тр = |{lifetimeState.data.result.birthSurnameBreakdown.arcana} - {lifetimeState.data.result.nameBreakdown.arcana}| ={" "}
                {lifetimeState.data.result.birthShadowStep}`
              </p>
            </div>
            <div className="note-card">
              <strong>Тень по новой фамилии</strong>
              <p>
                {lifetimeState.data.result.currentSurnameBreakdown && lifetimeState.data.result.currentShadowStep !== null
                  ? `Тн = |${lifetimeState.data.result.birthSurnameBreakdown.arcana} - ${lifetimeState.data.result.currentSurnameBreakdown.arcana}| = ${lifetimeState.data.result.currentShadowStep}`
                  : "Вторая тень не строится, пока новая фамилия не указана."}
              </p>
            </div>
            <div className="note-card">
              <strong>Старт второй тени</strong>
              <p>
                {lifetimeState.data.result.surnameChangeAge !== null
                  ? `Возраст ${lifetimeState.data.result.surnameChangeAge}. Первая тень новой фамилии всегда положительная и стартует из активной в этот год соты родовой тени.`
                  : "Если фамилия менялась, здесь будет показан возраст запуска второй тени."}
              </p>
            </div>
          </div>
          <div className="section-grid section-grid--two">
            <LifetimeShadowRangesTable
              segments={lifetimeState.data.ranges.birthSegments}
              subtitle="Отрицательный старт, шаг равен Тр."
              title="Родовая тень"
            />
            <LifetimeShadowRangesTable
              segments={lifetimeState.data.ranges.currentSegments}
              subtitle="Положительный старт с возраста смены фамилии."
              title="Новая фамилия"
            />
          </div>
          <LifetimeShadowChart
            maxAge={lifetimeState.data.result.yearStates[lifetimeState.data.result.yearStates.length - 1]?.age ?? 100}
            strips={lifetimeState.data.bookStrips}
          />
          <LifetimeSummaryTable rows={lifetimeState.data.summaryRows} />
          {lifetimeState.data.result.notes.length > 0 ? (
            <div className="note-grid">
              {lifetimeState.data.result.notes.map((note) => (
                <div className="note-card" key={note}>
                  <strong>Примечание</strong>
                  <p>{note}</p>
                </div>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {diseaseHoneycombState.data ? (
        <section className="section-block">
          <div className="section-block__header">
            <h2>Соты болезней: опасные годы</h2>
            <p>
              Этот блок связывает lifetime-периоды и соматическую диаграмму: сначала берём {diseaseHoneycombState.data.candidateLabel.toLowerCase()},
              потом проверяем, активируется ли соответствующая сота по домам. Источник опасности для этого режима:{" "}
              {diseaseHoneycombState.data.candidateDefinition.toLowerCase()}.
            </p>
          </div>
          <BookMethodGuide
            intro="Здесь уже появляется rule-engine книги: одного опасного года недостаточно, нужно ещё подтвердить его активацией соты через связанные дома."
            pages={getModulePages("disease-honeycomb")}
            steps={[
              {
                label: "1. Берём опасные годы из lifetime-диаграммы",
                description: diseaseHoneycombCandidateText
              },
              {
                label: "2. Разбиваем их по сотам",
                description: diseaseHoneycombSplitText
              },
              {
                label: "3. Для каждой соты проверяем её дома на этих годах",
                description: "Если хотя бы один дом соты получил цифру 5-9, ячейка считается окрашенной и сота активируется."
              },
              {
                label: "4. Оставляем только подтверждённые годы",
                description: diseaseHoneycombConfirmedText
              },
              {
                label: "5. Исключённые годы не считаем подтверждённым риском",
                description: diseaseHoneycombExcludedText
              }
            ]}
            title="Как проверить соты болезней вручную"
          />
          <div className="note-grid">
            {diseaseHoneycombState.data.notes.map((note) => (
              <div className="note-card" key={note}>
                <strong>Правило книги</strong>
                <p>{note}</p>
              </div>
            ))}
          </div>
          <div className="note-card note-card--single note-card--action">
            <strong>Связка с соматическим блоком</strong>
            <p>
              Нажмите на возраст в карточке дома или на сам шарик ниже, и сайт автоматически откроет этот возраст и нужный дом в
              соматической таблице, графиках и срезах.
            </p>
          </div>
          {diseaseHoneycombState.data.rows.length > 0 ? (
            <>
              <DiseaseHoneycombTable
                candidateLabel={diseaseHoneycombState.data.candidateLabel}
                rows={diseaseHoneycombState.data.rows}
              />
              {diseaseHoneycombBookState.data ? (
                <Suspense fallback={<div className="note-card note-card--single">Загружаю книжные круговые схемы сот болезней…</div>}>
                  <LazyDiseaseHoneycombBookPlates view={diseaseHoneycombBookState.data} />
                </Suspense>
              ) : null}
              <DiseaseHoneycombFocusBoard
                rows={diseaseHoneycombState.data.rows}
                onDrillDown={handleSomaticDrilldown}
                onSelectSota={handleSotaReferenceJump}
              />
              {diseaseHoneycombArcanaState.data && diseaseHoneycombArcanaState.data.rows.length > 0 ? (
                <>
                  <BookMethodGuide
                    intro="После подтверждения опасного года книга рекомендует перейти к временной ячейке каркаса сот, проверить её аркан, сравнить его с СМ и при поздней диагностике посмотреть предыдущую ячейку."
                    pages={getModulePages("honeycomb-frame")}
                    steps={[
                      {
                        label: "1. Находим временную ячейку соты",
                        description: diseaseArcanaMappingText
                      },
                      {
                        label: "2. Ищем органы-мишени для аркана ячейки",
                        description: "Каждый аркан в одной из пяти основных сот становится мишенью для болезни. ОЛ сюда не относится."
                      },
                      {
                        label: "3. Сверяем усилители риска",
                        description: diseaseArcanaFlagText
                      },
                      {
                        label: "4. При тяжёлой стадии проверяем предыдущую ячейку",
                        description: "Книга отдельно пишет, что поздно обнаруженная патология могла появиться ещё в предыдущем временном диапазоне."
                      }
                    ]}
                    title="Как связать опасный год с арканом-мишенью"
                  />
                  <div className="note-card note-card--single note-card--action">
                    <strong>Связка с атласом арканов</strong>
                    <p>
                      Нажмите на аркан в карточке ниже, и сайт откроет его органы-мишени, урок болезни и ошибки лечения в общем
                      арканном атласе. Кнопка соты рядом откроет её системы и органы из главы `190-214`.
                    </p>
                  </div>
                  <DiseaseHoneycombArcanaBoard
                    onFocusArcana={handleArcanaReferenceFocus}
                    notes={diseaseHoneycombArcanaState.data.notes}
                    onSelectArcana={handleArcanaReferenceJump}
                    onFocusSota={handleSotaReferenceFocus}
                    onSelectSota={handleSotaReferenceJump}
                    rows={diseaseHoneycombArcanaState.data.rows}
                    selectedArcana={selectedArcanaReference}
                    selectedSotaId={selectedSotaAtlasId}
                  />
                </>
              ) : null}
              <DiseaseHoneycombCards rows={diseaseHoneycombState.data.rows} onDrillDown={handleSomaticDrilldown} />
            </>
          ) : (
            <div className="note-card note-card--single note-card--warning">
              Для текущего набора данных lifetime-диаграмма не дала опасных лет, которые нужно дополнительно проверять через соты
              болезней.
            </div>
          )}
        </section>
      ) : null}

      <section className="section-block" ref={sotaAtlasSectionRef}>
        <div className="section-block__header">
          <h2>Атлас сот: органы, системы и урок</h2>
          <p>
            Это reference-слой страниц `190-214`: что именно относится к каждой соте по здоровью и чему она учит по жизни. Его
            нужно читать вместе с опасными годами, а не отдельно от них.
          </p>
        </div>
        <SotaReferenceAtlas
          entries={knowledgeBase.sotaReferenceAtlas}
          focusContext={sotaAtlasFocusContext}
          onSelectSota={handleSotaReferenceJump}
          selectedSotaId={selectedSotaAtlasId}
        />
      </section>

      {honeycombState.data ? (
        <section className="section-block">
          <div className="section-block__header">
            <h2>9. Каркас сот</h2>
            <p>
              Этот блок собирает в одну схему ОПВ, КЧХ, ЭБ, Тр, СЗ, СМ и ОЛ. Здесь же видно слабое место защиты организма,
              органы-мишени по каждому аркану и факторы ошибки лечения.
            </p>
          </div>
          <BookMethodGuide
            intro="Каркас должен быть проверяемым вручную по формулам книги: сначала тоны, потом производные метрики, потом полярность и ошибки лечения."
            pages={getModulePages("honeycomb-frame")}
            steps={[
              {
                label: "1. Снимаем пять базовых тонов",
                description: `Дт=${honeycombState.data.result.dayTone.arcana}, Мт=${honeycombState.data.result.monthTone.arcana}, Гт=${honeycombState.data.result.yearTone.arcana}, Фт=${honeycombState.data.result.surnameTone.arcana}, Ит=${honeycombState.data.result.nameTone.arcana}.`
              },
              {
                label: "2. Считаем первые производные арканы",
                description: `ОПВ=${honeycombOpvRow?.arcana ?? "—"}, КЧХ=${honeycombKchRow?.arcana ?? "—"}, ЭБ=${honeycombEbRow?.arcana ?? "—"}, Тр=${honeycombTrRow?.arcana ?? "—"}.`,
                formula: [honeycombOpvRow, honeycombKchRow, honeycombEbRow, honeycombTrRow]
                  .filter(Boolean)
                  .map((row) => `${row!.label}: ${row!.formula} = ${row!.rawValue}`)
                  .join(" · ")
              },
              {
                label: "3. Считаем правую часть каркаса",
                description: `СЗ=${honeycombSzRow?.arcana ?? "—"}, СМ=${honeycombSmRow?.arcana ?? "—"}, ОЛ=${honeycombOlRow?.arcana ?? "—"}.`,
                formula: [honeycombSzRow, honeycombSmRow, honeycombOlRow]
                  .filter(Boolean)
                  .map((row) => `${row!.label}: ${row!.formula} = ${row!.rawValue}`)
                  .join(" · ")
              },
              {
                label: "4. Проверяем полярность и слабое место",
                description: `СМ сейчас даёт ${honeycombState.data.result.protectionPolarity === "masculine" ? "мужскую" : honeycombState.data.result.protectionPolarity === "feminine" ? "женскую" : "неопределённую"} полярность, а ослабляемые системы: ${honeycombState.data.result.weakenedSystems.join(", ") || "не определены"}.`
              },
              {
                label: "5. Привязываем фактор ошибки лечения",
                description: `Для ОЛ=${honeycombOlRow?.arcana ?? "—"} книга даёт фактор: ${honeycombState.data.result.treatmentMistakeFactor ?? "не найден"}.`
              }
            ]}
            title="Как проверить каркас сот вручную"
          />
          <div className="section-grid section-grid--two">
            <HoneycombFrameChart cells={honeycombState.data.chartCells} onSelectArcana={handleArcanaReferenceJump} selectedArcana={selectedArcanaReference} />
            <div className="chart-card">
              <div className="chart-card__header">
                <h3>Слабое место защиты и ошибки лечения</h3>
                <p>СМ делит каркас на мужской или женский сценарий уязвимости, а ОЛ подсказывает, что усиливает осложнения.</p>
              </div>
              <div className="note-grid note-grid--single-column">
                <div className="note-card">
                  <strong>
                    СМ ={" "}
                    <button className={`arcana-link-button arcana-link-button--inline ${selectedArcanaReference === honeycombState.data!.result.metrics.sm.arcana ? "arcana-link-button--selected" : ""}`} onClick={() => handleArcanaReferenceJump(honeycombState.data!.result.metrics.sm.arcana)} type="button">
                      {honeycombState.data!.result.metrics.sm.arcana}
                    </button>
                  </strong>
                  <p>
                    Полярность:{" "}
                    {honeycombState.data.result.protectionPolarity === "masculine"
                      ? "мужская"
                      : honeycombState.data.result.protectionPolarity === "feminine"
                        ? "женская"
                        : "не определена"}
                    .
                  </p>
                  <p>
                    Ослабляемые системы: {honeycombState.data.result.weakenedSystems.join(", ") || "книга не даёт разделения для этого аркана"}.
                  </p>
                  <p>{honeycombState.data.result.metrics.sm.targetHeading ?? "Заголовок органов-мишеней для СМ ещё не оцифрован."}</p>
                </div>
                <div className="note-card">
                  <strong>
                    ОЛ ={" "}
                    <button className={`arcana-link-button arcana-link-button--inline ${selectedArcanaReference === honeycombState.data!.result.metrics.ol.arcana ? "arcana-link-button--selected" : ""}`} onClick={() => handleArcanaReferenceJump(honeycombState.data!.result.metrics.ol.arcana)} type="button">
                      {honeycombState.data!.result.metrics.ol.arcana}
                    </button>
                  </strong>
                  <p>{honeycombState.data.result.treatmentMistakeFactor ?? "Для этого аркана фактор ошибки лечения ещё не оцифрован."}</p>
                </div>
                <div className="note-card">
                  <strong>Родовая тень для каркаса</strong>
                  <p>
                    Тр = |{honeycombState.data.result.surnameTone.arcana} - {honeycombState.data.result.nameTone.arcana}| ={" "}
                    <button className={`arcana-link-button arcana-link-button--inline ${selectedArcanaReference === honeycombState.data!.result.metrics.tr.arcana ? "arcana-link-button--selected" : ""}`} onClick={() => handleArcanaReferenceJump(honeycombState.data!.result.metrics.tr.arcana)} type="button">
                      {honeycombState.data!.result.metrics.tr.arcana}
                    </button>
                  </p>
                  <p>Именно этот аркан затем накладывается на возрастные периоды тени по родовой фамилии.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="section-grid section-grid--two">
              <div className="chart-card">
                <div className="chart-card__header">
                  <h3>Базовые тоны</h3>
                  <p>Промежуточные значения, из которых книга собирает весь каркас.</p>
                </div>
              <HoneycombToneTable rows={honeycombState.data.toneRows} onSelectArcana={handleArcanaReferenceJump} selectedArcana={selectedArcanaReference} />
              </div>
              <div className="chart-card">
                <div className="chart-card__header">
                  <h3>Таблица ячеек каркаса</h3>
                  <p>Каждая строка показывает формулу, сырой итог и заголовок органов-мишеней для полученного аркана.</p>
                </div>
              <HoneycombMetricTable rows={honeycombState.data.metricRows} onSelectArcana={handleArcanaReferenceJump} selectedArcana={selectedArcanaReference} />
              </div>
            </div>
          {lifetimeState.data ? (
            <div className="chart-card">
              <div className="chart-card__header">
                <h3>Периоды тени по родовой фамилии для каркаса</h3>
                <p>Хронологическая раскладка первой тени, которую книга затем наносит на каркас сот.</p>
              </div>
              <div className="honeycomb-periods">
                {lifetimeState.data.result.birthSegments
                  .filter((segment) => segment.ageFrom <= 90)
                  .slice(0, 10)
                  .map((segment) => (
                    <article className={`honeycomb-period ${segment.direction === "positive" ? "honeycomb-period--positive" : "honeycomb-period--negative"}`} key={`${segment.ageFrom}-${segment.ageTo}`}>
                      <strong>{segment.ageFrom}-{segment.ageTo}</strong>
                      <span>{segment.sotaId} сота · {segment.meaning}</span>
                      <span>{segment.direction === "positive" ? "Положительная" : "Отрицательная"}</span>
                    </article>
                  ))}
              </div>
            </div>
          ) : null}
          {honeycombState.data.result.notes.length > 0 ? (
            <div className="note-grid">
              {honeycombState.data.result.notes.map((note) => (
                <div className="note-card" key={note}>
                  <strong>Примечание</strong>
                  <p>{note}</p>
                </div>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="section-block" ref={arcanaAtlasSectionRef}>
        <div className="section-block__header">
          <h2>11. Справочник арканов здоровья</h2>
          <p>
            Этот атлас собирает в одном месте органы-мишени, подробные проявления аркана и урок болезни. Он нужен для
            интерпретационного слоя сайта поверх каркаса сот и будущих диагностических модулей.
          </p>
        </div>
        {showArcanaAtlas ? (
          <Suspense fallback={<div className="note-card note-card--single">Загружаю атлас арканов здоровья…</div>}>
            <LazyArcanaHealthAtlas
              focusContext={arcanaAtlasFocusContext}
              onResetFocus={handleArcanaFocusReset}
              profiles={knowledgeBase.arcanaHealthProfiles}
              selectedArcana={selectedArcanaReference}
              onSelect={handleArcanaAtlasSelect}
              currentMatches={currentArcanaMatches}
              targetHeading={selectedArcanaTargetHeading}
              treatmentMistakeFactor={selectedArcanaTreatmentMistake}
            />
          </Suspense>
        ) : (
          <div className="note-card note-card--single note-card--action">
            <strong>Справочник вынесен в ленивую загрузку</strong>
            <p>Большой атлас арканов не тянется в стартовый рендер. Открой его по кнопке или кликом по аркану из каркаса сот.</p>
            <button className="action-button" onClick={() => setShowArcanaAtlas(true)} type="button">
              Показать атлас арканов
            </button>
          </div>
        )}
      </section>

      {hourlyState.data || autoHourlyData ? (
        <section className="section-block">
          <div className="section-block__header">
            <h2>12. Суточный бионумерологический ритм</h2>
            <p>
              {isBookStrictBiorhythmMode
                ? "Сейчас включён строгий режим главы 3: графики строятся только из ручных восьмёрок и часов рождения, без внешней таблицы согласных."
                : "Сейчас включён вспомогательный режим по опубликованной таблице авторов: слева остаётся ручная книжная сверка, справа работает автосборка по полному ФИО, дате и часу рождения."}
            </p>
          </div>
          <BookMethodGuide
            intro={
              isBookStrictBiorhythmMode
                ? "Человек, читавший главу 3, должен суметь полностью повторить этот режим руками: базовая восьмёрка, два дополнительных прохода и привязка первой цифры к часу рождения."
                : "Во внешнем режиме ручная восьмёрка остаётся книжным эталоном, а автосборка по ФИО показывается рядом как отдельный вспомогательный расчёт."
            }
            pages={getModulePages("hourly-biorhythm")}
            steps={[
              {
                label: "1. Формируем базовую восьмёрку",
                description: !isBookStrictBiorhythmMode && autoHourlyData
                  ? `По ФИО ${autoHourlyData.normalizedFullName} берём согласные ${autoHourlyData.consonants.join("")} и получаем восьмёрку ${autoHourlyData.baseEightValues.join(", ")}.`
                  : `Сейчас ручная восьмёрка задаётся напрямую: ${hourlyState.data?.baseEightValues.join(", ") ?? "—"}.`
              },
              {
                label: "2. Прокручиваем её до 24 значений",
                description: `Книга требует два дополнительных прохода. Первые 12 значений сейчас: ${hourlyGuideResult?.expandedTwentyFourValues.slice(0, 12).join(", ") ?? "—"}.`
              },
              {
                label: "3. Привязываем первую цифру к часу рождения",
                description: `Стартовый час сейчас ${String(hourlyGuideBirthHour).padStart(2, "0")}:00. Дальше значения раскладываются по часам подряд.`
              },
              {
                label: "4. Считаем среднюю линию",
                description: `Средняя линия текущего графика = ${hourlyGuideResult?.averageLine ?? "—"}.`
              },
              {
                label: "5. Выделяем окна ниже и выше средней",
                description: "Только после этого книга разрешает интерпретировать пассивные и активные окна, а не по голым цифрам."
              }
            ]}
            title="Как проверить суточный ритм вручную"
          />
          <div className="section-grid section-grid--two">
            <div className="comparison-shell">
              <div className="comparison-shell__header">
                <h3>{isBookStrictBiorhythmMode ? "Первый график по книге" : "Ручной / эталонный режим"}</h3>
                <p>
                  {isBookStrictBiorhythmMode
                    ? "Этот график строится строго из первой ручной восьмёрки и часа рождения. Так книга и проверяется без внешних допущений."
                    : "Этот график строится из текущей восьмёрки в поле ввода. Так можно точно повторить напечатанный пример книги и сравнить его с автосборкой справа."}
                </p>
              </div>
              <div className="comparison-shell__content">
                {hourlyState.data ? (
                  <>
                    <HourlyRhythmChart
                      result={hourlyState.data}
                      title="Ручной график"
                      subtitle={`Восьмёрка: ${hourlyState.data.baseEightValues.join(", ")} · средняя линия ${hourlyState.data.averageLine}`}
                    />
                    <HourlyZoneTable result={hourlyState.data} />
                    {manualHourlyRecommendations ? <HourlyRecommendationWindows summary={manualHourlyRecommendations} /> : null}
                  </>
                ) : (
                  <div className="note-card note-card--warning">
                    <strong>Ручной режим пока недоступен</strong>
                    <p>Исправьте поле базовой восьмёрки или нажмите кнопку автоподстановки справа, чтобы сразу построить эталонный график.</p>
                  </div>
                )}
              </div>
            </div>
            {isBookStrictBiorhythmMode ? (
              <div className="comparison-shell">
                <div className="comparison-shell__header">
                  <h3>Второй график по книге</h3>
                  <p>Для наложения двух суточных графиков в строгом режиме введите вторую ручную восьмёрку и час рождения второго человека.</p>
                </div>
                <div className="comparison-shell__content">
                  {partnerHourlyData ? (
                    <>
                      <HourlyRhythmChart
                        result={partnerHourlyData}
                        title="Второй ручной график"
                        subtitle={`Восьмёрка: ${partnerHourlyData.baseEightValues.join(", ")} · средняя линия ${partnerHourlyData.averageLine}`}
                      />
                      <HourlyZoneTable result={partnerHourlyData} />
                      {partnerHourlyRecommendations ? <HourlyRecommendationWindows summary={partnerHourlyRecommendations} /> : null}
                    </>
                  ) : (
                    <div className="note-card note-card--warning">
                      <strong>Второй график пока не построен</strong>
                      <p>Введите вторую ручную восьмёрку, если хотите наложить два суточных графика строго по книге.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : autoHourlyData ? (
              <div className="comparison-shell">
                <div className="comparison-shell__header">
                  <h3>Авторасчёт по ФИО</h3>
                  <p>
                    {autoHourlyData.normalizedFullName}. Согласных: {autoHourlyData.consonants.join("")}. Автовосьмёрка:{" "}
                    {autoHourlyData.baseEightValues.join(", ")}.
                  </p>
                </div>
                <div className="comparison-shell__content">
                  <div className="note-grid note-grid--single-column">
                    <div className="note-card">
                      <strong>Автосборка восьмёрки</strong>
                      <p>
                        Дата: {autoHourlyData.birthDate}. Час рождения: {String(autoHourlyData.birthHour).padStart(2, "0")}:00.
                      </p>
                      <p>Если хочешь строить график именно по этой раскладке, можно одной кнопкой подставить её в ручной режим.</p>
                      <button className="action-button" type="button" onClick={() => setHourlyBaseInput(autoHourlyData.baseEightValues.join(", "))}>
                        Подставить авто-восьмёрку
                      </button>
                    </div>
                    {hourlyBaseMismatch ? (
                      <div className="note-card note-card--warning">
                        <strong>Есть расхождение</strong>
                        <p>
                          Ручная восьмёрка и автоматическая раскладка по ФИО не совпадают. Для главы 3 это ожидаемо: печатный пример Шапковой
                          конфликтует с прямой буквенной транскрипцией в двух столбцах.
                        </p>
                      </div>
                    ) : (
                      <div className="note-card">
                        <strong>Совпадение режимов</strong>
                        <p>Текущая ручная восьмёрка уже совпадает с автоматическим расчётом по ФИО.</p>
                      </div>
                    )}
                  </div>
                  <HourlyRhythmChart
                    result={autoHourlyData}
                    title="Автоматический график"
                    subtitle={`Автовосьмёрка: ${autoHourlyData.baseEightValues.join(", ")} · средняя линия ${autoHourlyData.averageLine}`}
                  />
                  <HourlyZoneTable result={autoHourlyData} />
                  {autoHourlyRecommendations ? <HourlyRecommendationWindows summary={autoHourlyRecommendations} /> : null}
                  <Suspense fallback={<div className="note-card note-card--single">Загружаю таблицу раскладки ФИО…</div>}>
                    <LazyBiorhythmConstructionTable
                      dateDigits={autoHourlyData.dateDigits}
                      consonantRows={autoHourlyData.consonantRows}
                      consonantValueRows={autoHourlyData.consonantValueRows}
                      baseEightValues={autoHourlyData.baseEightValues}
                    />
                  </Suspense>
                </div>
              </div>
            ) : (
              <div className="comparison-shell">
                <div className="comparison-shell__header">
                  <h3>Авторасчёт по ФИО</h3>
                  <p>Во внешнем режиме этот блок появится после ввода даты, полного ФИО и часа рождения.</p>
                </div>
                <div className="comparison-shell__content">
                  <div className="note-card note-card--warning">
                    <strong>Авторасчёт пока недоступен</strong>
                    <p>Заполните ФИО для авторасчёта, если нужен вспомогательный режим по опубликованной таблице авторов.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          {primaryCompatibilityHourlyData && partnerHourlyData && hourlyCompatibilitySummary ? (
            <>
              <div className="note-card note-card--single">
                <strong>{isBookStrictBiorhythmMode ? "Наложение двух ручных графиков" : "Пара для наложения графиков"}</strong>
                {isBookStrictBiorhythmMode ? (
                  <p>
                    Первый график: восьмёрка {hourlyState.data?.baseEightValues.join(", ") ?? "—"} · {String(safeBirthHour).padStart(2, "0")}:00.
                    Второй график: восьмёрка {partnerHourlyData.baseEightValues.join(", ")} · {String(safeSecondaryBirthHour).padStart(2, "0")}:00.
                  </p>
                ) : (
                  <p>
                    Первый человек: {autoHourlyData?.normalizedFullName ?? "—"} · {autoHourlyData?.birthDate ?? "—"} ·{" "}
                    {String(autoHourlyData?.birthHour ?? safeBirthHour).padStart(2, "0")}:00. Второй человек: {publishedPartnerHourlyData?.normalizedFullName ?? "—"} ·{" "}
                    {publishedPartnerHourlyData?.birthDate ?? "—"} · {String(publishedPartnerHourlyData?.birthHour ?? safeSecondaryBirthHour).padStart(2, "0")}:00.
                  </p>
                )}
              </div>
              <Suspense fallback={<div className="note-card note-card--single">Загружаю наложение двух биоритмов…</div>}>
                <LazyHourlyCompatibilityChart
                  primary={primaryCompatibilityHourlyData}
                  secondary={partnerHourlyData}
                  primaryLabel={isBookStrictBiorhythmMode ? "1-й ручной график" : "Первый график"}
                  secondaryLabel={isBookStrictBiorhythmMode ? "2-й ручной график" : "Второй график"}
                  summary={hourlyCompatibilitySummary}
                />
                <LazyHourlyCompatibilityWindows
                  primaryLabel={isBookStrictBiorhythmMode ? "1-й ручной" : "1-й график"}
                  secondaryLabel={isBookStrictBiorhythmMode ? "2-й ручной" : "2-й график"}
                  summary={hourlyCompatibilitySummary}
                />
              </Suspense>
            </>
          ) : isBookStrictBiorhythmMode && hourlyState.data && secondaryHourlyBaseValidation.status === "empty" ? (
            <div className="note-card note-card--single">
              Введите вторую ручную восьмёрку и час рождения второго человека, и сайт наложит два суточных графика друг на друга строго
              по книге.
            </div>
          ) : !isBookStrictBiorhythmMode && autoHourlyData && secondaryBiorhythmFullNameValidation.status === "empty" ? (
            <div className="note-card note-card--single">
              Заполни ФИО и час рождения второго человека, и сайт наложит два суточных графика друг на друга, выделив общие часы
              активности и пассивности по книге.
            </div>
          ) : null}
          <Suspense fallback={<div className="note-card note-card--single">Загружаю пояснения к суточному ритму…</div>}>
            <LazyHourlyGuidanceBoard />
          </Suspense>
          {showBiorhythmReference ? (
            <Suspense fallback={<div className="note-card note-card--single">Загружаю справочные таблицы главы 3…</div>}>
              <LazyBiorhythmReferenceBoard reference={hourlyReference} />
            </Suspense>
          ) : (
            <div className="note-card note-card--single note-card--action">
              <strong>Справочные таблицы сна вынесены отдельно</strong>
              <p>Крупный reference-блок загружается только по запросу, чтобы не тормозить стартовый экран расчётов.</p>
              <button className="action-button" onClick={() => setShowBiorhythmReference(true)} type="button">
                Показать таблицы сна и циркадных ритмов
              </button>
            </div>
          )}
        </section>
      ) : null}

      <section className="section-block section-block--notes">
        <div className="section-block__header">
          <h2>13. Покрытие книги и незакрытые пробелы</h2>
          <p>Эта панель нужна, чтобы дальше расширять сайт строго по книге и не прошивать в расчёты неподтверждённые куски методики.</p>
        </div>
        {showCoverage ? (
          <Suspense fallback={<div className="note-card note-card--single">Загружаю панель покрытия книги…</div>}>
            <LazyBookCoverageBoard />
          </Suspense>
        ) : (
          <div className="note-card note-card--single note-card--action">
            <strong>Панель покрытия книги вынесена из стартовой загрузки</strong>
            <p>Её удобно открывать по требованию, когда нужно проверять незакрытые пробелы и статус модулей.</p>
            <button className="action-button" onClick={() => setShowCoverage(true)} type="button">
              Показать покрытие книги
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
