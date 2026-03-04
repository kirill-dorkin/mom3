import { memo } from "react";
import { knowledgeBase } from "../../book/knowledgeBase";

interface MatrixGridProps {
  counts: number[][];
  scores: number[][];
}

export const MatrixGrid = memo(function MatrixGrid({ counts, scores }: MatrixGridProps) {
  return (
    <div className="matrix-grid">
      {counts.map((row, rowIndex) =>
        row.map((count, colIndex) => {
          const digit = knowledgeBase.personalMatrixLayout.layout[rowIndex][colIndex];
          const house = knowledgeBase.houses.find((item) => item.matrixDigit === digit);
          const score = scores[rowIndex][colIndex];
          const tone = score >= 0 ? "positive" : "negative";

          return (
            <article className={`matrix-cell matrix-cell--${tone}`} key={`${rowIndex}-${colIndex}`}>
              <div className="matrix-cell__topline">
                <span className="matrix-cell__digit">{digit}</span>
                <span className="matrix-cell__score">{score > 0 ? `+${score}` : `${score}`}</span>
              </div>
              <strong className="matrix-cell__count">{count}</strong>
              <span className="matrix-cell__name">{house?.name}</span>
              <span className="matrix-cell__system">{house?.bodySystem}</span>
            </article>
          );
        })
      )}
    </div>
  );
});

MatrixGrid.displayName = "MatrixGrid";
