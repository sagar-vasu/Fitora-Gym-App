import { useCallback, useMemo, useState } from 'react';
import { DEFAULT_FILTERS, type ExerciseFilters } from '../types/exercise';
import { filterExercises } from '../services/exerciseCatalog';

export function useExerciseFilters() {
  const [filters, setFilters] = useState<ExerciseFilters>({
    ...DEFAULT_FILTERS,
  });

  const update = useCallback(
    <K extends keyof ExerciseFilters>(key: K, value: ExerciseFilters[K]) => {
      setFilters(previous => ({ ...previous, [key]: value }));
    },
    [],
  );

  const reset = useCallback(() => setFilters({ ...DEFAULT_FILTERS }), []);

  const results = useMemo(() => filterExercises(filters), [filters]);

  const advancedCount =
    Number(filters.equipment !== 'all') +
    Number(filters.level !== 'all') +
    Number(filters.category !== 'all') +
    Number(filters.includeSecondary);

  return {
    filters,
    setFilters,
    update,
    reset,
    results,
    advancedCount,
  };
}
