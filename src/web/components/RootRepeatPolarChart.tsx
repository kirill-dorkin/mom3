import { memo } from "react";
import type { RootPolarPoint } from "../../core/projections/rootCycleView";

interface RootRepeatPolarChartProps {
  points: RootPolarPoint[];
  highlightedAge: number;
  title: string;
}

export const RootRepeatPolarChart = memo(function RootRepeatPolarChart({ points, highlightedAge, title }: RootRepeatPolarChartProps) {
  const size = 420;
  const center = size / 2;
  const maxRadius = size * 0.41;
  const minRadius = size * 0.08;
  const highlightedRemainder = highlightedAge % 10;
  const radiusForDigit = (digit: number) => minRadius + (digit / 9) * (maxRadius - minRadius);
  const angleForIndex = (index: number) => Math.PI + (index / points.length) * Math.PI * 2;
  const coords = points.map((point, index) => {
    const angle = angleForIndex(index);
    const radius = radiusForDigit(point.rootDigit);

    return {
      ...point,
      angle,
      radius,
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius
    };
  });
  const polygon = coords.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <div className="chart-card chart-card--wide">
      <div className="chart-card__header">
        <h3>{title}</h3>
        <p>Полярная схема книги: для каждого остатка `0..9` берётся одна корневая позиция, потому что все возраста с тем же остатком повторяют её.</p>
      </div>
      <svg className="root-polar-chart" viewBox={`0 0 ${size} ${size}`} role="img" aria-label={title}>
        {Array.from({ length: 10 }, (_, digit) => (
          <circle className="root-polar-chart__ring" key={`root-ring-${digit}`} cx={center} cy={center} r={radiusForDigit(digit)} />
        ))}
        {coords.map((point) => (
          <line
            className={point.remainder === highlightedRemainder ? "root-polar-chart__axis root-polar-chart__axis--highlighted" : "root-polar-chart__axis"}
            key={`root-axis-${point.remainder}`}
            x1={center}
            y1={center}
            x2={center + Math.cos(point.angle) * maxRadius}
            y2={center + Math.sin(point.angle) * maxRadius}
          />
        ))}
        <polygon className="root-polar-chart__fill" points={polygon} />
        <polyline className="root-polar-chart__line" fill="none" points={polygon} />
        {coords.map((point) => (
          <g key={`root-polar-point-${point.remainder}`}>
            <circle
              className={point.remainder === highlightedRemainder ? "root-polar-chart__point root-polar-chart__point--highlighted" : "root-polar-chart__point"}
              cx={point.x}
              cy={point.y}
              r="4.2"
            />
            <text
              className="root-polar-chart__age-label"
              x={center + Math.cos(point.angle) * (maxRadius + 18)}
              y={center + Math.sin(point.angle) * (maxRadius + 18)}
              textAnchor="middle"
            >
              {point.remainder}
            </text>
            <text className="root-polar-chart__digit-label" x={point.x} y={point.y - 8} textAnchor="middle">
              {point.rootDigit}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
});

RootRepeatPolarChart.displayName = "RootRepeatPolarChart";
