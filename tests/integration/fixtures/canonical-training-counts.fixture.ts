import type { PlanDefinitionSnapshot } from "@/features/plan-definition-import/domain/plan-definition-import.types";

export function canonicalTrainingCounts(snapshot: PlanDefinitionSnapshot) {
  const trainingPlans = snapshot.sources.filter((source) => source.kind === "training_plan");
  const sessions = trainingPlans.flatMap((source) => Object.values(source.document.sessions));
  const metadata = snapshot.sources.find((source) => source.kind === "execution_metadata");
  return {
    batches: snapshot.sources.length,
    exercises: metadata?.document.exercises.length ?? 0,
    trainingPlans: trainingPlans.length,
    trainingSessions: sessions.length,
    trainingPrescriptions: sessions.reduce((sum, session) => sum + session.exercises.length, 0),
  };
}
