"use client";

import React, { useMemo, useState } from "react";

function formatCOP(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

function countBetween(ages, min, max) {
  return ages.filter((age) => age >= min && age <= max).length;
}

function getAdditionalDetails(ages, rateFn) {
  return ages.map((age) => ({ age, price: rateFn(age) }));
}

const plans = {
  familiar: {
    label: "Plan Familiar",
    intro:
      "Calcula la mensualidad mínima según edades y cupos, probando grupo fijo y adicionales.",
    additionalRate(age) {
      if (age <= 49) return 7500;
      if (age <= 60) return 11000;
      if (age <= 70) return 13000;
      if (age <= 80) return 18500;
      return 30000;
    },
    rules: [
      {
        id: "f1",
        name: "Grupo 1",
        fixed: 35000,
        validate(ages) {
          return ages.length >= 1 && ages.length <= 5 && ages.every((age) => age <= 50);
        },
        description: "Hasta 5 personas hasta 50 años.",
      },
      {
        id: "f2",
        name: "Grupo 2",
        fixed: 38000,
        validate(ages) {
          return ages.length >= 1 && ages.length <= 7 && ages.every((age) => age <= 50);
        },
        description: "Hasta 7 personas hasta 50 años.",
      },
      {
        id: "f3",
        name: "Grupo 3",
        fixed: 40000,
        validate(ages) {
          const u50 = countBetween(ages, 0, 50);
          const a51_60 = countBetween(ages, 51, 60);
          return ages.length >= 1 && ages.length <= 6 && u50 <= 5 && a51_60 <= 1 && countBetween(ages, 61, 999) === 0;
        },
        description: "Hasta 5 personas hasta 50 años y 1 entre 51 y 60.",
      },
      {
        id: "f4",
        name: "Grupo 4",
        fixed: 45000,
        validate(ages) {
          const u50 = countBetween(ages, 0, 50);
          const a51_60 = countBetween(ages, 51, 60);
          return ages.length >= 1 && ages.length <= 7 && u50 <= 5 && a51_60 <= 2 && countBetween(ages, 61, 999) === 0;
        },
        description: "Hasta 5 personas hasta 50 años y 2 entre 51 y 60.",
      },
      {
        id: "f5",
        name: "Grupo 5",
        fixed: 48000,
        validate(ages) {
          const u50 = countBetween(ages, 0, 50);
          const a51_70 = countBetween(ages, 51, 70);
          return ages.length >= 1 && ages.length <= 7 && u50 <= 5 && a51_70 <= 2 && countBetween(ages, 71, 999) === 0;
        },
        description: "Hasta 5 personas hasta 50 años y 2 entre 51 y 70.",
      },
      {
        id: "f6",
        name: "Grupo 6",
        fixed: 50000,
        validate(ages) {
          const u50 = countBetween(ages, 0, 50);
          const a51_80 = countBetween(ages, 51, 80);
          return ages.length >= 1 && ages.length <= 7 && u50 <= 5 && a51_80 <= 2 && countBetween(ages, 81, 999) === 0;
        },
        description: "Hasta 5 personas hasta 50 años y 2 entre 51 y 80.",
      },
      {
      id: "f7",
      name: "Grupo 7",
      fixed: 60000,
      validate(ages) {
        const u50 = countBetween(ages, 0, 50);
        const a81p = countBetween(ages, 81, 999);
        const a51_80 = countBetween(ages, 51, 80);
        return ages.length >= 1 && ages.length <= 7 && u50 <= 5 && a81p <= 2 && a51_80 === 0;
      },
      description: "Hasta 5 personas hasta 50 años y hasta 2 mayores de 81 años.",
    },
    ],
  },
  plus: {
    label: "Plan Familiar Plus",
    intro:
      "Busca la liquidación más barata entre grupo fijo, libre elección y adicionales, respetando cupos y rangos.",
    additionalRate(age) {
      if (age <= 58) return 11000;
      if (age <= 69) return 20000;
      if (age <= 75) return 70000;
      if (age <= 79) return 95000;
      if (age <= 89) return 115000;
      return 150000;
    },
    freeChoiceRate(age) {
      if (age <= 50) return 5200;
      if (age <= 55) return 9800;
      if (age <= 60) return 11400;
      if (age <= 65) return 14000;
      if (age <= 70) return 17800;
      if (age <= 75) return 25600;
      if (age <= 80) return 48000;
      return 48000;
    },
    rules: [
      {
        id: "p1",
        name: "Grupo 1",
        fixed: 40000,
        validate(ages) {
          return ages.length >= 1 && ages.length <= 7 && ages.every((age) => age <= 50);
        },
        description: "Hasta 7 personas hasta 50 años.",
      },
      {
        id: "p2",
        name: "Grupo 2",
        fixed: 45000,
        validate(ages) {
          const u50 = countBetween(ages, 0, 50);
          const a51_60 = countBetween(ages, 51, 60);
          return ages.length >= 1 && ages.length <= 7 && u50 <= 5 && a51_60 <= 2 && countBetween(ages, 61, 999) === 0;
        },
        description: "Hasta 5 personas hasta 50 años y 2 entre 51 y 60.",
      },
      {
        id: "p3",
        name: "Grupo 3",
        fixed: 60000,
        validate(ages) {
          const u50 = countBetween(ages, 0, 50);
          const a51_70 = countBetween(ages, 51, 70);
          return ages.length >= 1 && ages.length <= 7 && u50 <= 5 && a51_70 <= 2 && countBetween(ages, 71, 999) === 0;
        },
        description: "Hasta 5 personas hasta 50 años y 2 entre 51 y 70.",
      },
    ],
    freeChoice: {
      name: "Libre elección",
      min: 60000,
      validate(ages) {
        const u50 = countBetween(ages, 0, 50);
        const a51_75 = countBetween(ages, 51, 75);
        const a76_80 = countBetween(ages, 76, 80);
        const a81p = countBetween(ages, 81, 999);
        return (
          ages.length >= 1 &&
          ages.length <= 7 &&
          u50 <= 5 &&
          a81p === 0 &&
          a51_75 <= 2 &&
          a76_80 <= 1 &&
          a51_75 + a76_80 <= 2
        );
      },
      description: "Hasta 5 personas hasta 50 años y cupos controlados entre 51 y 80.",
    },
  },
};

function ageChipColor(age) {
  if (age <= 50) return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (age <= 60) return "bg-sky-100 text-sky-800 border-sky-200";
  if (age <= 70) return "bg-amber-100 text-amber-800 border-amber-200";
  if (age <= 80) return "bg-orange-100 text-orange-800 border-orange-200";
  return "bg-rose-100 text-rose-800 border-rose-200";
}

function chooseBestLiquidation(planKey, ages) {
  const plan = plans[planKey];
  const candidates = [];
  const compatible = new Set();

  const totalMasks = 1 << ages.length;
  for (let mask = 0; mask < totalMasks; mask++) {
    const subset = [];
    const subsetIndexes = new Set();

    for (let i = 0; i < ages.length; i++) {
      if (mask & (1 << i)) {
        subset.push(ages[i]);
        subsetIndexes.add(i);
      }
    }    for (const rule of plan.rules) {
      if (!rule.validate(subset)) continue;
      compatible.add(rule.name);

      const additionalDetails = ages
        .map((age, idx) => ({ age, idx }))
        .filter(({ idx }) => !subsetIndexes.has(idx))
        .map(({ age }) => ({ age, price: plan.additionalRate(age) }));
      const additional = additionalDetails.reduce((sum, item) => sum + item.price, 0);

      candidates.push({
        mode: "fixed",
        name: rule.name,
        groupPrice: rule.fixed,
        groupPeople: subset,
        additionalDetails,
        total: rule.fixed + additional,
      });
    }

    if (planKey === "plus" && plan.freeChoice && plan.freeChoice.validate(subset)) {
      compatible.add(plan.freeChoice.name);

      const groupSum = subset.reduce((sum, age) => sum + plan.freeChoiceRate(age), 0);
      const groupPrice = Math.max(groupSum, plan.freeChoice.min);
      const additionalDetails = ages
        .map((age, idx) => ({ age, idx }))
        .filter(({ idx }) => !subsetIndexes.has(idx))
        .map(({ age }) => ({ age, price: plan.additionalRate(age) }));
      const additional = additionalDetails.reduce((sum, item) => sum + item.price, 0);

      candidates.push({
        mode: "freeChoice",
        name: plan.freeChoice.name,
        groupPrice,
        groupPeople: subset,
        additionalDetails,
        total: groupPrice + additional,
      });
    }
  }

  candidates.sort((a, b) => {
    if (a.total !== b.total) return a.total - b.total;
    const priority = { fixed: 0, freeChoice: 1, additionalOnly: 2 };
    if (priority[a.mode] !== priority[b.mode]) return priority[a.mode] - priority[b.mode];
    return b.groupPeople.length - a.groupPeople.length;
  });

  if (candidates.length === 0) {
    const additionalDetails = getAdditionalDetails(ages, plan.additionalRate);
    const total = additionalDetails.reduce((sum, item) => sum + item.price, 0);
    return {
      mode: "additionalOnly",
      name: "Solo adicionales",
      groupPrice: 0,
      groupPeople: [],
      additionalDetails,
      total,
      compatibleLabels: [],
    };
  }

  const best = candidates[0];

  return {
    ...best,
    compatibleLabels: Array.from(compatible),
  };
}

export default function App() {
  const [planKey, setPlanKey] = useState("plus");
  const [ageInput, setAgeInput] = useState("69, 69, 45, 40, 10, 1, 5");
  const [manualAges, setManualAges] = useState([69, 69, 45, 40, 10, 1, 5]);
  const [newAge, setNewAge] = useState("");

  const result = useMemo(() => chooseBestLiquidation(planKey, manualAges), [planKey, manualAges]);
  const plan = plans[planKey];

  function syncFromText() {
    const parsed = ageInput
      .split(/[\s,;|]+/)
      .map((x) => Number(x))
      .filter((n) => Number.isFinite(n) && n >= 0);
    setManualAges(parsed);
  }

  function addAge() {
    const n = Number(newAge);
    if (!Number.isFinite(n) || n < 0) return;
    setManualAges((prev) => [...prev, n]);
    setNewAge("");
    setAgeInput((prev) => (prev.trim() ? `${prev}, ${n}` : String(n)));
  }

  function removeAge(index) {
    setManualAges((prev) => prev.filter((_, i) => i !== index));
    setAgeInput((prev) => {
      const arr = prev
        .split(/[\s,;|]+/)
        .map((x) => x.trim())
        .filter(Boolean)
        .map(Number)
        .filter((n) => Number.isFinite(n));
      arr.splice(index, 1);
      return arr.join(", ");
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Calculador de planes exequiales</h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">Prototipo funcional para liquidar <span className="font-medium">Plan Familiar</span> y <span className="font-medium">Plan Familiar Plus</span> con edades, cupos y reglas de grupo.</p>
            </div>
            <div className="inline-flex rounded-2xl bg-slate-100 p-1 text-sm font-medium">
              <button
                onClick={() => setPlanKey("familiar")}
                className={`rounded-xl px-4 py-2 transition ${planKey === "familiar" ? "bg-white shadow-sm" : "text-slate-500"}`}
              >
                Plan Familiar
              </button>
              <button
                onClick={() => setPlanKey("plus")}
                className={`rounded-xl px-4 py-2 transition ${planKey === "plus" ? "bg-white shadow-sm" : "text-slate-500"}`}
              >
                Plan Familiar Plus
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Ingreso de edades</h2>
                  <p className="mt-1 text-sm text-slate-600">Escribe edades separadas por coma o agrégalas una a una.</p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
                <textarea
                  value={ageInput}
                  onChange={(e) => setAgeInput(e.target.value)}
                  rows={3}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                  placeholder="Ej: 69, 69, 45, 40, 10, 1, 5"
                />
                <div className="flex gap-2 md:flex-col">
                  <button
                    onClick={syncFromText}
                    className="rounded-2xl bg-slate-900 px-4 py-3 text-white transition hover:bg-slate-800"
                  >
                    Procesar texto
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {manualAges.map((age, idx) => (
                  <button
                    key={`${age}-${idx}`}
                    onClick={() => removeAge(idx)}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${ageChipColor(age)}`}
                    title="Quitar"
                  >
                    <span>{age} años</span>
                    <span className="text-xs opacity-70">×</span>
                  </button>
                ))}
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  type="number"
                  min="0"
                  value={newAge}
                  onChange={(e) => setNewAge(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500 sm:max-w-40"
                  placeholder="Edad"
                />
                <button onClick={addAge} className="rounded-2xl border border-slate-300 px-4 py-3 font-medium hover:bg-slate-50">
                  Agregar edad
                </button>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Resultado óptimo</h2>
                  <p className="mt-1 text-sm text-slate-600">El sistema prueba combinaciones y toma la más barata permitida por las reglas cargadas.</p>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                  {plan.label}
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm text-slate-500">Personas</div>
                  <div className="mt-1 text-2xl font-semibold">{manualAges.length}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm text-slate-500">Modalidad</div>
                  <div className="mt-1 text-2xl font-semibold">{result.name}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm text-slate-500">Mensualidad</div>
                  <div className="mt-1 text-2xl font-semibold">{formatCOP(result.total)}</div>
                </div>
              </div>

              {result.compatibleLabels.length > 0 ? (
                <div className="mt-5 rounded-2xl border border-slate-200 p-4">
                  <h3 className="font-semibold">Opciones válidas encontradas</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {result.compatibleLabels.map((label) => (
                      <span key={label} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <h3 className="font-semibold">Integrantes del grupo</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {result.groupPeople.length ? (
                      result.groupPeople.map((age, idx) => (
                        <span key={`${age}-${idx}`} className={`rounded-full border px-3 py-1 text-sm ${ageChipColor(age)}`}>
                          {age} años
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">Sin grupo aplicado</span>
                    )}
                  </div>
                  <p className="mt-3 text-sm text-slate-600">Costo del grupo: <span className="font-medium text-slate-900">{formatCOP(result.groupPrice || 0)}</span></p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <h3 className="font-semibold">Adicionales</h3>
                  <div className="mt-3 space-y-2">
                    {result.additionalDetails.length ? (
                      result.additionalDetails.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
                          <span>{item.age} años</span>
                          <span className="font-medium">{formatCOP(item.price)}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">No hay adicionales.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-xl font-semibold">Reglas activas</h2>
              <p className="mt-1 text-sm text-slate-600">Estas reglas están cargadas como base editable dentro del código.</p>

              <div className="mt-4 space-y-3">
                {plan.rules.map((rule) => (
                  <div key={rule.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium">{rule.name}</div>
                      <div className="font-semibold">{formatCOP(rule.fixed)}</div>
                    </div>
                    <div className="mt-2 text-sm text-slate-600">{rule.description}</div>
                  </div>
                ))}
                {plan.freeChoice ? (
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium">{plan.freeChoice.name}</div>
                      <div className="font-semibold">mín. {formatCOP(plan.freeChoice.min)}</div>
                    </div>
                    <div className="mt-2 text-sm text-slate-600">{plan.freeChoice.description}</div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-xl font-semibold">Notas de implementación</h2>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                <li>• El motor prueba todas las combinaciones posibles y elige la más económica.</li>
                <li>• En Plus compara grupo fijo, libre elección y adicionales.</li>
                <li>• Las reglas se pueden ajustar fácilmente dentro del objeto <span className="font-medium text-slate-900">plans</span>.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900 p-5 text-slate-100">
          <div className="text-sm font-medium uppercase tracking-wide text-slate-300">Nota</div>
          <p className="mt-2 text-sm leading-6 text-slate-200">El prototipo ya resuelve la liquidación automática. Lo más útil ahora es conectar estas reglas a una interfaz de producción</p>
          <p className="mt-3 text-xs text-slate-400">Desarrollado por: Francisco Sanchez</p>
        </div>
      </div>
    </div>
  );
}
