import type { HoneycombFrameResult, HoneycombMetric, HoneycombMetricId, HoneycombTone } from "../calculations/honeycombFrame";

export interface HoneycombMetricTableRow {
  id: HoneycombMetricId;
  label: string;
  description: string;
  formula: string;
  rawValue: number;
  arcana: number;
  targetHeading: string | null;
}

export interface HoneycombToneRow {
  id: string;
  label: string;
  description: string;
  rawValue: number;
  arcana: number;
}

export interface HoneycombChartCell {
  metricId: HoneycombMetricId;
  label: string;
  arcana: number;
  x: number;
  y: number;
}

function toToneRow(tone: HoneycombTone): HoneycombToneRow {
  return {
    id: tone.id,
    label: tone.label,
    description: tone.description,
    rawValue: tone.rawValue,
    arcana: tone.arcana
  };
}

function toMetricRow(metric: HoneycombMetric): HoneycombMetricTableRow {
  return {
    id: metric.id,
    label: metric.label,
    description: metric.description,
    formula: metric.formula,
    rawValue: metric.rawValue,
    arcana: metric.arcana,
    targetHeading: metric.targetHeading
  };
}

export function buildHoneycombToneRows(result: HoneycombFrameResult): HoneycombToneRow[] {
  return [
    toToneRow(result.dayTone),
    toToneRow(result.monthTone),
    toToneRow(result.yearTone),
    toToneRow(result.surnameTone),
    toToneRow(result.nameTone)
  ];
}

export function buildHoneycombMetricRows(result: HoneycombFrameResult): HoneycombMetricTableRow[] {
  return [
    toMetricRow(result.metrics.opv),
    toMetricRow(result.metrics.kch),
    toMetricRow(result.metrics.eb),
    toMetricRow(result.metrics.tr),
    toMetricRow(result.metrics.sz),
    toMetricRow(result.metrics.sm),
    toMetricRow(result.metrics.ol)
  ];
}

export function buildHoneycombChartCells(result: HoneycombFrameResult): HoneycombChartCell[] {
  return [
    { metricId: "tr", label: "Тр", arcana: result.metrics.tr.arcana, x: 92, y: 92 },
    { metricId: "kch", label: "КЧХ", arcana: result.metrics.kch.arcana, x: 248, y: 164 },
    { metricId: "opv", label: "ОПВ", arcana: result.metrics.opv.arcana, x: 92, y: 236 },
    { metricId: "sz", label: "СЗ", arcana: result.metrics.sz.arcana, x: 402, y: 236 },
    { metricId: "eb", label: "ЭБ", arcana: result.metrics.eb.arcana, x: 556, y: 164 },
    { metricId: "ol", label: "ОЛ", arcana: result.metrics.ol.arcana, x: 712, y: 92 },
    { metricId: "sm", label: "СМ", arcana: result.metrics.sm.arcana, x: 712, y: 236 }
  ];
}
