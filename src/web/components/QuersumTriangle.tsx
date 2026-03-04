interface QuersumTriangleProps {
  rows: number[][];
  rootDigit: number;
}

export function QuersumTriangle({ rows, rootDigit }: QuersumTriangleProps) {
  return (
    <div
      className="mx-auto flex w-full min-w-[42rem] max-w-5xl flex-col items-center gap-4 rounded-[2rem] border border-stone-300/70 bg-[#fffaf1]/90 px-6 py-8 shadow-[0_18px_50px_rgba(44,27,17,0.12)]"
      role="img"
      aria-label={`Кверсум-треугольник, корневая цифра ${rootDigit}`}
    >
      <div className="text-center">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-stone-500">QuersumTriangle</p>
        <p className="mt-2 text-lg font-bold text-stone-600">Книжная кверсум-свёртка от даты к корню</p>
      </div>
      <div className="flex w-full flex-col items-center gap-3">
        {rows.map((row, rowIndex) => (
          <div className="flex w-full justify-center" key={`row-${rowIndex}`}>
            <div className="flex items-center justify-center gap-3">
              {row.map((digit, digitIndex) => (
                <span
                  className={`flex h-16 w-16 items-center justify-center rounded-[1.35rem] border text-3xl font-black shadow-sm transition-transform duration-200 ${
                    rowIndex === rows.length - 1
                      ? "border-stone-500 bg-stone-900 text-[#fffaf1] shadow-[0_16px_24px_rgba(31,27,23,0.18)]"
                      : rowIndex === 0
                        ? "border-[#c57f5d]/40 bg-[#f4ddcf] text-stone-900"
                        : "border-stone-300/80 bg-[#f8f3eb] text-stone-800"
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
