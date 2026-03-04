import { memo } from "react";
import { knowledgeBase } from "../../book/knowledgeBase";

interface MatrixGridProps {
  counts: number[][];
  scores: number[][];
}

export const MatrixGrid = memo(function MatrixGrid({ counts, scores }: MatrixGridProps) {
  return (
    <div className="mx-auto grid min-w-[58rem] grid-cols-3 gap-4">
      {counts.map((row, rowIndex) =>
        row.map((count, colIndex) => {
          const digit = knowledgeBase.personalMatrixLayout.layout[rowIndex][colIndex];
          const house = knowledgeBase.houses.find((item) => item.matrixDigit === digit);
          const score = scores[rowIndex][colIndex];
          const toneClasses =
            score >= 0
              ? "border-[#9cb681]/50 bg-[#d7e4c8]/80"
              : "border-[#c9826d]/45 bg-[#f0d7ce]/82";

          return (
            <article
              className={`flex min-h-[15.5rem] flex-col rounded-[1.9rem] border p-5 text-stone-900 shadow-[0_12px_28px_rgba(44,27,17,0.08)] ${toneClasses}`}
              key={`${rowIndex}-${colIndex}`}
            >
              <div className="mb-4 flex items-start justify-between gap-4 text-sm font-black uppercase tracking-[0.18em] text-stone-500">
                <span>{digit}</span>
                <span>{score > 0 ? `+${score}` : `${score}`}</span>
              </div>
              <strong className="text-[3.2rem] leading-none">{count}</strong>
              <span className="mt-4 text-[1.55rem] font-black leading-[1.15]">{house?.name}</span>
              <span className="mt-3 text-lg font-bold leading-[1.35] text-stone-600">{house?.bodySystem}</span>
            </article>
          );
        })
      )}
    </div>
  );
});

MatrixGrid.displayName = "MatrixGrid";
