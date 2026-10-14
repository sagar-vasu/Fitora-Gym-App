
export type Exercise = {
  id: string;
  name: string;
  level: string;
  category: string;
  equipment: string | null;
  force: string | null;
  mechanic: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  images: string[];
};

export type ExerciseFilters = {
  search: string;
  muscle: string;
  equipment: string;
  level: string;
  category: string;
  includeSecondary: boolean;
};

export const DEFAULT_FILTERS: ExerciseFilters = {
  search: '',
  muscle: 'all',
  equipment: 'all',
  level: 'all',
  category: 'all',
  includeSecondary: false,
};

export type FilterOption = {
  label: string;
  value: string;
};
