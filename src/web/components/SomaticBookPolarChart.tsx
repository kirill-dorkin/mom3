import { memo } from "react";
import type { SomaticSeriesTrajectory } from "../../core/projections/somaticView";

interface SomaticBookPolarChartProps {
  trajectory: SomaticSeriesTrajectory;
  title: string;
}

export const SomaticBookPolarChart = memo(function SomaticBookPolarChart({ trajectory, title }: SomaticBookPolarChartProps) {
  const size = 420;
  const center = size / 2;
  const maxRadius = size * 0.41;
  const minRadius = size * 0.08;
  const radiusForDigit = (digit: number) => minRadius + (digit / 9) * (maxRadius - minRadius);
  const angleForIndex = (index: number) => Math.PI + (index / trajectory.points.length) * Math.PI * 2;
  const points = trajectory.points.map((point, index) => {
    const angle = angleForIndex(index);
    const radius = radiusForDigit(point.digit);

    return {
      ...point,
      angle,
      radius,
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius
    };
  });
  const path = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <div className="chart-card chart-card--wide">
      <div className="chart-card__header">
        <h3>{title}</h3>
        <p>Круговая схема серии по возрастам выбранного десятилетия, как в книжном развороте.</p>
      </div>
      <svg className="somatic-polar-chart" viewBox={`0 0 ${size} ${size}`} role="img" aria-label={title}>
        {Array.from({ length: 10 }, (_, digit) => (
          <circle className="somatic-polar-chart__ring" key={`ring-${digit}`} cx={center} cy={center} r={radiusForDigit(digit)} />
        ))}
        {points.map((point) => (
          <line
            className="somatic-polar-chart__axis"
            key={`axis-${point.age}`}
            x1={center}
            y1={center}
            x2={center + Math.cos(point.angle) * maxRadius}
            y2={center + Math.sin(point.angle) * maxRadius}
          />
        ))}
        <polygon className="somatic-polar-chart__fill" points={path} />
        <polyline className="somatic-polar-chart__line" fill="none" points={path} />
        {points.map((point) => (
          <g key={`polar-point-${point.age}`}>
            <circle className="somatic-polar-chart__point" cx={point.x} cy={point.y} r="4.1" />
            <text
              className="somatic-polar-chart__age-label"
              x={center + Math.cos(point.angle) * (maxRadius + 16)}
              y={center + Math.sin(point.angle) * (maxRadius + 16)}
              textAnchor="middle"
            >
              {point.age}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
});

SomaticBookPolarChart.displayName = "SomaticBookPolarChart";
