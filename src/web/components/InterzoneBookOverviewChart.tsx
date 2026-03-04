import type { InterzoneBookOverview } from "../../core/projections/interzoneView";

interface InterzoneBookOverviewChartProps {
  overview: InterzoneBookOverview;
  seriesLabel: string;
}

const Y_AXIS_LABELS = [
  { value: 4, label: "4" },
  { value: 3, label: "3" },
  { value: 2, label: "2" },
  { value: 1, label: "1" },
  { value: 0, label: "0" },
  { value: -1, label: "5" },
  { value: -2, label: "6" },
  { value: -3, label: "7" },
  { value: -4, label: "8" },
  { value: -5, label: "9" }
];

const SEGMENT_FILLS = [
  "rgba(219, 218, 222, 0.42)",
  "rgba(231, 179, 151, 0.42)",
  "rgba(236, 215, 170, 0.42)",
  "rgba(240, 231, 177, 0.42)"
];

function formatCrossingLabel(lower: string | null, upper: string | null): string {
  if (!lower && !upper) {
    return "";
  }

  if (!lower || lower === upper) {
    return lower ?? upper ?? "";
  }

  return `${lower}/${upper}`;
}

export function InterzoneBookOverviewChart({ overview, seriesLabel }: InterzoneBookOverviewChartProps) {
  const width = Math.max(760, overview.totalMonths * 38 + 140);
  const height = 420;
  const paddingLeft = 52;
  const paddingRight = 22;
  const paddingTop = 38;
  const paddingBottom = 64;
  const innerWidth = width - paddingLeft - paddingRight;
  const innerHeight = height - paddingTop - paddingBottom;
  const xForOffset = (offset: number) => paddingLeft + (offset / overview.totalMonths) * innerWidth;
  const yForAxisValue = (value: number) => paddingTop + ((4 - value) / 9) * innerHeight;
  const verticalOffsets = Array.from({ length: overview.totalMonths + 1 }, (_, index) => index);

  return (
    <div className="chart-card chart-card--wide">
      <div className="chart-card__header">
        <h3>Книжный обзор межзонья</h3>
        <p>{seriesLabel}. Межзонные сомы раскладываются подряд в одну месячную ленту, как на развороте книги.</p>
      </div>
      <svg className="interzone-chart interzone-chart--book" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Книжный обзор межзонья для ${seriesLabel}`}>
        <rect className="interzone-chart__zone interzone-chart__zone--positive" x={paddingLeft} y={paddingTop} width={innerWidth} height={yForAxisValue(0) - paddingTop} />
        <rect className="interzone-chart__zone interzone-chart__zone--negative" x={paddingLeft} y={yForAxisValue(0)} width={innerWidth} height={paddingTop + innerHeight - yForAxisValue(0)} />
        {overview.segments.map((segment, index) => {
          const segmentLeft = xForOffset(segment.globalOffsetFrom);
          const segmentRight = xForOffset(segment.globalOffsetTo);
          const segmentMid = (segmentLeft + segmentRight) / 2;

          return (
            <g key={`segment-band-${segment.segmentIndex}`}>
              <rect
                className="interzone-chart__segment-panel"
                fill={SEGMENT_FILLS[index % SEGMENT_FILLS.length]}
                x={segmentLeft}
                y={paddingTop}
                width={segmentRight - segmentLeft}
                height={innerHeight}
              />
              <text className="interzone-chart__segment-caption" x={segmentMid} y={paddingTop - 14} textAnchor="middle">
                Сома {segment.segmentIndex}
              </text>
              <text className="interzone-chart__segment-caption interzone-chart__segment-caption--subtle" x={segmentMid} y={paddingTop - 2} textAnchor="middle">
                {segment.ageFrom}-{segment.ageTo} лет
              </text>
            </g>
          );
        })}
        {Y_AXIS_LABELS.map((entry) => (
          <g key={`y-${entry.label}`}>
            <line className="interzone-chart__grid" x1={paddingLeft} y1={yForAxisValue(entry.value)} x2={paddingLeft + innerWidth} y2={yForAxisValue(entry.value)} />
            <text className="interzone-chart__ylabel" x={paddingLeft - 10} y={yForAxisValue(entry.value) + 4} textAnchor="end">
              {entry.label}
            </text>
          </g>
        ))}
        {verticalOffsets.map((offset) => (
          <line
            className={offset % 12 === 0 ? "interzone-chart__segment-boundary" : "interzone-chart__grid interzone-chart__grid--vertical"}
            key={`x-${offset}`}
            x1={xForOffset(offset)}
            y1={paddingTop}
            x2={xForOffset(offset)}
            y2={paddingTop + innerHeight}
          />
        ))}
        <line className="interzone-chart__axis" x1={paddingLeft} y1={yForAxisValue(0)} x2={paddingLeft + innerWidth} y2={yForAxisValue(0)} />
        {overview.segments.map((segment) => (
          <g key={`segment-line-${segment.segmentIndex}`}>
            <polyline
              className={`interzone-chart__line interzone-chart__line--book interzone-chart__line--${segment.direction}`}
              fill="none"
              points={segment.points.map((point) => `${xForOffset(point.globalOffset)},${yForAxisValue(point.axisValue)}`).join(" ")}
            />
            {segment.points.map((point) => (
              <circle
                className="interzone-chart__point interzone-chart__point--book"
                cx={xForOffset(point.globalOffset)}
                cy={yForAxisValue(point.axisValue)}
                r="2.8"
                key={`segment-point-${segment.segmentIndex}-${point.globalOffset}`}
              />
            ))}
            {segment.crossingGlobalOffset !== null ? (
              <g>
                <line
                  className="interzone-chart__crossing"
                  x1={xForOffset(segment.crossingGlobalOffset)}
                  y1={paddingTop}
                  x2={xForOffset(segment.crossingGlobalOffset)}
                  y2={paddingTop + innerHeight}
                />
                <rect
                  className="interzone-chart__crossing-label-box"
                  x={xForOffset(segment.crossingGlobalOffset) - 28}
                  y={height - 36}
                  width="56"
                  height="18"
                  rx="4"
                />
                <text className="interzone-chart__crossing-label" x={xForOffset(segment.crossingGlobalOffset)} y={height - 23} textAnchor="middle">
                  {formatCrossingLabel(segment.crossingLowerMonthLabel, segment.crossingUpperMonthLabel)}
                </text>
              </g>
            ) : null}
          </g>
        ))}
        {overview.segments.map((segment) =>
          segment.points.slice(0, -1).map((point) => (
            <text
              className="interzone-chart__xlabel"
              key={`month-${segment.segmentIndex}-${point.globalOffset}`}
              x={xForOffset(point.globalOffset + 0.5)}
              y={height - 46}
              textAnchor="middle"
            >
              {point.monthNumber}
            </text>
          ))
        )}
        {overview.segments.map((segment) => (
          <text
            className="interzone-chart__month-band-label"
            key={`start-month-${segment.segmentIndex}`}
            x={xForOffset(segment.globalOffsetFrom + 0.5)}
            y={height - 12}
            textAnchor="start"
          >
            {segment.points[0]?.monthLabel}
          </text>
        ))}
      </svg>
    </div>
  );
}
