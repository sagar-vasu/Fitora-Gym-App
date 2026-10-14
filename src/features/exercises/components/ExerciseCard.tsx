import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ArrowUpRight } from 'lucide-react-native';

import { AppText } from '../../../components/ui/AppText';
import { colors, radius, spacing } from '../../../theme';
import { ExerciseImage } from './ExerciseImage';
import { formatLabel } from '../services/exerciseCatalog';
import type { Exercise } from '../types/exercise';

type Props = {
  exercise: Exercise;
  onPress: (exercise: Exercise) => void;
};

export const ExerciseCard = memo(function ExerciseCard({
  exercise,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={() => onPress(exercise)}
      accessibilityRole="button"
      accessibilityLabel={`View ${exercise.name} details`}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.78 }]}
    >
      <ExerciseImage exercise={exercise} style={styles.image} />

      <View style={styles.content}>
        <AppText weight="700" numberOfLines={2} style={styles.name}>
          {exercise.name}
        </AppText>

        <AppText variant="small" color={colors.textSecondary} numberOfLines={1}>
          {exercise.primaryMuscles.map(formatLabel).join(', ') ||
            'Muscles unspecified'}
        </AppText>

        <View style={styles.footer}>
          <AppText
            variant="caption"
            color={colors.primary}
            numberOfLines={1}
            style={styles.meta}
          >
            {formatLabel(exercise.equipment)}
            {' · '}
            {formatLabel(exercise.level)}
          </AppText>

          <ArrowUpRight size={19} color={colors.primary} />
        </View>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    minHeight: 126,
    alignItems: 'center',
  },
  image: {
    width: 98,
    height: 102,
  },
  content: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
  name: {
    fontSize: 16,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  meta: {
    flex: 1,
  },
});
