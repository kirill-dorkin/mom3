import { useDeferredValue, useMemo, useState, type ReactNode } from "react";
import { buildEnergogramProjection, calculatePersonalEnergyPotential, normalizeBirthDateInput } from "../index";
import { BirthHealthSquare } from "./components/BirthHealthSquare";
import { BookPersonalEnergogram } from "./components/BookPersonalEnergogram";
import { QuersumTriangle } from "./components/QuersumTriangle";

interface DateValidation {
  status: "empty" | "incomplete" | "valid" | "invalid";
  normalized: string | null;
  helperText: string;
}

function formatDateInputForTyping(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  }

  return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`;
}

function analyzeDateInput(value: string): DateValidation {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return {
      status: "empty",
      normalized: null,
      helperText: "Введите дату рождения в формате ДД.ММ.ГГГГ"
    };
  }

  const digitCount = trimmed.replace(/\D/g, "").length;
  if (digitCount < 8) {
    return {
      status: "incomplete",
      normalized: null,
      helperText: "Нужно 8 цифр даты рождения"
    };
  }

  try {
    const normalized = normalizeBirthDateInput(trimmed);
    return {
      status: "valid",
      normalized,
      helperText: `Дата принята: ${normalized}`
    };
  } catch (error) {
    return {
      status: "invalid",
      normalized: null,
      helperText: error instanceof Error ? error.message : "Некорректная дата"
    };
  }
}

function captureCalculation<T>(builder: () => T): { data: T | null; error: string | null } {
  try {
    return {
      data: builder(),
      error: null
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Ошибка расчёта"
    };
  }
}

function helperTone(status: DateValidation["status"]): string {
  switch (status) {
    case "valid":
      return "text-emerald-700";
    case "invalid":
      return "text-rose-700";
    case "incomplete":
      return "text-amber-700";
    default:
      return "text-stone-500";
  }
}

function inputTone(status: DateValidation["status"]): string {
  switch (status) {
    case "valid":
      return "border-emerald-500/70 bg-emerald-50/70";
    case "invalid":
      return "border-rose-500/70 bg-rose-50/70";
    case "incomplete":
      return "border-amber-500/70 bg-amber-50/70";
    default:
      return "border-stone-300/80 bg-white/85";
  }
}

function SectionShell(props: { index: string; title: string; description: string; children: ReactNode }) {
  return (
    <section className="w-full rounded-[1.2rem] border-[1.5px] border-stone-800 bg-white px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-stone-500">{props.index}</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-950 sm:text-[2.5rem]">{props.title}</h2>
        <p className="mx-auto mt-3 max-w-3xl text-lg font-semibold leading-8 text-stone-600">{props.description}</p>
      </div>
      <div className="mt-8 flex w-full justify-center overflow-x-auto pb-2">{props.children}</div>
    </section>
  );
}

export function FocusedBookPage() {
  const [birthDate, setBirthDate] = useState("18.03.1964");

  const dateValidation = useMemo(() => analyzeDateInput(birthDate), [birthDate]);
  const deferredNormalizedBirthDate = useDeferredValue(dateValidation.normalized ?? birthDate);
  const deferredDateStatus = useDeferredValue(dateValidation.status);

  const personalState = useMemo(
    () =>
      deferredDateStatus === "valid"
        ? captureCalculation(() => calculatePersonalEnergyPotential(deferredNormalizedBirthDate))
        : { data: null, error: null },
    [deferredDateStatus, deferredNormalizedBirthDate]
  );

  const energogramProjection = useMemo(
    () => (personalState.data ? buildEnergogramProjection(personalState.data.houseValues) : null),
    [personalState.data]
  );

  return (
    <div className="min-h-screen bg-[#f4efe5] text-stone-950">
      <main className="mx-auto flex w-full max-w-[92rem] flex-col items-center gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <section className="w-full max-w-3xl rounded-[1.2rem] border-[1.5px] border-stone-800 bg-white px-5 py-8 text-center sm:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.34em] text-stone-500">Книга MOM</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">
            Дата рождения, QuersumTriangle, квадрат здоровья и личная энергограмма
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg font-semibold leading-8 text-stone-600">
            Оставлен только один вход: дата рождения. Дальше страница строится строго сверху вниз, как клиент привык видеть это на
            листе.
          </p>

          <div className="mx-auto mt-8 flex max-w-xl flex-col items-center gap-3">
            <label className="w-full text-left text-sm font-bold uppercase tracking-[0.24em] text-stone-500" htmlFor="birth-date">
              Дата рождения
            </label>
            <input
              className={`w-full rounded-[1.1rem] border px-6 py-5 text-center text-3xl font-bold tracking-[0.08em] text-stone-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] outline-none transition focus:scale-[1.01] focus:ring-4 focus:ring-stone-300/40 ${inputTone(dateValidation.status)}`}
              id="birth-date"
              inputMode="numeric"
              onBlur={() => {
                try {
                  setBirthDate(normalizeBirthDateInput(birthDate));
                } catch {
                  // Keep the current user input until it is corrected.
                }
              }}
              onChange={(event) => setBirthDate(formatDateInputForTyping(event.target.value))}
              onPaste={(event) => {
                event.preventDefault();
                const pastedValue = event.clipboardData.getData("text");
                try {
                  setBirthDate(normalizeBirthDateInput(pastedValue));
                } catch {
                  setBirthDate(formatDateInputForTyping(pastedValue));
                }
              }}
              placeholder="ДД.ММ.ГГГГ"
              value={birthDate}
            />
            <p className={`text-center text-base font-semibold ${helperTone(dateValidation.status)}`}>{dateValidation.helperText}</p>
          </div>

          {personalState.error ? (
            <div className="mx-auto mt-6 max-w-2xl rounded-[1.1rem] border border-rose-400/40 bg-rose-50/80 px-5 py-4 text-left text-lg font-semibold text-rose-800">
              {personalState.error}
            </div>
          ) : null}
        </section>

        {personalState.data ? (
          <>
            <SectionShell
              index="01"
              title="QuersumTriangle"
              description="Кверсум-треугольник идёт строго сверху вниз и сужается к корневой цифре."
            >
              <QuersumTriangle birthDate={personalState.data.birthDate} rootDigit={personalState.data.rootDigit} rows={personalState.data.triangleRows} />
            </SectionShell>

            <SectionShell
              index="02"
              title="Квадрат состояния здоровья на момент рождения"
              description="Из QuersumTriangle строится простой книжный квадрат 3x3. В клетке остаётся только балл, номер и число повторов."
            >
              <BirthHealthSquare counts={personalState.data.matrixCounts} scores={personalState.data.matrixScores} />
            </SectionShell>

            {energogramProjection ? (
              <section className="w-full rounded-[1.6rem] border border-stone-300 bg-white px-4 py-6 shadow-[0_18px_36px_rgba(44,27,17,0.08)] sm:px-6 sm:py-8">
                <div className="mx-auto max-w-4xl text-center">
                  <p className="text-sm font-bold uppercase tracking-[0.34em] text-stone-500">03</p>
                  <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-950 sm:text-[2.5rem]">Личная энергограмма</h2>
                  <p className="mx-auto mt-3 max-w-3xl text-lg font-semibold leading-8 text-stone-600">
                    Слева стоит книжный порядок домов, справа простой порядок 1..9, а сверху шкала от -4 до 4.
                  </p>
                </div>
                <div className="mt-8 flex w-full justify-center overflow-x-auto pb-2">
                  <div className="min-w-max">
                    <BookPersonalEnergogram birthDate={personalState.data.birthDate} projection={energogramProjection} />
                  </div>
                </div>
              </section>
            ) : null}
          </>
        ) : null}
      </main>
    </div>
  );
}
