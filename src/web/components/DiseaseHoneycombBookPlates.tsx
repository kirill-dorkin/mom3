import type { CSSProperties } from "react";
import type { DiseaseHoneycombBookOffsetStatus, DiseaseHoneycombBookView } from "../../core/projections/diseaseHoneycombBookView";

const OFFSET_LABELS = ["0 лет", "1 год", "2 года", "3 года", "4 года", "5 лет", "6 лет", "7 лет", "8 лет", "9 лет"];

const SOMA_COLOR_BY_NAME: Record<string, string> = {
  Серый: "#dfe4ef",
  Красный: "#f6d1d1",
  Оранжевый: "#f8dec0",
  Желтый: "#f5efb6",
  Зеленый: "#d9ebc7",
  Голубой: "#cfe7f4",
  Синий: "#c8d5f1",
  Фиолетовый: "#d7cff1",
  Розовый: "#f6d2dd"
};

function formatAgeCell(ages: number[]): string {
  return ages.length > 0 ? ages.join(" / ") : "";
}

function getCandidateStatusLabel(status: DiseaseHoneycombBookOffsetStatus): string {
  switch (status) {
    case "confirmed":
      return "Подтверждено";
    case "excluded":
      return "Снято";
    case "mixed":
      return "Смешано";
    default:
      return "Нет кандидатов";
  }
}

function getPointCoordinates(offset: number, radius: number, center: number): { x: number; y: number; angle: number } {
  const angle = ((180 + offset * 36) * Math.PI) / 180;

  return {
    angle,
    x: center + Math.cos(angle) * radius,
    y: center - Math.sin(angle) * radius
  };
}

function getTextAnchor(x: number, center: number): "start" | "middle" | "end" {
  if (x > center + 12) {
    return "start";
  }
  if (x < center - 12) {
    return "end";
  }

  return "middle";
}

export function DiseaseHoneycombBookPlates({ view }: { view: DiseaseHoneycombBookView }) {
  const size = 300;
  const center = size / 2;
  const minRadius = 18;
  const maxRadius = 116;
  const radiusForDigit = (digit: number) => minRadius + (digit / 9) * (maxRadius - minRadius);
  const thresholdRadius = radiusForDigit(4.5);

  return (
    <div className="disease-book-board">
      <div className="note-grid">
        {view.notes.map((note) => (
          <div className="note-card" key={note}>
            <strong>Книжный шаблон</strong>
            <p>{note}</p>
          </div>
        ))}
      </div>
      <div className="disease-book-grid">
        {view.rows.map((row) => (
          <article className="disease-book-plate" key={`disease-book-${row.sotaId}`}>
            <div className="disease-book-plate__header">
              <div>
                <div className="disease-book-plate__eyebrow">{row.romanLabel} сота</div>
                <h3>
                  {row.healthFocus.join(", ")} = дома {row.houseIds.join(" и ")}
                </h3>
              </div>
              <div className="disease-book-plate__meta">
                <span>Кандидаты: {row.candidateAges.join(", ") || "—"}</span>
                <span>Подтверждено: {row.confirmedAges.join(", ") || "—"}</span>
                <span>Снято: {row.excludedAges.join(", ") || "—"}</span>
              </div>
            </div>

            <div className={`disease-book-plate__charts disease-book-plate__charts--count-${Math.min(row.houses.length, 3)}`}>
              {row.houses.map((house) => {
                const points = house.points.map((point) => {
                  const radius = radiusForDigit(point.digit);
                  return {
                    ...point,
                    ...getPointCoordinates(point.offset, radius, center)
                  };
                });
                const pointsAttr = points.map((point) => `${point.x},${point.y}`).join(" ");

                return (
                  <article className="disease-book-chart-card" key={`disease-book-chart-${row.sotaId}-${house.houseId}`}>
                    <div className="disease-book-chart-card__title">{house.bodySystem}</div>
                    <svg
                      aria-label={`${row.romanLabel} сота, дом ${house.houseId}, ${house.bodySystem}`}
                      className="disease-book-radar"
                      role="img"
                      viewBox={`0 0 ${size} ${size}`}
                    >
                      {Array.from({ length: 10 }, (_, digit) => (
                        <circle
                          className="disease-book-radar__ring"
                          cx={center}
                          cy={center}
                          key={`ring-${row.sotaId}-${house.houseId}-${digit}`}
                          r={radiusForDigit(digit)}
                        />
                      ))}
                      <circle className="disease-book-radar__threshold" cx={center} cy={center} r={thresholdRadius} />
                      {house.points.map((point) => {
                        const axisPoint = getPointCoordinates(point.offset, maxRadius + 6, center);
                        const labelPoint = getPointCoordinates(point.offset, maxRadius + 18, center);

                        return (
                          <g key={`axis-${row.sotaId}-${house.houseId}-${point.offset}`}>
                            <line className="disease-book-radar__axis" x1={center} x2={axisPoint.x} y1={center} y2={axisPoint.y} />
                            <text
                              className="disease-book-radar__age-label"
                              textAnchor={getTextAnchor(labelPoint.x, center)}
                              x={labelPoint.x}
                              y={labelPoint.y}
                            >
                              {OFFSET_LABELS[point.offset]}
                            </text>
                          </g>
                        );
                      })}
                      <polyline className="disease-book-radar__line" fill="none" points={pointsAttr} />
                      {points.map((point) => (
                        <g key={`point-${row.sotaId}-${house.houseId}-${point.offset}`}>
                          <circle
                            className={`disease-book-radar__point disease-book-radar__point--${point.candidateStatus} ${point.colored ? "disease-book-radar__point--colored" : ""}`}
                            cx={point.x}
                            cy={point.y}
                            r={point.candidateAges.length > 0 ? 5.4 : 4}
                          />
                        </g>
                      ))}
                    </svg>
                    <div className="disease-book-chart-card__caption">
                      Дом {house.houseId} · {house.houseName} · {house.somaColorName}
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="table-shell">
              <table className="disease-book-table">
                <thead>
                  <tr>
                    <th>{row.romanLabel} сота</th>
                    {row.ageCells.map((cell) => (
                      <th key={`disease-book-offset-${row.sotaId}-${cell.offset}`}>{cell.offset}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>возраст</th>
                    {row.ageCells.map((cell) => (
                      <td
                        className={`disease-book-table__age-cell disease-book-table__age-cell--${cell.status}`}
                        key={`disease-book-age-cell-${row.sotaId}-${cell.offset}`}
                        title={getCandidateStatusLabel(cell.status)}
                      >
                        {formatAgeCell(cell.ages)}
                      </td>
                    ))}
                  </tr>
                  {row.houses.map((house) => (
                    <tr
                      className="disease-book-table__house-row"
                      key={`disease-book-row-${row.sotaId}-${house.houseId}`}
                      style={{ "--disease-book-house-fill": SOMA_COLOR_BY_NAME[house.somaColorName] ?? "#eef1f6" } as CSSProperties}
                    >
                      <th>
                        {house.houseId} дом
                        <span>{house.bodySystem}</span>
                      </th>
                      {house.points.map((point) => (
                        <td
                          className={`disease-book-table__digit-cell ${point.colored ? "disease-book-table__digit-cell--colored" : ""} disease-book-table__digit-cell--${point.candidateStatus}`}
                          key={`disease-book-digit-${row.sotaId}-${house.houseId}-${point.offset}`}
                          title={`${OFFSET_LABELS[point.offset]} · ${getCandidateStatusLabel(point.candidateStatus)}`}
                        >
                          {point.digit}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
