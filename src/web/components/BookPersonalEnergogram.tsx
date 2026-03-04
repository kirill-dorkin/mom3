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
  const width = 1440;
  const height = 1120;
  const topAxisHeight = 112;
  const leftDigitsWidth = 116;
  const bodyPanelWidth = 252;
  const bodyInsetX = 14;
  const chartGap = 18;
  const chartWidth = 780;
  const rightDigitsWidth = 120;
  const rowCount = reversedOrder.length;
  const bodyX = leftDigitsWidth + bodyInsetX;
  const bodyWidth = bodyPanelWidth - bodyInsetX * 2;
  const chartLeft = leftDigitsWidth + bodyPanelWidth + chartGap;
  const chartTop = topAxisHeight;
  const chartHeight = height - chartTop - 88;
  const rowHeight = chartHeight / rowCount;
  const chartRight = chartLeft + chartWidth;
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
      y: chartTop + rowHeight * (rowIndex + 0.5)
    };
  });
  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <div className="mx-auto flex min-w-[90rem] max-w-[94rem] flex-col gap-5 rounded-[1rem] border-[1.5px] border-stone-800 bg-white px-8 py-8">
      <div className="text-center">
        <p className="text-[2.15rem] font-bold tracking-[0.02em] text-stone-950">Личная энергограмма</p>
        <p className="mt-1 text-[1.15rem] font-bold text-stone-500">{birthDate}</p>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="block h-auto w-full min-w-[88rem]" role="img" aria-label={`Личная энергограмма для ${birthDate}`}>
        <image
          href={manImage}
          x={bodyX}
          y={chartTop}
          width={bodyWidth}
          height={chartHeight}
          preserveAspectRatio="xMidYMid meet"
        />

        <rect x={chartLeft} y={chartTop} width={chartWidth} height={chartHeight} fill="#ffffff" stroke="#1c1917" strokeWidth="1.6" />

        {Array.from({ length: rowCount + 1 }, (_, index) => {
          const y = chartTop + rowHeight * index;
          return <line key={`row-${index}`} x1={chartLeft} x2={chartRight} y1={y} y2={y} stroke="#44403c" strokeOpacity="0.45" strokeWidth="1.05" />;
        })}

        {labels.map((value) => {
          const x = chartLeft + ((value - plotMin) / (plotMax - plotMin)) * chartWidth;
          return (
            <g key={`axis-${value}`}>
              <line x1={x} x2={x} y1={chartTop} y2={chartTop + chartHeight} stroke={value === 0 ? "#1c1917" : "#78716c"} strokeOpacity={value === 0 ? "0.8" : "0.25"} strokeWidth={value === 0 ? "1.7" : "1"} />
              <text x={x} y={54} textAnchor="middle" className="fill-stone-900 text-[34px] font-bold">
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
          const y = chartTop + rowHeight * (rowIndex + 0.5) + 10;
          return (
            <g key={`labels-${houseId}`}>
              <text x={leftDigitsWidth - 20} y={y} textAnchor="end" className="fill-stone-900 text-[40px] font-bold">
                {houseId}
              </text>
              <text x={chartRight + rightDigitsWidth / 2} y={y} textAnchor="middle" className="fill-stone-700 text-[38px] font-bold">
                {rowIndex + 1}
              </text>
            </g>
          );
        })}

        <line x1={chartRight} x2={chartRight} y1={chartTop} y2={chartTop + chartHeight} stroke="#1c1917" strokeWidth="1.6" />
        <line x1={chartRight + rightDigitsWidth} x2={chartRight + rightDigitsWidth} y1={chartTop} y2={chartTop + chartHeight} stroke="#1c1917" strokeWidth="1.2" opacity="0.6" />
        <text x={chartRight + rightDigitsWidth / 2} y={chartTop + chartHeight + 42} textAnchor="middle" className="fill-stone-500 text-[20px] font-bold uppercase tracking-[0.24em]">
          порядок
        </text>
        <text x={leftDigitsWidth - 20} y={chartTop + chartHeight + 42} textAnchor="end" className="fill-stone-500 text-[20px] font-bold uppercase tracking-[0.24em]">
          дома
        </text>
      </svg>
    </div>
  );
}
