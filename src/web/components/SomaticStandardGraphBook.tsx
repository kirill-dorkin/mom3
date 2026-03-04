import { memo } from "react";
import type { SomaticStandardGraphView } from "../../core/projections/somaticStandardGraphView";

interface SomaticStandardGraphBookProps {
  view: SomaticStandardGraphView;
}

function splitIntoLines(text: string, maxLineLength: number): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return [];
  }

  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;
    if (currentLine && nextLine.length > maxLineLength) {
      lines.push(currentLine);
      currentLine = word;
      continue;
    }

    currentLine = nextLine;
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function buildLinearPath(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) {
    return "";
  }

  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
}

function buildAreaPath(points: Array<{ x: number; y: number }>, zeroY: number): string {
  if (points.length === 0) {
    return "";
  }

  const path = [`M ${points[0].x} ${zeroY}`, `L ${points[0].x} ${points[0].y}`];

  for (const point of points.slice(1)) {
    path.push(`L ${point.x} ${point.y}`);
  }

  path.push(`L ${points[points.length - 1].x} ${zeroY}`, "Z");
  return path.join(" ");
}

export const SomaticStandardGraphBook = memo(function SomaticStandardGraphBook({ view }: SomaticStandardGraphBookProps) {
  const width = 1880;
  const height = 980;
  const paddingLeft = 84;
  const paddingTop = 28;
  const graphWidth = 1240;
  const graphHeight = 460;
  const bandWidth = 520;
  const graphLeft = paddingLeft;
  const graphTop = paddingTop;
  const graphBottom = graphTop + graphHeight;
  const labelTop = graphBottom + 52;
  const labelBottom = height - 42;
  const bandLeft = graphLeft + graphWidth;
  const axisStepY = graphHeight / (view.axisOrder.length - 1);
  const columnWidth = graphWidth / view.columns.length;
  const yForAxisIndex = (axisIndex: number) => graphTop + axisIndex * axisStepY;
  const xForColumnIndex = (index: number) => graphLeft + index * columnWidth;
  const linePoints = view.columns.map((column, index) => ({
    ...column,
    x: xForColumnIndex(index) + columnWidth / 2,
    y: yForAxisIndex(column.axisIndex)
  }));
  const zeroY = yForAxisIndex(view.zeroAxisIndex);
  const linePath = buildLinearPath(linePoints);
  const areaPath = buildAreaPath(linePoints, zeroY);

  return (
    <div className="chart-card chart-card--wide">
      <div className="chart-card__header">
        <h3>Стандартный график на выбранный возраст</h3>
        <p>Страница `154`: один возраст раскладывается по системам сразу, с книжными зонами значений справа.</p>
      </div>
      <svg className="somatic-standard-graph" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Стандартный соматический график на возраст ${view.age}`}>
        <defs>
          <clipPath id="somatic-standard-graph-positive">
            <rect x={graphLeft} y={graphTop} width={graphWidth} height={Math.max(0, zeroY - graphTop)} />
          </clipPath>
          <clipPath id="somatic-standard-graph-negative">
            <rect x={graphLeft} y={zeroY} width={graphWidth} height={Math.max(0, graphBottom - zeroY)} />
          </clipPath>
        </defs>

        <rect className="somatic-standard-graph__negative-zone" x={graphLeft} y={zeroY} width={graphWidth} height={graphBottom - zeroY} />

        {view.axisOrder.map((digit, axisIndex) => (
          <g key={`standard-axis-${digit}`}>
            <line
              className={digit === 0 ? "somatic-standard-graph__grid somatic-standard-graph__grid--major" : "somatic-standard-graph__grid"}
              x1={graphLeft}
              y1={yForAxisIndex(axisIndex)}
              x2={bandLeft + bandWidth}
              y2={yForAxisIndex(axisIndex)}
            />
            <text className="somatic-standard-graph__axis-label" x={graphLeft - 10} y={yForAxisIndex(axisIndex) + 4} textAnchor="end">
              {digit}
            </text>
          </g>
        ))}

        {view.columns.map((column, index) => {
          const left = xForColumnIndex(index);
          const center = left + columnWidth / 2;
          const lifeLines = splitIntoLines(column.lifeLabel, 12);
          const healthLines = splitIntoLines(column.healthLabel, 14);
          const lifeLineHeight = 28;
          const healthLineHeight = 24;
          const lifeStartY = labelTop;
          const healthStartY = Math.min(
            labelBottom - Math.max(0, (healthLines.length - 1) * healthLineHeight),
            lifeStartY + lifeLines.length * lifeLineHeight + 50
          );

          return (
            <g key={`standard-column-${column.seriesId}`}>
              <line className="somatic-standard-graph__column" x1={left} y1={graphTop} x2={left} y2={graphBottom} />
              <line className="somatic-standard-graph__column somatic-standard-graph__column--label" x1={left} y1={graphBottom} x2={left} y2={labelBottom} />
              <text className="somatic-standard-graph__life-label" x={center} y={lifeStartY} textAnchor="middle">
                {lifeLines.map((line, lineIndex) => (
                  <tspan key={`life-${column.seriesId}-${lineIndex}`} x={center} dy={lineIndex === 0 ? 0 : lifeLineHeight}>
                    {line}
                  </tspan>
                ))}
              </text>
              <text className="somatic-standard-graph__health-label" x={center} y={healthStartY} textAnchor="middle">
                {healthLines.map((line, lineIndex) => (
                  <tspan key={`health-${column.seriesId}-${lineIndex}`} x={center} dy={lineIndex === 0 ? 0 : healthLineHeight}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
        <line className="somatic-standard-graph__column" x1={graphLeft + graphWidth} y1={graphTop} x2={graphLeft + graphWidth} y2={graphBottom} />
        <line className="somatic-standard-graph__column somatic-standard-graph__column--label" x1={graphLeft + graphWidth} y1={graphBottom} x2={graphLeft + graphWidth} y2={labelBottom} />

        <path className="somatic-standard-graph__area somatic-standard-graph__area--positive" d={areaPath} clipPath="url(#somatic-standard-graph-positive)" />
        <path className="somatic-standard-graph__area somatic-standard-graph__area--negative" d={areaPath} clipPath="url(#somatic-standard-graph-negative)" />
        <path className="somatic-standard-graph__line" d={linePath} fill="none" />

        {linePoints.map((point) => (
          <g key={`standard-point-${point.seriesId}`}>
            <circle className="somatic-standard-graph__point" cx={point.x} cy={point.y} r="4.2" />
            <text className="somatic-standard-graph__point-label" x={point.x} y={point.y - 10} textAnchor="middle">
              {point.digit}
            </text>
          </g>
        ))}

        {view.bands.map((band) => {
          const top = yForAxisIndex(band.axisIndexFrom);
          const bottom = yForAxisIndex(band.axisIndexTo);
          const centerY = (top + bottom) / 2;
          const titleLines = splitIntoLines(band.title, 22);
          const descriptionLines = splitIntoLines(band.description, 30);
          const titleLineHeight = 22;
          const descriptionLineHeight = 18;
          const textGap = 10;
          const totalTextHeight =
            titleLines.length * titleLineHeight +
            descriptionLines.length * descriptionLineHeight +
            (descriptionLines.length > 0 ? textGap : 0);
          const titleY = centerY - totalTextHeight / 2 + 8;
          const descriptionY = titleY + titleLines.length * titleLineHeight + textGap;

          return (
            <g key={`standard-band-${band.order}`}>
              <rect
                className={band.tone === "positive" ? "somatic-standard-graph__band somatic-standard-graph__band--positive" : "somatic-standard-graph__band somatic-standard-graph__band--negative"}
                x={bandLeft}
                y={top}
                width={bandWidth}
                height={bottom - top}
              />
              <text className="somatic-standard-graph__band-title" x={bandLeft + bandWidth / 2} y={titleY} textAnchor="middle">
                {titleLines.map((line, lineIndex) => (
                  <tspan key={`band-title-${band.order}-${lineIndex}`} x={bandLeft + bandWidth / 2} dy={lineIndex === 0 ? 0 : titleLineHeight}>
                    {line}
                  </tspan>
                ))}
              </text>
              <text className="somatic-standard-graph__band-description" x={bandLeft + bandWidth / 2} y={descriptionY} textAnchor="middle">
                {descriptionLines.map((line, lineIndex) => (
                  <tspan
                    key={`band-description-${band.order}-${lineIndex}`}
                    x={bandLeft + bandWidth / 2}
                    dy={lineIndex === 0 ? 0 : descriptionLineHeight}
                  >
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}

        <text className="somatic-standard-graph__caption" x={graphLeft + graphWidth / 2} y={graphTop - 8} textAnchor="middle">
          Возраст {view.age}
        </text>
      </svg>
    </div>
  );
});

SomaticStandardGraphBook.displayName = "SomaticStandardGraphBook";
