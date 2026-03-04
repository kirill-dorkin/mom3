import { memo } from "react";
import type { EnergogramProjection } from "../../core/projections/energogramView";

interface EnergogramChartProps {
  projection: EnergogramProjection;
  title: string;
  subtitle: string;
  variant?: "personal" | "paired";
}

interface FigurePanel {
  x: number;
  width: number;
  tone: "neutral" | "negative" | "positive";
}

function splitIntoLines(value: string, targetLength: number): string[] {
  const words = value.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 1) {
    return [value];
  }

  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (candidate.length <= targetLength || currentLine.length === 0) {
      currentLine = candidate;
      continue;
    }

    lines.push(currentLine);
    currentLine = word;
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function HumanSilhouette({ x, y, width, height }: { x: number; y: number; width: number; height: number }) {
  const headCx = x + width * 0.46;
  const headCy = y + height * 0.12;
  const headRx = width * 0.12;
  const headRy = height * 0.08;
  const neckX = x + width * 0.52;
  const shoulderX = x + width * 0.57;
  const shoulderY = y + height * 0.22;
  const waistX = x + width * 0.53;
  const waistY = y + height * 0.5;
  const hipX = x + width * 0.5;
  const hipY = y + height * 0.62;
  const kneeX = x + width * 0.54;
  const kneeY = y + height * 0.82;
  const ankleX = x + width * 0.48;
  const ankleY = y + height * 0.95;
  const backShoulderX = x + width * 0.38;
  const backShoulderY = y + height * 0.25;
  const backHipX = x + width * 0.36;
  const backHipY = y + height * 0.62;
  const heelX = x + width * 0.3;
  const heelY = y + height * 0.97;
  const toeX = x + width * 0.62;
  const toeY = y + height * 0.98;
  const elbowX = x + width * 0.47;
  const elbowY = y + height * 0.49;
  const wristX = x + width * 0.44;
  const wristY = y + height * 0.63;

  return (
    <g className="energogram-chart__silhouette">
      <ellipse className="energogram-chart__silhouette-line" cx={headCx} cy={headCy} rx={headRx} ry={headRy} />
      <path
        className="energogram-chart__silhouette-line"
        fill="none"
        d={[
          `M ${neckX} ${y + height * 0.18}`,
          `L ${shoulderX} ${shoulderY}`,
          `Q ${x + width * 0.7} ${y + height * 0.31} ${x + width * 0.66} ${y + height * 0.38}`,
          `Q ${x + width * 0.58} ${y + height * 0.46} ${waistX} ${waistY}`,
          `Q ${x + width * 0.56} ${y + height * 0.57} ${hipX} ${hipY}`,
          `Q ${x + width * 0.58} ${y + height * 0.74} ${kneeX} ${kneeY}`,
          `L ${ankleX} ${ankleY}`,
          `L ${toeX} ${toeY}`
        ].join(" ")}
      />
      <path
        className="energogram-chart__silhouette-line"
        fill="none"
        d={[
          `M ${x + width * 0.44} ${y + height * 0.19}`,
          `Q ${backShoulderX} ${backShoulderY} ${x + width * 0.31} ${y + height * 0.38}`,
          `Q ${x + width * 0.27} ${y + height * 0.48} ${backHipX} ${backHipY}`,
          `Q ${x + width * 0.32} ${y + height * 0.73} ${x + width * 0.36} ${y + height * 0.84}`,
          `L ${heelX} ${heelY}`,
          `L ${x + width * 0.42} ${y + height * 0.97}`
        ].join(" ")}
      />
      <path
        className="energogram-chart__silhouette-line"
        fill="none"
        d={[
          `M ${x + width * 0.49} ${y + height * 0.3}`,
          `Q ${x + width * 0.52} ${y + height * 0.4} ${elbowX} ${elbowY}`,
          `Q ${x + width * 0.39} ${y + height * 0.57} ${wristX} ${wristY}`
        ].join(" ")}
      />
      <path
        className="energogram-chart__silhouette-line"
        fill="none"
        d={[
          `M ${x + width * 0.49} ${y + height * 0.2}`,
          `Q ${x + width * 0.57} ${y + height * 0.18} ${x + width * 0.61} ${y + height * 0.15}`,
          `Q ${x + width * 0.58} ${y + height * 0.16} ${x + width * 0.56} ${y + height * 0.16}`
        ].join(" ")}
      />
    </g>
  );
}

function panelClassName(tone: FigurePanel["tone"]): string {
  switch (tone) {
    case "negative":
      return "energogram-chart__figure-panel energogram-chart__figure-panel--negative";
    case "positive":
      return "energogram-chart__figure-panel energogram-chart__figure-panel--positive";
    default:
      return "energogram-chart__figure-panel energogram-chart__figure-panel--neutral";
  }
}

export const EnergogramChart = memo(function EnergogramChart({ projection, title, subtitle, variant = "personal" }: EnergogramChartProps) {
  const width = 760;
  const height = 560;
  const topPadding = 74;
  const bottomPadding = 36;
  const leftLabelWidth = 42;
  const rightScaleWidth = 136;
  const figureGap = 16;
  const plotWidth = variant === "paired" ? 340 : 360;
  const figurePanels: FigurePanel[] =
    variant === "paired"
      ? [
          { x: 18, width: 92, tone: "negative" },
          { x: 110, width: 92, tone: "positive" }
        ]
      : [{ x: 18, width: 128, tone: "neutral" }];
  const plotLeft = figurePanels[figurePanels.length - 1].x + figurePanels[figurePanels.length - 1].width + figureGap;
  const plotRight = plotLeft + plotWidth;
  const plotHeight = height - topPadding - bottomPadding;
  const rowHeight = plotHeight / projection.points.length;
  const xForScore = (score: number) => plotLeft + ((score - projection.minScore) / (projection.maxScore - projection.minScore)) * plotWidth;
  const yForRowCenter = (rowIndex: number) => topPadding + rowHeight * (rowIndex + 0.5);
  const verticalGridScores = Array.from({ length: projection.maxScore - projection.minScore + 1 }, (_, index) => projection.minScore + index);
  const rowBoundaries = Array.from({ length: projection.points.length + 1 }, (_, index) => topPadding + rowHeight * index);
  const path = projection.points.map((point) => `${xForScore(point.score)},${yForRowCenter(point.rowIndex)}`).join(" ");
  const zeroX = xForScore(0);
  const negativeCenterX = (plotLeft + zeroX) / 2;
  const positiveCenterX = (zeroX + plotRight) / 2;
  const chartLeft = figurePanels[0].x;
  const chartRight = plotRight + rightScaleWidth;

  return (
    <div className="chart-card chart-card--wide">
      <div className="chart-card__header">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      <div className="energogram-chart__book-order">{projection.houseOrder.join(" - ")}</div>
      <svg className="energogram-chart energogram-chart--book" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title}>
        <text className="energogram-chart__zone-caption energogram-chart__zone-caption--negative" x={negativeCenterX} y={topPadding - 18} textAnchor="middle">
          отрицательная зона
        </text>
        <text className="energogram-chart__zone-caption energogram-chart__zone-caption--positive" x={positiveCenterX} y={topPadding - 18} textAnchor="middle">
          положительная зона
        </text>
        {figurePanels.map((panel) => (
          <g key={`figure-panel-${panel.x}`}>
            <rect className={panelClassName(panel.tone)} x={panel.x} y={topPadding} width={panel.width} height={plotHeight} />
            <HumanSilhouette x={panel.x + panel.width * 0.08} y={topPadding + 4} width={panel.width * 0.84} height={plotHeight - 8} />
          </g>
        ))}
        <rect className="energogram-chart__zone energogram-chart__zone--negative" x={plotLeft} y={topPadding} width={zeroX - plotLeft} height={plotHeight} />
        <rect className="energogram-chart__zone energogram-chart__zone--positive" x={zeroX} y={topPadding} width={plotRight - zeroX} height={plotHeight} />
        {rowBoundaries.map((y) => (
          <line className="energogram-chart__grid energogram-chart__grid--row" key={`row-boundary-${y}`} x1={chartLeft} y1={y} x2={chartRight} y2={y} />
        ))}
        {verticalGridScores.map((score) => (
          <line className="energogram-chart__grid" key={`score-grid-${score}`} x1={xForScore(score)} y1={topPadding} x2={xForScore(score)} y2={topPadding + plotHeight} />
        ))}
        {figurePanels.map((panel) => (
          <rect className="energogram-chart__panel-border" key={`figure-border-${panel.x}`} x={panel.x} y={topPadding} width={panel.width} height={plotHeight} />
        ))}
        <rect className="energogram-chart__panel-border" x={plotLeft} y={topPadding} width={plotWidth} height={plotHeight} />
        <line className="energogram-chart__axis" x1={zeroX} y1={topPadding} x2={zeroX} y2={topPadding + plotHeight} />
        <polyline className="energogram-chart__line energogram-chart__line--book" fill="none" points={path} />
        {projection.points.map((point) => {
          const y = yForRowCenter(point.rowIndex);
          const houseNameLines = splitIntoLines(point.houseName, 18);
          const bodySystemLines = splitIntoLines(point.bodySystem, 20);
          return (
            <g key={`row-label-${point.houseId}`}>
              <text className="energogram-chart__house-label" x={plotLeft - leftLabelWidth} y={y + 4} textAnchor="middle">
                {point.houseId}
              </text>
              <text className="energogram-chart__body-label" x={plotRight + rightScaleWidth / 2} y={y - 10} textAnchor="middle">
                {houseNameLines.map((line, index) => (
                  <tspan key={`${point.houseId}-house-${index}`} x={plotRight + rightScaleWidth / 2} dy={index === 0 ? 0 : 13}>
                    {line}
                  </tspan>
                ))}
              </text>
              <text className="energogram-chart__body-subtitle" x={plotRight + rightScaleWidth / 2} y={y + 18} textAnchor="middle">
                {bodySystemLines.map((line, index) => (
                  <tspan key={`${point.houseId}-system-${index}`} x={plotRight + rightScaleWidth / 2} dy={index === 0 ? 0 : 11}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
        <text className="energogram-chart__axis-caption" x={plotLeft - leftLabelWidth} y={topPadding - 18} textAnchor="middle">
          дом
        </text>
        <text className="energogram-chart__axis-caption" x={plotRight + rightScaleWidth / 2} y={topPadding - 18} textAnchor="middle">
          область
        </text>
      </svg>
    </div>
  );
});

EnergogramChart.displayName = "EnergogramChart";
