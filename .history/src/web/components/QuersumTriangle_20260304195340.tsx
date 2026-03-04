import type { CSSProperties } from "react";

interface QuersumTriangleProps {
  rows: number[][];
  rootDigit: number;
}

function getRowLabel(index: number, totalRows: number): string {
  if (index === 0) {
    return "Дата";
  }

  if (index === totalRows - 1) {
    return "Корень";
  }

  return `Шаг ${index}`;
}

export function QuersumTriangle({ rows, rootDigit }: QuersumTriangleProps) {
  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <h3>Кверсум-ряд</h3>
        <p>Пошаговое сворачивание даты до корневой цифры, на котором строится первая глава книги.</p>
      </div>
      <div className="quersum-triangle" role="img" aria-label={`Кверсум-ряд, корневая цифра ${rootDigit}`}>
        {rows.map((row, rowIndex) => (
          <div className="quersum-row" key={`row-${rowIndex}`}>
            <div
              className="quersum-row__cells"
              style={{ gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))` } as CSSProperties}
            >
              {row.map((digit, digitIndex) => (
                <span
                  className={`quersum-cell ${rowIndex === rows.length - 1 ? "quersum-cell--root" : ""}`}
                  key={`digit-${rowIndex}-${digitIndex}`}
                >
                  {digit}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
