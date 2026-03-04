import { knowledgeBase } from "../../book/knowledgeBase";

interface BirthHealthSquareProps {
  counts: number[][];
  scores: number[][];
}

export function BirthHealthSquare({ counts, scores }: BirthHealthSquareProps) {
  return (
    <div className="mx-auto grid min-w-[28rem] grid-cols-3 border border-stone-900 bg-white">
      {scores.map((row, rowIndex) =>
        row.map((score, colIndex) => {
          const matrixDigit = knowledgeBase.personalMatrixLayout.layout[rowIndex][colIndex];
          const count = counts[rowIndex][colIndex];

          return (
            <div
              className="relative flex aspect-square min-h-[9rem] flex-col justify-between border border-stone-900 px-4 py-3 text-stone-950"
              key={`${rowIndex}-${colIndex}`}
            >
              <span className="absolute right-2 top-2 text-sm font-bold text-stone-500">{matrixDigit}</span>
              <span className="text-[2.5rem] font-bold leading-none">{score > 0 ? `+${score}` : `${score}`}</span>
              <span className="self-end text-lg font-bold text-stone-600">{count}</span>
            </div>
          );
        })
      )}
    </div>
  );
}
