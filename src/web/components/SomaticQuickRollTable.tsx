import { SOMATIC_BOOK_DIGIT_ORDER, type SomaticQuickRollRow } from "../../core/projections/somaticView";

interface SomaticQuickRollTableProps {
  rows: SomaticQuickRollRow[];
  selectedAge: number;
  selectedBaseDigit: number;
  selectedSeriesLabel: string;
}

export function SomaticQuickRollTable({
  rows,
  selectedAge,
  selectedBaseDigit,
  selectedSeriesLabel
}: SomaticQuickRollTableProps) {
  const selectedRow = rows.find((row) => row.age === selectedAge) ?? null;
  const maxAge = rows[rows.length - 1]?.age ?? 0;

  return (
    <div className="chart-card chart-card--wide">
      <div className="chart-card__header">
        <h3>Книжная таблица быстрой прокрутки</h3>
        <p>
          Для серии {selectedSeriesLabel} базовая цифра в нулевом году равна {selectedBaseDigit}.{" "}
          {selectedRow
            ? `По печатной таблице на возрасте ${selectedAge} получается ${selectedRow.values[selectedBaseDigit]}.`
            : `Печатная таблица книги в текущем reference-блоке покрывает возраст 0-${maxAge} лет.`}
        </p>
      </div>
      <div className="table-shell">
        <table className="quick-roll-table">
          <thead>
            <tr>
              <th>Возраст</th>
              {SOMATIC_BOOK_DIGIT_ORDER.map((baseDigit) => (
                <th
                  className={baseDigit === selectedBaseDigit ? "quick-roll-table__head quick-roll-table__head--highlighted" : "quick-roll-table__head"}
                  key={`base-${baseDigit}`}
                >
                  {baseDigit}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr className={row.age === selectedAge ? "quick-roll-table__row quick-roll-table__row--highlighted" : "quick-roll-table__row"} key={`age-${row.age}`}>
                <th>{row.age}</th>
                {SOMATIC_BOOK_DIGIT_ORDER.map((baseDigit) => {
                  const isSelectedCell = row.age === selectedAge && baseDigit === selectedBaseDigit;

                  return (
                    <td
                      className={isSelectedCell ? "quick-roll-table__cell quick-roll-table__cell--selected" : "quick-roll-table__cell"}
                      key={`age-${row.age}-digit-${baseDigit}`}
                    >
                      {row.values[baseDigit]}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
