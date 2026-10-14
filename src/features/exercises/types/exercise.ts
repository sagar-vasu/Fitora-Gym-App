
export type Exercise = {
  id: string;
  name: string;
  level: string;
  category: string;
  force: string | null;
  mechanic: string | null;
  equipment: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  images: string[];
};

export type ExerciseFilters = {
  search: string;
  group: string;
  equipment: string;
  level: string;
  category: string;
  includeSecondary: boolean;
};

export const DEFAULT_EXERCISE_FILTERS: ExerciseFilters = {
  search: '',
  group: 'all',
  equipment: 'all',
  level: 'all',
  category: 'all',
  includeSecondary: false,
};
