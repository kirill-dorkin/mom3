import type { HoneycombToneRow } from "../../core/projections/honeycombFrameView";

interface HoneycombToneTableProps {
  rows: HoneycombToneRow[];
  selectedArcana?: number;
  onSelectArcana?: (arcana: number) => void;
}

export function HoneycombToneTable({ rows, selectedArcana, onSelectArcana }: HoneycombToneTableProps) {
  return (
    <div className="table-shell">
      <table className="honeycomb-table">
        <thead>
          <tr>
            <th>Тон</th>
            <th>Смысл</th>
            <th>Сырьё</th>
            <th>Аркан</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <th>{row.label}</th>
              <td>{row.description}</td>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
