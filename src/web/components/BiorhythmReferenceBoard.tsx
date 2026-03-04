import type { HourlyBiorhythmReference } from "../../types/book";
import { CircadianRhythmTimeline } from "./CircadianRhythmTimeline";
import { SleepCycleTable } from "./SleepCycleTable";
import { SleepNeedChart } from "./SleepNeedChart";

interface BiorhythmReferenceBoardProps {
  reference: HourlyBiorhythmReference;
}

export function BiorhythmReferenceBoard({ reference }: BiorhythmReferenceBoardProps) {
  return (
    <div className="reference-board">
      <div className="section-grid section-grid--two">
        <SleepNeedChart groups={reference.sleepNeedByAgeGroups} />
        <SleepCycleTable
          ageColumns={reference.sleepCycleChangeWithAge.ageColumns}
          rows={reference.sleepCycleChangeWithAge.rows}
          childNorms={reference.childSleepNorms}
        />
      </div>

      <div className="section-grid section-grid--two">
        <div className="chart-card">
          <div className="chart-card__header">
            <h3>Стадии сна</h3>
            <p>Авторы отдельно описывают четыре стадии и рекомендуют попадать в первую из них внутри пассивных окон графика.</p>
          </div>
          <div className="note-grid">
            {reference.sleepStages.map((stage) => (
              <article className="note-card" key={stage.stage}>
                <strong>
                  {stage.stage} стадия · {stage.phase}
                </strong>
                <p>
                  {stage.title}. {stage.description}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-card__header">
            <h3>Подготовка ко сну и эффекты недосыпа</h3>
            <p>Обе подборки вынесены в книге как прикладные правила использования персонального графика.</p>
          </div>
          <div className="reference-columns">
            <div className="reference-list">
              <strong>Подготовка ко сну</strong>
              <ol>
                {reference.sleepPreparationTips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ol>
            </div>
            <div className="reference-list">
              <strong>Чем опасен недосып</strong>
              <ul>
                {reference.sleepDeprivationEffects.map((effect) => (
                  <li key={effect.title}>
                    <strong>{effect.title}.</strong> {effect.description}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="section-grid section-grid--two">
        <CircadianRhythmTimeline points={reference.circadianReferencePoints} />
        <div className="chart-card">
          <div className="chart-card__header">
            <h3>Персональные часы и оговорки источника</h3>
            <p>Здесь собраны итоговые выводы книги по персональному запуску ритма и те места главы 3, где печать выглядит спорной.</p>
          </div>
          <div className="note-grid note-grid--single-column">
            {reference.personalClockNotes.map((note) => (
              <article className="note-card" key={note.title}>
                <strong>{note.title}</strong>
                <p>{note.description}</p>
              </article>
            ))}
            {reference.notes.map((note) => (
              <article className="note-card note-card--warning" key={note}>
                <strong>Печатная оговорка</strong>
                <p>{note}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
