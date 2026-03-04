import type { HourlyBiorhythmResult } from "../../core/calculations/hourlyBiorhythm";

interface HourlyZoneTableProps {
  result: HourlyBiorhythmResult;
}

const bandLabel: Record<string, string> = {
  passive: "Пассив",
  normal: "Норма",
  overload: "Перегруз"
};

const relationLabel: Record<string, string> = {
  below_average: "Ниже средней",
  on_average: "На средней",
  above_average: "Выше средней"
};

export function HourlyZoneTable({ result }: HourlyZoneTableProps) {
  return (
    <div className="hour-zone-grid">
      {result.zones.map((zone) => (
        <article className={`hour-zone hour-zone--${zone.standardBand}`} key={zone.hour}>
          <div className="hour-zone__topline">
            <strong>{String(zone.hour).padStart(2, "0")}:00</strong>
            <span>{zone.value}</span>
          </div>
          <div className="hour-zone__band">{bandLabel[zone.standardBand]}</div>
          <div className="hour-zone__relation">{relationLabel[zone.relativeToAverage]}</div>
        </article>
      ))}
    </div>
  );
}
