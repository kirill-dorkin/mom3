import { memo } from "react";
import type { SomaticSeriesTrajectory } from "../../core/projections/somaticView";

interface SomaticBookStripChartProps {
  trajectory: SomaticSeriesTrajectory;
  title: string;
}

function buildSmoothPath(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) {
    return "";
  }

  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`;
  }

  const segments = [`M ${points[0].x} ${points[0].y}`];

  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[index - 1] ?? points[index];
    const current = points[index];
    const next = points[index + 1];
    const afterNext = points[index + 2] ?? next;

    const control1X = current.x + (next.x - previous.x) / 6;
    const control1Y = current.y + (next.y - previous.y) / 6;
    const control2X = next.x - (afterNext.x - current.x) / 6;
    const control2Y = next.y - (afterNext.y - current.y) / 6;

    segments.push(`C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${next.x} ${next.y}`);
  }

  return segments.join(" ");
}

export const SomaticBookStripChart = memo(function SomaticBookStripChart({ trajectory, title }: SomaticBookStripChartProps) {
  const width = 760;
  const height = 270;
  const paddingLeft = 40;
  const paddingRight = 12;
  const paddingTop = 20;
  const paddingBottom = 28;
  const innerWidth = width - paddingLeft - paddingRight;
  const innerHeight = height - paddingTop - paddingBottom;
  const stepX = trajectory.points.length > 1 ? innerWidth / (trajectory.points.length - 1) : 0;
  const xForIndex = (index: number) => paddingLeft + index * stepX;
  const yForDigit = (digit: number) => paddingTop + ((9 - digit) / 9) * innerHeight;
  const coords = trajectory.points.map((point, index) => ({
    ...point,
    x: xForIndex(index),
    y: yForDigit(point.digit)
  }));
  const path = buildSmoothPath(coords);

  return (
    <div className="chart-card chart-card--wide">
      <div className="chart-card__header">
        <h3>{title}</h3>
        <p>Книжная полосовая форма для одной позиции графика на выбранном десятилетии.</p>
      </div>
      <svg className="somatic-strip-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title}>
        {Array.from({ length: 10 }, (_, rowIndex) => (
          <line
            className="somatic-strip-chart__grid"
            key={`grid-y-${rowIndex}`}
            x1={paddingLeft}
            x2={paddingLeft + innerWidth}
            y1={yForDigit(9 - rowIndex)}
            y2={yForDigit(9 - rowIndex)}
          />
        ))}
        {coords.map((point, index) => (
          <line
            className={index === 0 || index === coords.length - 1 ? "somatic-strip-chart__grid somatic-strip-chart__grid--major" : "somatic-strip-chart__grid somatic-strip-chart__grid--vertical"}
            key={`grid-x-${point.age}`}
            x1={point.x}
            x2={point.x}
            y1={paddingTop}
            y2={paddingTop + innerHeight}
          />
        ))}
        <path className="somatic-strip-chart__line" d={path} fill="none" />
        {coords.map((point) => (
          <g key={`point-${point.age}`}>
            <circle className="somatic-strip-chart__point" cx={point.x} cy={point.y} r="3.6" />
            <text className="somatic-strip-chart__age-label" x={point.x} y={height - 8} textAnchor="middle">
              {point.age}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
});

SomaticBookStripChart.displayName = "SomaticBookStripChart";
