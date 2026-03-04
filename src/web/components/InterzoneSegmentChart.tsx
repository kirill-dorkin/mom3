import { digitToInterzoneAxisValue, type InterzoneSegment } from "../../core/projections/interzoneView";
import type { SomaticSeriesTrajectory } from "../../core/projections/somaticView";
import type { InterzoneReferenceRow } from "../../types/book";

interface InterzoneSegmentChartProps {
  segment: InterzoneSegment;
  trajectory: SomaticSeriesTrajectory;
  interpretation: InterzoneReferenceRow | null;
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

function formatDirectionLabel(direction: InterzoneSegment["direction"]): string {
  switch (direction) {
    case "up":
      return "вверх";
    case "down":
      return "вниз";
    default:
      return "горизонтально";
  }
}

export function InterzoneSegmentChart({ segment, trajectory, interpretation }: InterzoneSegmentChartProps) {
  const annualWidth = 760;
  const annualHeight = 220;
  const monthlyWidth = 760;
  const monthlyHeight = 280;

  const annualPaddingLeft = 42;
  const annualPaddingRight = 20;
  const annualPaddingTop = 22;
  const annualPaddingBottom = 40;
  const annualInnerWidth = annualWidth - annualPaddingLeft - annualPaddingRight;
  const annualInnerHeight = annualHeight - annualPaddingTop - annualPaddingBottom;

  const monthlyPaddingLeft = 42;
  const monthlyPaddingRight = 20;
  const monthlyPaddingTop = 18;
  const monthlyPaddingBottom = 62;
  const monthlyInnerWidth = monthlyWidth - monthlyPaddingLeft - monthlyPaddingRight;
  const monthlyInnerHeight = monthlyHeight - monthlyPaddingTop - monthlyPaddingBottom;

  const xForAnnualIndex = (index: number) =>
    annualPaddingLeft + (trajectory.points.length <= 1 ? 0 : (index / (trajectory.points.length - 1)) * annualInnerWidth);
  const yForAnnualAxisValue = (value: number) => annualPaddingTop + ((4 - value) / 9) * annualInnerHeight;
  const xForMonthlyOffset = (offset: number) => monthlyPaddingLeft + (offset / 12) * monthlyInnerWidth;
  const yForMonthlyAxisValue = (value: number) => monthlyPaddingTop + ((4 - value) / 9) * monthlyInnerHeight;

  const annualPolylinePoints = trajectory.points
    .map((point, index) => `${xForAnnualIndex(index)},${yForAnnualAxisValue(digitToInterzoneAxisValue(point.digit))}`)
    .join(" ");
  const monthlyPolylinePoints = segment.monthlyPoints
    .map((point) => `${xForMonthlyOffset(point.offset)},${yForMonthlyAxisValue(point.axisValue)}`)
    .join(" ");

  const annualHighlightStartIndex = trajectory.points.findIndex((point) => point.age === segment.ageFrom);
  const annualHighlightEndIndex = trajectory.points.findIndex((point) => point.age === segment.ageTo);
  const annualHighlightFromX = annualHighlightStartIndex >= 0 ? xForAnnualIndex(annualHighlightStartIndex) : annualPaddingLeft;
  const annualHighlightToX = annualHighlightEndIndex >= 0 ? xForAnnualIndex(annualHighlightEndIndex) : annualPaddingLeft;
  const directionLabel = interpretation?.directionLabel ?? formatDirectionLabel(segment.direction);
  const crossingLabel = segment.crossing
    ? segment.crossing.lowerMonthLabel === segment.crossing.upperMonthLabel
      ? segment.crossing.lowerMonthLabel
      : `${segment.crossing.lowerMonthLabel}/${segment.crossing.upperMonthLabel}`
    : "нет";

  return (
    <div className="chart-card chart-card--wide">
      <div className="chart-card__header">
        <h3>Сома {segment.segmentIndex}: {segment.ageFrom} {"->"} {segment.ageTo}</h3>
        <p>
          Верхняя панель оставляет годовой контекст серии, нижняя разворачивает только выбранную межзонную сому по месяцам от месяца
          рождения. Направление этой сомы: {directionLabel}.
        </p>
      </div>
      <div className="interzone-book-plate">
        <svg
          className="interzone-chart interzone-chart--annual"
          viewBox={`0 0 ${annualWidth} ${annualHeight}`}
          role="img"
          aria-label={`Годовой контекст межзонья для сомы ${segment.segmentIndex}`}
        >
          <rect
            className="interzone-chart__zone interzone-chart__zone--positive"
            x={annualPaddingLeft}
            y={annualPaddingTop}
            width={annualInnerWidth}
            height={yForAnnualAxisValue(0) - annualPaddingTop}
          />
          <rect
            className="interzone-chart__zone interzone-chart__zone--negative"
            x={annualPaddingLeft}
            y={yForAnnualAxisValue(0)}
            width={annualInnerWidth}
            height={annualPaddingTop + annualInnerHeight - yForAnnualAxisValue(0)}
          />
          <rect
            className="interzone-book-plate__annual-highlight"
            x={Math.min(annualHighlightFromX, annualHighlightToX)}
            y={annualPaddingTop}
            width={Math.max(Math.abs(annualHighlightToX - annualHighlightFromX), 20)}
            height={annualInnerHeight}
          />
          {Y_AXIS_LABELS.map((entry) => (
            <g key={`annual-${entry.label}`}>
              <line
                className="interzone-chart__grid"
                x1={annualPaddingLeft}
                y1={yForAnnualAxisValue(entry.value)}
                x2={annualPaddingLeft + annualInnerWidth}
                y2={yForAnnualAxisValue(entry.value)}
              />
              <text className="interzone-chart__ylabel" x={annualPaddingLeft - 10} y={yForAnnualAxisValue(entry.value) + 4} textAnchor="end">
                {entry.label}
              </text>
            </g>
          ))}
          {trajectory.points.map((point, index) => (
            <g key={`annual-age-${point.age}`}>
              <line
                className="interzone-chart__grid interzone-chart__grid--vertical"
                x1={xForAnnualIndex(index)}
                y1={annualPaddingTop}
                x2={xForAnnualIndex(index)}
                y2={annualPaddingTop + annualInnerHeight}
              />
              <text className="interzone-chart__xlabel" x={xForAnnualIndex(index)} y={annualHeight - 12} textAnchor="middle">
                {point.age}
              </text>
            </g>
          ))}
          <line
            className="interzone-chart__axis"
            x1={annualPaddingLeft}
            y1={yForAnnualAxisValue(0)}
            x2={annualPaddingLeft + annualInnerWidth}
            y2={yForAnnualAxisValue(0)}
          />
          <polyline className="interzone-chart__line interzone-chart__line--book" fill="none" points={annualPolylinePoints} />
          {trajectory.points.map((point, index) => {
            const isHighlighted = point.age === segment.ageFrom || point.age === segment.ageTo;
            return (
              <circle
                className={isHighlighted ? "interzone-book-plate__annual-point interzone-book-plate__annual-point--focus" : "interzone-book-plate__annual-point"}
                cx={xForAnnualIndex(index)}
                cy={yForAnnualAxisValue(digitToInterzoneAxisValue(point.digit))}
                r={isHighlighted ? "4.2" : "3.1"}
                key={`annual-point-${point.age}`}
              />
            );
          })}
          <text className="interzone-book-plate__zone-label" x={annualWidth - 18} y={annualPaddingTop + 14} textAnchor="end">
            положительная зона
          </text>
          <text className="interzone-book-plate__zone-label" x={annualWidth - 18} y={annualPaddingTop + annualInnerHeight - 12} textAnchor="end">
            отрицательная зона
          </text>
        </svg>

        <svg
          className="interzone-chart interzone-chart--monthly"
          viewBox={`0 0 ${monthlyWidth} ${monthlyHeight}`}
          role="img"
          aria-label={`Месячная раздвижка межзонья для сомы ${segment.segmentIndex}`}
        >
          <rect
            className="interzone-chart__zone interzone-chart__zone--positive"
            x={monthlyPaddingLeft}
            y={monthlyPaddingTop}
            width={monthlyInnerWidth}
            height={yForMonthlyAxisValue(0) - monthlyPaddingTop}
          />
          <rect
            className="interzone-chart__zone interzone-chart__zone--negative"
            x={monthlyPaddingLeft}
            y={yForMonthlyAxisValue(0)}
            width={monthlyInnerWidth}
            height={monthlyPaddingTop + monthlyInnerHeight - yForMonthlyAxisValue(0)}
          />
          {Y_AXIS_LABELS.map((entry) => (
            <g key={`monthly-${entry.label}`}>
              <line
                className="interzone-chart__grid"
                x1={monthlyPaddingLeft}
                y1={yForMonthlyAxisValue(entry.value)}
                x2={monthlyPaddingLeft + monthlyInnerWidth}
                y2={yForMonthlyAxisValue(entry.value)}
              />
              <text className="interzone-chart__ylabel" x={monthlyPaddingLeft - 10} y={yForMonthlyAxisValue(entry.value) + 4} textAnchor="end">
                {entry.label}
              </text>
            </g>
          ))}
          {segment.monthlyPoints.map((point) => (
            <g key={`month-${point.offset}`}>
              <line
                className="interzone-chart__grid interzone-chart__grid--vertical"
                x1={xForMonthlyOffset(point.offset)}
                y1={monthlyPaddingTop}
                x2={xForMonthlyOffset(point.offset)}
                y2={monthlyPaddingTop + monthlyInnerHeight}
              />
            </g>
          ))}
          <line
            className="interzone-chart__axis"
            x1={monthlyPaddingLeft}
            y1={yForMonthlyAxisValue(0)}
            x2={monthlyPaddingLeft + monthlyInnerWidth}
            y2={yForMonthlyAxisValue(0)}
          />
          <polyline className={`interzone-chart__line interzone-chart__line--${segment.direction}`} fill="none" points={monthlyPolylinePoints} />
          {segment.monthlyPoints.map((point) => (
            <circle className="interzone-chart__point" cx={xForMonthlyOffset(point.offset)} cy={yForMonthlyAxisValue(point.axisValue)} r="3.2" key={`point-${point.offset}`} />
          ))}
          {segment.monthlyPoints.slice(0, -1).map((point) => {
            const left = xForMonthlyOffset(point.offset);
            const right = xForMonthlyOffset(point.offset + 1);
            const center = (left + right) / 2;
            return (
              <g key={`month-box-${point.offset}`}>
                <rect className="interzone-book-plate__month-box" x={left + 2} y={monthlyHeight - 46} width={Math.max(right - left - 4, 14)} height="22" rx="4" />
                <text className="interzone-book-plate__month-number" x={center} y={monthlyHeight - 56} textAnchor="middle">
                  {point.monthNumber}
                </text>
                <text className="interzone-book-plate__month-label" x={center} y={monthlyHeight - 31} textAnchor="middle">
                  {point.monthLabel}
                </text>
              </g>
            );
          })}
          {segment.crossing ? (
            <g>
              <line
                className="interzone-chart__crossing"
                x1={xForMonthlyOffset(segment.crossing.exactOffset)}
                y1={monthlyPaddingTop}
                x2={xForMonthlyOffset(segment.crossing.exactOffset)}
                y2={monthlyPaddingTop + monthlyInnerHeight}
              />
              <rect className="interzone-chart__crossing-label-box" x={xForMonthlyOffset(segment.crossing.exactOffset) - 34} y={10} width="68" height="20" rx="4" />
              <text className="interzone-chart__crossing-label" x={xForMonthlyOffset(segment.crossing.exactOffset)} y={24} textAnchor="middle">
                {crossingLabel}
              </text>
            </g>
          ) : null}
        </svg>

        {interpretation ? (
          <div className="interzone-book-plate__interpretation">
            <div className="interzone-book-plate__copy interzone-book-plate__copy--positive">
              <strong>Положительная зона · {interpretation.directionLabel}</strong>
              <p>{interpretation.positiveZone}</p>
            </div>
            <div className="interzone-book-plate__copy interzone-book-plate__copy--negative">
              <strong>Отрицательная зона · {interpretation.directionLabel}</strong>
              <p>{interpretation.negativeZone}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
