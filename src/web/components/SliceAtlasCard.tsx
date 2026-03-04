import type { SomaticSliceAtlasEntry } from "../../core/projections/somaticView";

interface SliceAtlasCardProps {
  entry: SomaticSliceAtlasEntry;
  selected: boolean;
  onSelect: (seriesId: number) => void;
}

function polarToCartesian(center: number, radius: number, angle: number): { x: number; y: number } {
  return {
    x: center + Math.cos(angle) * radius,
    y: center + Math.sin(angle) * radius
  };
}

export function SliceAtlasCard({ entry, selected, onSelect }: SliceAtlasCardProps) {
  const size = 240;
  const center = size / 2;
  const maxRadius = 84;
  const minRadius = 22;
  const pointCount = Math.max(entry.trajectory.points.length, 1);
  const radiusForDigit = (digit: number) => minRadius + (digit / 9) * (maxRadius - minRadius);
  const angleForIndex = (index: number) => (-Math.PI / 2) + (index / pointCount) * Math.PI * 2;
  const pointCoords = entry.trajectory.points.map((point, index) => {
    const angle = angleForIndex(index);
    const radius = radiusForDigit(point.digit);

    return {
      ...point,
      angle,
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius
    };
  });
  const polygon = pointCoords.map((point) => `${point.x},${point.y}`).join(" ");
  const ageFrom = entry.trajectory.points[0]?.age ?? 0;
  const ageTo = entry.trajectory.points[entry.trajectory.points.length - 1]?.age ?? ageFrom;

  return (
    <button
      type="button"
      className={`slice-atlas-card ${selected ? "slice-atlas-card--selected" : ""}`}
      onClick={() => onSelect(entry.seriesId)}
      aria-pressed={selected}
    >
      <div className="slice-atlas-card__header">
        <div>
          <h3>{entry.sphereName}</h3>
          <p>{entry.healthName}</p>
        </div>
        {selected ? <span className="slice-atlas-card__badge">В фокусе</span> : null}
      </div>
      <svg className="slice-atlas-card__chart" viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Срез энергограммы: ${entry.sphereName}`}>
        {Array.from({ length: 10 }, (_, digit) => (
          <circle className="slice-atlas-card__ring" key={`ring-${digit}`} cx={center} cy={center} r={radiusForDigit(digit)} />
        ))}
        {pointCoords.map((point) => (
          <line
            className="slice-atlas-card__axis"
            key={`axis-${entry.seriesId}-${point.age}`}
            x1={center}
            x2={polarToCartesian(center, maxRadius + 10, point.angle).x}
            y1={center}
            y2={polarToCartesian(center, maxRadius + 10, point.angle).y}
          />
        ))}
        {polygon.length > 0 ? <polygon className="slice-atlas-card__fill" points={polygon} /> : null}
        {pointCoords.length > 1 ? <polyline className="slice-atlas-card__line" fill="none" points={polygon} /> : null}
        {pointCoords.map((point) => (
          <g key={`point-${entry.seriesId}-${point.age}`}>
            <circle className="slice-atlas-card__point" cx={point.x} cy={point.y} r="3.8" />
            <text
              className="slice-atlas-card__label"
              x={polarToCartesian(center, maxRadius + 20, point.angle).x}
              y={polarToCartesian(center, maxRadius + 20, point.angle).y}
              textAnchor="middle"
            >
              {point.age}
            </text>
          </g>
        ))}
      </svg>
      <div className="slice-atlas-card__meta">
        <span>{ageFrom}-{ageTo} лет</span>
        <span>+ зона {entry.positiveYears} · - зона {entry.negativeYears}</span>
      </div>
      <div className="slice-atlas-card__digits" aria-hidden="true">
        {entry.trajectory.points.map((point) => (
          <span
            className={`slice-atlas-card__digit ${point.digit <= 4 ? "slice-atlas-card__digit--positive" : "slice-atlas-card__digit--negative"}`}
            key={`digit-${entry.seriesId}-${point.age}`}
          >
            {point.digit}
          </span>
        ))}
      </div>
    </button>
  );
}
