import type { SomaticSeriesTrajectory } from "../../core/projections/somaticView";

interface TimelineChartProps {
  trajectory: SomaticSeriesTrajectory;
  title: string;
}

export function TimelineChart({ trajectory, title }: TimelineChartProps) {
  const width = 760;
  const height = 280;
  const paddingX = 44;
  const paddingY = 30;
  const innerWidth = width - paddingX * 2;
  const innerHeight = height - paddingY * 2;

  const maxAge = Math.max(...trajectory.points.map((point) => point.age), 1);

  const xForAge = (age: number) => paddingX + (age / maxAge) * innerWidth;
  const yForDigit = (digit: number) => paddingY + ((9 - digit) / 9) * innerHeight;

  const line = trajectory.points.map((point) => `${xForAge(point.age)},${yForDigit(point.digit)}`).join(" ");
  const fill = `${paddingX},${height - paddingY} ${line} ${paddingX + innerWidth},${height - paddingY}`;

  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <h3>{title}</h3>
        <p>Линейная траектория значений по возрасту</p>
      </div>
      <svg className="timeline-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title}>
        {Array.from({ length: 10 }, (_, index) => {
          const y = yForDigit(index);
          return <line className="timeline-chart__grid" key={`grid-y-${index}`} x1={paddingX} x2={paddingX + innerWidth} y1={y} y2={y} />;
        })}
        {trajectory.points.map((point) => (
          <line
            className="timeline-chart__grid timeline-chart__grid--vertical"
            key={`grid-x-${point.age}`}
            x1={xForAge(point.age)}
            x2={xForAge(point.age)}
            y1={paddingY}
            y2={paddingY + innerHeight}
          />
        ))}
        <polygon className="timeline-chart__fill" points={fill} />
        <polyline className="timeline-chart__line" fill="none" points={line} />
        {trajectory.points.map((point) => (
          <g key={`point-${point.age}`}>
            <circle className="timeline-chart__point" cx={xForAge(point.age)} cy={yForDigit(point.digit)} r="4.5" />
            <text className="timeline-chart__xlabel" x={xForAge(point.age)} y={height - 10} textAnchor="middle">
              {point.age}
            </text>
          </g>
        ))}
        {Array.from({ length: 10 }, (_, index) => {
          const value = 9 - index;
          return (
            <text className="timeline-chart__ylabel" key={`label-y-${value}`} x={paddingX - 12} y={yForDigit(value) + 4} textAnchor="end">
              {value}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
