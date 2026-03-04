import { useDeferredValue, useState } from "react";
import { buildArcanaHealthFocusView } from "../../core/projections/arcanaHealthFocusView";
import { searchArcanaHealthProfiles } from "../../core/projections/arcanaHealthSearch";
import type { ArcanaHealthProfile } from "../../types/book";

interface ArcanaAtlasMatch {
  label: string;
  description: string;
}

export interface ArcanaAtlasFocusContext {
  arcana: number;
  ages: number[];
  sotaId: number;
  focusSystems: string[];
  triggerHouseIds: number[];
  metricLabel: string;
  segmentLabel: string;
  sourceMode: "current" | "previous";
  targetHeading: string | null;
}

interface ArcanaHealthAtlasProps {
  profiles: ArcanaHealthProfile[];
  selectedArcana: number;
  onSelect: (arcana: number) => void;
  currentMatches?: ArcanaAtlasMatch[];
  focusContext?: ArcanaAtlasFocusContext | null;
  onResetFocus?: () => void;
  targetHeading: string | null;
  treatmentMistakeFactor: string | null;
}

const ARCANA_SEARCH_QUICK_FILTERS = [
  "онкология",
  "аллергия",
  "беременность",
  "репродуктивная система",
  "почки",
  "сердце",
  "травмы",
  "зависимости",
  "психика",
  "кожа"
];

export function ArcanaHealthAtlas({
  profiles,
  selectedArcana,
  onSelect,
  currentMatches = [],
  focusContext,
  onResetFocus,
  targetHeading,
  treatmentMistakeFactor
}: ArcanaHealthAtlasProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const profile = profiles.find((item) => item.arcana === selectedArcana) ?? profiles[0];
  const searchResults = searchArcanaHealthProfiles(profiles, deferredSearchQuery);
  const hasSearchQuery = deferredSearchQuery.trim().length > 0;
  const selectedSearchResult = searchResults.find((item) => item.arcana === profile.arcana) ?? null;
  const focusView =
    focusContext && focusContext.arcana === profile.arcana
      ? buildArcanaHealthFocusView(profile, {
          focusSystems: focusContext.focusSystems,
          targetHeading: focusContext.targetHeading
        })
      : null;

  return (
    <div className="arcana-atlas">
      <div className="arcana-atlas__toolbar">
        <div className="arcana-atlas__controls">
          <label className="arcana-atlas__select">
            Аркан
            <select value={profile.arcana} onChange={(event) => onSelect(Number(event.target.value))}>
              {profiles.map((item) => (
                <option key={`arcana-option-${item.arcana}`} value={item.arcana}>
                  {item.displayLabel} · {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="arcana-atlas__search">
            Обратный поиск по болезни / органу
            <input
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Например: онкология, почки, беременность, аллергия"
              type="text"
              value={searchQuery}
            />
            <span className="arcana-atlas__search-hint">
              Поиск идёт по органам-мишеням, проявлениям, ошибкам лечения и урокам болезни.
            </span>
          </label>
        </div>
        <div className="arcana-atlas__quick-filters">
          {ARCANA_SEARCH_QUICK_FILTERS.map((filter) => (
            <button
              className={`arcana-atlas__quick-filter ${deferredSearchQuery === filter ? "arcana-atlas__quick-filter--active" : ""}`}
              key={filter}
              onClick={() => setSearchQuery(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="arcana-chip-grid">
          {profiles.map((item) => (
            <button
              className={`arcana-chip ${item.arcana === profile.arcana ? "arcana-chip--active" : ""}`}
              key={`arcana-chip-${item.arcana}`}
              onClick={() => onSelect(item.arcana)}
              type="button"
            >
              <span>{item.displayLabel}</span>
              <strong>{item.name}</strong>
            </button>
          ))}
        </div>
      </div>

      {focusContext && focusContext.arcana === profile.arcana ? (
        <div className="note-card note-card--single note-card--action arcana-focus-card">
          <strong>{focusContext.sourceMode === "previous" ? "Предыдущая временная ячейка риска" : "Фокус риска из сот болезней"}</strong>
          <p>
            Аркан {focusContext.arcana} в {focusContext.sotaId} соте, диапазон {focusContext.segmentLabel}, ячейка{" "}
            {focusContext.metricLabel}. Годы: {focusContext.ages.join(", ")}. Дома: {focusContext.triggerHouseIds.join(", ") || "—"}.
          </p>
          <p>
            {focusContext.focusSystems.length > 0
              ? `Системы подтверждения: ${focusContext.focusSystems.join(", ")}.`
              : "Для предыдущей ячейки сайт не навязывает автоматическую системную фильтрацию: ориентиром остаются сам аркан и его органы-мишени."}
          </p>
          <p>{focusContext.targetHeading ?? "Заголовок органов-мишеней для этого риска ещё не оцифрован."}</p>
          {focusView && focusView.focusTargetItems.length > 0 ? (
            <div className="manifestation-chip-list">
              {focusView.focusTargetItems.map((item) => (
                <span className="manifestation-chip manifestation-chip--focus" key={`focus-target-${item}`}>
                  {item}
                </span>
              ))}
            </div>
          ) : null}
          {onResetFocus ? (
            <button className="arcana-focus-card__button" onClick={onResetFocus} type="button">
              Сбросить фокус риска
            </button>
          ) : null}
        </div>
      ) : null}

      {hasSearchQuery ? (
        searchResults.length > 0 ? (
          <div className="arcana-search-board">
            <div className="note-card note-card--single">
              Найдено {searchResults.length} арканов по запросу `{deferredSearchQuery}`. Можно идти от болезни и органа назад к аркану,
              а затем сразу смотреть его подробную карточку ниже.
            </div>
            <div className="arcana-search-grid">
              {searchResults.map((result) => (
                <button
                  className={`arcana-search-card ${result.arcana === profile.arcana ? "arcana-search-card--active" : ""}`}
                  key={`arcana-search-${result.arcana}`}
                  onClick={() => onSelect(result.arcana)}
                  type="button"
                >
                  <div className="arcana-search-card__header">
                    <strong>
                      {result.displayLabel} · {result.name}
                    </strong>
                    <span>{result.matches.length} совп.</span>
                  </div>
                  <ul className="arcana-search-card__list">
                    {result.matches.slice(0, 3).map((match) => (
                      <li key={`${result.arcana}-${match.field}-${match.excerpt}`}>
                        <span>{match.label}</span>
                        {match.excerpt}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="note-card note-card--warning">
            <strong>По запросу `{deferredSearchQuery}` совпадений не найдено</strong>
            <p>Попробуйте короче: например `почки`, `сердце`, `онкология`, `психика`, `аллергия`.</p>
          </div>
        )
      ) : null}

      <div className="section-grid section-grid--two">
        <div className="chart-card">
          <div className="chart-card__header">
            <h3>
              {profile.displayLabel} · {profile.name}
            </h3>
            <p>
              Проявления по здоровью: стр. {profile.manifestationSource.pdfPages.join(", ")}. Урок болезни: стр.{" "}
              {profile.lessonSource.pdfPages.join(", ")}.
            </p>
          </div>
          <div className="note-grid">
            <article className="note-card">
              <strong>Органы-мишени</strong>
              {focusView && focusView.targetItems.length > 0 ? (
                <div className="manifestation-chip-list">
                  {focusView.targetItems.map((item) => (
                    <span
                      className={`manifestation-chip ${focusView.focusTargetItems.includes(item) ? "manifestation-chip--focus" : ""}`}
                      key={`target-item-${profile.arcana}-${item}`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <p>{targetHeading ?? "Для этого аркана заголовок органов-мишеней пока не найден."}</p>
              )}
            </article>
            <article className="note-card">
              <strong>Ошибки лечения</strong>
              <p>{treatmentMistakeFactor ?? "Для этого аркана книга не выделяет отдельный фактор ошибки лечения."}</p>
            </article>
            <article className="note-card">
              <strong>Где используется сейчас</strong>
              <p>
                {currentMatches.length > 0
                  ? currentMatches.map((match) => `${match.label}: ${match.description}`).join(" · ")
                  : "В текущем расчете каркаса сот этот аркан пока не встречается."}
              </p>
            </article>
          </div>
          <div className="manifestation-list-shell">
            <strong>Подробные проявления</strong>
            {focusView && focusView.matchedManifestations.length > 0 ? (
              <>
                <div className="manifestation-chip-list">
                  {focusView.matchedManifestations.map((item) => (
                    <span className="manifestation-chip manifestation-chip--focus" key={`matched-manifestation-${item}`}>
                      {item}
                    </span>
                  ))}
                </div>
                <ul className="manifestation-list">
                  {profile.manifestations.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <ul className="manifestation-list">
                  {profile.manifestations.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {focusView ? (
                  <div className="note-card note-card--single manifestation-note">
                    По текущему риск-контексту прямых совпадений в списке проявлений нет. В этом случае ориентиром книги остаётся
                    блок органов-мишеней выше.
                  </div>
                ) : null}
              </>
            )}
          </div>
          {hasSearchQuery ? (
            selectedSearchResult ? (
              <div className="manifestation-list-shell">
                <strong>Совпадения текущего аркана по запросу `{deferredSearchQuery}`</strong>
                <ul className="manifestation-list">
                  {selectedSearchResult.matches.map((match) => (
                    <li key={`${match.field}-${match.excerpt}`}>
                      <span className="arcana-search-match-label">{match.label}:</span> {match.excerpt}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="note-card note-card--single">
                У выбранного аркана по текущему запросу совпадений нет, хотя совпадения есть у других арканов.
              </div>
            )
          ) : null}
        </div>

        <div className="chart-card">
          <div className="chart-card__header">
            <h3>Урок болезни</h3>
            <p>Этот блок в книге относится к сотам I-V и нужен для интерпретационного слоя сайта.</p>
          </div>
          <div className="note-grid note-grid--single-column">
            <article className="note-card">
              <strong>Для взрослого</strong>
              <p>{profile.lesson}</p>
            </article>
            <article className="note-card">
              <strong>Для детей</strong>
              <p>{profile.childLesson}</p>
            </article>
            {profile.notes?.map((note) => (
              <article className="note-card note-card--warning" key={note}>
                <strong>Примечание</strong>
                <p>{note}</p>
              </article>
            )) ?? null}
          </div>
        </div>
      </div>
    </div>
  );
}
