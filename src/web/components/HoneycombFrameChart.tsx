import type { HoneycombChartCell } from "../../core/projections/honeycombFrameView";

interface HoneycombFrameChartProps {
  cells: HoneycombChartCell[];
  selectedArcana?: number;
  onSelectArcana?: (arcana: number) => void;
}

function buildHexagonPoints(centerX: number, centerY: number, size: number): string {
  const halfHeight = Math.sqrt(3) * 0.5 * size;

  return [
    [centerX - size * 0.5, centerY - halfHeight],
    [centerX + size * 0.5, centerY - halfHeight],
    [centerX + size, centerY],
    [centerX + size * 0.5, centerY + halfHeight],
    [centerX - size * 0.5, centerY + halfHeight],
    [centerX - size, centerY]
  ]
    .map(([x, y]) => `${x},${y}`)
    .join(" ");
}

export function HoneycombFrameChart({ cells, selectedArcana, onSelectArcana }: HoneycombFrameChartProps) {
  const size = 62;

  return (
    <div className="chart-card chart-card--wide">
      <div className="chart-card__header">
        <h3>Схема каркаса сот</h3>
        <p>Позиции ячеек повторяют шаблон книги: пять основных арканов, плюс бессрочные СМ и ОЛ.</p>
      </div>
      <svg className="honeycomb-chart" viewBox="0 0 804 328" role="img" aria-label="Каркас сот">
        {cells.map((cell) => (
          <g
            className={`honeycomb-chart__cell honeycomb-chart__cell--${cell.metricId} ${selectedArcana === cell.arcana ? "honeycomb-chart__cell--selected" : ""} ${onSelectArcana ? "honeycomb-chart__cell--clickable" : ""}`}
            key={cell.metricId}
            onClick={onSelectArcana ? () => onSelectArcana(cell.arcana) : undefined}
            onKeyDown={onSelectArcana ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelectArcana(cell.arcana);
              }
            } : undefined}
            role={onSelectArcana ? "button" : undefined}
            tabIndex={onSelectArcana ? 0 : undefined}
          >
            <polygon
              className={`honeycomb-chart__hex ${cell.metricId === "sm" || cell.metricId === "ol" ? "honeycomb-chart__hex--lifelong" : ""}`}
              points={buildHexagonPoints(cell.x, cell.y, size)}
            />
            <text className="honeycomb-chart__label" x={cell.x} y={cell.y - 16} textAnchor="middle">
              {cell.label}
            </text>
            <text className="honeycomb-chart__value" x={cell.x} y={cell.y + 10} textAnchor="middle">
              {cell.arcana}
            </text>
          </g>
        ))}
        <text className="honeycomb-chart__title" x="402" y="124" textAnchor="middle">
          КАРКАС
        </text>
        <text className="honeycomb-chart__title" x="402" y="164" textAnchor="middle">
          СОТ
        </text>
      </svg>
    </div>
  );
}
