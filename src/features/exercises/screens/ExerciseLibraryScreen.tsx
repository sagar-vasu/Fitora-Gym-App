import React, { useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Search, X, Dumbbell } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppText } from '../../../components/ui/AppText';
import { colors, spacing, radius } from '../../../theme';

import { ExerciseCard } from '../components/ExerciseCard';
import { MuscleSelector } from '../components/MuscleSelector';
import { FilterSheet } from '../components/FilterSheet';
import { useExerciseFilters } from '../hooks/useExerciseFilters';

import type { Exercise } from '../types/exercise';
import type {
  MainTabParamList,
  RootStackParamList,
} from '../../../app/navigation/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Train'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function ExerciseLibraryScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { filters, setFilters, update, reset, results, advancedCount } =
    useExerciseFilters();

  const openDetail = useCallback(
    (exercise: Exercise) =>
      navigation.navigate('ExerciseDetail', {
        exerciseId: exercise.id,
      }),
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: Exercise }) => (
      <ExerciseCard exercise={item} onPress={openDetail} />
    ),
    [openDetail],
  );

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <AppText
              variant="caption"
              weight="700"
              color={colors.textSecondary}
            >
              YOUR MOVEMENT LIBRARY
            </AppText>

            <AppText
              variant="heading"
              weight="700"
              style={{ marginTop: spacing.xs }}
            >
              Exercises
            </AppText>
          </View>

          <View style={styles.icon}>
            <Dumbbell size={23} color={colors.primary} />
          </View>
        </View>

        <View style={styles.search}>
          <Search size={20} color={colors.textSecondary} />

          <TextInput
            value={filters.search}
            onChangeText={value => update('search', value)}
            placeholder="Search exercises..."
            placeholderTextColor={colors.textSecondary}
            accessibilityLabel="Search exercise library"
            returnKeyType="search"
            style={styles.input}
          />

          {filters.search.length > 0 && (
            <Pressable
              onPress={() => update('search', '')}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
            >
              <X size={20} color={colors.textSecondary} />
            </Pressable>
          )}
        </View>

        <View style={styles.sectionRow}>
          <AppText weight="700">Focus area</AppText>
          <AppText variant="caption" color={colors.textSecondary}>
            Choose a muscle group
          </AppText>
        </View>

        <MuscleSelector
          selected={filters.muscle}
          onChange={value => update('muscle', value)}
        />

        <View style={styles.resultsRow}>
          <View style={{ flex: 1 }}>
            <AppText weight="700">{results.length} exercises</AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              Explore and learn proper technique
            </AppText>
          </View>

          <FilterSheet applied={filters} onApply={setFilters} />
        </View>

        {advancedCount > 0 && (
          <Pressable
            onPress={reset}
            accessibilityRole="button"
            style={styles.clear}
          >
            <AppText variant="small" color={colors.primary} weight="700">
              Clear filters
            </AppText>
          </Pressable>
        )}
      </View>

      <FlatList
        data={results}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        style={{ flex: 1 }}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={7}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Search size={34} color={colors.textSecondary} />

            <AppText variant="title" weight="700">
              No exercises found
            </AppText>

            <AppText
              color={colors.textSecondary}
              style={{ textAlign: 'center' }}
            >
              Try another name or remove some filters.
            </AppText>

            <Pressable
              accessibilityRole="button"
              onPress={reset}
              style={styles.resetButton}
            >
              <AppText color={colors.textInverse} weight="700">
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
  header: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  search: {
    marginTop: spacing.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    minHeight: 54,
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: spacing.sm,
  },
  sectionRow: {
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  clear: {
    alignSelf: 'flex-end',
    paddingVertical: spacing.xs,
  },
  list: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: spacing.md,
  },
  resetButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
});
