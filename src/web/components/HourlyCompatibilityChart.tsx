import type { HourlyBiorhythmResult, HourlyCompatibilitySummary } from "../../core/calculations/hourlyBiorhythm";

interface HourlyCompatibilityChartProps {
  primary: HourlyBiorhythmResult;
  secondary: HourlyBiorhythmResult;
  primaryLabel: string;
  secondaryLabel: string;
  summary: HourlyCompatibilitySummary;
}

export function HourlyCompatibilityChart({
  primary,
  secondary,
  primaryLabel,
  secondaryLabel,
  summary
}: HourlyCompatibilityChartProps) {
  const width = 960;
  const height = 360;
  const paddingX = 52;
  const paddingY = 28;
  const innerWidth = width - paddingX * 2;
  const innerHeight = height - paddingY * 2;
  const bandWidth = innerWidth / 24;
  const xForHour = (hour: number) => paddingX + bandWidth * (hour + 0.5);
  const xForBand = (hour: number) => paddingX + bandWidth * hour;
  const yForValue = (value: number) => paddingY + ((9 - value) / 8) * innerHeight;
  const primaryPoints = primary.hourlyValuesOrdered.map((item) => `${xForHour(item.hour)},${yForValue(item.value)}`).join(" ");
  const secondaryPoints = secondary.hourlyValuesOrdered.map((item) => `${xForHour(item.hour)},${yForValue(item.value)}`).join(" ");
  const sharedPassiveHours = new Set(summary.sharedPassiveWindows.flatMap((window) => window.hours));
  const sharedActivityHours = new Set(summary.sharedActivityWindows.flatMap((window) => window.hours));

  return (
    <div className="chart-card chart-card--wide">
      <div className="chart-card__header">
        <h3>Наложение двух суточных графиков</h3>
        <p>
          Книга предлагает накладывать графики партнёров друг на друга и искать общие периоды активности и пассивности. Здесь
          один цветовой слой отдан первому человеку, второй второму, а фон подсвечивает общие окна.
        </p>
      </div>
      <div className="hourly-compat-legend">
        <span className="hourly-compat-legend__item">
          <span className="hourly-compat-legend__swatch hourly-compat-legend__swatch--primary-line" />
          {primaryLabel}
        </span>
        <span className="hourly-compat-legend__item">
          <span className="hourly-compat-legend__swatch hourly-compat-legend__swatch--secondary-line" />
          {secondaryLabel}
        </span>
        <span className="hourly-compat-legend__item">
          <span className="hourly-compat-legend__swatch hourly-compat-legend__swatch--shared-activity" />
          Общая активность
        </span>
        <span className="hourly-compat-legend__item">
          <span className="hourly-compat-legend__swatch hourly-compat-legend__swatch--shared-passive" />
          Общая пассивность
        </span>
      </div>
      <svg className="hourly-compat-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Наложение двух суточных графиков">
        {Array.from({ length: 24 }, (_, hour) => {
          const className = sharedActivityHours.has(hour)
            ? "hourly-compat-chart__zone hourly-compat-chart__zone--shared-activity"
            : sharedPassiveHours.has(hour)
              ? "hourly-compat-chart__zone hourly-compat-chart__zone--shared-passive"
              : null;

          return className ? (
            <rect className={className} key={`compat-zone-${hour}`} x={xForBand(hour)} y={paddingY} width={bandWidth} height={innerHeight} />
          ) : null;
        })}
        {Array.from({ length: 9 }, (_, index) => {
          const value = index + 1;
          return (
            <line
              className="hourly-compat-chart__grid"
              key={`compat-grid-y-${value}`}
              x1={paddingX}
              y1={yForValue(value)}
              x2={paddingX + innerWidth}
              y2={yForValue(value)}
            />
          );
        })}
        {Array.from({ length: 25 }, (_, hour) => (
          <line
            className="hourly-compat-chart__grid hourly-compat-chart__grid--vertical"
            key={`compat-grid-x-${hour}`}
            x1={xForBand(hour)}
            y1={paddingY}
            x2={xForBand(hour)}
            y2={paddingY + innerHeight}
          />
        ))}
        <line
          className="hourly-compat-chart__average hourly-compat-chart__average--primary"
          x1={paddingX}
          y1={yForValue(primary.averageLine)}
          x2={paddingX + innerWidth}
          y2={yForValue(primary.averageLine)}
        />
        <line
          className="hourly-compat-chart__average hourly-compat-chart__average--secondary"
          x1={paddingX}
          y1={yForValue(secondary.averageLine)}
          x2={paddingX + innerWidth}
          y2={yForValue(secondary.averageLine)}
        />
        <polyline className="hourly-compat-chart__line hourly-compat-chart__line--primary" fill="none" points={primaryPoints} />
        <polyline className="hourly-compat-chart__line hourly-compat-chart__line--secondary" fill="none" points={secondaryPoints} />
        {primary.hourlyValuesOrdered.map((item) => (
          <circle
            className="hourly-compat-chart__point hourly-compat-chart__point--primary"
            cx={xForHour(item.hour)}
            cy={yForValue(item.value)}
            key={`compat-primary-${item.hour}`}
            r="4.2"
          />
        ))}
        {secondary.hourlyValuesOrdered.map((item) => (
          <circle
            className="hourly-compat-chart__point hourly-compat-chart__point--secondary"
            cx={xForHour(item.hour)}
            cy={yForValue(item.value)}
            key={`compat-secondary-${item.hour}`}
            r="4.2"
          />
        ))}
        {Array.from({ length: 24 }, (_, hour) => (
          <text className="hourly-compat-chart__xlabel" key={`compat-hour-${hour}`} x={xForHour(hour)} y={height - 8} textAnchor="middle">
            {String(hour).padStart(2, "0")}
          </text>
        ))}
        {Array.from({ length: 9 }, (_, index) => {
          const value = index + 1;
          return (
            <text className="hourly-compat-chart__ylabel" key={`compat-y-${value}`} x={paddingX - 12} y={yForValue(value) + 4} textAnchor="end">
              {value}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
