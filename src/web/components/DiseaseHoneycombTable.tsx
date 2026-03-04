import type { DiseaseHoneycombSotaRow } from "../../core/projections/diseaseHoneycombView";

interface DiseaseHoneycombTableProps {
  rows: DiseaseHoneycombSotaRow[];
  candidateLabel: string;
}

function formatAges(ages: number[]): string {
  return ages.length > 0 ? ages.join(", ") : "—";
}

export function DiseaseHoneycombTable({ rows, candidateLabel }: DiseaseHoneycombTableProps) {
  return (
    <div className="chart-card chart-card--wide">
      <div className="chart-card__header">
        <h3>Сводная таблица по сотам</h3>
        <p>Сначала берём {candidateLabel.toLowerCase()}, затем оставляем только те годы, где сота реально активируется по домам.</p>
      </div>
      <div className="table-shell">
        <table className="disease-honeycomb-table">
          <thead>
            <tr>
              <th>Сота</th>
              <th>Системы</th>
              <th>Дома</th>
              <th>Кандидаты</th>
              <th>Подтверждено</th>
              <th>Исключено</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`disease-honeycomb-row-${row.sotaId}`}>
                <th>{row.sotaId}</th>
                <td>{row.healthFocus.join(", ")}</td>
                <td>{row.houseIds.join(", ")}</td>
                <td>{formatAges(row.candidateAges)}</td>
                <td className="disease-honeycomb-table__ages disease-honeycomb-table__ages--confirmed">
                  {formatAges(row.confirmedAges)}
                </td>
                <td className="disease-honeycomb-table__ages disease-honeycomb-table__ages--excluded">
                  {formatAges(row.excludedAges)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
