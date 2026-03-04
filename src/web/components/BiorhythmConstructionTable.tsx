import type { BiorhythmAlignedRow } from "../../core/calculations/hourlyBiorhythm";

interface BiorhythmConstructionTableProps {
  dateDigits: number[];
  consonantRows: BiorhythmAlignedRow<string>[];
  consonantValueRows: BiorhythmAlignedRow<number>[];
  baseEightValues: number[];
}

function renderCellValue(value: string | number | null): string {
  return value === null ? "—" : String(value);
}

export function BiorhythmConstructionTable({
  dateDigits,
  consonantRows,
  consonantValueRows,
  baseEightValues
}: BiorhythmConstructionTableProps) {
  return (
    <div className="table-shell">
      <table className="biorhythm-build-table">
        <thead>
          <tr>
            <th>Слой</th>
            {dateDigits.map((_, index) => (
              <th key={`col-${index + 1}`}>{index + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Дата</th>
            {dateDigits.map((digit, index) => (
              <td key={`date-${index}`}>{digit}</td>
            ))}
          </tr>
          {consonantRows.map((row) => (
            <tr key={`letters-${row.rowIndex}`}>
              <th>Согласные {row.rowIndex + 1}</th>
              {row.values.map((value, index) => (
                <td key={`letter-${row.rowIndex}-${index}`}>{renderCellValue(value)}</td>
              ))}
            </tr>
          ))}
          {consonantValueRows.map((row) => (
            <tr key={`digits-${row.rowIndex}`}>
              <th>Цифры {row.rowIndex + 1}</th>
              {row.values.map((value, index) => (
                <td key={`digit-${row.rowIndex}-${index}`}>{renderCellValue(value)}</td>
              ))}
            </tr>
          ))}
          <tr>
            <th>База</th>
            {baseEightValues.map((digit, index) => (
              <td key={`base-${index}`} className="biorhythm-build-table__base">
                {digit}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
