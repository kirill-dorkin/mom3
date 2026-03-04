import type { DiseaseHoneycombSotaRow } from "../../core/projections/diseaseHoneycombView";

interface DiseaseHoneycombFocusBoardProps {
  rows: DiseaseHoneycombSotaRow[];
  onDrillDown?: (age: number, seriesId: number) => void;
  onSelectSota?: (sotaId: number) => void;
}

interface HouseFocusEntry {
  houseId: number;
  houseName: string;
  bodySystem: string;
  somaColorName: string;
  sotaId: number;
  sotaName: string;
  coloredConfirmedAges: number[];
  dormantConfirmedAges: number[];
  excludedAges: number[];
}

function buildHouseFocusEntries(rows: DiseaseHoneycombSotaRow[]): HouseFocusEntry[] {
  const entries = new Map<number, HouseFocusEntry>();

  for (const row of rows) {
    for (const year of row.years) {
      for (const house of year.houses) {
        const existing = entries.get(house.houseId);
        const entry =
          existing ??
          ({
            houseId: house.houseId,
            houseName: house.houseName,
            bodySystem: house.bodySystem,
            somaColorName: house.somaColorName,
            sotaId: row.sotaId,
            sotaName: row.sotaName,
            coloredConfirmedAges: [],
            dormantConfirmedAges: [],
            excludedAges: []
          } satisfies HouseFocusEntry);

        if (row.confirmedAges.includes(year.age)) {
          if (house.colored) {
            entry.coloredConfirmedAges.push(year.age);
          } else {
            entry.dormantConfirmedAges.push(year.age);
          }
        }

        if (row.excludedAges.includes(year.age)) {
          entry.excludedAges.push(year.age);
        }

        entries.set(house.houseId, entry);
      }
    }
  }

  return Array.from(entries.values())
    .map((entry) => ({
      ...entry,
      coloredConfirmedAges: Array.from(new Set(entry.coloredConfirmedAges)).sort((left, right) => left - right),
      dormantConfirmedAges: Array.from(new Set(entry.dormantConfirmedAges)).sort((left, right) => left - right),
      excludedAges: Array.from(new Set(entry.excludedAges)).sort((left, right) => left - right)
    }))
    .sort((left, right) => {
      if (right.coloredConfirmedAges.length !== left.coloredConfirmedAges.length) {
        return right.coloredConfirmedAges.length - left.coloredConfirmedAges.length;
      }

      return left.houseId - right.houseId;
    });
}

function formatAges(ages: number[]): string {
  return ages.length > 0 ? ages.join(", ") : "—";
}

export function DiseaseHoneycombFocusBoard({ rows, onDrillDown, onSelectSota }: DiseaseHoneycombFocusBoardProps) {
  const entries = buildHouseFocusEntries(rows);

  return (
    <div className="disease-focus-board">
      {entries.map((entry) => (
        <article className="disease-focus-card" key={`disease-focus-${entry.houseId}`}>
          <div className="disease-focus-card__header">
            <div>
              <div className="disease-focus-card__eyebrow">
                {entry.sotaId} сота · {entry.sotaName}
              </div>
              <h3>
                Дом {entry.houseId} · {entry.houseName}
              </h3>
            </div>
            <div className="disease-focus-card__count">{entry.coloredConfirmedAges.length}</div>
          </div>
          <p className="disease-focus-card__system">
            {entry.bodySystem} · цвет дома в соматике: {entry.somaColorName}
          </p>
          <div className="disease-focus-card__meta">
            <strong>Подтверждённые окрашивания</strong>
            <div className="disease-focus-card__ages">
              {entry.coloredConfirmedAges.length > 0 ? (
                entry.coloredConfirmedAges.map((age) => (
                  <button
                    className="disease-focus-card__age-button"
                    key={`disease-focus-age-${entry.houseId}-${age}`}
                    onClick={onDrillDown ? () => onDrillDown(age, entry.houseId) : undefined}
                    type="button"
                  >
                    {age}
                  </button>
                ))
              ) : (
                <span className="disease-focus-card__ages-empty">—</span>
              )}
            </div>
          </div>
          {onSelectSota ? (
            <button className="disease-focus-card__sota-button" onClick={() => onSelectSota(entry.sotaId)} type="button">
              Открыть справку {entry.sotaId} соты
            </button>
          ) : null}
          <div className="disease-focus-card__lines">
            <p>
              <strong>Сота подтверждалась без окраски этого дома:</strong> {formatAges(entry.dormantConfirmedAges)}
            </p>
            <p>
              <strong>Снятые кандидаты по соте:</strong> {formatAges(entry.excludedAges)}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
