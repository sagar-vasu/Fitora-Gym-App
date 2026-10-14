import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from 'react-native';
import { X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '../../../components/ui/AppText';
import { colors, radius, spacing } from '../../../theme';
import { filterExercises, getFilterOptions } from '../services/exerciseCatalog';
import type { ExerciseFilters, FilterOption } from '../types/exercise';

type Key = 'equipment' | 'level' | 'category';

type Props = {
  applied: ExerciseFilters;
  onApply: (value: ExerciseFilters) => void;
};

const SECTIONS: { key: Key; title: string }[] = [
  { key: 'equipment', title: 'Equipment' },
  { key: 'level', title: 'Difficulty' },
  { key: 'category', title: 'Exercise type' },
];

const OPTIONS: Record<Key, FilterOption[]> = {
  equipment: getFilterOptions('equipment'),
  level: getFilterOptions('level'),
  category: getFilterOptions('category'),
};

export function FilterSheet({ applied, onApply }: Props) {
  const [visible, setVisible] = useState(false);
  const [draft, setDraft] = useState({ ...applied });
  const insets = useSafeAreaInsets();

  const open = () => {
    setDraft({ ...applied });
    setVisible(true);
  };

  const close = () => setVisible(false);

  const update = (key: Key, value: string) => {
    setDraft(prev => ({ ...prev, [key]: value }));
  };

  const reset = () => {
    setDraft(prev => ({
      ...prev,
      equipment: 'all',
      level: 'all',
      category: 'all',
      includeSecondary: false,
    }));
  };

  const apply = () => {
    onApply({ ...draft });
    close();
  };

  const count =
    Number(applied.equipment !== 'all') +
    Number(applied.level !== 'all') +
    Number(applied.category !== 'all') +
    Number(applied.includeSecondary);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Advanced filters, ${count} active`}
        style={styles.trigger}
        onPress={open}
      >
        <AppText color={colors.primary} weight="700">
          Filters {count > 0 ? `(${count})` : ''}
        </AppText>
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={close}
      >
        <View style={styles.modalRoot}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={close}
            accessibilityLabel="Dismiss filters"
          >
            <View style={styles.scrim} />
          </Pressable>

          <View style={styles.sheet}>
            <View style={styles.handle} />

            <View style={styles.header}>
              <View style={{ flex: 1 }}>
                <AppText variant="title" weight="700">
                  Refine exercises
                </AppText>
                <AppText variant="small" color={colors.textSecondary}>
                  Choose what works for your training.
                </AppText>
              </View>

              <Pressable
                onPress={close}
                accessibilityRole="button"
                accessibilityLabel="Close filters"
                style={styles.close}
              >
                <X size={20} color={colors.text} />
              </Pressable>
            </View>

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.body}
              showsVerticalScrollIndicator={false}
            >
              {SECTIONS.map(section => (
                <View key={section.key} style={styles.section}>
                  <AppText weight="700">{section.title}</AppText>

                  <View style={styles.options}>
                    {OPTIONS[section.key].map(option => {
                      const selected = draft[section.key] === option.value;

                      return (
                        <Pressable
                          key={option.value}
                          onPress={() => update(section.key, option.value)}
                          accessibilityRole="button"
                          accessibilityState={{ selected }}
                          style={[styles.option, selected && styles.selected]}
                        >
                          <AppText
                            variant="small"
                            color={selected ? colors.textInverse : colors.text}
                          >
                            {option.label}
                          </AppText>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              ))}

              <View style={styles.switchRow}>
                <View style={{ flex: 1 }}>
                  <AppText weight="700">Include secondary muscles</AppText>
                  <AppText variant="small" color={colors.textSecondary}>
                    Include exercises using the muscle in a supporting role.
                  </AppText>
                </View>

                <Switch
                  accessibilityLabel="Include secondary muscles"
                  value={draft.includeSecondary}
                  onValueChange={value =>
                    setDraft(prev => ({
                      ...prev,
                      includeSecondary: value,
                    }))
                  }
                  trackColor={{
                    false: colors.border,
                    true: colors.success,
                  }}
                />
              </View>
            </ScrollView>

            <View
              style={[
                styles.footer,
                { paddingBottom: Math.max(insets.bottom, 16) },
              ]}
            >
              <Pressable
                onPress={reset}
                style={styles.reset}
                accessibilityRole="button"
              >
                <AppText color={colors.primary} weight="700">
                  Reset
                </AppText>
              </Pressable>

              <Pressable
                onPress={apply}
                style={styles.apply}
                accessibilityRole="button"
              >
                <AppText color={colors.textInverse} weight="700">
                  Show {filterExercises(draft).length} exercises
                </AppText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrim: {
    flex: 1,
    backgroundColor: 'rgba(15, 30, 22, 0.5)',
  },
  sheet: {
    height: '82%',
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    backgroundColor: colors.background,
    paddingTop: spacing.sm,
    overflow: 'hidden',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    alignItems: 'center',
  },
  close: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  section: {
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  option: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    minHeight: 42,
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  selected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  reset: {
    minWidth: 76,
    minHeight: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  apply: {
    flex: 1,
    minHeight: 52,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
