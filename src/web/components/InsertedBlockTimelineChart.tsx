import type { InsertedBlockTimeline } from "../../core/projections/rootCycleView";

interface InsertedBlockTimelineChartProps {
  timeline: InsertedBlockTimeline;
  title: string;
}

export function InsertedBlockTimelineChart({ timeline, title }: InsertedBlockTimelineChartProps) {
  const width = Math.max(780, timeline.totalColumns * 28 + 110);
  const height = 320;
  const paddingLeft = 44;
  const paddingRight = 18;
  const paddingTop = 38;
  const paddingBottom = 40;
  const innerWidth = width - paddingLeft - paddingRight;
  const innerHeight = height - paddingTop - paddingBottom;
  const xForOffset = (offset: number) =>
    paddingLeft + (timeline.totalColumns <= 1 ? 0 : (offset / (timeline.totalColumns - 1)) * innerWidth);
  const yForDigit = (digit: number) => paddingTop + ((9 - digit) / 9) * innerHeight;
  const verticalOffsets = Array.from({ length: timeline.totalColumns }, (_, index) => index);
  const path = timeline.flattenedPoints.map((point) => `${xForOffset(point.globalOffset)},${yForDigit(point.digit)}`).join(" ");

  return (
    <div className="chart-card chart-card--wide">
      <div className="chart-card__header">
        <h3>{title}</h3>
        <p>Упрощённый вид книги: годовые блоки соматического графика соединяются вставными корнями следующего года.</p>
      </div>
      <svg className="inserted-block-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title}>
        {timeline.years.map((year, index) => {
          const left = xForOffset(year.globalOffsetFrom);
          const right = xForOffset(year.globalOffsetTo);
          const panelMid = (left + right) / 2;

          return (
            <g key={`year-panel-${year.age}`}>
              <rect
                className={index % 2 === 0 ? "inserted-block-chart__year-panel inserted-block-chart__year-panel--odd" : "inserted-block-chart__year-panel inserted-block-chart__year-panel--even"}
                x={left}
                y={paddingTop}
                width={right - left}
                height={innerHeight}
              />
              <text className="inserted-block-chart__year-label" x={panelMid} y={paddingTop - 12} textAnchor="middle">
                {year.age} {year.age === 1 ? "год" : "лет"}
              </text>
              {year.transitionToNext ? (
                <rect
                  className="inserted-block-chart__transition-panel"
                  x={xForOffset(year.transitionToNext.globalOffset) - 10}
                  y={paddingTop}
                  width="20"
                  height={innerHeight}
                  rx="4"
                />
              ) : null}
            </g>
          );
        })}
        {Array.from({ length: 10 }, (_, digit) => (
          <g key={`y-${digit}`}>
            <line className="inserted-block-chart__grid" x1={paddingLeft} y1={yForDigit(digit)} x2={paddingLeft + innerWidth} y2={yForDigit(digit)} />
            <text className="inserted-block-chart__ylabel" x={paddingLeft - 10} y={yForDigit(digit) + 4} textAnchor="end">
              {digit}
            </text>
          </g>
        ))}
        {verticalOffsets.map((offset) => (
          <line
            className="inserted-block-chart__grid inserted-block-chart__grid--vertical"
            key={`x-${offset}`}
            x1={xForOffset(offset)}
            y1={paddingTop}
            x2={xForOffset(offset)}
            y2={paddingTop + innerHeight}
          />
        ))}
        <polyline className="inserted-block-chart__line" fill="none" points={path} />
        {timeline.flattenedPoints.map((point) =>
          point.kind === "transition" ? (
            <circle
              className="inserted-block-chart__transition-point"
              cx={xForOffset(point.globalOffset)}
              cy={yForDigit(point.digit)}
              r="5.5"
              key={`point-${point.globalOffset}`}
            />
          ) : null
        )}
      </svg>
    </div>
  );
}
