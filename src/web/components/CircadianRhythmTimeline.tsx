import type { CircadianReferencePoint } from "../../types/book";

interface CircadianRhythmTimelineProps {
  points: CircadianReferencePoint[];
}

export function CircadianRhythmTimeline({ points }: CircadianRhythmTimelineProps) {
  const orderedPoints = [...points].sort((left, right) => left.order - right.order);
  const width = 920;
  const height = 220;
  const paddingX = 60;
  const baselineY = 130;
  const maxTimelineHour = Math.max(...orderedPoints.map((point) => point.timelineHour), 24);
  const innerWidth = width - paddingX * 2;
  const xForHour = (hour: number) => paddingX + (hour / maxTimelineHour) * innerWidth;

  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <h3>Циркадные ориентиры книги</h3>
        <p>Это не персональный график, а общий справочный слой главы 3, с которым авторы потом полемизируют через персональные ритмы.</p>
      </div>
      <svg className="circadian-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Циркадные ориентиры">
        <line className="circadian-chart__baseline" x1={paddingX} y1={baselineY} x2={width - paddingX} y2={baselineY} />
        {orderedPoints.map((point, index) => {
          const x = xForHour(point.timelineHour);
          const cardY = index % 2 === 0 ? 28 : 150;
          const anchor = index % 2 === 0 ? "top" : "bottom";

          return (
            <g key={`${point.order}-${point.timeLabel}`}>
              <line className="circadian-chart__guide" x1={x} x2={x} y1={baselineY} y2={cardY + (anchor === "top" ? 44 : -16)} />
              <circle className="circadian-chart__point" cx={x} cy={baselineY} r="6" />
              <text className="circadian-chart__time" x={x} y={anchor === "top" ? cardY : cardY - 12} textAnchor="middle">
                {point.timeLabel}
              </text>
              <text className="circadian-chart__title" x={x} y={anchor === "top" ? cardY + 16 : cardY + 4} textAnchor="middle">
                {point.title}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="circadian-note-list">
        {orderedPoints.map((point) => (
          <article className="circadian-note" key={`circadian-note-${point.order}`}>
            <strong>{point.timeLabel}</strong>
            <p>
              {point.title}. {point.description}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
