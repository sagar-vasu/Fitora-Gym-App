import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

import { AppText } from '../../../components/ui/AppText';
import { colors, radius, spacing } from '../../../theme';

import { ExerciseThumbnail } from './ExerciseThumbnail';
import { label } from '../services/exerciseCatalog';
import type { Exercise } from '../types/exercise';

type Props = {
  exercise: Exercise;
  onPress: () => void;
};

export const ExerciseCard = memo(function ExerciseCard({
  exercise,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`View exercise: ${exercise.name}`}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.72 }]}
    >
      <View style={styles.thumb}>
        <ExerciseThumbnail exercise={exercise} />
      </View>

      <View style={styles.body}>
        <AppText weight="700" numberOfLines={2}>
          {exercise.name}
        </AppText>

        <AppText variant="small" color={colors.textSecondary} numberOfLines={1}>
          {exercise.primaryMuscles.map(label).join(', ') ||
            'Muscles not specified'}
        </AppText>

        <AppText variant="caption" color={colors.primary} numberOfLines={1}>
          {label(exercise.level)}
          {' · '}
          {label(exercise.equipment)}
        </AppText>
      </View>

      <ChevronRight size={18} color={colors.textSecondary} />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
    marginBottom: spacing.sm,
    minHeight: 116,
  },
  thumb: {
    width: 92,
  },
  body: {
    flex: 1,
    gap: 5,
    minWidth: 0,
  },
});
