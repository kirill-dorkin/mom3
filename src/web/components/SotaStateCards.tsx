import { knowledgeBase } from "../../book/knowledgeBase";
import type { SotaActivationState } from "../../core/calculations/sotaActivation";

interface SotaStateCardsProps {
  age: number;
  states: Record<number, SotaActivationState>;
}

export function SotaStateCards({ age, states }: SotaStateCardsProps) {
  return (
    <div className="sota-grid">
      {knowledgeBase.sotas.map((sota) => {
        const state = states[sota.id];
        return (
          <article className={`sota-card ${state.active ? "sota-card--active" : "sota-card--idle"}`} key={sota.id}>
            <div className="sota-card__eyebrow">Возраст {age}</div>
            <h3>{sota.name}</h3>
            <p>{sota.healthFocus.join(", ")}</p>
            <div className="sota-card__meta">
              <span>{state.active ? "Активна" : "Не активна"}</span>
              <span>Дома: {sota.houses.join(", ")}</span>
            </div>
            <div className="sota-card__triggers">
              {state.houses.map((house) => (
                <span className={`sota-card__trigger ${house.colored ? "sota-card__trigger--on" : ""}`} key={house.houseId}>
                  {house.houseId}: {house.digit}
                </span>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}
