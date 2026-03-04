import type { RootRepeatGroup } from "../../core/projections/rootCycleView";

interface RootRepeatTableProps {
  groups: RootRepeatGroup[];
  highlightedAge: number;
}

export function RootRepeatTable({ groups, highlightedAge }: RootRepeatTableProps) {
  return (
    <div className="chart-card chart-card--wide">
      <div className="chart-card__header">
        <h3>Повторение корня каждые 10 лет</h3>
        <p>Шаблон страницы 149: возраст попадает в одну и ту же группу по остатку от деления на 10.</p>
      </div>
      <div className="table-shell">
        <table className="root-repeat-table">
          <thead>
            <tr>
              <th>Группа</th>
              <th>Возрастные повторы</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr key={`repeat-${group.remainder}`}>
                <th>{group.remainder}</th>
                <td>
                  <div className="root-repeat-table__ages">
                    {group.ages.map((age) => (
                      <span
                        className={age === highlightedAge ? "root-repeat-table__age root-repeat-table__age--highlighted" : "root-repeat-table__age"}
                        key={`repeat-age-${group.remainder}-${age}`}
                      >
                        {age}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
