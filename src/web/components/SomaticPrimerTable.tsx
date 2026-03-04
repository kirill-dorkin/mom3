import type { SomaticSeriesDefinition } from "../../types/book";
import type { SomaticTableRow } from "../../core/projections/somaticView";

interface SomaticPrimerTableProps {
  rows: SomaticTableRow[];
  series: SomaticSeriesDefinition[];
  selectedSeriesId: number;
}

export function SomaticPrimerTable({ rows, series, selectedSeriesId }: SomaticPrimerTableProps) {
  return (
    <div className="chart-card chart-card--wide">
      <div className="chart-card__header">
        <h3>Стартовая книжная таблица 0-2 лет</h3>
        <p>Шаблон страницы 134: сферы, системы здоровья и первые три строки возрастной прокрутки для текущей даты.</p>
      </div>
      <div className="table-shell">
        <table className="somatic-primer-table">
          <thead>
            <tr>
              <th>Серия</th>
              {series.map((entry) => (
                <th className={entry.id === selectedSeriesId ? "somatic-primer-table__head somatic-primer-table__head--highlighted" : "somatic-primer-table__head"} key={`series-id-${entry.id}`}>
                  {entry.id}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Сфера</th>
              {series.map((entry) => (
                <td className={entry.id === selectedSeriesId ? "somatic-primer-table__cell somatic-primer-table__cell--highlighted" : "somatic-primer-table__cell"} key={`sphere-${entry.id}`}>
                  {entry.sphereName}
                </td>
              ))}
            </tr>
            <tr>
              <th>Здоровье</th>
              {series.map((entry) => (
                <td className={entry.id === selectedSeriesId ? "somatic-primer-table__cell somatic-primer-table__cell--highlighted" : "somatic-primer-table__cell"} key={`health-${entry.id}`}>
                  {entry.healthName}
                </td>
              ))}
            </tr>
            {rows.map((row) => (
              <tr key={`primer-age-${row.age}`}>
                <th>{row.age} {row.age === 1 ? "год" : row.age === 0 ? "лет" : "года"}</th>
                {series.map((entry) => (
                  <td className={entry.id === selectedSeriesId ? "somatic-primer-table__cell somatic-primer-table__cell--highlighted" : "somatic-primer-table__cell"} key={`age-${row.age}-series-${entry.id}`}>
                    {row.cells[entry.id]?.digit ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
