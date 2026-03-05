import { knowledgeBase } from "../../book/knowledgeBase";

interface BirthHealthSquareProps {
  counts: number[][];
  scores: number[][];
}

interface SquarePanelProps {
  title: string;
  values: number[][];
  formatValue: (value: number) => string;
}

function SquarePanel({ title, values, formatValue }: SquarePanelProps) {
  const houseByDigit = new Map(knowledgeBase.houses.map((house) => [house.matrixDigit, house]));

  return (
    <section className="flex flex-col items-center gap-4">
      <h3 className="text-center text-[1.55rem] font-bold tracking-[0.02em] text-stone-950">{title}</h3>
      <div className="grid min-w-[28rem] grid-cols-3 border border-stone-900 bg-white">
        {values.map((row, rowIndex) =>
          row.map((value, colIndex) => {
            const cellNumber = knowledgeBase.personalMatrixLayout.layout[rowIndex][colIndex];
            const house = houseByDigit.get(cellNumber);

            return (
              <div
                className="relative flex aspect-square min-h-[11rem] flex-col border border-stone-900 px-3 py-3 text-stone-950"
                key={`${title}-${rowIndex}-${colIndex}`}
              >
                <span className="text-center text-[0.92rem] font-bold leading-tight text-stone-700">
                  {house?.bodySystem ?? ""}
                </span>
                <span className="mt-auto mb-auto self-center text-[2.35rem] font-bold leading-none">
                  {formatValue(value)}
                </span>
                <span className="text-center text-[0.92rem] font-bold leading-tight text-stone-700">
                  {house?.name ?? ""}
                </span>
                <span className="absolute bottom-1.5 right-2 text-sm font-bold text-stone-600">{cellNumber}</span>
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
        values={scores}
        formatValue={(value) => (value > 0 ? `+${value}` : `${value}`)}
      />
      <SquarePanel
        values={counts}
        formatValue={(value) => `${value}`}
      />
    </div>
  );
}
