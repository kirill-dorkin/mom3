import type { HourlyCompatibilitySummary } from "../../core/calculations/hourlyBiorhythm";

interface HourlyCompatibilityWindowsProps {
  summary: HourlyCompatibilitySummary;
  primaryLabel: string;
  secondaryLabel: string;
}

function renderWindowMeta(
  primaryLabel: string,
  secondaryLabel: string,
  window: HourlyCompatibilitySummary["sharedPassiveWindows"][number]
): string {
  return `${window.durationHours} ч · ${primaryLabel}: ${window.primaryMinValue}-${window.primaryMaxValue} (ср. ${window.primaryAverageValue}) · ${secondaryLabel}: ${window.secondaryMinValue}-${window.secondaryMaxValue} (ср. ${window.secondaryAverageValue})`;
}

export function HourlyCompatibilityWindows({
  summary,
  primaryLabel,
  secondaryLabel
}: HourlyCompatibilityWindowsProps) {
  return (
    <div className="section-grid section-grid--two">
      <div className="chart-card">
        <div className="chart-card__header">
          <h3>Общие часы пассивности</h3>
          <p>Оба графика одновременно находятся ниже своих средних линий. В книге это участки для тишины, восстановления и мягкого режима.</p>
        </div>
        {summary.sharedPassiveWindows.length > 0 ? (
          <div className="window-list">
            {summary.sharedPassiveWindows.map((window) => (
              <article className="window-card window-card--sleep" key={`compat-passive-${window.label}`}>
                <strong>{window.label}</strong>
                <p>{renderWindowMeta(primaryLabel, secondaryLabel, window)}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="note-card note-card--single">
            Совпадающих пассивных окон не найдено.
          </div>
        )}
      </div>
      <div className="chart-card">
        <div className="chart-card__header">
          <h3>Общие часы активности</h3>
          <p>Оба графика одновременно выше своих средних линий. Эти интервалы подходят для общего действия, поездок, дел и разговоров.</p>
        </div>
        {summary.sharedActivityWindows.length > 0 ? (
          <div className="window-list">
            {summary.sharedActivityWindows.map((window) => (
              <article className="window-card window-card--activity" key={`compat-activity-${window.label}`}>
                <strong>{window.label}</strong>
                <p>{renderWindowMeta(primaryLabel, secondaryLabel, window)}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="note-card note-card--single">
            Совпадающих активных окон не найдено.
          </div>
        )}
      </div>
    </div>
  );
}
