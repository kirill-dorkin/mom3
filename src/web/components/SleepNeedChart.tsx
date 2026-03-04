import type { SleepNeedByAgeGroup } from "../../types/book";

interface SleepNeedChartProps {
  groups: SleepNeedByAgeGroup[];
}

export function SleepNeedChart({ groups }: SleepNeedChartProps) {
  const maxHours = Math.max(...groups.map((group) => group.hoursMax), 1);

  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <h3>Потребность во сне по возрастам</h3>
        <p>Книжная шкала из главы 3. Высота столбца берётся по верхней границе диапазона, внутренняя риска показывает нижнюю границу.</p>
      </div>
      <div className="sleep-need-chart">
        {groups.map((group) => (
          <article className="sleep-need-chart__item" key={`${group.label}-${group.ageRange}`}>
            <div className="sleep-need-chart__bar-shell">
              <div
                className="sleep-need-chart__bar"
                style={{ height: `${(group.hoursMax / maxHours) * 100}%` }}
              >
                <span
                  className="sleep-need-chart__min-line"
                  style={{ bottom: `${(group.hoursMin / group.hoursMax) * 100}%` }}
                />
                <strong>{group.hoursLabel}</strong>
              </div>
            </div>
            <div className="sleep-need-chart__caption">
              <strong>{group.label}</strong>
              <span>{group.ageRange}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
