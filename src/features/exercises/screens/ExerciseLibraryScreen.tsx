import React, { useCallback, useMemo, useState } from 'react';

import {
  FlatList,
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Check,
  Dumbbell,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react-native';

import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppText } from '../../../components/ui/AppText';
import { ExerciseCard } from '../components/ExerciseCard';

import { colors, radius, spacing } from '../../../theme';

import {
  filterExercises,
  label,
  MUSCLE_GROUPS,
  optionsFor,
} from '../services/exerciseCatalog';

import {
  DEFAULT_EXERCISE_FILTERS,
  type ExerciseFilters,
  type Exercise,
} from '../types/exercise';

import type {
  MainTabParamList,
  RootStackParamList,
} from '../../../app/navigation/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Train'>,
  NativeStackScreenProps<RootStackParamList>
>;

type AdvancedKey = 'equipment' | 'level' | 'category';

type Option = {
  key: string;
  title: string;
};

const FILTER_SECTIONS: Array<{
  key: AdvancedKey;
  title: string;
  subtitle: string;
}> = [
  {
    key: 'equipment',
    title: 'Equipment',
    subtitle: 'What equipment is available?',
  },
  {
    key: 'level',
    title: 'Difficulty',
    subtitle: 'Choose your experience level',
  },
  {
    key: 'category',
    title: 'Exercise type',
    subtitle: 'Select the movement category',
  },
];

const ALL_OPTION: Option = {
  key: 'all',
  title: 'Any',
};

const ADVANCED_OPTIONS: Record<AdvancedKey, Option[]> = {
  equipment: [
    ALL_OPTION,
    ...optionsFor('equipment').map(value => ({
      key: value,
      title: label(value),
    })),
  ],
  level: [
    ALL_OPTION,
    ...optionsFor('level').map(value => ({
      key: value,
      title: label(value),
    })),
  ],
  category: [
    ALL_OPTION,
    ...optionsFor('category').map(value => ({
      key: value,
      title: label(value),
    })),
  ],
};

function advancedCount(filters: ExerciseFilters): number {
  return (
    Number(filters.equipment !== 'all') +
    Number(filters.level !== 'all') +
    Number(filters.category !== 'all') +
    Number(filters.includeSecondary)
  );
}

function Pill({
  title,
  selected,
  onPress,
  compact = false,
}: {
  title: string;
  selected: boolean;
  onPress: () => void;
  compact?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        compact && styles.pillCompact,
        selected && styles.pillSelected,
        pressed && styles.pressed,
      ]}
    >
      <AppText
        variant="small"
        weight={selected ? '700' : '500'}
        color={selected ? colors.textInverse : colors.text}
      >
        {title}
      </AppText>
    </Pressable>
  );
}

function FilterSection({
  title,
  subtitle,
  options,
  value,
  onChange,
}: {
  title: string;
  subtitle: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <View style={styles.filterSection}>
      <AppText weight="700">{title}</AppText>

      <AppText
        variant="small"
        color={colors.textSecondary}
        style={styles.sectionSubtitle}
      >
        {subtitle}
      </AppText>

      <View style={styles.optionWrap}>
        {options.map(option => (
          <Pill
            key={option.key}
            title={option.title}
            selected={value === option.key}
            onPress={() => onChange(option.key)}
            compact
          />
        ))}
      </View>
    </View>
  );
}

function FilterSheet({
  visible,
  applied,
  onClose,
  onApply,
}: {
  visible: boolean;
  applied: ExerciseFilters;
  onClose: () => void;
  onApply: (filters: ExerciseFilters) => void;
}) {
  const insets = useSafeAreaInsets();

  const [draft, setDraft] = useState<ExerciseFilters>(applied);

  const setAdvanced = (key: AdvancedKey, value: string) => {
    setDraft(previous => ({
      ...previous,
      [key]: value,
    }));
  };

  const resetDraft = () => {
    setDraft(previous => ({
      ...previous,
      equipment: 'all',
      level: 'all',
      category: 'all',
      includeSecondary: false,
    }));
  };

  const previewCount = useMemo(() => filterExercises(draft).length, [draft]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      navigationBarTranslucent
      onShow={() => setDraft({ ...applied })}
      onRequestClose={onClose}
    >
      <View style={styles.modalRoot}>
        <Pressable
          style={styles.scrim}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close filters"
        />

        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.sheetHeader}>
            <View style={styles.flex}>
              <AppText variant="title" weight="700">
                Refine your search
              </AppText>

              <AppText
                variant="small"
                color={colors.textSecondary}
                style={styles.sheetSubtitle}
              >
                Find exactly what you want to train.
              </AppText>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close filters"
              onPress={onClose}
              style={styles.closeButton}
            >
              <X size={20} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.sheetScroll}
            contentContainerStyle={styles.sheetContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {FILTER_SECTIONS.map(section => (
              <FilterSection
                key={section.key}
                title={section.title}
                subtitle={section.subtitle}
                options={ADVANCED_OPTIONS[section.key]}
                value={draft[section.key]}
                onChange={value => setAdvanced(section.key, value)}
              />
            ))}

            <View style={styles.secondaryRow}>
              <View style={styles.flex}>
                <AppText weight="700">Include supporting muscles</AppText>

                <AppText
                  variant="small"
                  color={colors.textSecondary}
                  style={styles.sectionSubtitle}
                >
                  Show exercises where your selected muscle is also used
                  secondarily.
                </AppText>
              </View>

              <Switch
                value={draft.includeSecondary}
                onValueChange={value =>
                  setDraft(previous => ({
                    ...previous,
                    includeSecondary: value,
                  }))
                }
                accessibilityLabel="Include supporting muscles"
                trackColor={{
                  false: colors.border,
                  true: colors.success,
                }}
                thumbColor={colors.surface}
              />
            </View>
          </ScrollView>

          <View
            style={[
              styles.sheetFooter,
              { paddingBottom: Math.max(insets.bottom, 16) },
            ]}
          >
            <Pressable
              accessibilityRole="button"
              onPress={resetDraft}
              style={styles.resetButton}
            >
              <AppText color={colors.primary} weight="700">
                Reset
              </AppText>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => onApply(draft)}
              style={styles.applyButton}
            >
              <Check size={18} color={colors.textInverse} />

              <AppText color={colors.textInverse} weight="700">
                Show {previewCount} results
              </AppText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export function ExerciseLibraryScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  const [filters, setFilters] = useState<ExerciseFilters>({
    ...DEFAULT_EXERCISE_FILTERS,
  });

  const [sheetVisible, setSheetVisible] = useState(false);

  const results = useMemo(() => filterExercises(filters), [filters]);

  const count = advancedCount(filters);

  const currentGroup =
    MUSCLE_GROUPS.find(group => group.key === filters.group)?.title ?? 'All';

  const clearAll = () => {
    setFilters({ ...DEFAULT_EXERCISE_FILTERS });
    Keyboard.dismiss();
  };

  const openExercise = useCallback(
    (exercise: Exercise) => {
      navigation.navigate('ExerciseDetail', {
        exerciseId: exercise.id,
      });
    },
    [navigation],
  );

  const renderExercise = useCallback(
    ({ item }: { item: Exercise }) => (
      <ExerciseCard exercise={item} onPress={() => openExercise(item)} />
    ),
    [openExercise],
  );

  const activeFilters = [
    filters.equipment !== 'all'
      ? { key: 'equipment' as const, title: label(filters.equipment) }
      : null,
    filters.level !== 'all'
      ? { key: 'level' as const, title: label(filters.level) }
      : null,
    filters.category !== 'all'
      ? { key: 'category' as const, title: label(filters.category) }
      : null,
  ].filter(
    (
      item,
    ): item is {
      key: AdvancedKey;
      title: string;
    } => item !== null,
  );

  return (
    <View style={styles.root}>
      <View
        style={[styles.fixedHeader, { paddingTop: insets.top + spacing.sm }]}
      >
        <View style={styles.titleRow}>
          <View style={styles.flex}>
            <AppText
              variant="caption"
              color={colors.textSecondary}
              weight="700"
            >
              YOUR MOVEMENT LIBRARY
            </AppText>

            <AppText variant="heading" weight="700" style={styles.pageTitle}>
              Exercises
            </AppText>
          </View>

          <View style={styles.headerIcon}>
            <Dumbbell size={23} color={colors.primary} />
          </View>
        </View>

        <View style={styles.searchField}>
          <Search size={20} color={colors.textSecondary} />

          <TextInput
            value={filters.search}
            onChangeText={value =>
              setFilters(previous => ({
                ...previous,
                search: value,
              }))
            }
            placeholder="Search exercises..."
            placeholderTextColor={colors.textSecondary}
            accessibilityLabel="Search exercise library"
            returnKeyType="search"
            style={styles.searchInput}
          />

          {filters.search.length > 0 && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              onPress={() =>
                setFilters(previous => ({
                  ...previous,
                  search: '',
                }))
              }
            >
              <X size={18} color={colors.textSecondary} />
            </Pressable>
          )}
        </View>

        <View style={styles.focusHeader}>
          <AppText weight="700">Focus area</AppText>

          <AppText variant="caption" color={colors.textSecondary}>
            Select a muscle
          </AppText>
        </View>

        <FlatList
          horizontal
          data={MUSCLE_GROUPS}
          keyExtractor={item => item.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.muscleRow}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <Pill
              title={item.title}
              selected={filters.group === item.key}
              onPress={() =>
                setFilters(previous => ({
                  ...previous,
                  group: item.key,
                }))
              }
            />
          )}
        />

        <View style={styles.toolbar}>
          <View style={styles.flex}>
            <AppText weight="700" numberOfLines={1}>
              {filters.group === 'all'
                ? 'All exercises'
                : `${currentGroup} exercises`}
            </AppText>

            <AppText variant="caption" color={colors.textSecondary}>
              {results.length} movements available
            </AppText>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Open advanced filters, ${count} active`}
            onPress={() => {
              Keyboard.dismiss();
              setSheetVisible(true);
            }}
            style={styles.filterButton}
          >
            <SlidersHorizontal size={18} color={colors.primary} />

            <AppText variant="small" weight="700" color={colors.primary}>
              Filters
            </AppText>

            {count > 0 && (
              <View style={styles.countBadge}>
                <AppText
                  variant="caption"
                  color={colors.textInverse}
                  weight="700"
                >
                  {count}
                </AppText>
              </View>
            )}
          </Pressable>
        </View>

        {(activeFilters.length > 0 || filters.includeSecondary) && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.activeRow}
          >
            {activeFilters.map(item => (
              <Pressable
                key={item.key}
                accessibilityRole="button"
                accessibilityLabel={`Remove ${item.title} filter`}
                onPress={() =>
                  setFilters(previous => ({
                    ...previous,
                    [item.key]: 'all',
                  }))
                }
                style={styles.activeTag}
              >
                <AppText variant="caption" color={colors.primary}>
                  {item.title}
                </AppText>

                <X size={13} color={colors.primary} />
              </Pressable>
            ))}

            {filters.includeSecondary && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Disable supporting muscles"
                onPress={() =>
                  setFilters(previous => ({
                    ...previous,
                    includeSecondary: false,
                  }))
                }
                style={styles.activeTag}
              >
                <AppText variant="caption" color={colors.primary}>
                  Supporting muscles
                </AppText>

                <X size={13} color={colors.primary} />
              </Pressable>
            )}
          </ScrollView>
        )}
      </View>

      <FlatList
        data={results}
        renderItem={renderExercise}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={7}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Search size={28} color={colors.primary} />
            </View>

            <AppText variant="title" weight="700" style={styles.emptyTitle}>
              No matches found
            </AppText>

            <AppText
              variant="small"
              color={colors.textSecondary}
              style={styles.emptyDescription}
            >
              Try another muscle group or clear your filters to discover more
              exercises.
            </AppText>

            <Pressable
              accessibilityRole="button"
              onPress={clearAll}
              style={styles.emptyButton}
            >
              <AppText color={colors.textInverse} weight="700">
                Clear all filters
              </AppText>
            </Pressable>
          </View>
        }
      />

      <FilterSheet
        visible={sheetVisible}
        applied={filters}
        onClose={() => setSheetVisible(false)}
        onApply={value => {
          setFilters(value);
          setSheetVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
    minWidth: 0,
  },
  fixedHeader: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageTitle: {
    marginTop: spacing.xs,
  },
  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchField: {
    marginTop: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 54,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    paddingVertical: spacing.sm,
  },
  focusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  muscleRow: {
    gap: spacing.xs,
    paddingBottom: spacing.sm,
  },
  pill: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillCompact: {
    minHeight: 40,
    paddingHorizontal: spacing.md,
  },
  pillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pressed: {
    opacity: 0.75,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  filterButton: {
    minHeight: 46,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    gap: spacing.xs,
    alignItems: 'center',
  },
  countBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  activeRow: {
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  activeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    minHeight: 34,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
    gap: spacing.md,
  },
  emptyIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    textAlign: 'center',
  },
  emptyDescription: {
    textAlign: 'center',
    lineHeight: 21,
  },
  emptyButton: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    minHeight: 48,
    justifyContent: 'center',
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(14, 28, 20, 0.52)',
  },
  sheet: {
    height: '82%',
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: spacing.sm,
    overflow: 'hidden',
  },
  handle: {
    width: 38,
    height: 4,
    borderRadius: 4,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  sheetSubtitle: {
    marginTop: spacing.xs,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetScroll: {
    flex: 1,
  },
  sheetContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  filterSection: {
    marginBottom: spacing.xxl,
  },
  sectionSubtitle: {
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  optionWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  secondaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  sheetFooter: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  resetButton: {
    minWidth: 85,
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButton: {
    flex: 1,
    minHeight: 54,
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
});
