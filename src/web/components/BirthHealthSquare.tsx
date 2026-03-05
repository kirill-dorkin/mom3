import { knowledgeBase } from "../../book/knowledgeBase";

interface BirthHealthSquareProps {
  counts: number[][];
  scores: number[][];
}

interface SquarePanelProps {
  values: number[][];
  formatValue: (value: number) => string;
}

function SquarePanel({ values, formatValue }: SquarePanelProps) {
  const houseByDigit = new Map(knowledgeBase.houses.map((house) => [house.matrixDigit, house]));

  return (
    <section className="w-full">
      <div className="grid w-full grid-cols-3 border-[1.5px] border-stone-900 bg-white">
        {values.map((row, rowIndex) =>
          row.map((value, colIndex) => {
            const cellNumber = knowledgeBase.personalMatrixLayout.layout[rowIndex][colIndex];
            const house = houseByDigit.get(cellNumber);

            return (
              <div
                className="relative grid aspect-square min-h-[9.5rem] grid-rows-[auto_1fr_auto] border border-stone-900 bg-white px-2 py-2 pb-7 text-stone-950 sm:min-h-[10.5rem] md:min-h-[8.75rem] lg:min-h-[10.25rem] xl:min-h-[11.5rem]"
                key={`${rowIndex}-${colIndex}`}
              >
                <span className="block w-full break-words text-center text-[clamp(1rem,1.22vw,1.3rem)] font-black leading-[1.06] tracking-[0.01em] text-stone-950 [overflow-wrap:anywhere]">
                  {house?.bodySystem ?? ""}
                </span>
                <span className="place-self-center text-center text-[clamp(1.95rem,3.35vw,2.75rem)] font-black leading-none">
                  {formatValue(value)}
                </span>
                <span className="block w-full break-words text-center text-[clamp(1rem,1.22vw,1.3rem)] font-black leading-[1.06] tracking-[0.01em] text-stone-950 [overflow-wrap:anywhere]">
                  {house?.name ?? ""}
                </span>
                <span className="absolute bottom-1.5 right-1.5 text-base font-black leading-none text-stone-900">{cellNumber}</span>
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
    <div className="mx-auto w-full max-w-[96rem] px-3 sm:px-4">
      <div className="grid w-full grid-cols-1 gap-6 pb-2 md:grid-cols-2 md:gap-8 lg:gap-10">
        <SquarePanel
          values={scores}
          formatValue={(value) => (value > 0 ? `+${value}` : `${value}`)}
        />
        <SquarePanel
          values={counts}
          formatValue={(value) => `${value}`}
        />
      </div>
    </div>
  );
}
