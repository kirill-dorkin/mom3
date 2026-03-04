import type { InterzoneSegment } from "../../core/projections/interzoneView";

interface InterzoneSummaryTableProps {
  segments: InterzoneSegment[];
}

function formatCrossing(segment: InterzoneSegment): string {
  if (!segment.crossing) {
    return "Нет";
  }

  if (segment.crossing.lowerMonthNumber === segment.crossing.upperMonthNumber) {
    return segment.crossing.lowerMonthLabel;
  }

  return `${segment.crossing.lowerMonthLabel}/${segment.crossing.upperMonthLabel}`;
}

function formatDirection(direction: InterzoneSegment["direction"]): string {
  switch (direction) {
    case "up":
      return "Вверх";
    case "down":
      return "Вниз";
    default:
      return "Горизонтально";
  }
}

export function InterzoneSummaryTable({ segments }: InterzoneSummaryTableProps) {
  return (
    <div className="table-shell">
      <table className="interzone-table">
        <thead>
          <tr>
            <th>Сома</th>
            <th>Возраст</th>
            <th>Переход</th>
            <th>Направление</th>
            <th>Месяц смены зоны</th>
          </tr>
        </thead>
        <tbody>
          {segments.map((segment) => (
            <tr key={segment.segmentIndex}>
              <th>{segment.segmentIndex}</th>
              <td>{segment.ageFrom} {"->"} {segment.ageTo}</td>
              <td>{segment.startDigit} {"->"} {segment.endDigit}</td>
              <td>{formatDirection(segment.direction)}</td>
              <td>{formatCrossing(segment)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
