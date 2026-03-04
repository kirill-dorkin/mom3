interface QuersumTriangleProps {
  birthDate?: string;
  rows: number[][];
  rootDigit: number;
}

export function QuersumTriangle({ birthDate, rows, rootDigit }: QuersumTriangleProps) {
  return (
    <div
      className="mx-auto flex w-full min-w-[34rem] max-w-3xl flex-col items-center gap-4 rounded-[1.4rem] border border-stone-300 bg-white px-8 py-8 shadow-[0_16px_30px_rgba(44,27,17,0.08)]"
      role="img"
      aria-label={`Кверсум-треугольник, корневая цифра ${rootDigit}`}
    >
      {birthDate ? <div className="w-full text-center text-[2.15rem] font-bold tracking-[0.06em] text-stone-900">{birthDate}</div> : null}
      <div className="flex w-full flex-col items-center gap-3">
        {rows.map((row, rowIndex) => (
          <div className="flex w-full justify-center" key={`row-${rowIndex}`}>
            <div className="flex items-center justify-center gap-3">
              {row.map((digit, digitIndex) => (
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-sm border border-transparent text-[2.1rem] font-bold leading-none text-stone-900 ${
                    rowIndex === rows.length - 1
                      ? "border-stone-400 bg-stone-100"
                      : "bg-white"
                  }`}
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
