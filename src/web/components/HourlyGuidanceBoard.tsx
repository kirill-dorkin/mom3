const standardBands = [
  {
    title: "1, 2, 3",
    subtitle: "Пассивное поведение",
    text: "Подходит для отдыха, сна, медитации и спокойной творческой работы. Не подходит для тяжёлых физических и интеллектуальных нагрузок."
  },
  {
    title: "4, 5, 6",
    subtitle: "Норма",
    text: "Рабочая зона для обычной активности: дела, учёба, творчество, поездки и стандартные бытовые задачи."
  },
  {
    title: "7, 8, 9",
    subtitle: "Перенапряжение",
    text: "Энергии много, но её лучше направлять в контролируемую активность. Перегиб в этом диапазоне книга связывает с истощением и риском травм."
  }
];

const averageZones = [
  {
    title: "Ниже средней линии",
    text: "Книга относит эти часы к зонам пассивности: здесь нежелательны операции, анализы, тяжёлые нагрузки, активный спорт и плотные приёмы пищи."
  },
  {
    title: "Выше средней линии",
    text: "Это зоны активности: лучше ставить нагрузки, медицинские процедуры, приём лекарств, питание, обучение и рабочие задачи."
  }
];

export function HourlyGuidanceBoard() {
  return (
    <div className="note-grid">
      {standardBands.map((item) => (
        <article className="note-card" key={item.title}>
          <strong>{item.title}</strong>
          <p>
            {item.subtitle}. {item.text}
          </p>
        </article>
      ))}
      {averageZones.map((item) => (
        <article className="note-card" key={item.title}>
          <strong>{item.title}</strong>
          <p>{item.text}</p>
        </article>
      ))}
    </div>
  );
}
