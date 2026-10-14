import rawData from '../../../data/exercises.json';
import { MUSCLE_GROUPS } from '../constants/muscleGroups';
import {
  DEFAULT_FILTERS,
  type Exercise,
  type ExerciseFilters,
  type FilterOption,
} from '../types/exercise';

const normalize = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, ' ');

const text = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : '';

const strings = (value: unknown): string[] =>
  Array.isArray(value)
    ? value
        .filter((v): v is string => typeof v === 'string')
        .map(v => v.trim())
        .filter(Boolean)
    : [];

function parseRecord(value: unknown): Exercise | null {
  if (!value || typeof value !== 'object') return null;

  const row = value as Record<string, unknown>;
  const id = text(row.id);
  const name = text(row.name);

  // Reject records that cannot safely be linked by ID.
  if (!id || !name) return null;

  return {
    id,
    name,
    level: text(row.level) || 'unspecified',
    category: text(row.category) || 'unspecified',
    equipment: text(row.equipment) || null,
    force: text(row.force) || null,
    mechanic: text(row.mechanic) || null,
    primaryMuscles: strings(row.primaryMuscles).map(normalize),
    secondaryMuscles: strings(row.secondaryMuscles).map(normalize),
    instructions: strings(row.instructions),
    images: strings(row.images),
  };
}

const rows: unknown[] = Array.isArray(rawData) ? rawData : [];
const seenIds = new Set<string>();

export const EXERCISES: Exercise[] = rows
  .map(parseRecord)
  .filter((item): item is Exercise => {
    if (!item || seenIds.has(item.id)) return false;
    seenIds.add(item.id);
    return true;
  })
  .sort((a, b) => a.name.localeCompare(b.name));

const index = new Map(EXERCISES.map(item => [item.id, item]));

export function getExercise(id: string) {
  return index.get(id);
}

export function formatLabel(value: string | null | undefined) {
  if (!value || value === 'unspecified') return 'Not specified';
  if (value === 'body only') return 'Bodyweight';

  return value.replace(/\b\w/g, char => char.toUpperCase());
}

export function getFilterOptions(
  field: 'equipment' | 'level' | 'category',
): FilterOption[] {
  const options = new Set(EXERCISES.map(ex => ex[field] || 'none'));

  return [
    { label: 'Any', value: 'all' },
    ...Array.from(options)
      .sort()
      .map(value => ({
        label: value === 'none' ? 'None specified' : formatLabel(value),
        value,
      })),
  ];
}

export function filterExercises(
  filters: ExerciseFilters = DEFAULT_FILTERS,
): Exercise[] {
  const queryWords = normalize(filters.search).split(' ').filter(Boolean);

  const group = MUSCLE_GROUPS.find(g => g.id === filters.muscle);
  const targetMuscles = new Set<string>(group?.muscles ?? []);

  return EXERCISES.filter(ex => {
    if (filters.muscle !== 'all') {
      if (!group) return false;

      const muscles = filters.includeSecondary
        ? [...ex.primaryMuscles, ...ex.secondaryMuscles]
        : ex.primaryMuscles;

      if (!muscles.some(muscle => targetMuscles.has(muscle))) {
        return false;
      }
    }

    if (
      filters.equipment !== 'all' &&
      (ex.equipment || 'none') !== filters.equipment
    )
      return false;

    if (filters.level !== 'all' && ex.level !== filters.level) {
      return false;
    }

    if (filters.category !== 'all' && ex.category !== filters.category)
      return false;

    if (queryWords.length > 0) {
      const searchable = normalize(
        [
          ex.name,
          ex.equipment || '',
          ex.category,
          ...ex.primaryMuscles,
          ...ex.secondaryMuscles,
        ].join(' '),
      );

      if (!queryWords.every(word => searchable.includes(word))) {
        return false;
      }
    }

    return true;
  });
}

// Development asset source. Pin and host reviewed media for release.
const IMAGE_BASE =
  'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';

export function getExerciseImage(
  exercise: Exercise,
  imageIndex = 0,
): string | undefined {
  const path = exercise.images[imageIndex];
  if (!path) return undefined;

  const parts = path.replace(/\\/g, '/').split('/');

  if (parts.some(part => !part || part === '.' || part === '..')) {
    return undefined;
  }

  return IMAGE_BASE + parts.map(encodeURIComponent).join('/');
}
