import { memo } from "react";
import { knowledgeBase } from "../../book/knowledgeBase";
import type { SomaticTableRow } from "../../core/projections/somaticView";

interface DecadeHeatTableProps {
  rows: SomaticTableRow[];
  highlightedSeriesId?: number;
}

function getCellTone(digit: number): "positive" | "negative" {
  return digit <= 4 ? "positive" : "negative";
}

export const DecadeHeatTable = memo(function DecadeHeatTable({ rows, highlightedSeriesId }: DecadeHeatTableProps) {
  const series = knowledgeBase.somaticSeries;

  return (
    <div className="table-shell">
      <table className="heat-table">
        <thead>
          <tr>
            <th>Возраст</th>
            {series.map((item) => (
              <th className={item.id === highlightedSeriesId ? "heat-table__head--highlighted" : undefined} key={item.id}>
                <span className="heat-table__head-title">{item.sphereName}</span>
                <span className="heat-table__head-subtitle">{item.healthName}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.age}>
              <th>{row.age}</th>
              {series.map((item) => {
                const cell = row.cells[item.id];
                return (
                  <td
                    className={`heat-table__cell heat-table__cell--${getCellTone(cell.digit)} ${item.id === highlightedSeriesId ? "heat-table__cell--highlighted" : ""}`}
                    key={`${row.age}-${item.id}`}
                    title={`${item.sphereName}: ${cell.digit} / ${cell.energyScore > 0 ? `+${cell.energyScore}` : cell.energyScore}`}
                  >
                    <span className="heat-table__digit">{cell.digit}</span>
                    <span className="heat-table__score">{cell.energyScore > 0 ? `+${cell.energyScore}` : cell.energyScore}</span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

DecadeHeatTable.displayName = "DecadeHeatTable";
