import type { DiseaseHoneycombSotaRow } from "../../core/projections/diseaseHoneycombView";

interface DiseaseHoneycombCardsProps {
  rows: DiseaseHoneycombSotaRow[];
  onDrillDown?: (age: number, seriesId: number) => void;
}

export function DiseaseHoneycombCards({ rows, onDrillDown }: DiseaseHoneycombCardsProps) {
  return (
    <div className="disease-honeycomb-grid">
      {rows.map((row) => (
        <article className="disease-honeycomb-card" key={`disease-card-${row.sotaId}`}>
          <div className="disease-honeycomb-card__header">
            <div>
              <div className="disease-honeycomb-card__eyebrow">
                {row.sotaId} сота · дома {row.houseIds.join(", ")}
              </div>
              <h3>{row.sotaName}</h3>
            </div>
            <div className="disease-honeycomb-card__meta">
              <span>Подтверждено: {row.confirmedAges.length}</span>
              <span>Исключено: {row.excludedAges.length}</span>
            </div>
          </div>
          <p className="disease-honeycomb-card__focus">{row.healthFocus.join(", ")}</p>
          <div className="disease-honeycomb-card__years">
            {row.years.map((year) => (
              <div
                className={`disease-honeycomb-year ${year.active ? "disease-honeycomb-year--active" : "disease-honeycomb-year--inactive"}`}
                key={`disease-year-${row.sotaId}-${year.age}`}
              >
                <div className="disease-honeycomb-year__topline">
                  <strong>{year.age} лет</strong>
                  <span>{year.active ? "сота активна" : "сота не активна"}</span>
                </div>
                <div className="disease-honeycomb-year__summary">
                  <span>
                    Окрашено домов: {year.houses.filter((house) => house.colored).length}/{year.houses.length}
                  </span>
                  <span>
                    Правило книги: {year.active ? "год подтверждён" : "год снят после перепроверки"}
                  </span>
                </div>
                <div className={`disease-honeycomb-year__balls disease-honeycomb-year__balls--count-${year.houses.length}`}>
                  {year.houses.map((house) => (
                    onDrillDown ? (
                      <button
                        className={`disease-honeycomb-ball disease-honeycomb-ball--clickable ${house.colored ? "disease-honeycomb-ball--colored" : ""}`}
                        key={`disease-house-${row.sotaId}-${year.age}-${house.houseId}`}
                        onClick={() => onDrillDown(year.age, house.houseId)}
                        title={`${house.houseName}. Открыть возраст ${year.age} и дом ${house.houseId} в соматическом блоке.`}
                        type="button"
                      >
                        <div className="disease-honeycomb-ball__eyebrow">
                          Дом {house.houseId} · {house.somaColorName}
                        </div>
                        <div className="disease-honeycomb-ball__circle">
                          <span>{house.digit}</span>
                        </div>
                        <div className="disease-honeycomb-ball__label">{house.bodySystem}</div>
                      </button>
                    ) : (
                      <article
                        className={`disease-honeycomb-ball ${house.colored ? "disease-honeycomb-ball--colored" : ""}`}
                        key={`disease-house-${row.sotaId}-${year.age}-${house.houseId}`}
                        title={house.houseName}
                      >
                        <div className="disease-honeycomb-ball__eyebrow">
                          Дом {house.houseId} · {house.somaColorName}
                        </div>
                        <div className="disease-honeycomb-ball__circle">
                          <span>{house.digit}</span>
                        </div>
                        <div className="disease-honeycomb-ball__label">{house.bodySystem}</div>
                      </article>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
