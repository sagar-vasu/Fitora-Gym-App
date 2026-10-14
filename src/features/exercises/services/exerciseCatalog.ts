import raw from '../../../data/exercises.json';
import type { Exercise, ExerciseFilters } from '../types/exercise';

const str = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : '';

const arr = (value: unknown): string[] =>
  Array.isArray(value)
    ? value
        .filter((v): v is string => typeof v === 'string')
        .map(v => v.trim())
        .filter(Boolean)
    : [];

const unique = (values: string[]): string[] => Array.from(new Set(values));

const normalize = (value: string): string =>
  value.trim().toLocaleLowerCase('en-US').replace(/\s+/g, ' ');

function parseExercise(record: unknown, index: number): Exercise | null {
  if (!record || typeof record !== 'object') {
    return null;
  }

  const r = record as Record<string, unknown>;
  const name = str(r.name);

  if (!name) {
    return null;
  }

  // Stable for this pinned dataset snapshot.
  const id =
    str(r.id) ||
    `missing-id-${index}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  return {
    id,
    name,
    level: str(r.level) || 'unspecified',
    category: str(r.category) || 'unspecified',
    force: str(r.force) || null,
    mechanic: str(r.mechanic) || null,
    equipment: str(r.equipment) || null,
    primaryMuscles: unique(arr(r.primaryMuscles).map(normalize)),
    secondaryMuscles: unique(arr(r.secondaryMuscles).map(normalize)),
    instructions: arr(r.instructions),
    images: arr(r.images),
  };
}

const rawRows: unknown[] = Array.isArray(raw) ? raw : [];

const seen = new Set<string>();

export const exerciseCatalog: Exercise[] = rawRows
  .flatMap((row, index) => {
    const result = parseExercise(row, index);

    if (!result || seen.has(result.id)) {
      return [];
    }

    seen.add(result.id);
    return [result];
  })
  .sort((a, b) => a.name.localeCompare(b.name));

const byId = new Map(exerciseCatalog.map(ex => [ex.id, ex]));

export const findExercise = (id: string): Exercise | undefined => byId.get(id);

// UI groups are NOT literal dataset muscle values.

export const MUSCLE_GROUPS: ReadonlyArray<{
  key: string;
  title: string;
  muscles: readonly string[];
}> = [
  {
    key: 'all',
    title: 'All',
    muscles: [],
  },
  {
    key: 'chest',
    title: 'Chest',
    muscles: ['chest'],
  },
  {
    key: 'back',
    title: 'Back',
    muscles: ['lats', 'middle back', 'lower back', 'traps'],
  },
  {
    key: 'shoulders',
    title: 'Shoulders',
    muscles: ['shoulders'],
  },
  {
    key: 'biceps',
    title: 'Biceps',
    muscles: ['biceps'],
  },
  {
    key: 'triceps',
    title: 'Triceps',
    muscles: ['triceps'],
  },
  {
    key: 'forearms',
    title: 'Forearms',
    muscles: ['forearms'],
  },
  {
    key: 'core',
    title: 'Core',
    muscles: ['abdominals'],
  },
  {
    key: 'quads',
    title: 'Quads',
    muscles: ['quadriceps'],
  },
  {
    key: 'hamstrings',
    title: 'Hamstrings',
    muscles: ['hamstrings'],
  },
  {
    key: 'glutes',
    title: 'Glutes',
    muscles: ['glutes'],
  },
  {
    key: 'calves',
    title: 'Calves',
    muscles: ['calves'],
  },
  {
    key: 'adductors',
    title: 'Adductors',
    muscles: ['adductors'],
  },
  {
    key: 'abductors',
    title: 'Abductors',
    muscles: ['abductors'],
  },
  {
    key: 'neck',
    title: 'Neck',
    muscles: ['neck'],
  },
];

const groups = new Map(MUSCLE_GROUPS.map(g => [g.key, new Set(g.muscles)]));

export const optionsFor = (key: 'equipment' | 'level' | 'category'): string[] =>
  unique(exerciseCatalog.map(ex => ex[key] || 'none')).sort((a, b) =>
    a.localeCompare(b),
  );

export function filterExercises(filters: ExerciseFilters): Exercise[] {
  const words = normalize(filters.search).split(' ').filter(Boolean);

  const groupMuscles = groups.get(filters.group);

  return exerciseCatalog.filter(ex => {
    // Muscle group filtering
    if (filters.group !== 'all') {
      if (!groupMuscles) {
        return false;
      }

      const muscles = filters.includeSecondary
        ? [...ex.primaryMuscles, ...ex.secondaryMuscles]
        : ex.primaryMuscles;

      if (!muscles.some(m => groupMuscles.has(m))) {
        return false;
      }
    }

    // Equipment
    if (
      filters.equipment !== 'all' &&
      (ex.equipment || 'none') !== filters.equipment
    ) {
      return false;
    }

    // Difficulty
    if (filters.level !== 'all' && ex.level !== filters.level) {
      return false;
    }

    // Category
    if (filters.category !== 'all' && ex.category !== filters.category) {
      return false;
    }

    // Multiword text search
    if (words.length) {
      const haystack = normalize(
        [
          ex.name,
          ex.equipment,
          ex.category,
          ...ex.primaryMuscles,
          ...ex.secondaryMuscles,
        ]
          .filter(Boolean)
          .join(' '),
      );

      if (!words.every(word => haystack.includes(word))) {
        return false;
      }
    }

    return true;
  });
}

const MEDIA_BASE =
  'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';

export function imageUrl(ex: Exercise, index = 0): string | undefined {
  const relativePath = ex.images[index];

  if (!relativePath) {
    return undefined;
  }

  // Prevent accidental absolute or traversal paths.
  const pieces = relativePath.replace(/\\/g, '/').split('/');

  if (pieces.some(part => !part || part === '.' || part === '..')) {
    return undefined;
  }

  return MEDIA_BASE + pieces.map(encodeURIComponent).join('/');
}

export function label(value: string | null | undefined): string {
  if (!value || value === 'none' || value === 'unspecified') {
    return 'Not specified';
  }

  if (value === 'body only') {
    return 'Bodyweight';
  }

  return value.replace(/\b\w/g, c => c.toUpperCase());
}

export const catalogStats = {
  rawRows: rawRows.length,
  validRows: exerciseCatalog.length,
  withoutImages: exerciseCatalog.filter(e => e.images.length === 0).length,
  withoutInstructions: exerciseCatalog.filter(e => e.instructions.length === 0)
    .length,
  withoutPrimaryMuscles: exerciseCatalog.filter(
    e => e.primaryMuscles.length === 0,
  ).length,
};
