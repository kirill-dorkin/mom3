import type { LifetimeSummaryRow } from "../../core/projections/lifetimeShadowView";

interface LifetimeSummaryTableProps {
  rows: LifetimeSummaryRow[];
}

const ROMAN_SOTA_BY_ID: Record<number, string> = {
  1: "I",
  2: "II",
  3: "III",
  4: "IV",
  5: "V"
};

function groupRowsByType(rows: LifetimeSummaryRow[]): Array<{
  type: LifetimeSummaryRow["type"];
  label: string;
  definition: string;
  rows: LifetimeSummaryRow[];
}> {
  const grouped = new Map<
    LifetimeSummaryRow["type"],
    {
      type: LifetimeSummaryRow["type"];
      label: string;
      definition: string;
      rows: LifetimeSummaryRow[];
    }
  >();

  for (const row of rows) {
    const existing = grouped.get(row.type);
    if (existing) {
      existing.rows.push(row);
      continue;
    }

    grouped.set(row.type, {
      type: row.type,
      label: row.label,
      definition: row.definition,
      rows: [row]
    });
  }

  return [...grouped.values()];
}

export function LifetimeSummaryTable({ rows }: LifetimeSummaryTableProps) {
  const groupedRows = groupRowsByType(rows);

  return (
    <div className="chart-card chart-card--wide">
      <div className="chart-card__header">
        <h3>Итоговая таблица периодов</h3>
        <p>Компоновка приближена к финальной печатной таблице книги: тип периода, набор возрастов по сотам и одно определение на группу.</p>
      </div>
      <div className="table-shell">
        <table className="lifetime-table lifetime-table--book">
          <thead>
            <tr>
              <th>Тип периода</th>
              <th>Периоды</th>
              <th>Определение</th>
            </tr>
          </thead>
          <tbody>
            {groupedRows.map((group) =>
              group.rows.map((row, rowIndex) => (
                <tr key={`${group.type}-${row.sotaId}`}>
                  {rowIndex === 0 ? (
                    <th className={`lifetime-table__type-cell lifetime-table__type-cell--${group.type}`} rowSpan={group.rows.length}>
                      {group.label}
                    </th>
                  ) : null}
                  <td className="lifetime-table__periods-cell">
                    <div className="lifetime-table__ages">
                      {row.ages.map((age) => (
                        <span className="lifetime-table__age-chip" key={`${group.type}-${row.sotaId}-${age}`}>
                          {age}
                        </span>
                      ))}
                    </div>
                    <div className="lifetime-table__sota-caption">
                      в {ROMAN_SOTA_BY_ID[row.sotaId] ?? row.sotaId} соте
                      <span>{row.sotaName}</span>
                    </div>
                  </td>
                  {rowIndex === 0 ? (
                    <td className="lifetime-table__definition-cell" rowSpan={group.rows.length}>
                      {group.definition}
                    </td>
                  ) : null}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
