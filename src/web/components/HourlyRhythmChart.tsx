import { memo } from "react";
import type { HourlyBiorhythmResult } from "../../core/calculations/hourlyBiorhythm";

interface HourlyRhythmChartProps {
  result: HourlyBiorhythmResult;
  title?: string;
  subtitle?: string;
}

export const HourlyRhythmChart = memo(function HourlyRhythmChart({ result, title = "Бионумерологический ритм суток", subtitle }: HourlyRhythmChartProps) {
  const width = 960;
  const height = 320;
  const paddingX = 52;
  const paddingY = 28;
  const innerWidth = width - paddingX * 2;
  const innerHeight = height - paddingY * 2;

  const xForHour = (hour: number) => paddingX + (hour / 23) * innerWidth;
  const yForValue = (value: number) => paddingY + ((9 - value) / 8) * innerHeight;
  const averageY = yForValue(result.averageLine);

  const points = result.hourlyValuesOrdered.map((item) => `${xForHour(item.hour)},${yForValue(item.value)}`).join(" ");

  return (
    <div className="chart-card chart-card--wide">
      <div className="chart-card__header">
        <h3>{title}</h3>
        <p>{subtitle ?? `Средняя линия: ${result.averageLine}`}</p>
      </div>
      <svg className="hourly-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Суточный график активности">
        <rect className="hourly-chart__zone hourly-chart__zone--high" x={paddingX} y={paddingY} width={innerWidth} height={averageY - paddingY} />
        <rect className="hourly-chart__zone hourly-chart__zone--low" x={paddingX} y={averageY} width={innerWidth} height={paddingY + innerHeight - averageY} />
        {Array.from({ length: 9 }, (_, index) => {
          const value = index + 1;
          return <line className="hourly-chart__grid" key={`grid-y-${value}`} x1={paddingX} y1={yForValue(value)} x2={paddingX + innerWidth} y2={yForValue(value)} />;
        })}
        {result.hourlyValuesOrdered.map((item) => (
          <line
            className="hourly-chart__grid hourly-chart__grid--vertical"
            key={`grid-x-${item.hour}`}
            x1={xForHour(item.hour)}
            y1={paddingY}
            x2={xForHour(item.hour)}
            y2={paddingY + innerHeight}
          />
        ))}
        <line className="hourly-chart__average" x1={paddingX} y1={averageY} x2={paddingX + innerWidth} y2={averageY} />
        <polyline className="hourly-chart__line" fill="none" points={points} />
        {result.hourlyValuesOrdered.map((item) => (
          <g key={`hourly-${item.hour}`}>
            <circle className="hourly-chart__point" cx={xForHour(item.hour)} cy={yForValue(item.value)} r="4.2" />
            <text className="hourly-chart__xlabel" x={xForHour(item.hour)} y={height - 8} textAnchor="middle">
              {String(item.hour).padStart(2, "0")}
            </text>
          </g>
        ))}
        {Array.from({ length: 9 }, (_, index) => {
          const value = index + 1;
          return (
            <text className="hourly-chart__ylabel" key={`y-${value}`} x={paddingX - 12} y={yForValue(value) + 4} textAnchor="end">
              {value}
            </text>
          );
        })}
      </svg>
    </div>
  );
});

HourlyRhythmChart.displayName = "HourlyRhythmChart";
