import { knowledgeBase } from "../../book/knowledgeBase";

const statusLabel: Record<string, string> = {
  direct: "Готово к расчёту",
  lookup_required: "Нужны справочники",
  needs_verification: "Нужна верификация"
};

export function BookCoverageBoard() {
  return (
    <div className="coverage-board">
      <div className="coverage-board__modules">
        {knowledgeBase.calculationModules.map((module) => (
          <article className={`coverage-card coverage-card--${module.status}`} key={module.id}>
            <div className="coverage-card__status">{statusLabel[module.status]}</div>
            <h3>{module.id}</h3>
            <p>{module.notes}</p>
            <div className="coverage-card__meta">Страницы: {module.source.pdfPages.join(", ")}</div>
          </article>
        ))}
      </div>
      <div className="coverage-board__gaps">
        {knowledgeBase.verificationGaps.map((gap) => (
          <article className={`gap-card gap-card--${gap.severity}`} key={gap.id}>
            <strong>{gap.id}</strong>
            <p>{gap.description}</p>
            <div className="coverage-card__meta">Страницы: {gap.source.pdfPages.join(", ")}</div>
          </article>
        ))}
      </div>
    </div>
  );
}
