import { arcanaTargetHeadingByArcana, treatmentMistakeByArcana } from "../../book/knowledgeBase";
import type { ArcanaHealthProfile } from "../../types/book";

export type ArcanaHealthSearchField =
  | "name"
  | "target_heading"
  | "manifestation"
  | "lesson"
  | "child_lesson"
  | "treatment_mistake";

export interface ArcanaHealthSearchMatch {
  field: ArcanaHealthSearchField;
  label: string;
  excerpt: string;
}

export interface ArcanaHealthSearchResult {
  arcana: number;
  displayLabel: string;
  name: string;
  score: number;
  matches: ArcanaHealthSearchMatch[];
}

function normalizeSearchText(value: string): string {
  return value
    .toLocaleLowerCase("ru-RU")
    .replace(/ё/gu, "е")
    .replace(/[«»"']/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function tokenizeQuery(value: string): string[] {
  return normalizeSearchText(value)
    .split(/[\s,.;:()/-]+/u)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function buildTokenVariants(token: string): string[] {
  const variants = new Set([token]);

  for (const trimLength of [1, 2, 3]) {
    const variant = token.slice(0, Math.max(4, token.length - trimLength));
    if (variant.length >= 4) {
      variants.add(variant);
    }
  }

  return [...variants];
}

function matchesQuery(text: string, normalizedQuery: string, tokens: string[]): boolean {
  const normalizedText = normalizeSearchText(text);
  if (normalizedText.length === 0) {
    return false;
  }

  if (normalizedQuery.length > 0 && normalizedText.includes(normalizedQuery)) {
    return true;
  }

  return tokens.every((token) => buildTokenVariants(token).some((variant) => normalizedText.includes(variant)));
}

function scoreField(baseScore: number, text: string, normalizedQuery: string): number {
  const normalizedText = normalizeSearchText(text);
  if (normalizedQuery.length > 0 && normalizedText === normalizedQuery) {
    return baseScore + 6;
  }

  if (normalizedQuery.length > 0 && normalizedText.startsWith(normalizedQuery)) {
    return baseScore + 4;
  }

  if (normalizedQuery.length > 0 && normalizedText.includes(normalizedQuery)) {
    return baseScore + 2;
  }

  return baseScore;
}

function pushMatch(
  matches: Array<ArcanaHealthSearchMatch & { score: number }>,
  field: ArcanaHealthSearchField,
  label: string,
  excerpt: string,
  baseScore: number,
  normalizedQuery: string
): void {
  matches.push({
    field,
    label,
    excerpt,
    score: scoreField(baseScore, excerpt, normalizedQuery)
  });
}

export function searchArcanaHealthProfiles(
  profiles: ArcanaHealthProfile[],
  query: string
): ArcanaHealthSearchResult[] {
  const normalizedQuery = normalizeSearchText(query);
  const tokens = tokenizeQuery(query);

  if (normalizedQuery.length === 0 || tokens.length === 0) {
    return [];
  }

  return profiles
    .map((profile) => {
      const matches: Array<ArcanaHealthSearchMatch & { score: number }> = [];
      const targetHeading = arcanaTargetHeadingByArcana.get(profile.arcana)?.title ?? "";
      const treatmentMistakeFactor = treatmentMistakeByArcana.get(profile.arcana)?.factors ?? "";
      const nameLabel = `${profile.displayLabel} ${profile.name}`;

      if (matchesQuery(nameLabel, normalizedQuery, tokens)) {
        pushMatch(matches, "name", "Аркан", `${profile.displayLabel} · ${profile.name}`, 14, normalizedQuery);
      }

      if (matchesQuery(targetHeading, normalizedQuery, tokens)) {
        pushMatch(matches, "target_heading", "Органы-мишени", targetHeading, 13, normalizedQuery);
      }

      if (matchesQuery(treatmentMistakeFactor, normalizedQuery, tokens)) {
        pushMatch(matches, "treatment_mistake", "Ошибки лечения", treatmentMistakeFactor, 10, normalizedQuery);
      }

      for (const manifestation of profile.manifestations) {
        if (matchesQuery(manifestation, normalizedQuery, tokens)) {
          pushMatch(matches, "manifestation", "Проявление", manifestation, 12, normalizedQuery);
        }
      }

      if (matchesQuery(profile.lesson, normalizedQuery, tokens)) {
        pushMatch(matches, "lesson", "Урок болезни", profile.lesson, 8, normalizedQuery);
      }

      if (matchesQuery(profile.childLesson, normalizedQuery, tokens)) {
        pushMatch(matches, "child_lesson", "Детский урок", profile.childLesson, 7, normalizedQuery);
      }

      const uniqueMatches = Array.from(new Map(matches.map((item) => [`${item.field}:${item.excerpt}`, item])).values()).sort(
        (left, right) => right.score - left.score
      );

      return uniqueMatches.length > 0
        ? {
            arcana: profile.arcana,
            displayLabel: profile.displayLabel,
            name: profile.name,
            score: uniqueMatches.reduce((sum, item) => sum + item.score, 0),
            matches: uniqueMatches.slice(0, 5).map(({ field, label, excerpt }) => ({ field, label, excerpt }))
          }
        : null;
    })
    .filter((item): item is ArcanaHealthSearchResult => item !== null)
    .sort((left, right) => right.score - left.score || left.arcana - right.arcana);
}
