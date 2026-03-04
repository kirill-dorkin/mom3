import { knowledgeBase } from "../../book/knowledgeBase";
import type { SomaticSeriesTrajectory, SomaticTableRow } from "../../core/projections/somaticView";

interface SomaticSliceDiagramBookProps {
  rows: SomaticTableRow[];
  trajectory: SomaticSeriesTrajectory;
  selectedSeriesId: number;
  title: string;
}

function getCellTone(digit: number): "positive" | "negative" {
  return digit <= 4 ? "positive" : "negative";
}

export function SomaticSliceDiagramBook({
  rows,
  trajectory,
  selectedSeriesId,
  title
}: SomaticSliceDiagramBookProps) {
  const series = knowledgeBase.somaticSeries;
  const size = 360;
  const center = size / 2;
  const maxRadius = size * 0.41;
  const minRadius = size * 0.08;
  const radiusForDigit = (digit: number) => minRadius + (digit / 9) * (maxRadius - minRadius);
  const angleForIndex = (index: number) => Math.PI + (index / trajectory.points.length) * Math.PI * 2;
  const points = trajectory.points.map((point, index) => {
    const angle = angleForIndex(index);
    const radius = radiusForDigit(point.digit);

    return {
      ...point,
      angle,
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius
    };
  });
  const polygon = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <div className="chart-card chart-card--wide">
      <div className="chart-card__header">
        <h3>{title}</h3>
        <p>Книжный шаблон страницы 152: десятилетняя таблица сверху и вынесенный в круг выбранный столбец серии.</p>
      </div>
      <div className="slice-diagram-book">
        <div className="table-shell">
          <table className="slice-diagram-book__table">
            <thead>
              <tr>
                <th>Возраст</th>
                {series.map((item) => (
                  <th className={item.id === selectedSeriesId ? "slice-diagram-book__head slice-diagram-book__head--highlighted" : "slice-diagram-book__head"} key={`slice-head-${item.id}`}>
                    {item.id}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`slice-row-${row.age}`}>
                  <th>{row.age}</th>
                  {series.map((item) => {
                    const cell = row.cells[item.id];

                    return (
                      <td
                        className={`slice-diagram-book__cell slice-diagram-book__cell--${getCellTone(cell.digit)} ${
                          item.id === selectedSeriesId ? "slice-diagram-book__cell--highlighted" : ""
                        }`}
                        key={`slice-cell-${row.age}-${item.id}`}
                      >
                        {cell.digit}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <svg className="slice-diagram-book__polar" viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${title}: круговая схема`}>
          {Array.from({ length: 10 }, (_, digit) => (
            <circle className="slice-diagram-book__ring" key={`ring-${digit}`} cx={center} cy={center} r={radiusForDigit(digit)} />
          ))}
          {points.map((point) => (
            <line
              className="slice-diagram-book__axis"
              key={`axis-${point.age}`}
              x1={center}
              y1={center}
              x2={center + Math.cos(point.angle) * maxRadius}
              y2={center + Math.sin(point.angle) * maxRadius}
            />
          ))}
          {polygon.length > 0 ? <polygon className="slice-diagram-book__fill" points={polygon} /> : null}
          {points.length > 1 ? <polyline className="slice-diagram-book__line" fill="none" points={polygon} /> : null}
          {points.map((point) => (
            <g key={`slice-point-${point.age}`}>
              <circle className="slice-diagram-book__point" cx={point.x} cy={point.y} r="4" />
              <text
                className="slice-diagram-book__label"
                x={center + Math.cos(point.angle) * (maxRadius + 16)}
                y={center + Math.sin(point.angle) * (maxRadius + 16)}
                textAnchor="middle"
              >
                {point.age}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
