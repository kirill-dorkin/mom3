import type { ArcanaTextBreakdown } from "../../core/calculations/nameArcana";

interface NameArcanaCardProps {
  title: string;
  breakdown: ArcanaTextBreakdown;
  selectedArcana?: number;
  onSelectArcana?: (arcana: number) => void;
}

export function NameArcanaCard({ title, breakdown, selectedArcana, onSelectArcana }: NameArcanaCardProps) {
  return (
    <article className="chart-card">
      <div className="chart-card__header">
        <h3>{title}</h3>
        <p>{breakdown.normalized}</p>
      </div>
      <div className="arcana-card__formula">
        {breakdown.letters.map((item, index) => (
          <span className="arcana-card__token" key={`${title}-${item.letter}-${index}`}>
            {item.letter}
            <strong>{item.value}</strong>
          </span>
        ))}
      </div>
      <div className="arcana-card__result">
        <span>Сумма: {breakdown.rawSum}</span>
        <strong>
          Аркан:{" "}
          {onSelectArcana ? (
            <button
              className={`arcana-link-button arcana-link-button--inline ${selectedArcana === breakdown.arcana ? "arcana-link-button--selected" : ""}`}
              onClick={() => onSelectArcana(breakdown.arcana)}
              type="button"
            >
              {breakdown.arcana}
            </button>
          ) : (
            breakdown.arcana
          )}
        </strong>
      </div>
    </article>
  );
}
