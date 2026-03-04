import type { SomaticQuickRollDerivation } from "../../core/projections/somaticView";

interface SomaticQuickRollExplainBookProps {
  derivation: SomaticQuickRollDerivation;
  selectedSeriesId: number;
}

function formatAgeLabel(age: number): string {
  if (age === 1) {
    return "1 год";
  }

  if (age >= 2 && age <= 4) {
    return `${age} года`;
  }

  return `${age} лет`;
}

export function SomaticQuickRollExplainBook({ derivation, selectedSeriesId }: SomaticQuickRollExplainBookProps) {
  const selectedStep = derivation.steps.find((step) => step.seriesId === selectedSeriesId) ?? derivation.steps[0];
  const targetAgeLabel = formatAgeLabel(derivation.targetAge);

  return (
    <div className="chart-card chart-card--wide">
      <div className="chart-card__header">
        <h3>Книжный разбор прокрутки возраста</h3>
        <p>
          Страницы {`147-150`}: берём цифры строки `0 лет`, ищем их в строке {targetAgeLabel} справочной таблицы и получаем готовую
          строку возраста.
        </p>
      </div>

      <div className="table-shell">
        <table className="quick-roll-derive-table">
          <thead>
            <tr>
              <th>Серия</th>
              {derivation.steps.map((step) => (
                <th
                  className={step.seriesId === selectedSeriesId ? "quick-roll-derive-table__head quick-roll-derive-table__head--highlighted" : "quick-roll-derive-table__head"}
                  key={`series-${step.seriesId}`}
                >
                  {step.seriesId}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Сфера</th>
              {derivation.steps.map((step) => (
                <td
                  className={step.seriesId === selectedSeriesId ? "quick-roll-derive-table__cell quick-roll-derive-table__cell--highlighted" : "quick-roll-derive-table__cell"}
                  key={`sphere-${step.seriesId}`}
                >
                  {step.sphereName}
                </td>
              ))}
            </tr>
            <tr>
              <th>0 лет</th>
              {derivation.steps.map((step) => (
                <td
                  className={step.seriesId === selectedSeriesId ? "quick-roll-derive-table__cell quick-roll-derive-table__cell--highlighted" : "quick-roll-derive-table__cell"}
                  key={`source-${step.seriesId}`}
                >
                  {step.sourceDigit}
                </td>
              ))}
            </tr>
            <tr>
              <th>{targetAgeLabel}</th>
              {derivation.steps.map((step) => (
                <td
                  className={step.seriesId === selectedSeriesId ? "quick-roll-derive-table__cell quick-roll-derive-table__cell--highlighted" : "quick-roll-derive-table__cell"}
                  key={`result-${step.seriesId}`}
                >
                  {step.resultDigit}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="table-shell">
        <table className="quick-roll-derive-table quick-roll-derive-table--lookup">
          <thead>
            <tr>
              <th>Столбец</th>
              {derivation.lookupOrder.map((digit) => (
                <th className={digit === selectedStep.sourceDigit ? "quick-roll-derive-table__head quick-roll-derive-table__head--highlighted" : "quick-roll-derive-table__head"} key={`lookup-head-${digit}`}>
                  {digit}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>{targetAgeLabel}</th>
              {derivation.lookupOrder.map((digit) => (
                <td className={digit === selectedStep.sourceDigit ? "quick-roll-derive-table__cell quick-roll-derive-table__cell--selected" : "quick-roll-derive-table__cell"} key={`lookup-${digit}`}>
                  {derivation.lookupRow[digit]}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {selectedStep ? (
        <div className="note-card note-card--single">
          Для серии {selectedStep.seriesId} ({selectedStep.sphereName} / {selectedStep.healthName}) книга делает шаг: `0 лет ={" "}
          {selectedStep.sourceDigit}` → строка {targetAgeLabel}, столбец `{selectedStep.sourceDigit}` → результат `{selectedStep.resultDigit}`.
        </div>
      ) : null}
    </div>
  );
}
