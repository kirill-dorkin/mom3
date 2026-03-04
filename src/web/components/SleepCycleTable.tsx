import type { ChildSleepNorm, SleepCycleChangeRow } from "../../types/book";

interface SleepCycleTableProps {
  ageColumns: string[];
  rows: SleepCycleChangeRow[];
  childNorms: ChildSleepNorm[];
}

export function SleepCycleTable({ ageColumns, rows, childNorms }: SleepCycleTableProps) {
  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <h3>Изменение циклов сна с возрастом</h3>
        <p>Таблица воспроизводится по книге без правки спорных заголовков. Ниже отдельно вынесены детские возрастные нормы.</p>
      </div>
      <div className="table-shell">
        <table className="sleep-cycle-table">
          <thead>
            <tr>
              <th>Показатель</th>
              {ageColumns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.metric}>
                <td>{row.metric}</td>
                {row.values.map((value, index) => (
                  <td key={`${row.metric}-${ageColumns[index] ?? index}`}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="child-sleep-list">
        {childNorms.map((norm) => (
          <article className="child-sleep-card" key={norm.ageRange}>
            <strong>{norm.ageRange}</strong>
            <p>Дневной сон: {norm.daySleep}.</p>
            <p>Ночной сон: {norm.nightSleep}.</p>
          </article>
        ))}
      </div>
    </div>
  );
}
