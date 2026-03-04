import { knowledgeBase } from "../../book/knowledgeBase";
import type { SomaticAgeSnapshot } from "../../core/calculations/somaticDiagram";

interface SomaticWheelProps {
  snapshot: SomaticAgeSnapshot;
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

function polarToCartesian(center: number, radius: number, angle: number): { x: number; y: number } {
  return {
    x: center + Math.cos(angle) * radius,
    y: center + Math.sin(angle) * radius
  };
}

function describeDonutSector(center: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number): string {
  const outerStart = polarToCartesian(center, outerRadius, startAngle);
  const outerEnd = polarToCartesian(center, outerRadius, endAngle);
  const innerEnd = polarToCartesian(center, innerRadius, endAngle);
  const innerStart = polarToCartesian(center, innerRadius, startAngle);
  const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}`,
    "Z"
  ].join(" ");
}

function getValueClass(digit: number): "positive" | "negative" {
  return digit <= 4 ? "positive" : "negative";
}

export function SomaticWheel({ snapshot }: SomaticWheelProps) {
  const size = 640;
  const center = size / 2;
  const ringInnerRadius = 126;
  const ringOuterRadius = 230;
  const baseSeries = knowledgeBase.somaticSeries.find((series) => series.id === 0);
  const ringSeries = knowledgeBase.somaticSeries.filter((series) => series.id !== 0);
  const angleStep = (Math.PI * 2) / ringSeries.length;
  const centerLines = baseSeries ? splitIntoLines(baseSeries.sphereName, 12) : [];
  const centerLabelY = center - 42 - ((centerLines.length - 1) * 10);

  return (
    <div className="chart-card chart-card--wide">
      <div className="chart-card__header">
        <h3>Круговая соматическая схема</h3>
        <p>Возрастной срез по 9 внешним секторам и центральной зоне подключения.</p>
      </div>
      <svg className="somatic-wheel" viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Соматическая схема на возраст ${snapshot.age}`}>
        <circle className="somatic-wheel__guide" cx={center} cy={center} r={ringOuterRadius + 18} />
        <circle className="somatic-wheel__guide" cx={center} cy={center} r={ringInnerRadius - 30} />
        {ringSeries.map((series, index) => {
          const startAngle = (-Math.PI / 2) + index * angleStep;
          const endAngle = startAngle + angleStep;
          const midAngle = startAngle + angleStep / 2;
          const value = snapshot.values[series.id];
          const fillRadius = ringInnerRadius + ((value.digit + 1) / 10) * (ringOuterRadius - ringInnerRadius);
          const labelPosition = polarToCartesian(center, ringOuterRadius + 46, midAngle);
          const digitPosition = polarToCartesian(center, ringInnerRadius + (fillRadius - ringInnerRadius) / 2, midAngle);
          const labelLines = splitIntoLines(series.sphereName, 14);
          const labelStartY = labelPosition.y - ((labelLines.length - 1) * 10);

          return (
            <g key={series.id}>
              <path className="somatic-wheel__sector-bg" d={describeDonutSector(center, ringInnerRadius, ringOuterRadius, startAngle, endAngle)} />
              <path
                className={`somatic-wheel__sector somatic-wheel__sector--${getValueClass(value.digit)}`}
                d={describeDonutSector(center, ringInnerRadius, fillRadius, startAngle, endAngle)}
              />
              <path className="somatic-wheel__divider" d={`M ${center} ${center} L ${polarToCartesian(center, ringOuterRadius, startAngle).x} ${polarToCartesian(center, ringOuterRadius, startAngle).y}`} />
              <text className="somatic-wheel__digit" x={digitPosition.x} y={digitPosition.y + 4} textAnchor="middle">
                {value.digit}
              </text>
              <text className="somatic-wheel__label" x={labelPosition.x} y={labelStartY} textAnchor="middle">
                {labelLines.map((line, lineIndex) => (
                  <tspan key={`${series.id}-line-${lineIndex}`} x={labelPosition.x} dy={lineIndex === 0 ? 0 : 20}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
        {baseSeries ? (
          <g>
            <circle
              className={`somatic-wheel__center somatic-wheel__center--${getValueClass(snapshot.values[baseSeries.id].digit)}`}
              cx={center}
              cy={center}
              r={78}
            />
            <text className="somatic-wheel__center-kicker" x={center} y={centerLabelY} textAnchor="middle">
              {centerLines.map((line, lineIndex) => (
                <tspan key={`center-${lineIndex}`} x={center} dy={lineIndex === 0 ? 0 : 20}>
                  {line}
                </tspan>
              ))}
            </text>
            <text className="somatic-wheel__center-digit" x={center} y={center + 8} textAnchor="middle">
              {snapshot.values[baseSeries.id].digit}
            </text>
            <text className="somatic-wheel__center-age" x={center} y={center + 36} textAnchor="middle">
              Возраст {snapshot.age}
            </text>
          </g>
        ) : null}
      </svg>
    </div>
  );
}
