import type { PairedInfluenceHouseRow } from "../../core/projections/pairedInfluenceView";

interface InfluenceDeltaChartProps {
  rows: PairedInfluenceHouseRow[];
  title: string;
}

export function InfluenceDeltaChart({ rows, title }: InfluenceDeltaChartProps) {
  const width = 760;
  const rowHeight = 34;
  const height = rows.length * rowHeight + 46;
  const paddingTop = 22;
  const labelWidth = 180;
  const rightPadding = 28;
  const innerWidth = width - labelWidth - rightPadding;
  const centerX = labelWidth + innerWidth / 2;
  const maxAbsDelta = Math.max(...rows.map((row) => Math.abs(row.deltaScore)), 1);

  const xForDelta = (delta: number) => centerX + (delta / maxAbsDelta) * ((innerWidth / 2) - 14);

  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <h3>{title}</h3>
        <p>Правее оси сферы усиливаются, левее оси проседают.</p>
      </div>
      <svg className="delta-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title}>
        <line className="delta-chart__axis" x1={centerX} y1={paddingTop - 6} x2={centerX} y2={height - 8} />
        {rows.map((row, index) => {
          const y = paddingTop + index * rowHeight;
          const barEndX = xForDelta(row.deltaScore);
          const leftX = Math.min(centerX, barEndX);
          const barWidth = Math.max(Math.abs(barEndX - centerX), row.deltaScore === 0 ? 2 : 0);
          return (
            <g key={row.houseId}>
              <text className="delta-chart__label" x={8} y={y + 14}>
                {row.houseId}. {row.houseName}
              </text>
              <line className="delta-chart__grid" x1={labelWidth} y1={y + 6} x2={width - rightPadding} y2={y + 6} />
              <rect
                className={`delta-chart__bar delta-chart__bar--${row.trend}`}
                x={leftX}
                y={y - 2}
                width={barWidth}
                height={16}
                rx={8}
              />
              <text className="delta-chart__value" x={width - 6} y={y + 14} textAnchor="end">
                {row.deltaScore > 0 ? `+${row.deltaScore}` : row.deltaScore}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
