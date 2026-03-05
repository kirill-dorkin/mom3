import manImage from "../../../man.png";
import type { EnergogramProjection } from "../../core/projections/energogramView";

interface BookPersonalEnergogramProps {
  projection: EnergogramProjection;
  birthDate: string;
}

interface PointPosition {
  houseId: number;
  rowIndex: number;
  score: number;
  x: number;
  y: number;
}

export function BookPersonalEnergogram({ projection, birthDate }: BookPersonalEnergogramProps) {
  const reversedOrder = [...projection.houseOrder].reverse();
  const scoreByHouseId = new Map(projection.points.map((point) => [point.houseId, point.score]));
  const imageAspect = 282 / 1126;
  const height = 760;
  const topAxisHeight = 92;
  const leftDigitsWidth = 96;
  const chartGap = 26;
  const chartWidth = 560;
  const rightDigitsWidth = 98;
  const rowCount = reversedOrder.length;
  const imageY = topAxisHeight + 8;
  const imageHeight = 540;
  const bodyX = leftDigitsWidth + 4;
  const bodyWidth = imageHeight * imageAspect;
  const bodyFrameOffsets = [0.0124, 0.0591, 0.1319, 0.2558, 0.3779, 0.5004, 0.6226, 0.746, 0.869, 0.9907];
  const chartTop = imageY + imageHeight * bodyFrameOffsets[0];
  const chartBottom = imageY + imageHeight * bodyFrameOffsets[bodyFrameOffsets.length - 1];
  const chartHeight = chartBottom - chartTop;
  const rowLineOffsets = [bodyFrameOffsets[0], ...bodyFrameOffsets.slice(2)];
  const yPositions = rowLineOffsets.map((offset) => imageY + imageHeight * offset);
  const chartLeft = bodyX + bodyWidth + chartGap;
  const chartRight = chartLeft + chartWidth;
  const leftLabelX = leftDigitsWidth - 14;
  const contentLeft = leftLabelX;
  const contentRight = chartRight + rightDigitsWidth;
  const sidePadding = 120;
  const width = contentRight - contentLeft + sidePadding * 2;
  const xShift = sidePadding - contentLeft;
  const plotMin = -4;
  const plotMax = 4;
  const labels = Array.from({ length: plotMax - plotMin + 1 }, (_, index) => plotMin + index);
  const points: PointPosition[] = reversedOrder.map((houseId, rowIndex) => {
    const rawScore = scoreByHouseId.get(houseId) ?? 0;
    const clampedScore = Math.max(plotMin, Math.min(plotMax, rawScore));
    return {
      houseId,
      rowIndex,
      score: rawScore,
      x: chartLeft + ((clampedScore - plotMin) / (plotMax - plotMin)) * chartWidth,
      y: yPositions[rowIndex]
    };
  });
  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <div className="mx-auto flex min-w-[66rem] max-w-[70rem] flex-col gap-4 bg-white px-4 py-2">
      <div className="text-center">
        <p className="text-[1.95rem] font-bold tracking-[0.02em] text-stone-950">Личная энергограмма</p>
        <p className="mt-1 text-[1rem] font-bold text-stone-500">{birthDate}</p>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="block h-auto w-full min-w-[64rem]" role="img" aria-label={`Личная энергограмма для ${birthDate}`}>
        <g transform={`translate(${xShift}, 0)`}>
          <image
            href={manImage}
            x={bodyX}
            y={imageY}
            width={bodyWidth}
            height={imageHeight}
            preserveAspectRatio="none"
          />

          <rect x={chartLeft} y={chartTop} width={chartWidth} height={chartHeight} fill="#ffffff" stroke="#1c1917" strokeWidth="1.6" />

          {yPositions.map((y, index) => {
            const lineStart = bodyX + bodyWidth;
            return (
              <g key={`row-${index}`}>
                <line x1={lineStart} x2={chartLeft} y1={y} y2={y} stroke="#44403c" strokeOpacity="0.22" strokeWidth="1.05" />
                <line x1={chartLeft} x2={chartRight} y1={y} y2={y} stroke="#44403c" strokeOpacity="0.45" strokeWidth="1.05" />
              </g>
            );
          })}

          {labels.map((value) => {
            const x = chartLeft + ((value - plotMin) / (plotMax - plotMin)) * chartWidth;
            return (
              <g key={`axis-${value}`}>
                <line x1={x} x2={x} y1={chartTop} y2={chartTop + chartHeight} stroke={value === 0 ? "#1c1917" : "#78716c"} strokeOpacity={value === 0 ? "0.8" : "0.25"} strokeWidth={value === 0 ? "1.7" : "1"} />
                <line x1={x} x2={x} y1={chartTop - 10} y2={chartTop} stroke="#1c1917" strokeWidth="1.2" opacity="0.65" />
                <text x={x} y={46} textAnchor="middle" className="fill-stone-900 text-[28px] font-bold">
                  {value}
                </text>
              </g>
            );
          })}

          <polyline fill="none" points={polyline} stroke="#111827" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />

          {points.map((point) => (
            <g key={`point-${point.houseId}`}>
              <circle cx={point.x} cy={point.y} r="5.8" fill="#111827" />
              {point.score < plotMin || point.score > plotMax ? (
                <text
                  x={point.score > 0 ? point.x - 10 : point.x + 10}
                  y={point.y - 12}
                  textAnchor={point.score > 0 ? "end" : "start"}
                  className="fill-stone-500 text-[18px] font-bold"
                >
                  {point.score > 0 ? `+${point.score}` : point.score}
                </text>
              ) : null}
            </g>
          ))}

          {reversedOrder.map((houseId, rowIndex) => {
            const y = yPositions[rowIndex];
            return (
              <g key={`labels-${houseId}`}>
                <line x1={chartLeft - 8} x2={chartLeft} y1={y} y2={y} stroke="#1c1917" strokeWidth="1.15" opacity="0.65" />
                <line x1={chartRight} x2={chartRight + 8} y1={y} y2={y} stroke="#1c1917" strokeWidth="1.15" opacity="0.65" />
                <text x={leftLabelX} y={y} textAnchor="end" dominantBaseline="middle" className="fill-stone-900 text-[32px] font-bold">
                  {houseId}
                </text>
                <text x={chartRight + rightDigitsWidth / 2} y={y} textAnchor="middle" dominantBaseline="middle" className="fill-stone-700 text-[32px] font-bold">
                  {rowIndex + 1}
                </text>
              </g>
            );
          })}

          <line x1={chartRight} x2={chartRight} y1={chartTop} y2={chartTop + chartHeight} stroke="#1c1917" strokeWidth="1.6" />
          <text x={chartRight + rightDigitsWidth / 2} y={chartTop + chartHeight + 36} textAnchor="middle" className="fill-stone-500 text-[18px] font-bold uppercase tracking-[0.24em]">
            порядок
          </text>
          <text x={leftLabelX} y={chartTop + chartHeight + 36} textAnchor="end" className="fill-stone-500 text-[18px] font-bold uppercase tracking-[0.24em]">
            дома
          </text>
        </g>
      </svg>
    </div>
  );
}
