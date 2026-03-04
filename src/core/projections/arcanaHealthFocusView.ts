import type { ArcanaHealthProfile } from "../../types/book";

export interface ArcanaHealthFocusInput {
  focusSystems: string[];
  targetHeading: string | null;
}

export interface ArcanaHealthFocusView {
  targetItems: string[];
  focusTargetItems: string[];
  matchedManifestations: string[];
}

function normalizeText(value: string): string {
  return value
    .toLocaleLowerCase("ru-RU")
    .replace(/ё/gu, "е")
    .replace(/[«»"']/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function getSystemTerms(system: string): string[] {
  const normalized = normalizeText(system);

  if (normalized === "жкт" || normalized.includes("пищевар")) {
    return ["жкт", "пищевар", "желуд", "киш", "печен", "желч", "поджелуд", "пищевод", "глот", "аппенд", "прямая киш"];
  }

  if (normalized.includes("мочевыдел") || normalized.includes("выделитель")) {
    return ["моч", "почки", "мочеточ", "уретр", "надпочеч"];
  }

  if (normalized.includes("нервно-псих")) {
    return ["нерв", "псих", "мозг", "сознани", "эмоци", "памят", "речь", "чувств"];
  }

  if (normalized.includes("нерв")) {
    return ["нерв", "мозг", "сознани", "памят", "речь"];
  }

  if (normalized.includes("псих")) {
    return ["псих", "эмоци", "сознани", "памят", "чувств", "речь"];
  }

  if (normalized.includes("костно") || normalized.includes("мышеч")) {
    return ["кость", "мышц", "сустав", "связк", "сухож", "хрящ", "позвоноч", "скелет"];
  }

  if (normalized.includes("дых")) {
    return ["дых", "бронх", "трах", "легк", "плевр", "гортан", "носоглот", "диафраг"];
  }

  if (normalized.includes("репродукт")) {
    return ["репродук", "матк", "яичник", "влагалищ", "шейка матки", "эндомет", "миомет", "проста", "семен", "уретр"];
  }

  if (normalized.includes("кровеносн") || normalized.includes("сердечно-кров")) {
    return ["сердц", "кров", "сосуд", "артер", "вен", "капил"];
  }

  if (normalized.includes("иммун")) {
    return ["иммун", "тимус", "лимф", "селез", "костный мозг", "миндал", "аденоид"];
  }

  if (normalized.includes("лимфат")) {
    return ["лимф", "лимфат", "узл", "проток", "ствол"];
  }

  if (normalized.includes("эндокрин")) {
    return ["эндокрин", "желез", "гормон", "гипоф", "щитовид", "поджелуд", "надпочеч", "яичник", "тимус", "шишковид"];
  }

  return [normalized];
}

function parseTargetItems(targetHeading: string | null): string[] {
  if (!targetHeading) {
    return [];
  }

  return targetHeading
    .split(/[,;]+/u)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function matchesAnyTerm(text: string, terms: string[]): boolean {
  const normalized = normalizeText(text);
  return terms.some((term) => normalized.includes(term));
}

export function buildArcanaHealthFocusView(
  profile: ArcanaHealthProfile,
  input: ArcanaHealthFocusInput
): ArcanaHealthFocusView {
  const targetItems = parseTargetItems(input.targetHeading);
  const focusTerms = Array.from(new Set(input.focusSystems.flatMap((system) => getSystemTerms(system))));
  const focusTargetItems = targetItems.filter((item) => matchesAnyTerm(item, focusTerms));
  const matchedManifestations = profile.manifestations.filter((manifestation) => matchesAnyTerm(manifestation, focusTerms));

  return {
    targetItems,
    focusTargetItems,
    matchedManifestations
  };
}
