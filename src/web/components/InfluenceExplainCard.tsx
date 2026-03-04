interface InfluenceExplainCardProps {
  secondaryDoubledDigits: number[];
  combinedDigits: number[];
}

export function InfluenceExplainCard({ secondaryDoubledDigits, combinedDigits }: InfluenceExplainCardProps) {
  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <h3>Промежуточные ряды</h3>
        <p>Книга сначала удваивает вторую дату, затем накладывает её на первую поразрядной кверсуммой.</p>
      </div>
      <div className="digit-strip-group">
        <div className="digit-strip">
          <span className="digit-strip__label">Удвоенная дата второго</span>
          <div className="digit-strip__values">
            {secondaryDoubledDigits.map((digit, index) => (
              <span className="digit-strip__cell" key={`double-${index}`}>
                {digit}
              </span>
            ))}
          </div>
        </div>
        <div className="digit-strip">
          <span className="digit-strip__label">Совмещённый ряд влияния</span>
          <div className="digit-strip__values">
            {combinedDigits.map((digit, index) => (
              <span className="digit-strip__cell digit-strip__cell--accent" key={`combined-${index}`}>
                {digit}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
