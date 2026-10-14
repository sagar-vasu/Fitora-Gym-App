import React, { useMemo, useState, useCallback } from 'react';

import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, X } from 'lucide-react-native';

import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppText } from '../../../components/ui/AppText';
import { colors, radius, spacing } from '../../../theme';
import { ExerciseCard } from '../components/ExerciseCard';

import {
  DEFAULT_EXERCISE_FILTERS,
  type ExerciseFilters,
} from '../types/exercise';

import {
  filterExercises,
  MUSCLE_GROUPS,
  optionsFor,
  label,
} from '../services/exerciseCatalog';

import type {
  MainTabParamList,
  RootStackParamList,
} from '../../../app/navigation/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Train'>,
  NativeStackScreenProps<RootStackParamList>
>;

type SelectFilterKey = 'group' | 'equipment' | 'level' | 'category';

const categories: Array<{
  key: 'equipment' | 'level' | 'category';
  title: string;
}> = [
  { key: 'equipment', title: 'Equipment' },
  { key: 'level', title: 'Difficulty' },
  { key: 'category', title: 'Type' },
];

type FilterOption = {
  key: string;
  title: string;
};

type FilterChipsProps = {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
};

function FilterChips({ options, value, onChange }: FilterChipsProps) {
  return (
    <FlatList
      horizontal
      data={options}
      keyExtractor={item => item.key}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chipRow}
      renderItem={({ item }) => {
        const active = value === item.key;

        return (
          <Pressable
            onPress={() => onChange(item.key)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`Filter: ${item.title}`}
            style={[styles.chip, active && styles.activeChip]}
          >
            <AppText
              variant="small"
              color={active ? colors.textInverse : colors.textSecondary}
              weight={active ? '700' : '400'}
            >
              {item.title}
            </AppText>
          </Pressable>
        );
      }}
    />
  );
}

const muscleOptions = MUSCLE_GROUPS.map(group => ({
  key: group.key,
  title: group.title,
}));

export function ExerciseLibraryScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  const [filters, setFilters] = useState<ExerciseFilters>({
    ...DEFAULT_EXERCISE_FILTERS,
  });

  const setFilter = useCallback(
    <K extends keyof ExerciseFilters>(key: K, value: ExerciseFilters[K]) => {
      setFilters(prev => ({
        ...prev,
        [key]: value,
      }));
    },
    [],
  );

  const resetFilters = useCallback(() => {
    setFilters({ ...DEFAULT_EXERCISE_FILTERS });
  }, []);

  const results = useMemo(() => filterExercises(filters), [filters]);

  const isFiltered =
    filters.search !== '' ||
    filters.group !== 'all' ||
    filters.equipment !== 'all' ||
    filters.level !== 'all' ||
    filters.category !== 'all' ||
    filters.includeSecondary;

  const renderExercise = useCallback(
    ({ item }: { item: (typeof results)[number] }) => (
      <ExerciseCard
        exercise={item}
        onPress={() =>
          navigation.navigate('ExerciseDetail', {
            exerciseId: item.id,
          })
        }
      />
    ),
    [navigation],
  );

  function renderFilter(key: SelectFilterKey, title: string) {
    const options: FilterOption[] =
      key === 'group'
        ? muscleOptions
        : [
            { key: 'all', title: 'All' },
            ...optionsFor(key).map(value => ({
              key: value,
              title: label(value),
            })),
          ];

    return (
      <View key={key}>
        <AppText weight="700" style={styles.filterLabel}>
          {title}
        </AppText>

        <FilterChips
          options={options}
          value={filters[key]}
          onChange={value => setFilter(key, value)}
        />
      </View>
    );
  }

  const header = (
    <View>
      <AppText variant="heading" weight="700">
        Explore exercises
      </AppText>

      <AppText color={colors.textSecondary} style={styles.subtitle}>
        Real movements, clear guidance, your pace.
      </AppText>

      <View style={styles.search}>
        <Search size={20} color={colors.textSecondary} />

        <TextInput
          value={filters.search}
          onChangeText={value => setFilter('search', value)}
          placeholder="Search names, muscles, equipment"
          placeholderTextColor={colors.textSecondary}
          accessibilityLabel="Search exercises"
          returnKeyType="search"
          style={styles.input}
        />

        {Boolean(filters.search) && (
          <Pressable
            onPress={() => setFilter('search', '')}
            accessibilityLabel="Clear search"
            accessibilityRole="button"
          >
            <X size={20} color={colors.textSecondary} />
          </Pressable>
        )}
      </View>

      {renderFilter('group', 'Muscle group')}

      <Pressable
        onPress={() => setFilter('includeSecondary', !filters.includeSecondary)}
        accessibilityRole="switch"
        accessibilityState={{
          checked: filters.includeSecondary,
        }}
        style={styles.toggle}
      >
        <View
          style={[styles.checkbox, filters.includeSecondary && styles.checked]}
        />

        <AppText variant="small">Include secondary muscles</AppText>
      </Pressable>

      {categories.map(item => renderFilter(item.key, item.title))}

      <View style={styles.resultRow}>
        <AppText variant="small" color={colors.textSecondary}>
          {results.length} exercise
          {results.length === 1 ? '' : 's'}
        </AppText>

        {isFiltered && (
          <Pressable onPress={resetFilters} accessibilityRole="button">
            <AppText variant="small" color={colors.primary} weight="700">
              Reset filters
            </AppText>
          </Pressable>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.root}>
      <FlatList
        data={results}
        keyExtractor={item => item.id}
        renderItem={renderExercise}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={7}
        removeClippedSubviews={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + spacing.md,
          },
        ]}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <View style={styles.empty}>
            <AppText variant="title" weight="700">
              No matching exercises
            </AppText>

            <AppText
              color={colors.textSecondary}
              style={{ textAlign: 'center' }}
            >
              Try another muscle group or reset your filters.
            </AppText>

            <Pressable onPress={resetFilters} accessibilityRole="button">
              <AppText weight="700" color={colors.primary}>
                Reset filters
              </AppText>
            </Pressable>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  subtitle: {
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 54,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    paddingVertical: spacing.sm,
  },
  filterLabel: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  chipRow: {
    gap: spacing.xs,
    paddingBottom: spacing.xs,
  },
  chip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    minHeight: 42,
    justifyContent: 'center',
  },
  activeChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
    minHeight: 44,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.textSecondary,
  },
  checked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  empty: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
});
