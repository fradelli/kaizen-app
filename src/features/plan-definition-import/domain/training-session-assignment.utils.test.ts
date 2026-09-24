import { describe, expect, it } from "vitest";

import type { TrainingPlan } from "./plan-definition-source.types";
import { resolveTrainingSessionAssignment } from "./training-session-assignment.utils";

const plan: TrainingPlan = {
  plan_id: "plan",
  version: "1",
  status: "active",
  created_at: "2026-09-01",
  last_updated: "2026-09-01",
  sessions: {
    lower_a: session(),
    upper_a: session(),
    pre_lower_warmup: session(),
    pre_upper_warmup: session(),
    custom: session(),
  },
};

describe("resolveTrainingSessionAssignment", () => {
  it("prefers explicit versioned metadata", () => {
    expect(
      resolveTrainingSessionAssignment(
        {
          sessions: [
            {
              plan_id: "plan",
              plan_version: "1",
              session_id: "custom",
              assignment_role: "mobility",
              compatible_preparation_session_ids: ["pre_lower_warmup"],
            },
          ],
          exercises: [],
        },
        plan,
        "custom",
      ),
    ).toEqual({
      assignmentRole: "mobility",
      compatiblePreparationSessionIds: ["pre_lower_warmup"],
    });
  });

  it.each([
    ["pre_lower_warmup", "preparation", []],
    ["lower_a", "main", ["pre_lower_warmup"]],
    ["upper_a", "main", ["pre_upper_warmup"]],
    ["custom", "main", []],
  ] as const)("maps legacy session %s", (sessionId, assignmentRole, compatibleIds) => {
    expect(resolveTrainingSessionAssignment({ exercises: [] }, plan, sessionId)).toEqual({
      assignmentRole,
      compatiblePreparationSessionIds: compatibleIds,
    });
  });
});

function session(): TrainingPlan["sessions"][string] {
  return { name: "Sessão", target_duration_minutes: 10, exercises: [] };
}
