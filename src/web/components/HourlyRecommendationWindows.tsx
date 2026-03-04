import type { HourlyRecommendationSummary } from "../../core/calculations/hourlyBiorhythm";

interface HourlyRecommendationWindowsProps {
  summary: HourlyRecommendationSummary;
}

function renderWindowMeta(window: HourlyRecommendationSummary["sleepWindows"][number]): string {
  return `${window.durationHours} ч · значения ${window.minValue}-${window.maxValue} · ср. ${window.averageValue}`;
}

export function HourlyRecommendationWindows({ summary }: HourlyRecommendationWindowsProps) {
  return (
    <div className="section-grid section-grid--two">
      <div className="chart-card">
        <div className="chart-card__header">
          <h3>Окна засыпания</h3>
          <p>Книга рекомендует искать здесь участки одновременно ниже средней линии и в диапазоне 1-3.</p>
        </div>
        {summary.sleepWindows.length > 0 ? (
          <div className="window-list">
            {summary.sleepWindows.map((window) => (
              <article className="window-card window-card--sleep" key={`sleep-window-${window.label}`}>
                <strong>{window.label}</strong>
                <p>{renderWindowMeta(window)}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="note-card note-card--single">
            На текущем суточном графике таких окон нет.
          </div>
        )}
      </div>
      <div className="chart-card">
        <div className="chart-card__header">
          <h3>Окна активности</h3>
          <p>Все часы выше средней линии. Именно сюда книга относит нагрузки, процедуры, приём лекарств и рабочие задачи.</p>
        </div>
        {summary.activityWindows.length > 0 ? (
          <div className="window-list">
            {summary.activityWindows.map((window) => (
              <article className="window-card window-card--activity" key={`activity-window-${window.label}`}>
                <strong>{window.label}</strong>
                <p>{renderWindowMeta(window)}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="note-card note-card--single">
            На текущем суточном графике нет часов выше средней линии.
          </div>
        )}
      </div>
    </div>
  );
}
