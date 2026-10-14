export type MainTabParamList = {
  Today: undefined;
  Train: undefined;
  Nutrition: undefined;
  Progress: undefined;
  You: undefined;
};

export type RootStackParamList = {
  Main: undefined;
  ExerciseDetail: { exerciseId: string };
  ActiveWorkout: { workoutId: string };
  WorkoutSummary: { sessionId: string };
};
