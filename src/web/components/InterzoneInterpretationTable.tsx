import type { InterzoneReference } from "../../types/book";

interface InterzoneInterpretationTableProps {
  reference: InterzoneReference;
}

export function InterzoneInterpretationTable({ reference }: InterzoneInterpretationTableProps) {
  return (
    <div className="chart-card chart-card--wide">
      <div className="chart-card__header">
        <h3>Книжная таблица трактовок межзонья</h3>
        <p>Стр. 139-140. После месячной раздвижки выбирается строка по сочетанию зоны и направления линии.</p>
      </div>
      <div className="table-shell">
        <table className="interzone-table interzone-reference-table">
          <thead>
            <tr>
              <th>Положительная зона</th>
              <th>Направление</th>
              <th>Отрицательная зона</th>
            </tr>
          </thead>
          <tbody>
            {reference.rows.map((row) => (
              <tr key={row.direction}>
                <td>{row.positiveZone}</td>
                <th className="interzone-reference-table__direction">{row.directionLabel}</th>
                <td>{row.negativeZone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="interzone-reference-table__notes">
        {reference.notes.map((note) => (
          <p key={note}>{note}</p>
        ))}
      </div>
    </div>
  );
}
