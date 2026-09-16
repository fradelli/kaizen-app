import { Suspense } from "react";
import { redirect } from "next/navigation";

import { resolveTrainingDayDate } from "@/features/training/application/resolve-training-day-date";
import { queryFixedWorkspaceTrainingDayPage } from "@/features/training/data/training-queries";
import { InvalidTrainingDate } from "@/features/training/ui/components/training-day-page/components/invalid-training-date/invalid-training-date";
import { TrainingDayContent } from "@/features/training/ui/components/training-day-page/components/training-day-content/training-day-content";
import { TrainingDayLoading } from "@/features/training/ui/components/training-day-page/components/training-day-loading/training-day-loading";
import { TrainingDayPage } from "@/features/training/ui/components/training-day-page/training-day-page";

type TrainingPageProps = Readonly<{
  searchParams: Promise<Readonly<{ date?: string | readonly string[] }>>;
}>;

export default async function TrainingPage({ searchParams }: TrainingPageProps) {
  const { date } = await searchParams;
  const dateResolution = resolveTrainingDayDate({ rawDate: date });

  if (dateResolution.status === "invalid") {
    return (
      <TrainingDayPage dateResolution={dateResolution}>
        <InvalidTrainingDate
          todayDate={dateResolution.todayDate}
          repeated={dateResolution.reason === "repeated_date"}
        />
      </TrainingDayPage>
    );
  }

  if (dateResolution.requiresCanonicalRedirect) {
    redirect(`/treino?date=${encodeURIComponent(dateResolution.civilDate)}`);
  }

  const trainingDayResult = queryFixedWorkspaceTrainingDayPage(dateResolution.civilDate);

  return (
    <TrainingDayPage dateResolution={dateResolution}>
      <Suspense key={dateResolution.civilDate} fallback={<TrainingDayLoading />}>
        <TrainingDayContent result={trainingDayResult} />
      </Suspense>
    </TrainingDayPage>
  );
}
