import houses from "../../data/book/houses.json";
import sotas from "../../data/book/sotas.json";
import arcanaPolarity from "../../data/book/arcana-polarity.json";
import personalMatrixLayout from "../../data/book/personal-matrix-layout.json";
import energogramLayout from "../../data/book/energogram-layout.json";
import personalEnergyScoreMap from "../../data/book/personal-energy-score-map.json";
import somaticEnergyScoreMap from "../../data/book/somatic-energy-score-map.json";
import calculationModules from "../../data/book/calculation-modules.json";
import verificationGaps from "../../data/book/verification-gaps.json";
import treatmentMistakes from "../../data/book/treatment-mistakes.json";
import arcanaTargetHeadings from "../../data/book/arcana-target-headings.json";
import arcanaNameLetterMap from "../../data/book/arcana-name-letter-map.json";
import biorhythmLetterMap from "../../data/book/biorhythm-letter-map.json";
import hourlyBiorhythmReference from "../../data/book/hourly-biorhythm-reference.json";
import interzoneReference from "../../data/book/interzone-reference.json";
import arcanaHealthProfiles from "../../data/book/arcana-health-profiles.json";
import sotaReferenceAtlas from "../../data/book/sota-reference-atlas.json";
import somaticSeries from "../../data/book/somatic-series.json";
import somaticStandardGraphReference from "../../data/book/somatic-standard-graph-reference.json";
import personalEnergyExample from "../../data/examples/personal-energy-18-03-1964.json";
import pairedEnergyExample from "../../data/examples/paired-energy-18-03-1964_by_15-01-1978.json";
import somaticExample from "../../data/examples/somatic-18-03-1964.json";
import hourlyBiorhythmBaseExample from "../../data/examples/hourly-biorhythm-base-18031964.json";
import hourlyBiorhythmIdentityExample from "../../data/examples/hourly-biorhythm-identity-shcherbakova-veronika-alekseevna.json";
import lifetimeShadowExample from "../../data/examples/lifetime-shadow-shapkova-irina-roanova-19.json";
import honeycombFrameExample from "../../data/examples/honeycomb-frame-shapkova-irina-18-03-1964.json";
import type {
  ArcanaNameLetterMapEntry,
  ArcanaPolarity,
  ArcanaHealthProfile,
  ArcanaTargetHeadingDefinition,
  SotaReferenceDefinition,
  BiorhythmLetterMapEntry,
  CalculationModuleDefinition,
  HourlyBiorhythmReference,
  InterzoneReference,
  EnergogramLayoutDefinition,
  HoneycombFrameExample,
  HouseDefinition,
  HourlyBiorhythmBaseExample,
  HourlyBiorhythmIdentityExample,
  LifetimeShadowExample,
  MatrixLayoutDefinition,
  PairedEnergyExample,
  PersonalEnergyExample,
  PersonalEnergyScoreMapEntry,
  SomaticExample,
  SomaticEnergyScoreMapEntry,
  SomaticSeriesDefinition,
  SomaticStandardGraphReference,
  SotaDefinition,
  TreatmentMistakeDefinition,
  VerificationGap
} from "../types/book";

export const knowledgeBase = {
  houses: houses as HouseDefinition[],
  sotas: sotas as SotaDefinition[],
  arcanaPolarity: arcanaPolarity as ArcanaPolarity,
  personalMatrixLayout: personalMatrixLayout as MatrixLayoutDefinition,
  energogramLayout: energogramLayout as EnergogramLayoutDefinition,
  personalEnergyScoreMap: personalEnergyScoreMap as PersonalEnergyScoreMapEntry[],
  somaticEnergyScoreMap: somaticEnergyScoreMap as SomaticEnergyScoreMapEntry[],
  calculationModules: calculationModules as CalculationModuleDefinition[],
  verificationGaps: verificationGaps as VerificationGap[],
  treatmentMistakes: treatmentMistakes as TreatmentMistakeDefinition[],
  arcanaTargetHeadings: arcanaTargetHeadings as ArcanaTargetHeadingDefinition[],
  arcanaNameLetterMap: arcanaNameLetterMap as ArcanaNameLetterMapEntry[],
  biorhythmLetterMap: biorhythmLetterMap as BiorhythmLetterMapEntry[],
  hourlyBiorhythmReference: hourlyBiorhythmReference as HourlyBiorhythmReference,
  interzoneReference: interzoneReference as InterzoneReference,
  arcanaHealthProfiles: arcanaHealthProfiles as ArcanaHealthProfile[],
  sotaReferenceAtlas: sotaReferenceAtlas as SotaReferenceDefinition[],
  somaticSeries: somaticSeries as SomaticSeriesDefinition[],
  somaticStandardGraphReference: somaticStandardGraphReference as SomaticStandardGraphReference,
  examples: {
    personalEnergy18031964: personalEnergyExample as PersonalEnergyExample,
    pairedEnergy18031964By15011978: pairedEnergyExample as PairedEnergyExample,
    somatic18031964: somaticExample as SomaticExample,
    hourlyBiorhythmBase18031964: hourlyBiorhythmBaseExample as HourlyBiorhythmBaseExample,
    hourlyBiorhythmIdentityShcherbakovaVeronikaAlekseevna: hourlyBiorhythmIdentityExample as HourlyBiorhythmIdentityExample,
    lifetimeShadowShapkovaIrinaRoanova19: lifetimeShadowExample as LifetimeShadowExample,
    honeycombFrameShapkovaIrina18031964: honeycombFrameExample as HoneycombFrameExample
  }
};

export const houseById = new Map(knowledgeBase.houses.map((house) => [house.id, house]));
export const sotaById = new Map(knowledgeBase.sotas.map((sota) => [sota.id, sota]));
export const sotaReferenceById = new Map(knowledgeBase.sotaReferenceAtlas.map((entry) => [entry.sotaId, entry]));
export const treatmentMistakeByArcana = new Map(knowledgeBase.treatmentMistakes.map((item) => [item.arcana, item]));
export const arcanaTargetHeadingByArcana = new Map(knowledgeBase.arcanaTargetHeadings.map((item) => [item.arcana, item]));
export const somaticSeriesById = new Map(knowledgeBase.somaticSeries.map((item) => [item.id, item]));
export const arcanaHealthProfileByArcana = new Map(knowledgeBase.arcanaHealthProfiles.map((item) => [item.arcana, item]));
export const arcanaNameLetterValueByLetter = new Map(
  knowledgeBase.arcanaNameLetterMap.flatMap((item) => item.letters.map((letter) => [letter, item.value] as const))
);
export const biorhythmLetterValueByLetter = new Map(
  knowledgeBase.biorhythmLetterMap.flatMap((item) => item.letters.map((letter) => [letter, item.value] as const))
);

export function getPersonalMatrixDigits(): number[][] {
  return knowledgeBase.personalMatrixLayout.layout.map((row) => [...row]);
}

export function getArcanaPolarity(arcana: number): "masculine" | "feminine" | null {
  if (knowledgeBase.arcanaPolarity.masculine.includes(arcana)) {
    return "masculine";
  }

  if (knowledgeBase.arcanaPolarity.feminine.includes(arcana)) {
    return "feminine";
  }

  return null;
}
