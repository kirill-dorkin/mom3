import assert from "node:assert/strict";
import { knowledgeBase } from "../book/knowledgeBase";
import { calculateHoneycombFrame } from "../core/calculations/honeycombFrame";
import { calculatePersonalEnergyPotential, normalizeBirthDateInput, parseBirthDateDigits } from "../core/calculations/energyPotential";
import {
  buildHourlyCompatibilitySummary,
  buildHourlyRecommendationSummary,
  calculateBiorhythmBaseFromIdentity,
  calculateBiorhythmBaseFromIdentityByMode,
  calculateHourlyBiorhythmFromBase,
  calculateHourlyBiorhythmFromIdentity
} from "../core/calculations/hourlyBiorhythm";
import { calculateLifetimeShadowDiagram } from "../core/calculations/lifetimeShadow";
import { calculatePairedEnergyInfluence } from "../core/calculations/pairedEnergyInfluence";
import { buildDiseaseHoneycombArcanaView } from "../core/projections/diseaseHoneycombArcanaView";
import { buildDiseaseHoneycombBookView } from "../core/projections/diseaseHoneycombBookView";
import { buildArcanaHealthFocusView } from "../core/projections/arcanaHealthFocusView";
import { buildDiseaseHoneycombView } from "../core/projections/diseaseHoneycombView";
import { buildInterzoneBookOverview, buildInterzoneSegments } from "../core/projections/interzoneView";
import { buildLifetimeBookStrips, buildLifetimeSummaryRows } from "../core/projections/lifetimeShadowView";
import { buildInsertedBlockTimeline, buildRootCycleStates, buildRootPolarPoints, buildRootRepeatGroups } from "../core/projections/rootCycleView";
import { searchArcanaHealthProfiles } from "../core/projections/arcanaHealthSearch";
import {
  SOMATIC_BOOK_DIGIT_ORDER,
  buildSomaticQuickRollDerivation,
  buildSomaticQuickRollRows,
  buildSomaticSeriesTrajectory,
  buildSomaticSliceAtlas
} from "../core/projections/somaticView";
import { buildSomaticStandardGraphView } from "../core/projections/somaticStandardGraphView";
import { calculateSomaticBaseDigits, calculateSomaticDiagram } from "../core/calculations/somaticDiagram";
import { calculateSotaActivationForSnapshot } from "../core/calculations/sotaActivation";

function stringify(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function sortNumericRecord(record: Record<number, number>): Record<string, number> {
  return Object.fromEntries(
    Object.entries(record)
      .sort(([left], [right]) => Number(left) - Number(right))
      .map(([key, value]) => [key, value])
  );
}

function main(): void {
  const example = knowledgeBase.examples.personalEnergy18031964;
  const result = calculatePersonalEnergyPotential(example.birthDate);
  assert.equal(normalizeBirthDateInput("1964-03-18"), example.birthDate, "ISO date normalization mismatch");
  assert.equal(normalizeBirthDateInput("18/3/1964"), "18.03.1964", "Short date normalization mismatch");
  assert.deepEqual(parseBirthDateDigits("1964-03-18"), example.digits, "Alternative date format digit parsing mismatch");

  assert.deepEqual(result.digits, example.digits, "Birth date digit parsing mismatch");
  assert.deepEqual(result.triangleRows, example.triangleRows, "Quersum triangle mismatch");
  assert.deepEqual(sortNumericRecord(result.digitCounts), example.digitCounts, "Digit counts mismatch");
  assert.deepEqual(
    sortNumericRecord(Object.fromEntries(Object.entries(result.houseValues).map(([houseId, value]) => [houseId, value.count]))),
    example.houseCounts,
    "House counts mismatch"
  );
  assert.deepEqual(
    sortNumericRecord(Object.fromEntries(Object.entries(result.houseValues).map(([houseId, value]) => [houseId, value.score]))),
    example.houseScores,
    "House scores mismatch"
  );
  assert.deepEqual(result.matrixCounts, example.matrixCounts, "Matrix counts mismatch");
  assert.deepEqual(result.matrixScores, example.matrixScores, "Matrix scores mismatch");
  assert.equal(result.rootDigit, example.rootDigit, "Root digit mismatch");

  console.log("Validated example 18.03.1964 successfully.");
  console.log(stringify({
    rootDigit: result.rootDigit,
    matrixCounts: result.matrixCounts,
    matrixScores: result.matrixScores
  }));

  const pairedExample = knowledgeBase.examples.pairedEnergy18031964By15011978;
  const pairedResult = calculatePairedEnergyInfluence(pairedExample.primaryBirthDate, pairedExample.secondaryBirthDate);
  assert.deepEqual(pairedResult.secondaryDoubledDigits, pairedExample.secondaryDoubledDigits, "Doubled secondary date mismatch");
  assert.deepEqual(pairedResult.combinedDigits, pairedExample.combinedDigits, "Combined influence digits mismatch");
  assert.deepEqual(pairedResult.triangleRows, pairedExample.triangleRows, "Paired influence triangle mismatch");
  assert.deepEqual(sortNumericRecord(pairedResult.digitCounts), pairedExample.digitCounts, "Paired influence digit counts mismatch");
  assert.deepEqual(
    sortNumericRecord(Object.fromEntries(Object.entries(pairedResult.houseValues).map(([houseId, value]) => [houseId, value.count]))),
    pairedExample.houseCounts,
    "Paired influence house counts mismatch"
  );
  assert.deepEqual(
    sortNumericRecord(Object.fromEntries(Object.entries(pairedResult.houseValues).map(([houseId, value]) => [houseId, value.score]))),
    pairedExample.houseScores,
    "Paired influence house scores mismatch"
  );
  assert.deepEqual(pairedResult.matrixCounts, pairedExample.matrixCounts, "Paired influence matrix counts mismatch");
  assert.deepEqual(pairedResult.matrixScores, pairedExample.matrixScores, "Paired influence matrix scores mismatch");
  assert.deepEqual(sortNumericRecord(pairedResult.deltaScoresByHouseId), pairedExample.deltaScoresByHouseId, "Paired influence score delta mismatch");
  assert.equal(pairedResult.rootDigit, pairedExample.rootDigit, "Paired influence root mismatch");

  console.log("Validated directed paired influence example successfully.");
  console.log(
    stringify({
      combinedDigits: pairedResult.combinedDigits,
      matrixScores: pairedResult.matrixScores,
      deltaScoresByHouseId: pairedResult.deltaScoresByHouseId
    })
  );

  const somaticExample = knowledgeBase.examples.somatic18031964;
  const somaticBase = calculateSomaticBaseDigits(somaticExample.birthDate);
  assert.deepEqual(
    sortNumericRecord(somaticBase),
    somaticExample.baseDigitsBySeriesId,
    "Somatic base digits mismatch"
  );

  const somaticResult = calculateSomaticDiagram(somaticExample.birthDate, 5);
  for (const [age, expectedValues] of Object.entries(somaticExample.ages)) {
    const snapshot = somaticResult.snapshots.find((item) => item.age === Number(age));
    assert.ok(snapshot, `Missing somatic snapshot for age ${age}`);
    const actualDigits = Object.fromEntries(
      Object.entries(snapshot.values).map(([seriesId, value]) => [seriesId, value.digit])
    );
    assert.deepEqual(sortNumericRecord(actualDigits), expectedValues, `Somatic digits mismatch at age ${age}`);
  }

  console.log("Validated somatic progression example 18.03.1964 successfully.");
  console.log(
    stringify({
      somaticBaseDigits: somaticBase,
      age5: somaticResult.snapshots.find((item) => item.age === 5)?.values
    })
  );

  const age5 = somaticResult.snapshots.find((item) => item.age === 5);
  assert.ok(age5, "Missing age 5 snapshot");
  const age5Sotas = calculateSotaActivationForSnapshot(age5);
  assert.deepEqual(
    Object.fromEntries(Object.entries(age5Sotas).map(([sotaId, value]) => [sotaId, value.active])),
    {
      1: true,
      2: false,
      3: true,
      4: true,
      5: true
    },
    "Unexpected sota activation pattern for age 5"
  );

  console.log(
    stringify({
      age5SotaActivation: Object.fromEntries(
        Object.entries(age5Sotas).map(([sotaId, value]) => [sotaId, value.triggerHouseIds])
      )
    })
  );

  const fullSomaticResult = calculateSomaticDiagram(somaticExample.birthDate, 9);
  const age12SomaticResult = calculateSomaticDiagram(somaticExample.birthDate, 12);
  const interzoneTrajectory = buildSomaticSeriesTrajectory(fullSomaticResult, 6, 0, 9);
  const sliceAtlas = buildSomaticSliceAtlas(fullSomaticResult, 0, 9);
  const standardGraph = buildSomaticStandardGraphView(age12SomaticResult.snapshots.find((snapshot) => snapshot.age === 12)!);
  assert.equal(sliceAtlas.length, knowledgeBase.somaticSeries.length, "Unexpected slice atlas size");
  assert.deepEqual(
    sliceAtlas.find((entry) => entry.seriesId === 0)?.trajectory.points.slice(0, 6).map((point) => point.digit),
    [9, 0, 1, 2, 3, 4],
    "Unexpected slice atlas digits for series 0"
  );
  assert.deepEqual(
    sliceAtlas.find((entry) => entry.seriesId === 6)?.trajectory.points.slice(0, 6).map((point) => point.digit),
    [3, 4, 5, 6, 7, 8],
    "Unexpected slice atlas digits for series 6"
  );
  assert.equal(
    sliceAtlas.find((entry) => entry.seriesId === 6)?.positiveYears,
    5,
    "Unexpected positive year count for slice atlas series 6"
  );
  assert.deepEqual(
    standardGraph.columns.map((column) => column.digit),
    [8, 3, 7, 6, 6, 5, 5, 6, 7],
    "Unexpected standard graph digits for age 12"
  );
  assert.deepEqual(standardGraph.axisOrder, [4, 3, 2, 1, 0, 5, 6, 7, 8, 9], "Unexpected standard graph axis order");
  assert.equal(standardGraph.bands[0]?.title, "Краеугольная сфера", "Unexpected first standard graph band");
  assert.equal(standardGraph.columns[0]?.lifeLabel, "Публичность", "Unexpected first standard graph life label");

  console.log("Validated somatic slice atlas example successfully.");
  console.log(
    stringify({
      sliceAtlas: sliceAtlas.slice(0, 2).map((entry) => ({
        seriesId: entry.seriesId,
        digits: entry.trajectory.points.map((point) => point.digit),
        positiveYears: entry.positiveYears,
        negativeYears: entry.negativeYears
      }))
    })
  );

  const interzoneSegments = buildInterzoneSegments(interzoneTrajectory, 3);
  const interzoneOverview = buildInterzoneBookOverview(interzoneSegments);
  const insertedBlockTimeline = buildInsertedBlockTimeline(fullSomaticResult, 0, 2);
  const rootCycleStates = buildRootCycleStates(result.rootDigit, 12);
  const rootPolarPoints = buildRootPolarPoints(result.rootDigit);
  const rootRepeatGroups = buildRootRepeatGroups();
  const somaticQuickRollRows = buildSomaticQuickRollRows();
  const somaticQuickRollDerivation = buildSomaticQuickRollDerivation(fullSomaticResult.baseDigits, 12);
  assert.deepEqual(
    fullSomaticResult.snapshots.slice(0, 3).map((snapshot) => ({
      age: snapshot.age,
      digits: Object.fromEntries(
        Object.entries(snapshot.values).map(([seriesId, value]) => [seriesId, value.digit])
      )
    })),
    [
      { age: 0, digits: { 0: 9, 1: 6, 2: 1, 3: 5, 4: 4, 5: 4, 6: 3, 7: 3, 8: 4, 9: 5 } },
      { age: 1, digits: { 0: 0, 1: 7, 2: 2, 3: 6, 4: 5, 5: 5, 6: 4, 7: 4, 8: 5, 9: 6 } },
      { age: 2, digits: { 0: 1, 1: 8, 2: 3, 3: 7, 4: 6, 5: 6, 6: 5, 7: 5, 8: 6, 9: 7 } }
    ],
    "Unexpected primer rows for page-134 somatic table"
  );
  assert.deepEqual(
    interzoneSegments.map((segment) => segment.segmentIndex),
    [2, 7],
    "Unexpected interzone segment indexes for series 6"
  );
  assert.equal(interzoneSegments[0].crossing?.lowerMonthNumber, 12, "Unexpected first interzone lower month");
  assert.equal(interzoneSegments[0].crossing?.upperMonthNumber, 1, "Unexpected first interzone upper month");
  assert.equal(interzoneSegments[1].crossing?.lowerMonthNumber, 3, "Unexpected second interzone crossing month");
  assert.equal(interzoneOverview.totalMonths, 24, "Unexpected interzone overview month width");
  assert.deepEqual(
    interzoneOverview.segments.map((segment) => [segment.globalOffsetFrom, segment.globalOffsetTo]),
    [
      [0, 12],
      [12, 24]
    ],
    "Unexpected interzone overview segment offsets"
  );
  assert.equal(
    interzoneOverview.segments[0]?.crossingLowerMonthLabel,
    "дек",
    "Unexpected first interzone overview crossing label"
  );
  assert.equal(
    interzoneOverview.segments[1]?.crossingGlobalOffset,
    24,
    "Unexpected second interzone overview crossing offset"
  );
  assert.equal(knowledgeBase.interzoneReference.rows.length, 3, "Unexpected interzone interpretation row count");
  assert.deepEqual(
    knowledgeBase.interzoneReference.rows.map((row) => row.direction),
    ["up", "flat", "down"],
    "Unexpected interzone interpretation direction order"
  );
  assert.match(
    knowledgeBase.interzoneReference.rows[1]?.negativeZone ?? "",
    /срывы результата/,
    "Expected horizontal interzone negative interpretation to mention breakdown of result"
  );
  assert.match(
    knowledgeBase.interzoneReference.rows[2]?.negativeZone ?? "",
    /потеря времени и денег/,
    "Expected downward interzone negative interpretation to mention loss of time and money"
  );
  assert.match(
    knowledgeBase.interzoneReference.notes[1] ?? "",
    /ваше нежелание/,
    "Expected interzone note to preserve the truncated OCR phrase warning"
  );
  assert.deepEqual(
    rootCycleStates.map((state) => state.rootDigit),
    [9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1],
    "Unexpected root-cycle rotation through zero"
  );
  assert.equal(insertedBlockTimeline.totalColumns, 32, "Unexpected inserted-block timeline width");
  assert.deepEqual(
    insertedBlockTimeline.years.map((year) => ({
      age: year.age,
      rootDigit: year.rootDigit,
      transition: year.transitionToNext?.digit ?? null
    })),
    [
      { age: 0, rootDigit: 9, transition: 0 },
      { age: 1, rootDigit: 0, transition: 1 },
      { age: 2, rootDigit: 1, transition: null }
    ],
    "Unexpected inserted-block root transitions"
  );
  assert.deepEqual(
    insertedBlockTimeline.years[0]?.points.map((point) => point.digit),
    [9, 6, 1, 5, 4, 4, 3, 3, 4, 5],
    "Unexpected inserted-block first-year row"
  );
  assert.deepEqual(
    rootRepeatGroups[0]?.ages,
    [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    "Unexpected repeat-group ages for remainder 0"
  );
  assert.deepEqual(
    rootRepeatGroups[9]?.ages,
    [9, 19, 29, 39, 49, 59, 69, 79, 89, 99],
    "Unexpected repeat-group ages for remainder 9"
  );
  assert.deepEqual(
    rootPolarPoints.map((point) => point.rootDigit),
    [9, 0, 1, 2, 3, 4, 5, 6, 7, 8],
    "Unexpected polar root digits by remainder"
  );
  assert.deepEqual(
    rootPolarPoints[3]?.ages,
    [3, 13, 23, 33, 43, 53, 63, 73, 83, 93],
    "Unexpected polar ages for remainder 3"
  );
  assert.equal(somaticQuickRollRows.length, 101, "Unexpected quick-roll reference height");
  assert.deepEqual(
    somaticQuickRollRows[0]?.values,
    { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9 },
    "Unexpected quick-roll zero-age row"
  );
  assert.deepEqual(
    somaticQuickRollRows[23]?.values,
    { 0: 3, 1: 4, 2: 5, 3: 6, 4: 7, 5: 8, 6: 9, 7: 0, 8: 1, 9: 2 },
    "Unexpected quick-roll row for age 23"
  );
  assert.deepEqual(
    somaticQuickRollRows[43]?.values,
    { 0: 3, 1: 4, 2: 5, 3: 6, 4: 7, 5: 8, 6: 9, 7: 0, 8: 1, 9: 2 },
    "Unexpected quick-roll row for age 43"
  );
  assert.deepEqual(
    somaticQuickRollRows[100]?.values,
    { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9 },
    "Unexpected quick-roll row for age 100"
  );
  assert.deepEqual(
    SOMATIC_BOOK_DIGIT_ORDER.map((digit) => somaticQuickRollDerivation.lookupRow[digit]),
    [3, 4, 5, 6, 7, 8, 9, 0, 1, 2],
    "Unexpected book-order quick-roll lookup row for age 12"
  );
  assert.deepEqual(
    somaticQuickRollDerivation.steps.map((step) => step.resultDigit),
    [1, 8, 3, 7, 6, 6, 5, 5, 6, 7],
    "Unexpected book derivation result row for age 12"
  );

  console.log("Validated interzone expansion example successfully.");
  console.log(
    stringify({
      seriesId: 6,
      overviewOffsets: interzoneOverview.segments.map((segment) => `${segment.globalOffsetFrom}-${segment.globalOffsetTo}`),
      insertedRoots: insertedBlockTimeline.years.map((year) => year.rootDigit),
      rootPolarDigits: rootPolarPoints.map((point) => point.rootDigit),
      primerRows: fullSomaticResult.snapshots.slice(0, 3).map((snapshot) => snapshot.age),
      quickRollRow23: somaticQuickRollRows[23]?.values,
      quickRollDerivationAge12: somaticQuickRollDerivation.steps.map((step) => step.resultDigit),
      interzoneSegments: interzoneSegments.map((segment) => ({
        segmentIndex: segment.segmentIndex,
        ageFrom: segment.ageFrom,
        ageTo: segment.ageTo,
        crossing: segment.crossing
          ? `${segment.crossing.lowerMonthLabel}/${segment.crossing.upperMonthLabel}`
          : null
      }))
    })
  );

  const lifetimeExample = knowledgeBase.examples.lifetimeShadowShapkovaIrinaRoanova19;
  const lifetimeResult = calculateLifetimeShadowDiagram({
    name: lifetimeExample.name,
    birthSurname: lifetimeExample.birthSurname,
    currentSurname: lifetimeExample.currentSurname,
    surnameChangeAge: lifetimeExample.surnameChangeAge,
    maxAge: 100
  });
  assert.equal(lifetimeResult.nameBreakdown.arcana, lifetimeExample.arcanaByWord.name, "Lifetime name arcana mismatch");
  assert.equal(lifetimeResult.birthSurnameBreakdown.arcana, lifetimeExample.arcanaByWord.birthSurname, "Lifetime birth surname arcana mismatch");
  assert.equal(lifetimeResult.currentSurnameBreakdown?.arcana, lifetimeExample.arcanaByWord.currentSurname, "Lifetime current surname arcana mismatch");
  assert.equal(lifetimeResult.birthShadowStep, lifetimeExample.shadowSteps.birth, "Lifetime birth shadow step mismatch");
  assert.equal(lifetimeResult.currentShadowStep, lifetimeExample.shadowSteps.current, "Lifetime current shadow step mismatch");
  assert.deepEqual(
    lifetimeResult.birthSegments.slice(0, 5).map((segment) => ({
      ageFrom: segment.ageFrom,
      ageTo: segment.ageTo,
      direction: segment.direction,
      sotaId: segment.sotaId
    })),
    [
      { ageFrom: 0, ageTo: 9, direction: "negative", sotaId: 1 },
      { ageFrom: 10, ageTo: 18, direction: "positive", sotaId: 2 },
      { ageFrom: 19, ageTo: 27, direction: "negative", sotaId: 3 },
      { ageFrom: 28, ageTo: 36, direction: "positive", sotaId: 4 },
      { ageFrom: 37, ageTo: 45, direction: "negative", sotaId: 5 }
    ],
    "Lifetime birth segment sequence mismatch"
  );
  assert.deepEqual(
    lifetimeResult.currentSegments.slice(0, 5).map((segment) => ({
      ageFrom: segment.ageFrom,
      ageTo: segment.ageTo,
      direction: segment.direction,
      sotaId: segment.sotaId
    })),
    [
      { ageFrom: 19, ageTo: 22, direction: "positive", sotaId: 3 },
      { ageFrom: 23, ageTo: 25, direction: "negative", sotaId: 4 },
      { ageFrom: 26, ageTo: 28, direction: "positive", sotaId: 5 },
      { ageFrom: 29, ageTo: 31, direction: "negative", sotaId: 1 },
      { ageFrom: 32, ageTo: 34, direction: "positive", sotaId: 2 }
    ],
    "Lifetime current surname segment sequence mismatch"
  );

  const actualLifetimeAgesByType = Object.fromEntries(
    Object.keys(lifetimeExample.periodTypeAges).map((periodType) => [
      periodType,
      lifetimeResult.yearStates.filter((state) => state.type === periodType).map((state) => state.age)
    ])
  );
  for (const [periodType, expectedAges] of Object.entries(lifetimeExample.periodTypeAges)) {
    for (const age of expectedAges) {
      assert.ok(
        actualLifetimeAgesByType[periodType]?.includes(age),
        `Lifetime result does not include published book age ${age} for ${periodType}`
      );
    }
  }
  assert.ok(
    actualLifetimeAgesByType.especially_unfavorable.includes(55),
    "Expected coherent interval overlay to include boundary age 55 as especially unfavorable"
  );

  const lifetimeSummaryRows = buildLifetimeSummaryRows(lifetimeResult);
  assert.ok(
    lifetimeSummaryRows.some((row) => row.type === "especially_unfavorable" && row.sotaId === 3 && row.ages.join(",") === "23,24,25"),
    "Lifetime summary missing especially unfavorable III row"
  );
  assert.ok(
    lifetimeSummaryRows.some((row) => row.type === "especially_favorable" && row.sotaId === 1 && row.ages.join(",") === "46,50,51,52"),
    "Lifetime summary missing especially favorable I row"
  );
  const lifetimeBookStrips = buildLifetimeBookStrips(lifetimeResult);
  assert.deepEqual(
    lifetimeBookStrips.map((strip) => [strip.ageFrom, strip.ageTo]),
    [
      [1, 36],
      [37, 72],
      [73, 100]
    ],
    "Unexpected split layout for lifetime book graph"
  );
  assert.deepEqual(
    lifetimeBookStrips.map((strip) => strip.primarySegments.map((segment) => segment.primarySotaId)),
    [
      [1, 2, 3, 4],
      [5, 1, 2, 3],
      [4, 5, 1, 2]
    ],
    "Unexpected primary-sota strip sequence in lifetime book graph"
  );
  assert.equal(
    lifetimeBookStrips[0]?.ages.find((state) => state.age === 23)?.color,
    "resonant",
    "Expected age 23 to be black resonance in lifetime book graph"
  );
  assert.equal(
    lifetimeBookStrips[0]?.ages.find((state) => state.age === 29)?.color,
    "negative",
    "Expected age 29 to stay negative in lifetime book graph"
  );
  assert.equal(
    lifetimeBookStrips[2]?.ages.find((state) => state.age === 100)?.color,
    "positive",
    "Expected age 100 to stay positive in lifetime book graph"
  );

  console.log("Validated lifetime shadow example successfully.");
  console.log(
    stringify({
      arcanaByWord: {
        name: lifetimeResult.nameBreakdown.arcana,
        birthSurname: lifetimeResult.birthSurnameBreakdown.arcana,
        currentSurname: lifetimeResult.currentSurnameBreakdown?.arcana ?? null
      },
      shadowSteps: {
        birth: lifetimeResult.birthShadowStep,
        current: lifetimeResult.currentShadowStep
      },
      stripRanges: lifetimeBookStrips.map((strip) => `${strip.ageFrom}-${strip.ageTo}`),
      notes: lifetimeResult.notes
    })
  );

  const diseaseHoneycombView = buildDiseaseHoneycombView(fullSomaticResult, lifetimeResult);
  assert.equal(
    diseaseHoneycombView.candidateType,
    "especially_unfavorable",
    "Disease-honeycomb example should use especially unfavorable years after surname change"
  );
  assert.deepEqual(
    Object.fromEntries(
      diseaseHoneycombView.rows
        .slice()
        .sort((left, right) => left.sotaId - right.sotaId)
        .map((row) => [row.sotaId, row.confirmedAges])
    ),
    {
      1: [91, 95],
      2: [59, 60, 61],
      3: [23, 24, 25],
      4: [73, 77, 78],
      5: [41, 42, 43]
    },
    "Disease-honeycomb confirmed age groups mismatch"
  );
  assert.deepEqual(
    Object.fromEntries(
      diseaseHoneycombView.rows
        .slice()
        .sort((left, right) => left.sotaId - right.sotaId)
        .map((row) => [row.sotaId, row.excludedAges])
    ),
    {
      1: [96, 97],
      2: [55],
      3: [],
      4: [79],
      5: [37]
    },
    "Disease-honeycomb excluded age groups mismatch"
  );
  assert.equal(
    diseaseHoneycombView.rows.find((row) => row.sotaId === 5)?.years.find((year) => year.age === 41)?.active,
    true,
    "Disease-honeycomb should confirm age 41 for V honeycomb"
  );
  assert.equal(
    diseaseHoneycombView.rows.find((row) => row.sotaId === 2)?.years.find((year) => year.age === 55)?.active,
    false,
    "Disease-honeycomb should filter boundary age 55 for II honeycomb"
  );

  console.log("Validated disease-honeycomb risk years successfully.");
  console.log(
    stringify({
      candidateType: diseaseHoneycombView.candidateType,
      confirmedBySota: Object.fromEntries(diseaseHoneycombView.rows.map((row) => [row.sotaId, row.confirmedAges])),
      excludedBySota: Object.fromEntries(diseaseHoneycombView.rows.map((row) => [row.sotaId, row.excludedAges]))
    })
  );

  const diseaseHoneycombBookView = buildDiseaseHoneycombBookView(fullSomaticResult, diseaseHoneycombView);
  assert.deepEqual(
    diseaseHoneycombBookView.rows.find((row) => row.sotaId === 1)?.houses.find((house) => house.houseId === 3)?.points.map((point) => point.digit),
    [5, 6, 7, 8, 9, 0, 1, 2, 3, 4],
    "Disease-honeycomb book view should keep the printed 3-house decade sequence for I sota"
  );
  assert.deepEqual(
    diseaseHoneycombBookView.rows.find((row) => row.sotaId === 2)?.ageCells.filter((cell) => cell.ages.length > 0),
    [
      { offset: 0, ages: [60], status: "confirmed" },
      { offset: 1, ages: [61], status: "confirmed" },
      { offset: 5, ages: [55], status: "excluded" },
      { offset: 9, ages: [59], status: "confirmed" }
    ],
    "Disease-honeycomb book offset mapping mismatch for II sota"
  );
  assert.deepEqual(
    diseaseHoneycombBookView.rows.find((row) => row.sotaId === 5)?.houses.find((house) => house.houseId === 9)?.points.map((point) => point.digit),
    [5, 6, 7, 8, 9, 0, 1, 2, 3, 4],
    "Disease-honeycomb book view should keep the printed 9-house decade sequence for V sota"
  );

  console.log("Validated disease-honeycomb book charts successfully.");
  console.log(
    stringify({
      diseaseBookI3House: diseaseHoneycombBookView.rows.find((row) => row.sotaId === 1)?.houses.find((house) => house.houseId === 3)?.points.map((point) => point.digit),
      diseaseBookIIOffsets: diseaseHoneycombBookView.rows.find((row) => row.sotaId === 2)?.ageCells.filter((cell) => cell.ages.length > 0),
      diseaseBookV9House: diseaseHoneycombBookView.rows.find((row) => row.sotaId === 5)?.houses.find((house) => house.houseId === 9)?.points.map((point) => point.digit)
    })
  );

  const honeycombExample = knowledgeBase.examples.honeycombFrameShapkovaIrina18031964;
  const honeycombResult = calculateHoneycombFrame({
    birthDate: honeycombExample.birthDate,
    name: honeycombExample.name,
    birthSurname: honeycombExample.birthSurname
  });
  assert.equal(honeycombResult.dayTone.arcana, honeycombExample.baseTones.day, "Honeycomb day tone mismatch");
  assert.equal(honeycombResult.monthTone.arcana, honeycombExample.baseTones.month, "Honeycomb month tone mismatch");
  assert.equal(honeycombResult.yearTone.arcana, honeycombExample.baseTones.year, "Honeycomb year tone mismatch");
  assert.equal(honeycombResult.surnameTone.arcana, honeycombExample.baseTones.surname, "Honeycomb surname tone mismatch");
  assert.equal(honeycombResult.nameTone.arcana, honeycombExample.baseTones.name, "Honeycomb name tone mismatch");
  assert.deepEqual(
    {
      opv: honeycombResult.metrics.opv.arcana,
      kch: honeycombResult.metrics.kch.arcana,
      eb: honeycombResult.metrics.eb.arcana,
      tr: honeycombResult.metrics.tr.arcana,
      sz: honeycombResult.metrics.sz.arcana,
      sm: honeycombResult.metrics.sm.arcana,
      ol: honeycombResult.metrics.ol.arcana
    },
    honeycombExample.metrics,
    "Honeycomb frame metrics mismatch"
  );
  assert.equal(honeycombResult.protectionPolarity, honeycombExample.protectionPolarity, "Honeycomb protection polarity mismatch");
  assert.deepEqual(honeycombResult.weakenedSystems, honeycombExample.weakenedSystems, "Honeycomb weakened systems mismatch");
  assert.equal(honeycombResult.treatmentMistakeFactor, honeycombExample.treatmentMistakeFactor, "Honeycomb treatment mistake factor mismatch");

  console.log("Validated honeycomb frame example successfully.");
  console.log(
    stringify({
      baseTones: {
        dt: honeycombResult.dayTone.arcana,
        mt: honeycombResult.monthTone.arcana,
        gt: honeycombResult.yearTone.arcana,
        ft: honeycombResult.surnameTone.arcana,
        it: honeycombResult.nameTone.arcana
      },
      metrics: Object.fromEntries(
        Object.entries(honeycombResult.metrics).map(([metricId, metric]) => [metricId, metric.arcana])
      ),
      protectionPolarity: honeycombResult.protectionPolarity,
      treatmentMistakeFactor: honeycombResult.treatmentMistakeFactor
    })
  );

  const diseaseHoneycombArcanaView = buildDiseaseHoneycombArcanaView(diseaseHoneycombView, lifetimeResult, honeycombResult);
  assert.deepEqual(
    Object.fromEntries(diseaseHoneycombArcanaView.rows.map((row) => [row.sotaId, row.metricId])),
    {
      1: "opv",
      2: "kch",
      3: "sz",
      4: "eb",
      5: "tr"
    },
    "Disease-honeycomb arcana mapping mismatch"
  );
  assert.deepEqual(
    Object.fromEntries(diseaseHoneycombArcanaView.rows.map((row) => [row.sotaId, row.arcana])),
    {
      1: 15,
      2: 2,
      3: 19,
      4: 17,
      5: 9
    },
    "Disease-honeycomb arcana values mismatch"
  );
  assert.ok(
    diseaseHoneycombArcanaView.rows.find((row) => row.sotaId === 1)?.riskFlags.includes("В основной соте стоит аркан 15"),
    "Expected I sota to keep the printed 15-arcana high-risk flag"
  );
  assert.ok(
    diseaseHoneycombArcanaView.rows.find((row) => row.sotaId === 5)?.riskFlags.includes("Аркан ячейки совпадает с СМ"),
    "Expected V sota to keep the SM coincidence flag"
  );
  assert.deepEqual(
    diseaseHoneycombArcanaView.rows.find((row) => row.sotaId === 5)?.healthFocus,
    ["Иммунная система", "Лимфатическая система", "Эндокринная система"],
    "Expected V sota to keep the printed health focus"
  );
  assert.deepEqual(
    diseaseHoneycombArcanaView.rows.find((row) => row.sotaId === 5)?.yearLinks.find((link) => link.age === 41),
    {
      age: 41,
      currentSegmentLabel: "37-45",
      metricId: "tr",
      metricLabel: "Тр",
      arcana: 9,
      targetHeading: honeycombResult.metrics.tr.targetHeading,
      triggerHouseIds: [8, 9],
      coloredHouses: [
        {
          houseId: 8,
          houseName: "Духовность и карма",
          bodySystem: "Иммунная система"
        },
        {
          houseId: 9,
          houseName: "Магия и интуиция",
          bodySystem: "Эндокринная система"
        }
      ],
      supportingSystems: ["Иммунная система", "Эндокринная система"],
      previousSegmentLabel: "28-36",
      previousSotaId: 4,
      previousSotaName: "Четвертая сота",
      previousMetricId: "eb",
      previousMetricLabel: "ЭБ",
      previousArcana: 17,
      previousTargetHeading: honeycombResult.metrics.eb.targetHeading
    },
    "Unexpected previous-cell linkage for age 41 in V sota"
  );
  assert.equal(diseaseHoneycombArcanaView.notes.length, 3, "Unexpected disease-honeycomb arcana note count");

  const arcana9FocusView = buildArcanaHealthFocusView(
    knowledgeBase.arcanaHealthProfiles.find((profile) => profile.arcana === 9)!,
    {
      focusSystems: ["Иммунная система", "Эндокринная система"],
      targetHeading: honeycombResult.metrics.tr.targetHeading
    }
  );
  assert.ok(
    arcana9FocusView.focusTargetItems.includes("эндокринная система"),
    "Expected disease-focused arcana-9 view to keep the endocrine target"
  );
  assert.ok(
    arcana9FocusView.focusTargetItems.some((item) => item.includes("тимус")),
    "Expected disease-focused arcana-9 view to keep the thymus target"
  );
  assert.equal(
    arcana9FocusView.matchedManifestations.length,
    0,
    "Expected disease-focused arcana-9 view to fall back to target headings when manifestations do not match the risk systems"
  );

  const arcana17FocusView = buildArcanaHealthFocusView(
    knowledgeBase.arcanaHealthProfiles.find((profile) => profile.arcana === 17)!,
    {
      focusSystems: ["Дыхательная система"],
      targetHeading: honeycombResult.metrics.eb.targetHeading
    }
  );
  assert.ok(
    arcana17FocusView.focusTargetItems.some((item) => item.includes("Бронхи")),
    "Expected arcana-17 focus view to keep bronchial targets for the respiratory system"
  );
  assert.ok(
    arcana17FocusView.matchedManifestations.some((item) => item.includes("дыхательных путей")),
    "Expected arcana-17 focus view to surface respiratory manifestations"
  );

  console.log("Validated disease-honeycomb arcana linkage successfully.");
  console.log(
    stringify({
      diseaseArcanaBySota: Object.fromEntries(
        diseaseHoneycombArcanaView.rows.map((row) => [
          row.sotaId,
          {
            metric: row.metricLabel,
            arcana: row.arcana,
            flags: row.riskFlags
          }
        ])
      ),
      previousCellAt41: diseaseHoneycombArcanaView.rows.find((row) => row.sotaId === 5)?.yearLinks.find((link) => link.age === 41),
      arcana9FocusTargets: arcana9FocusView.focusTargetItems,
      arcana17RespiratoryManifestations: arcana17FocusView.matchedManifestations
    })
  );

  const hourlyIdentityExample = knowledgeBase.examples.hourlyBiorhythmIdentityShcherbakovaVeronikaAlekseevna;
  const hourlyIdentityResult = calculateBiorhythmBaseFromIdentity(hourlyIdentityExample.birthDate, hourlyIdentityExample.fullName);
  assert.deepEqual(hourlyIdentityResult.consonants, hourlyIdentityExample.consonants, "Hourly identity consonant extraction mismatch");
  assert.deepEqual(
    hourlyIdentityResult.consonantValueRows.map((row) => row.values),
    hourlyIdentityExample.consonantValueRows,
    "Hourly identity consonant transcription mismatch"
  );
  assert.deepEqual(hourlyIdentityResult.baseEightValues, hourlyIdentityExample.baseEightValues, "Hourly identity base eight mismatch");

  const shapkovaAutoBase = calculateBiorhythmBaseFromIdentity("18.03.1964", "Шапкова Ирина Владимировна");
  assert.notDeepEqual(
    shapkovaAutoBase.baseEightValues,
    knowledgeBase.examples.hourlyBiorhythmBase18031964.baseEightValues,
    "Expected automatic transcription to differ from the printed Shapkova base example"
  );
  assert.throws(
    () => calculateBiorhythmBaseFromIdentityByMode("18.03.1964", "Шапкова Ирина Владимировна", "book_strict"),
    /Строгий режим по книге/,
    "Expected strict book mode to reject automatic FIO transcription"
  );

  console.log("Validated automatic biorhythm transcription example successfully.");
  console.log(
    stringify({
      fullName: hourlyIdentityResult.normalizedFullName,
      consonants: hourlyIdentityResult.consonants.join(""),
      baseEightValues: hourlyIdentityResult.baseEightValues,
      shapkovaAutoBase: shapkovaAutoBase.baseEightValues
    })
  );

  const hourlyExample = knowledgeBase.examples.hourlyBiorhythmBase18031964;
  const hourlyResult = calculateHourlyBiorhythmFromBase(hourlyExample.baseEightValues, hourlyExample.birthHour);
  assert.deepEqual(
    hourlyResult.expandedTwentyFourValues,
    hourlyExample.expandedTwentyFourValues,
    "Expanded 24-hour biorhythm values mismatch"
  );
  assert.deepEqual(
    sortNumericRecord(hourlyResult.hourlyValuesByHour),
    hourlyExample.hourlyValuesByHour,
    "Hour-mapped biorhythm values mismatch"
  );
  assert.equal(hourlyResult.averageLine, hourlyExample.averageLine, "Average line mismatch");

  const hourlySummary = buildHourlyRecommendationSummary(hourlyResult);
  assert.deepEqual(
    hourlySummary.sleepWindows.map((window) => window.label),
    ["00:00-01:00", "12:00-13:00", "20:00-22:00"],
    "Unexpected sleep-onset windows for printed hourly example"
  );
  assert.deepEqual(
    hourlySummary.activityWindows.map((window) => window.label),
    ["02:00-08:00", "10:00-12:00", "13:00-16:00", "17:00-20:00", "23:00-00:00"],
    "Unexpected activity windows for printed hourly example"
  );
  const hourlyCompatibilityPartner = calculateHourlyBiorhythmFromIdentity(hourlyIdentityExample.birthDate, hourlyIdentityExample.fullName, 6);
  const hourlyCompatibilitySummary = buildHourlyCompatibilitySummary(hourlyResult, hourlyCompatibilityPartner);
  assert.deepEqual(
    hourlyCompatibilitySummary.sharedPassiveWindows.map((window) => window.label),
    ["01:00-02:00", "08:00-09:00", "21:00-22:00"],
    "Unexpected shared passive windows for overlaid biorhythms"
  );
  assert.deepEqual(
    hourlyCompatibilitySummary.sharedActivityWindows.map((window) => window.label),
    ["02:00-03:00", "07:00-08:00", "10:00-12:00", "13:00-14:00", "15:00-16:00", "17:00-19:00", "23:00-00:00"],
    "Unexpected shared activity windows for overlaid biorhythms"
  );
  assert.equal(
    hourlyCompatibilitySummary.sharedActivityWindows.find((window) => window.label === "17:00-19:00")?.secondaryAverageValue,
    8.5,
    "Unexpected averaged value inside shared evening activity window"
  );

  const hourlyReference = knowledgeBase.hourlyBiorhythmReference;
  assert.equal(hourlyReference.sleepNeedByAgeGroups.length, 7, "Unexpected sleep-need chart group count");
  assert.equal(
    hourlyReference.sleepNeedByAgeGroups[4]?.ageRange,
    "3-5 лет",
    "Unexpected preserved school-age label in sleep-need chart"
  );
  assert.deepEqual(
    hourlyReference.sleepCycleChangeWithAge.ageColumns,
    ["20 лет", "40 лет", "60 лет", "60 лет", "80 лет"],
    "Unexpected preserved age headers in sleep-cycle table"
  );
  assert.equal(hourlyReference.personalClockNotes.length, 3, "Unexpected personal-clock note count");

  assert.equal(knowledgeBase.arcanaHealthProfiles.length, 22, "Unexpected arcana health profile count");
  assert.equal(knowledgeBase.arcanaHealthProfiles[0]?.arcana, 22, "Expected the arcana atlas to start with the Fool");
  assert.ok(
    knowledgeBase.arcanaHealthProfiles.find((profile) => profile.arcana === 1)?.manifestations.includes("Голова"),
    "Arcana 1 profile is missing the head manifestation"
  );
  assert.ok(
    knowledgeBase.arcanaHealthProfiles.find((profile) => profile.arcana === 15)?.lesson.includes("онкологию"),
    "Arcana 15 lesson should keep the early-oncology diagnostic warning"
  );
  assert.ok(
    knowledgeBase.arcanaHealthProfiles.find((profile) => profile.arcana === 20)?.childLesson.includes("мудрость"),
    "Arcana 20 child lesson should keep the family wisdom focus"
  );
  const oncologySearch = searchArcanaHealthProfiles(knowledgeBase.arcanaHealthProfiles, "онкология");
  const pregnancySearch = searchArcanaHealthProfiles(knowledgeBase.arcanaHealthProfiles, "беременность");
  const kidneySearch = searchArcanaHealthProfiles(knowledgeBase.arcanaHealthProfiles, "почки");
  const allergySearch = searchArcanaHealthProfiles(knowledgeBase.arcanaHealthProfiles, "аллергия");
  assert.equal(oncologySearch[0]?.arcana, 12, "Expected oncology search to start with arcana 12");
  assert.ok(
    oncologySearch.some((result) => result.arcana === 15),
    "Expected oncology search to include arcana 15"
  );
  assert.deepEqual(
    pregnancySearch.slice(0, 5).map((result) => result.arcana),
    [3, 6, 18, 20, 22],
    "Unexpected top pregnancy-related arcana ordering"
  );
  assert.equal(kidneySearch[0]?.arcana, 18, "Expected kidney search to start with arcana 18");
  assert.ok(
    allergySearch.some((result) => result.arcana === 12) && allergySearch.some((result) => result.arcana === 18),
    "Expected allergy search to include both arcana 12 and arcana 18"
  );
  assert.equal(knowledgeBase.sotaReferenceAtlas.length, 5, "Unexpected sota reference atlas size");
  assert.deepEqual(
    knowledgeBase.sotaReferenceAtlas.map((entry) => entry.sotaId),
    [1, 2, 3, 4, 5],
    "Unexpected sota reference atlas ordering"
  );
  assert.ok(
    knowledgeBase.sotaReferenceAtlas.find((entry) => entry.sotaId === 1)?.systems[0]?.organs.includes("Желудок"),
    "First sota reference atlas entry should include the stomach"
  );
  assert.ok(
    knowledgeBase.sotaReferenceAtlas.find((entry) => entry.sotaId === 3)?.systems.some((system) => system.title === "Дыхательная система"),
    "Third sota reference atlas entry should include the respiratory system"
  );
  assert.ok(
    knowledgeBase.sotaReferenceAtlas.find((entry) => entry.sotaId === 5)?.lifeSummary.lesson.includes("Кармы"),
    "Fifth sota life lesson should keep the karma focus"
  );

  console.log("Validated 24-hour biorhythm expansion example successfully.");
  console.log(
    stringify({
      averageLine: hourlyResult.averageLine,
      hours0to5: hourlyResult.hourlyValuesOrdered.slice(0, 6),
      sleepWindows: hourlySummary.sleepWindows.map((window) => window.label),
      compatibilityPassive: hourlyCompatibilitySummary.sharedPassiveWindows.map((window) => window.label),
      compatibilityActivity: hourlyCompatibilitySummary.sharedActivityWindows.map((window) => window.label),
      preservedBookNotes: hourlyReference.notes,
      arcanaAtlas22: knowledgeBase.arcanaHealthProfiles[0]?.name,
      arcanaAtlas1Manifestations: knowledgeBase.arcanaHealthProfiles.find((profile) => profile.arcana === 1)?.manifestations.length,
      sotaAtlasTitles: knowledgeBase.sotaReferenceAtlas.map((entry) => entry.lifeTitle),
      oncologySearch: oncologySearch.slice(0, 4).map((result) => result.arcana),
      pregnancySearch: pregnancySearch.slice(0, 5).map((result) => result.arcana)
    })
  );
}

main();
