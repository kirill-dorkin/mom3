import { knowledgeBase } from "../../book/knowledgeBase";
import type { DiseaseHoneycombArcanaRow } from "../../core/projections/diseaseHoneycombArcanaView";

interface DiseaseHoneycombArcanaBoardProps {
  rows: DiseaseHoneycombArcanaRow[];
  notes: string[];
  onSelectArcana?: (arcana: number) => void;
  onFocusArcana?: (context: {
    arcana: number;
    ages: number[];
    sotaId: number;
    focusSystems: string[];
    triggerHouseIds: number[];
    metricLabel: string;
    segmentLabel: string;
    sourceMode: "current" | "previous";
    targetHeading: string | null;
  }) => void;
  onSelectSota?: (sotaId: number) => void;
  onFocusSota?: (context: {
    sotaId: number;
    ages: number[];
    focusSystems: string[];
    triggerHouseIds: number[];
    metricLabel: string;
    segmentLabel: string;
    sourceMode: "current" | "previous";
    arcana: number;
    targetHeading: string | null;
  }) => void;
  selectedArcana?: number;
  selectedSotaId?: number;
}

interface ArcanaYearGroup {
  ages: number[];
  currentSegmentLabel: string;
  triggerHouseIds: number[];
  coloredHouses: {
    houseId: number;
    houseName: string;
    bodySystem: string;
  }[];
  supportingSystems: string[];
  previousSegmentLabel: string | null;
  previousSotaId: number | null;
  previousSotaName: string | null;
  previousMetricLabel: string | null;
  previousArcana: number | null;
  previousTargetHeading: string | null;
}

function buildYearGroups(row: DiseaseHoneycombArcanaRow): ArcanaYearGroup[] {
  const groups = new Map<string, ArcanaYearGroup>();

  for (const link of row.yearLinks) {
    const key = [
      link.currentSegmentLabel,
      link.triggerHouseIds.join(","),
      link.previousSegmentLabel ?? "none",
      String(link.previousSotaId ?? "none"),
      link.previousMetricLabel ?? "none",
      String(link.previousArcana ?? "none")
    ].join("|");

    const existing =
      groups.get(key) ??
      {
        ages: [],
        currentSegmentLabel: link.currentSegmentLabel,
        triggerHouseIds: link.triggerHouseIds,
        coloredHouses: link.coloredHouses,
        supportingSystems: link.supportingSystems,
        previousSegmentLabel: link.previousSegmentLabel,
        previousSotaId: link.previousSotaId,
        previousSotaName: link.previousSotaName,
        previousMetricLabel: link.previousMetricLabel,
        previousArcana: link.previousArcana,
        previousTargetHeading: link.previousTargetHeading
      };

    existing.ages.push(link.age);
    groups.set(key, existing);
  }

  return Array.from(groups.values()).map((group) => ({
    ...group,
    ages: group.ages.slice().sort((left, right) => left - right)
  }));
}

export function DiseaseHoneycombArcanaBoard({
  rows,
  notes,
  onFocusArcana,
  onSelectArcana,
  onFocusSota,
  onSelectSota,
  selectedArcana,
  selectedSotaId
}: DiseaseHoneycombArcanaBoardProps) {
  return (
    <div className="disease-arcana-board">
      <div className="note-grid">
        {notes.map((note) => (
          <div className="note-card" key={note}>
            <strong>Арканный слой</strong>
            <p>{note}</p>
          </div>
        ))}
      </div>
      <div className="disease-arcana-grid">
        {rows.map((row) => {
          const referenceEntry = knowledgeBase.sotaReferenceAtlas.find((entry) => entry.sotaId === row.sotaId) ?? null;

          return (
            <article className="disease-arcana-card" key={`disease-arcana-${row.sotaId}`}>
              <div className="disease-arcana-card__header">
                <div>
                  <div className="disease-arcana-card__eyebrow">
                    {row.sotaId} сота · временная ячейка {row.metricLabel}
                  </div>
                  <h3>
                    {row.metricLabel} ={" "}
                    {onSelectArcana ? (
                      <button
                        className={`arcana-link-button arcana-link-button--inline ${selectedArcana === row.arcana ? "arcana-link-button--selected" : ""}`}
                        onClick={() => onSelectArcana(row.arcana)}
                        type="button"
                      >
                        {row.arcana}
                      </button>
                    ) : (
                      row.arcana
                    )}
                  </h3>
                </div>
                <div className="disease-arcana-card__age-count">{row.confirmedAges.length}</div>
              </div>
              <p className="disease-arcana-card__heading">
                {row.targetHeading ?? "Для этой ячейки заголовок органов-мишеней ещё не оцифрован."}
              </p>
              <div className="disease-arcana-card__focus">
                {row.healthFocus.map((focus) => (
                  <span className="disease-arcana-card__focus-chip" key={`${row.sotaId}-${focus}`}>
                    {focus}
                  </span>
                ))}
              </div>
              {referenceEntry ? (
                <div className="disease-arcana-card__reference">
                  <div className="disease-arcana-card__reference-title">Системы этой соты</div>
                  <div className="disease-arcana-card__reference-chips">
                    {referenceEntry.systems.map((system) => (
                      <span className="disease-arcana-card__reference-chip" key={`${row.sotaId}-${system.title}`}>
                        {system.title}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
              {row.riskFlags.length > 0 ? (
                <div className="disease-arcana-card__flags">
                  {row.riskFlags.map((flag) => (
                    <span className="disease-arcana-card__flag" key={`${row.sotaId}-${flag}`}>
                      {flag}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="disease-arcana-card__flags">
                  <span className="disease-arcana-card__flag disease-arcana-card__flag--muted">Явных дополнительных флагов книга здесь не выделяет</span>
                </div>
              )}
              {onSelectSota ? (
                <button
                  className={`disease-arcana-card__sota-button ${selectedSotaId === row.sotaId ? "disease-arcana-card__sota-button--active" : ""}`}
                  onClick={() => onSelectSota(row.sotaId)}
                  type="button"
                >
                  Открыть всю {row.sotaId} соту
                </button>
              ) : null}
              <div className="disease-arcana-card__groups">
                {buildYearGroups(row).map((group) => (
                  <div className="disease-arcana-card__group" key={`${row.sotaId}-${group.currentSegmentLabel}-${group.previousSegmentLabel ?? "none"}-${group.triggerHouseIds.join("-")}`}>
                    <strong>Годы {group.ages.join(", ")}</strong>
                    <p>Текущая временная ячейка: {group.currentSegmentLabel}.</p>
                    {group.coloredHouses.length > 0 ? (
                      <>
                        <p>
                          Подтверждающие дома:{" "}
                          {group.coloredHouses.map((house) => `дом ${house.houseId} (${house.houseName})`).join(", ")}.
                        </p>
                        <p>Системы года: {group.supportingSystems.join(", ")}.</p>
                      </>
                    ) : (
                      <p>Подтверждающие дома для этой группы не найдены.</p>
                    )}
                    {onFocusSota ? (
                      <button
                        className="disease-arcana-card__group-button"
                        onClick={() =>
                          onFocusSota({
                            sotaId: row.sotaId,
                            ages: group.ages,
                            focusSystems: group.supportingSystems.length > 0 ? group.supportingSystems : row.healthFocus,
                            triggerHouseIds: group.triggerHouseIds,
                            metricLabel: row.metricLabel,
                            segmentLabel: group.currentSegmentLabel,
                            sourceMode: "current",
                            arcana: row.arcana,
                            targetHeading: row.targetHeading
                          })
                        }
                        type="button"
                      >
                        Открыть органы этого риска
                      </button>
                    ) : null}
                    {onFocusArcana ? (
                      <button
                        className="disease-arcana-card__group-button"
                        onClick={() =>
                          onFocusArcana({
                            arcana: row.arcana,
                            ages: group.ages,
                            sotaId: row.sotaId,
                            focusSystems: group.supportingSystems.length > 0 ? group.supportingSystems : row.healthFocus,
                            triggerHouseIds: group.triggerHouseIds,
                            metricLabel: row.metricLabel,
                            segmentLabel: group.currentSegmentLabel,
                            sourceMode: "current",
                            targetHeading: row.targetHeading
                          })
                        }
                        type="button"
                      >
                        Открыть аркан этого риска
                      </button>
                    ) : null}
                    {group.previousArcana !== null ? (
                      <>
                        <p>
                          Предыдущая ячейка: {group.previousSegmentLabel} · {group.previousSotaName ?? `Сота ${group.previousSotaId}`} ·{" "}
                          {group.previousMetricLabel} ={" "}
                          {onSelectArcana ? (
                            <button
                              className={`arcana-link-button arcana-link-button--inline ${selectedArcana === group.previousArcana ? "arcana-link-button--selected" : ""}`}
                              onClick={() => onSelectArcana(group.previousArcana!)}
                              type="button"
                            >
                              {group.previousArcana}
                            </button>
                          ) : (
                            group.previousArcana
                          )}
                        </p>
                        {onFocusSota && group.previousSotaId !== null ? (
                          <button
                            className="disease-arcana-card__group-button"
                            onClick={() =>
                              onFocusSota({
                                sotaId: group.previousSotaId!,
                                ages: group.ages,
                                focusSystems: [],
                                triggerHouseIds: [],
                                metricLabel: group.previousMetricLabel ?? "Предыдущая ячейка",
                                segmentLabel: group.previousSegmentLabel ?? "Предыдущая ячейка",
                                sourceMode: "previous",
                                arcana: group.previousArcana!,
                                targetHeading: group.previousTargetHeading
                              })
                            }
                            type="button"
                          >
                            Открыть органы предыдущей соты
                          </button>
                        ) : null}
                        {onFocusArcana ? (
                          <button
                            className="disease-arcana-card__group-button"
                            onClick={() =>
                              onFocusArcana({
                                arcana: group.previousArcana!,
                                ages: group.ages,
                                sotaId: group.previousSotaId ?? row.sotaId,
                                focusSystems: [],
                                triggerHouseIds: [],
                                metricLabel: group.previousMetricLabel!,
                                segmentLabel: group.previousSegmentLabel!,
                                sourceMode: "previous",
                                targetHeading: group.previousTargetHeading
                              })
                            }
                            type="button"
                          >
                            Открыть предыдущий аркан
                          </button>
                        ) : null}
                      </>
                    ) : (
                      <p>Предыдущая временная ячейка для этого блока ещё не началась.</p>
                    )}
                    {group.previousTargetHeading ? <p>{group.previousTargetHeading}</p> : null}
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
