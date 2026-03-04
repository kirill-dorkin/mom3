import { memo } from "react";
import type { LifetimeBookStrip } from "../../core/projections/lifetimeShadowView";

interface LifetimeShadowChartProps {
  strips: LifetimeBookStrip[];
  maxAge: number;
}

const ROMAN_SOTA_BY_ID: Record<number, string> = {
  1: "I",
  2: "II",
  3: "III",
  4: "IV",
  5: "V"
};

export const LifetimeShadowChart = memo(function LifetimeShadowChart({ strips, maxAge }: LifetimeShadowChartProps) {
  const paddingX = 20;
  const paddingTop = 48;
  const paddingBottom = 32;
  const stripGap = 26;
  const ageCellWidth = 34;
  const colorBandWidth = 38;
  const sotaBoxWidth = 86;
  const rowHeight = 18;
  const chartHeight = Math.max(...strips.map((strip) => strip.ages.length), 0) * rowHeight;
  const stripWidth = ageCellWidth + colorBandWidth + sotaBoxWidth;
  const width = paddingX * 2 + strips.length * stripWidth + Math.max(0, strips.length - 1) * stripGap;
  const height = paddingTop + chartHeight + paddingBottom;

  return (
    <div className="chart-card chart-card--wide">
      <div className="chart-card__header">
        <h3>Диаграмма на всю жизнь</h3>
        <p>
          Книжный режим финального графика: возрастные полосы разбиты на колонки, а итоговые состояния сведены к трём цветам.
          Возраст `0` остаётся в итоговой таблице ниже, как и в книге.
        </p>
      </div>
      <div className="lifetime-book-legend">
        <span className="lifetime-book-legend__item">
          <span className="lifetime-book-legend__swatch lifetime-book-legend__swatch--positive" />
          Зелёная зона
        </span>
        <span className="lifetime-book-legend__item">
          <span className="lifetime-book-legend__swatch lifetime-book-legend__swatch--negative" />
          Негативная или смешанная зона
        </span>
        <span className="lifetime-book-legend__item">
          <span className="lifetime-book-legend__swatch lifetime-book-legend__swatch--resonant" />
          Резонанс отрицательных зон
        </span>
      </div>
      <div className="table-shell">
        <svg className="lifetime-chart lifetime-chart--book" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Диаграмма соматического состояния на всю жизнь">
          {strips.map((strip, stripIndex) => {
            const stripX = paddingX + stripIndex * (stripWidth + stripGap);
            const orderedAges = [...strip.ages].sort((left, right) => right.age - left.age);

            return (
              <g className="lifetime-chart__book-strip" key={`lifetime-strip-${strip.stripIndex}`}>
                <text className="lifetime-chart__book-caption" x={stripX + stripWidth / 2} y={26} textAnchor="middle">
                  {strip.ageFrom}-{strip.ageTo}
                </text>
                {orderedAges.map((ageState, ageIndex) => {
                  const y = paddingTop + ageIndex * rowHeight;

                  return (
                    <g key={`lifetime-age-${strip.stripIndex}-${ageState.age}`}>
                      <rect className="lifetime-chart__book-age-cell" x={stripX} y={y} width={ageCellWidth} height={rowHeight} />
                      <text
                        className="lifetime-chart__book-age-text"
                        x={stripX + ageCellWidth / 2}
                        y={y + rowHeight / 2 + 4}
                        textAnchor="middle"
                      >
                        {ageState.age}
                      </text>
                      <rect
                        className={`lifetime-chart__book-band lifetime-chart__book-band--${ageState.color}`}
                        x={stripX + ageCellWidth}
                        y={y}
                        width={colorBandWidth}
                        height={rowHeight}
                      />
                    </g>
                  );
                })}
                <rect
                  className="lifetime-chart__book-column-frame"
                  x={stripX + ageCellWidth}
                  y={paddingTop}
                  width={colorBandWidth}
                  height={strip.ages.length * rowHeight}
                />
                {strip.primarySegments.map((segment) => {
                  const segmentOffset = strip.ageTo - segment.ageTo;
                  const segmentHeight = (segment.ageTo - segment.ageFrom + 1) * rowHeight;
                  const y = paddingTop + segmentOffset * rowHeight;

                  return (
                    <g key={`lifetime-sota-${strip.stripIndex}-${segment.ageFrom}-${segment.ageTo}`}>
                      <rect
                        className="lifetime-chart__book-sota-box"
                        x={stripX + ageCellWidth + colorBandWidth}
                        y={y}
                        width={sotaBoxWidth}
                        height={segmentHeight}
                      />
                      <text
                        className="lifetime-chart__book-sota-label"
                        x={stripX + ageCellWidth + colorBandWidth + sotaBoxWidth / 2}
                        y={y + segmentHeight / 2 + 6}
                        textAnchor="middle"
                      >
                        {ROMAN_SOTA_BY_ID[segment.primarySotaId] ?? segment.primarySotaId}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
          <text className="lifetime-chart__book-max-age" x={width - paddingX} y={height - 8} textAnchor="end">
            До {maxAge} лет
          </text>
        </svg>
      </div>
    </div>
  );
});

LifetimeShadowChart.displayName = "LifetimeShadowChart";
