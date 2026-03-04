import type { HoneycombMetricTableRow } from "../../core/projections/honeycombFrameView";

interface HoneycombMetricTableProps {
  rows: HoneycombMetricTableRow[];
  selectedArcana?: number;
  onSelectArcana?: (arcana: number) => void;
}

export function HoneycombMetricTable({ rows, selectedArcana, onSelectArcana }: HoneycombMetricTableProps) {
  return (
    <div className="table-shell">
      <table className="honeycomb-table">
        <thead>
          <tr>
            <th>Ячейка</th>
            <th>Смысл</th>
            <th>Формула</th>
            <th>Сырой итог</th>
            <th>Аркан</th>
            <th>Органы-мишени</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <th>{row.label}</th>
              <td>{row.description}</td>
              <td className="honeycomb-table__formula">{row.formula}</td>
              <td>{row.rawValue}</td>
              <td>
                {onSelectArcana ? (
                  <button
                    className={`arcana-link-button arcana-link-button--cell ${selectedArcana === row.arcana ? "arcana-link-button--selected" : ""}`}
                    onClick={() => onSelectArcana(row.arcana)}
                    type="button"
                  >
                    {row.arcana}
                  </button>
                ) : (
                  row.arcana
                )}
              </td>
              <td>{row.targetHeading ?? "Нет оцифрованного заголовка"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
