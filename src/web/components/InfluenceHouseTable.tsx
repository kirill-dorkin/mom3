import type { PairedInfluenceHouseRow } from "../../core/projections/pairedInfluenceView";

interface InfluenceHouseTableProps {
  rows: PairedInfluenceHouseRow[];
}

export function InfluenceHouseTable({ rows }: InfluenceHouseTableProps) {
  return (
    <div className="table-shell">
      <table className="influence-table">
        <thead>
          <tr>
            <th>Дом</th>
            <th>Система</th>
            <th>Было</th>
            <th>Стало</th>
            <th>Дельта</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.houseId}>
              <th>
                <span className="influence-table__house-id">{row.houseId}</span>
                <span className="influence-table__house-name">{row.houseName}</span>
              </th>
              <td>{row.bodySystem}</td>
              <td>{row.baseScore > 0 ? `+${row.baseScore}` : row.baseScore}</td>
              <td>{row.influencedScore > 0 ? `+${row.influencedScore}` : row.influencedScore}</td>
              <td className={`influence-table__delta influence-table__delta--${row.trend}`}>
                {row.deltaScore > 0 ? `+${row.deltaScore}` : row.deltaScore}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
