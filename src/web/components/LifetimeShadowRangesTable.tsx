import type { LifetimeShadowSegment } from "../../core/calculations/lifetimeShadow";

interface LifetimeShadowRangesTableProps {
  title: string;
  subtitle: string;
  segments: LifetimeShadowSegment[];
}

function getDirectionLabel(direction: LifetimeShadowSegment["direction"]): string {
  return direction === "positive" ? "+" : "-";
}

export function LifetimeShadowRangesTable({ title, subtitle, segments }: LifetimeShadowRangesTableProps) {
  return (
    <div className="chart-card chart-card--wide">
      <div className="chart-card__header">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      <div className="table-shell">
        <table className="lifetime-table">
          <thead>
            <tr>
              <th>Период</th>
              <th>Знак</th>
              <th>Сота</th>
              <th>Толкование</th>
            </tr>
          </thead>
          <tbody>
            {segments.map((segment) => (
              <tr key={`${title}-${segment.source}-${segment.segmentIndex}`}>
                <td>
                  [{segment.ageFrom}-{segment.ageTo}]
                </td>
                <td className={segment.direction === "positive" ? "lifetime-table__sign--positive" : "lifetime-table__sign--negative"}>
                  {getDirectionLabel(segment.direction)}
                </td>
                <td>{segment.sotaId}</td>
                <td>{segment.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
