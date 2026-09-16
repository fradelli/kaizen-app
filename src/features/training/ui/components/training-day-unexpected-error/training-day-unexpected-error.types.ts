export type TrainingDayUnexpectedErrorProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;
