interface BookMethodStep {
  label: string;
  description: string;
  formula?: string;
}

interface BookMethodGuideProps {
  title: string;
  pages: number[];
  intro: string;
  steps: BookMethodStep[];
  defaultOpen?: boolean;
}

function formatPages(pages: number[]): string {
  if (pages.length === 0) {
    return "Страницы не указаны";
  }

  if (pages.length === 1) {
    return `Стр. ${pages[0]}`;
  }

  return `Стр. ${pages.join(", ")}`;
}

export function BookMethodGuide({ title, pages, intro, steps, defaultOpen = false }: BookMethodGuideProps) {
  return (
    <details className="method-guide" open={defaultOpen}>
      <summary className="method-guide__summary">
        <div className="method-guide__summary-copy">
          <strong>{title}</strong>
          <span>{formatPages(pages)}</span>
        </div>
        <span className="method-guide__summary-action">Показать ручную проверку</span>
      </summary>
      <div className="method-guide__body">
        <p className="method-guide__intro">{intro}</p>
        <ol className="method-guide__steps">
          {steps.map((step) => (
            <li className="method-guide__step" key={step.label}>
              <strong>{step.label}</strong>
              <p>{step.description}</p>
              {step.formula ? <code className="method-guide__formula">{step.formula}</code> : null}
            </li>
          ))}
        </ol>
      </div>
    </details>
  );
}
