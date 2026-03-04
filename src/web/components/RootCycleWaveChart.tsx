import { memo } from "react";
import type { RootCycleState } from "../../core/projections/rootCycleView";

interface RootCycleWaveChartProps {
  states: RootCycleState[];
  highlightedAge: number;
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

export const RootCycleWaveChart = memo(function RootCycleWaveChart({ states, highlightedAge, title }: RootCycleWaveChartProps) {
  const width = 900;
  const height = 320;
  const paddingLeft = 42;
  const paddingRight = 16;
  const paddingTop = 20;
  const paddingBottom = 30;
  const innerWidth = width - paddingLeft - paddingRight;
  const innerHeight = height - paddingTop - paddingBottom;
  const maxAge = states[states.length - 1]?.age ?? 0;
  const xForAge = (age: number) => paddingLeft + (maxAge === 0 ? 0 : (age / maxAge) * innerWidth);
  const yForDigit = (digit: number) => paddingTop + ((9 - digit) / 9) * innerHeight;
  const points = states.map((state) => ({
    ...state,
    x: xForAge(state.age),
    y: yForDigit(state.rootDigit)
  }));
  const highlightedPoint = points.find((point) => point.age === highlightedAge) ?? null;
  const path = buildSmoothPath(points);

  return (
    <div className="chart-card chart-card--wide">
      <div className="chart-card__header">
        <h3>{title}</h3>
        <p>Книжный синус корня даты по годам `0-100`: каждые `10` лет волна повторяется, но непрерывный рисунок остаётся наглядным.</p>
      </div>
      <svg className="root-wave-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title}>
        {Array.from({ length: 10 }, (_, digit) => (
          <g key={`root-grid-y-${digit}`}>
            <line className="root-wave-chart__grid" x1={paddingLeft} y1={yForDigit(digit)} x2={width - paddingRight} y2={yForDigit(digit)} />
            <text className="root-wave-chart__ylabel" x={paddingLeft - 10} y={yForDigit(digit) + 4} textAnchor="end">
              {digit}
            </text>
          </g>
        ))}
        {Array.from({ length: Math.floor(maxAge / 10) + 1 }, (_, index) => {
          const age = index * 10;
          const x = xForAge(age);

          return (
            <g key={`root-grid-x-${age}`}>
              <line
                className={age === highlightedAge ? "root-wave-chart__grid root-wave-chart__grid--highlighted" : "root-wave-chart__grid root-wave-chart__grid--vertical"}
                x1={x}
                y1={paddingTop}
                x2={x}
                y2={height - paddingBottom}
              />
              <text className="root-wave-chart__xlabel" x={x} y={height - 8} textAnchor="middle">
                {age}
              </text>
            </g>
          );
        })}
        <path className="root-wave-chart__line" d={path} fill="none" />
        {points.filter((point) => point.age % 10 === 0).map((point) => (
          <circle className="root-wave-chart__point" cx={point.x} cy={point.y} r="3.8" key={`root-point-${point.age}`} />
        ))}
        {highlightedPoint ? (
          <g>
            <circle className="root-wave-chart__focus" cx={highlightedPoint.x} cy={highlightedPoint.y} r="6" />
            <text className="root-wave-chart__focus-label" x={highlightedPoint.x + 8} y={highlightedPoint.y - 8}>
              {highlightedPoint.age} лет · {highlightedPoint.rootDigit}
            </text>
          </g>
        ) : null}
      </svg>
    </div>
  );
});

RootCycleWaveChart.displayName = "RootCycleWaveChart";
