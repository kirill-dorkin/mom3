import type { PairedInfluenceHouseRow } from "../../core/projections/pairedInfluenceView";

interface InfluenceDeltaChartProps {
  rows: PairedInfluenceHouseRow[];
  title: string;
}

function splitIntoLines(text: string, maxLineLength: number): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return [];
  }

  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (currentLine && candidate.length > maxLineLength) {
      lines.push(currentLine);
      currentLine = word;
      continue;
    }

    currentLine = candidate;
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

export function InfluenceDeltaChart({ rows, title }: InfluenceDeltaChartProps) {
  const width = 1040;
  const rowHeight = 62;
  const height = rows.length * rowHeight + 54;
  const paddingTop = 26;
  const labelWidth = 340;
  const rightPadding = 42;
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
          const rowTop = paddingTop + index * rowHeight;
          const labelLines = splitIntoLines(`${row.houseId}. ${row.houseName}`, 22);
          const barEndX = xForDelta(row.deltaScore);
          const leftX = Math.min(centerX, barEndX);
          const barWidth = Math.max(Math.abs(barEndX - centerX), row.deltaScore === 0 ? 2 : 0);
          return (
            <g key={row.houseId}>
              <text className="delta-chart__label" x={10} y={rowTop + 18} textAnchor="start">
                {labelLines.map((line, lineIndex) => (
                  <tspan key={`${row.houseId}-line-${lineIndex}`} x={10} dy={lineIndex === 0 ? 0 : 22}>
                    {line}
                  </tspan>
                ))}
              </text>
              <line className="delta-chart__grid" x1={labelWidth} y1={rowTop + 24} x2={width - rightPadding} y2={rowTop + 24} />
              <rect
                className={`delta-chart__bar delta-chart__bar--${row.trend}`}
                x={leftX}
                y={rowTop + 14}
                width={barWidth}
                height={20}
                rx={10}
              />
              <text className="delta-chart__value" x={width - 8} y={rowTop + 30} textAnchor="end">
                {row.deltaScore > 0 ? `+${row.deltaScore}` : row.deltaScore}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
