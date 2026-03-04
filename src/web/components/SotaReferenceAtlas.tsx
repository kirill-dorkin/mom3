import { knowledgeBase } from "../../book/knowledgeBase";
import type { SotaReferenceDefinition } from "../../types/book";

export interface SotaReferenceFocusContext {
  sotaId: number;
  ages: number[];
  focusSystems: string[];
  triggerHouseIds: number[];
  metricLabel: string;
  segmentLabel: string;
  sourceMode: "current" | "previous";
  arcana: number;
  targetHeading: string | null;
}

interface SotaReferenceAtlasProps {
  entries: SotaReferenceDefinition[];
  selectedSotaId: number;
  onSelectSota: (sotaId: number) => void;
  focusContext?: SotaReferenceFocusContext | null;
}

function normalizeSystemLabel(value: string): string {
  return value.toLocaleLowerCase("ru-RU").replace(/ё/g, "е").replace(/\s+/g, " ").trim();
}

function getSystemAliases(value: string): string[] {
  const normalized = normalizeSystemLabel(value);

  if (normalized === "жкт" || normalized.includes("пищевар")) {
    return ["жкт", "пищеварительная система"];
  }

  if (normalized.includes("мочевыдел") || normalized.includes("выделитель")) {
    return ["мочевыделительная система", "выделительная система"];
  }

  if (normalized.includes("сосудистая и нервная")) {
    return ["сосудистая и нервная система", "нервная система", "психическая система", "нервно-психическая система"];
  }

  if (normalized.includes("нервно-псих")) {
    return ["нервно-психическая система", "нервная система", "психическая система"];
  }

  if (normalized.includes("нервная")) {
    return ["нервная система", "сосудистая и нервная система", "нервно-психическая система"];
  }

  if (normalized.includes("психичес")) {
    return ["психическая система", "нервно-психическая система", "сосудистая и нервная система"];
  }

  if (normalized.includes("сердечно-кров") || normalized.includes("кровеносн")) {
    return ["кровеносная система", "сердечно-кровеносная система"];
  }

  return [normalized];
}

function isFocusedSystem(systemTitle: string, focusSystems: string[]): boolean {
  const titleAliases = new Set(getSystemAliases(systemTitle));

  return focusSystems.some((system) => getSystemAliases(system).some((alias) => titleAliases.has(alias)));
}

export function SotaReferenceAtlas({ entries, selectedSotaId, onSelectSota, focusContext }: SotaReferenceAtlasProps) {
  const entry = entries.find((item) => item.sotaId === selectedSotaId) ?? entries[0];
  const sota = knowledgeBase.sotas.find((item) => item.id === entry.sotaId) ?? knowledgeBase.sotas[0];
  const activeFocus = focusContext?.sotaId === entry.sotaId ? focusContext : null;

  return (
    <div className="sota-reference-atlas">
      <div className="sota-reference-atlas__toolbar">
        <div className="sota-reference-chip-grid">
          {entries.map((item) => {
            const currentSota = knowledgeBase.sotas.find((sotaEntry) => sotaEntry.id === item.sotaId);
            return (
              <button
                className={`sota-reference-chip ${item.sotaId === entry.sotaId ? "sota-reference-chip--active" : ""}`}
                key={`sota-reference-chip-${item.sotaId}`}
                onClick={() => onSelectSota(item.sotaId)}
                type="button"
              >
                <span>{item.sotaId} сота</span>
                <strong>{currentSota?.healthFocus.join(" / ") ?? currentSota?.name ?? `Сота ${item.sotaId}`}</strong>
              </button>
            );
          })}
        </div>
      </div>

      {activeFocus ? (
        <div className="note-card note-card--single note-card--action sota-reference-focus-card">
          <strong>
            {activeFocus.sourceMode === "previous"
              ? "Предыдущая временная ячейка риска"
              : "Фокус риска по подтверждённым годам"}
          </strong>
          <p>
            Годы: {activeFocus.ages.join(", ")}. Диапазон: {activeFocus.segmentLabel}. Временная ячейка: {activeFocus.metricLabel} ={" "}
            {activeFocus.arcana}. Дома:{" "}
            {activeFocus.triggerHouseIds.join(", ") || "—"}.
          </p>
          <p>
            {activeFocus.focusSystems.length > 0
              ? `Системы фокуса: ${activeFocus.focusSystems.join(", ")}.`
              : "Для предыдущей временной ячейки сайт не навязывает автофильтр по системам: книга рекомендует проверить всю соту и аркан целиком."}
          </p>
          <p>{activeFocus.targetHeading ?? "Заголовок органов-мишеней для этого аркана ещё не оцифрован."}</p>
          <button className="sota-reference-focus-card__button" onClick={() => onSelectSota(entry.sotaId)} type="button">
            Показать всю соту без фокуса
          </button>
        </div>
      ) : null}

      <div className="section-grid section-grid--two">
        <div className="chart-card">
          <div className="chart-card__header">
            <h3>
              {entry.sotaId} сота · {sota.name}
            </h3>
            <p>
              Дома: {sota.houses.join(", ")}. Системы и органы: стр. {entry.healthSource.pdfPages.join(", ")}.
            </p>
          </div>
          <div className="sota-reference-systems">
            {entry.systems.map((system) => (
              <article
                className={`sota-reference-system-card ${activeFocus && isFocusedSystem(system.title, activeFocus.focusSystems) ? "sota-reference-system-card--focused" : ""}`}
                key={`${entry.sotaId}-${system.title}`}
              >
                <strong>{system.title}</strong>
                <p>{system.summary}</p>
                <div className="sota-reference-organ-list">
                  {system.organs.map((organ) => (
                    <span
                      className={`sota-reference-organ-chip ${activeFocus && isFocusedSystem(system.title, activeFocus.focusSystems) ? "sota-reference-organ-chip--focused" : ""}`}
                      key={`${entry.sotaId}-${system.title}-${organ}`}
                    >
                      {organ}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-card__header">
            <h3>{entry.lifeTitle}</h3>
            <p>Толкование соты для жизни: стр. {entry.lifeSource.pdfPages.join(", ")}.</p>
          </div>
          <div className="note-grid note-grid--single-column">
            <article className="note-card">
              <strong>Основная идея</strong>
              <p>{entry.lifeSummary.coreIdea}</p>
            </article>
            <article className="note-card">
              <strong>Положительная зона</strong>
              <p>{entry.lifeSummary.positiveSummary}</p>
            </article>
            <article className="note-card">
              <strong>Отрицательная зона</strong>
              <p>{entry.lifeSummary.negativeSummary}</p>
            </article>
            <article className="note-card note-card--action">
              <strong>Урок соты</strong>
              <p>{entry.lifeSummary.lesson}</p>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}
