import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import type {
  PublicTrainingExerciseDto,
  TrainingDayDto,
  TrainingDayPageQueryResult,
  TrainingDaySessionDto,
} from "@/features/training/application/training-dto";
import type { CivilDate } from "@/features/training/domain/training-day.types";

import { TrainingDayContent } from "./training-day-content";

const civilDate = "2026-09-16" as CivilDate;

afterEach(cleanup);

describe("TrainingDayContent", () => {
  it("renders a safe failure instead of a partial projection", async () => {
    render(
      await TrainingDayContent({
        result: Promise.resolve({ status: "invalid_data", reason: "reference_invalid" }),
      }),
    );

    expect(screen.getByText("Não foi possível resolver o treino")).toBeInTheDocument();
    expect(screen.getByText(/Nenhum dado parcial foi exibido/)).toBeInTheDocument();
  });

  it("distinguishes an unavailable active plan from inconsistent data", async () => {
    render(
      await renderReadyDay({
        state: "unavailable",
        civilDate,
        reason: "active_plan_not_found",
      }),
    );

    expect(screen.getByText("Plano de treino indisponível")).toBeInTheDocument();
    expect(screen.queryByText("Não foi possível resolver o treino")).not.toBeInTheDocument();
  });

  it("shows available sessions for an unassigned day without mutation controls", async () => {
    render(
      await renderReadyDay({
        state: "unassigned",
        civilDate,
        assignmentId: null,
        assignmentRevision: null,
        availablePlan: {
          status: "available",
          planId: "performance",
          version: "2.0.0",
          sourceStatus: "approved",
          sessions: [createSession("main")],
        },
      }),
    );

    expect(screen.getByText("Nenhum treino foi definido para esta data")).toBeInTheDocument();
    expect(screen.getByText("Sessão principal")).toBeInTheDocument();
    expect(screen.getByText("Descanso")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("keeps preparation before the main session and only shows applicable load", async () => {
    const preparation = createSession("preparation", "Preparação");
    const main = createSession("main", "Treino principal", [
      createExercise({
        loadApplicable: true,
        loadUnit: "kg",
        loadKg: "20.500",
        name: "Agachamento",
      }),
      createExercise({
        prescriptionId: "prescription-without-load",
        loadApplicable: false,
        loadKg: null,
        name: "Salto vertical",
      }),
    ]);

    render(
      await renderReadyDay({
        ...assignedBase,
        state: "training",
        preparation,
        main,
      }),
    );

    const sectionHeadings = screen.getAllByRole("heading", { level: 2 });
    expect(sectionHeadings.map((heading) => heading.textContent)).toEqual([
      "Preparação",
      "Treino principal",
    ]);
    expect(screen.getByText("20.500 kg")).toBeInTheDocument();
    expect(screen.queryByText("0 kg")).not.toBeInTheDocument();
  });

  it("renders mobility without a main training section", async () => {
    render(
      await renderReadyDay({
        ...assignedBase,
        state: "mobility",
        mobility: createSession("mobility", "Mobilidade leve"),
      }),
    );

    expect(screen.getByRole("heading", { level: 2, name: "Mobilidade leve" })).toBeInTheDocument();
    expect(screen.queryByText("Treino principal")).not.toBeInTheDocument();
  });

  it("renders rest explicitly without artificial exercises", async () => {
    render(
      await renderReadyDay({
        state: "rest",
        civilDate,
        assignmentId: "assignment-rest",
        assignmentRevision: 1,
        reason: "Recuperação programada",
        execution: null,
      }),
    );

    expect(screen.getByRole("heading", { level: 2, name: "Descanso hoje" })).toBeInTheDocument();
    expect(screen.getByText("Recuperação programada")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 3 })).not.toBeInTheDocument();
  });
});

const assignedBase = {
  civilDate,
  assignmentId: "assignment-1",
  assignmentRevision: 1,
  planId: "performance",
  planVersion: "2.0.0",
  execution: null,
} as const;

async function renderReadyDay(day: TrainingDayDto) {
  const result: TrainingDayPageQueryResult = { status: "ready", day };
  return TrainingDayContent({ result: Promise.resolve(result) });
}

function createSession(
  role: TrainingDaySessionDto["role"],
  name = "Sessão principal",
  exercises = [createExercise()],
): TrainingDaySessionDto {
  return {
    role,
    sessionId: `session-${role}`,
    name,
    targetDurationMinutes: 45,
    shortDurationMinutes: 30,
    intensity: "moderada",
    notes: null,
    exercises,
  };
}

function createExercise(
  overrides: Partial<PublicTrainingExerciseDto> &
    Readonly<{ prescriptionId?: string; loadKg?: string | null }> = {},
) {
  const { loadKg = null, ...publicOverrides } = overrides;

  return {
    prescriptionId: "prescription-1",
    exerciseId: "exercise-1",
    name: "Mobilidade de quadril",
    ordinal: 1,
    prescribedSets: 1,
    prescribedText: "1 x 8 repetições",
    restSeconds: 60,
    priority: null,
    notes: null,
    dose: {
      sourceText: "8 repetições",
      minimum: 8,
      maximum: 8,
      unit: "repetitions",
      scope: "total",
      qualifier: null,
    },
    measurementType: "repetitions",
    loadApplicable: false,
    loadUnit: null,
    instructions: ["Execute com controle."],
    cues: [],
    risks: null,
    executionId: null,
    status: "completed",
    comment: null,
    revision: null,
    sets: [
      {
        setNumber: 1,
        status: "completed",
        value: 8,
        leftValue: null,
        rightValue: null,
        directionValues: null,
        loadKg,
        revision: 1,
      },
    ],
    ...publicOverrides,
  } as const;
}
