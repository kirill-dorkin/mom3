import { knowledgeBase } from "../../book/knowledgeBase";

interface BirthHealthSquareProps {
  counts: number[][];
  scores: number[][];
}

interface SquarePanelProps {
  title: string;
  values: number[][];
  formatValue: (value: number) => string;
  showMatrixDigit?: boolean;
  showCellNumber?: boolean;
}

function SquarePanel({ title, values, formatValue, showMatrixDigit = false, showCellNumber = false }: SquarePanelProps) {
  return (
    <section className="flex flex-col items-center gap-4">
      <h3 className="text-center text-[1.55rem] font-bold tracking-[0.02em] text-stone-950">{title}</h3>
      <div className="grid min-w-[28rem] grid-cols-3 border border-stone-900 bg-white">
        {values.map((row, rowIndex) =>
          row.map((value, colIndex) => {
            const matrixDigit = knowledgeBase.personalMatrixLayout.layout[rowIndex][colIndex];
            const cellNumber = rowIndex * 3 + colIndex + 1;

            return (
              <div
                className="relative flex aspect-square min-h-[9rem] items-start border border-stone-900 px-4 py-3 text-stone-950"
                key={`${title}-${rowIndex}-${colIndex}`}
              >
                {showMatrixDigit ? (
                  <span className="absolute right-3 top-2 text-lg font-bold text-stone-500">{matrixDigit}</span>
                ) : null}
                <span className="pt-1 text-[2.5rem] font-bold leading-none">{formatValue(value)}</span>
                {showCellNumber ? (
                  <span className="absolute bottom-0 right-0 flex h-12 w-12 items-center justify-center border-l border-t border-stone-900 bg-stone-50 text-xl font-bold text-stone-700">
                    {cellNumber}
                  </span>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

export function BirthHealthSquare({ counts, scores }: BirthHealthSquareProps) {
  return (
    <div className="mx-auto flex min-w-[58rem] flex-wrap items-start justify-center gap-10">
      <SquarePanel
        title="Баллы при рождении"
        values={scores}
        formatValue={(value) => (value > 0 ? `+${value}` : `${value}`)}
        showMatrixDigit
      />
      <SquarePanel
        title="Количество цифр"
        values={counts}
        formatValue={(value) => `${value}`}
        showCellNumber
      />
    </div>
  );
}
