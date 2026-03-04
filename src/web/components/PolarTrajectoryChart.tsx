import type { SomaticSeriesTrajectory } from "../../core/projections/somaticView";

interface PolarTrajectoryChartProps {
  trajectory: SomaticSeriesTrajectory;
  title: string;
}

export function PolarTrajectoryChart({ trajectory, title }: PolarTrajectoryChartProps) {
  const size = 420;
  const center = size / 2;
  const maxRadius = size * 0.39;
  const minRadius = size * 0.11;
  const radiusForDigit = (digit: number) => minRadius + (digit / 9) * (maxRadius - minRadius);
  const angleForIndex = (index: number) => (-Math.PI / 2) + (index / trajectory.points.length) * Math.PI * 2;

  const pointCoords = trajectory.points.map((point, index) => {
    const radius = radiusForDigit(point.digit);
    const angle = angleForIndex(index);
    return {
      ...point,
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
      angle
    };
  });

  const path = pointCoords.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <h3>{title}</h3>
        <p>Круговая схема по возрастам 0-9 лет</p>
      </div>
      <svg className="polar-chart" viewBox={`0 0 ${size} ${size}`} role="img" aria-label={title}>
        {Array.from({ length: 10 }, (_, digit) => {
          const radius = radiusForDigit(digit);
          return <circle className="polar-chart__ring" key={`ring-${digit}`} cx={center} cy={center} r={radius} />;
        })}
        {pointCoords.map((point) => (
          <line className="polar-chart__axis" key={`axis-${point.age}`} x1={center} y1={center} x2={center + Math.cos(point.angle) * maxRadius} y2={center + Math.sin(point.angle) * maxRadius} />
        ))}
        <polygon className="polar-chart__fill" points={path} />
        <polyline className="polar-chart__line" fill="none" points={path} />
        {pointCoords.map((point) => (
          <g key={`polar-point-${point.age}`}>
            <circle className="polar-chart__point" cx={point.x} cy={point.y} r="4.5" />
            <text
              className="polar-chart__label"
              x={center + Math.cos(point.angle) * (maxRadius + 18)}
              y={center + Math.sin(point.angle) * (maxRadius + 18)}
              textAnchor="middle"
            >
              {point.age}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
