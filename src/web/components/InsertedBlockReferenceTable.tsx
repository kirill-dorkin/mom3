import type { InsertedBlockTimeline } from "../../core/projections/rootCycleView";

interface InsertedBlockReferenceTableProps {
  timeline: InsertedBlockTimeline;
}

export function InsertedBlockReferenceTable({ timeline }: InsertedBlockReferenceTableProps) {
  const seriesColumns =
    timeline.years[0]?.points.filter((point) => point.kind === "series") ?? [];

  return (
    <div className="chart-card chart-card--wide">
      <div className="chart-card__header">
        <h3>Таблица вставных блоков</h3>
        <p>Тот же переход по годам, но в табличном виде: `0..9` серии текущего года и вставной корень следующего года.</p>
      </div>
      <div className="table-shell">
        <table className="inserted-block-table">
          <thead>
            <tr>
              <th>Возраст</th>
              {seriesColumns.map((point) => (
                <th key={`inserted-series-head-${point.seriesId}`} title={point.seriesLabel}>
                  {point.seriesId}
                </th>
              ))}
              <th title="Корень следующего года">→</th>
            </tr>
          </thead>
          <tbody>
            {timeline.years.map((year) => (
              <tr key={`inserted-year-row-${year.age}`}>
                <th>{year.age}</th>
                {year.points.map((point) => (
                  <td
                    className={
                      point.seriesId === 0
                        ? "inserted-block-table__cell inserted-block-table__cell--root"
                        : "inserted-block-table__cell"
                    }
                    key={`inserted-year-${year.age}-series-${point.globalOffset}`}
                    title={point.seriesLabel}
                  >
                    {point.digit}
                  </td>
                ))}
                <td
                  className={
                    year.transitionToNext
                      ? "inserted-block-table__cell inserted-block-table__cell--transition"
                      : "inserted-block-table__cell inserted-block-table__cell--empty"
                  }
                  title={year.transitionToNext?.seriesLabel ?? "Переход дальше не строится"}
                >
                  {year.transitionToNext?.digit ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
