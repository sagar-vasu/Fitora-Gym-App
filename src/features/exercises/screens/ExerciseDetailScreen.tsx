import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppText } from '../../../components/ui/AppText';
import { Screen } from '../../../components/layout/Screen';
import { AppCard } from '../../../components/ui/AppCard';

import { colors, radius, spacing } from '../../../theme';

import type { RootStackParamList } from '../../../app/navigation/types';

import { findExercise, label } from '../services/exerciseCatalog';

import { ExerciseThumbnail } from '../components/ExerciseThumbnail';

type Props = NativeStackScreenProps<RootStackParamList, 'ExerciseDetail'>;

export function ExerciseDetailScreen({ route }: Props) {
  const exercise = findExercise(route.params.exerciseId);

  const [imageIndex, setImageIndex] = useState(0);

  if (!exercise) {
    return (
      <Screen scroll>
        <AppText variant="title" weight="700">
          Exercise unavailable
        </AppText>

        <AppText color={colors.textSecondary}>
          This exercise could not be found in the current catalog.
        </AppText>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <ExerciseThumbnail
        exercise={exercise}
        imageIndex={imageIndex}
        height={285}
      />

      {exercise.images.length > 1 && (
        <View style={styles.pager}>
          {exercise.images.map((_, index) => (
            <Pressable
              key={index}
              accessibilityRole="button"
              accessibilityLabel={`View exercise image ${index + 1}`}
              accessibilityState={{
                selected: index === imageIndex,
              }}
              onPress={() => setImageIndex(index)}
              style={[styles.dot, index === imageIndex && styles.selectedDot]}
            />
          ))}
        </View>
      )}

      <AppText variant="heading" weight="700" style={styles.title}>
        {exercise.name}
      </AppText>

      <View style={styles.pills}>
        {[exercise.level, exercise.category, exercise.equipment || 'none'].map(
          (value, index) => (
            <View key={`${index}-${value}`} style={styles.pill}>
              <AppText variant="small" color={colors.primary} weight="600">
                {label(value)}
              </AppText>
            </View>
          ),
        )}
      </View>

      <AppCard style={styles.section}>
        <AppText variant="title" weight="700">
          Muscles worked
        </AppText>

        <AppText style={styles.spacing}>
          Primary:{' '}
          {exercise.primaryMuscles.map(label).join(', ') || 'Not specified'}
        </AppText>

        <AppText color={colors.textSecondary}>
          Secondary:{' '}
          {exercise.secondaryMuscles.map(label).join(', ') || 'None listed'}
        </AppText>
      </AppCard>

      <AppCard style={styles.section}>
        <AppText variant="title" weight="700">
          Movement details
        </AppText>

        <AppText style={styles.spacing}>
          Equipment: {label(exercise.equipment)}
        </AppText>

        <AppText>Difficulty: {label(exercise.level)}</AppText>

        <AppText>Category: {label(exercise.category)}</AppText>

        <AppText>Force: {label(exercise.force)}</AppText>

        <AppText>Mechanic: {label(exercise.mechanic)}</AppText>
      </AppCard>

      <AppText variant="title" weight="700" style={styles.section}>
        How to perform
      </AppText>

      {exercise.instructions.length > 0 ? (
        exercise.instructions.map((instruction, index) => (
          <View key={index} style={styles.step}>
            <View style={styles.stepNumber}>
              <AppText weight="700" color={colors.textInverse}>
                {index + 1}
              </AppText>
            </View>

            <View style={styles.flex}>
              <AppText>{instruction}</AppText>
            </View>
          </View>
        ))
      ) : (
        <AppText color={colors.textSecondary}>
          Instructions are not available for this movement.
        </AppText>
      )}

      <AppText
        variant="caption"
        color={colors.textSecondary}
        style={styles.disclaimer}
      >
        Educational exercise information. Technique guidance may require review
        by a qualified trainer.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: spacing.xl,
  },
  section: {
    marginTop: spacing.xl,
  },
  spacing: {
    marginTop: spacing.md,
  },
  pager: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: spacing.sm,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.border,
  },
  selectedDot: {
    backgroundColor: colors.primary,
    width: 24,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  pill: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  step: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
    marginTop: spacing.lg,
  },
  stepNumber: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
  },
  disclaimer: {
    marginTop: spacing.xxxl,
    marginBottom: spacing.xl,
  },
});
