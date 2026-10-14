import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Target, Info } from 'lucide-react-native';

import { Screen } from '../../../components/layout/Screen';
import { AppText } from '../../../components/ui/AppText';
import { AppCard } from '../../../components/ui/AppCard';

import { colors, radius, spacing } from '../../../theme';
import { getExercise, formatLabel } from '../services/exerciseCatalog';
import { ExerciseGallery } from '../components/ExerciseGallery';

import type { RootStackParamList } from '../../../app/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ExerciseDetail'>;

function Tag({ text }: { text: string }) {
  return (
    <View style={styles.tag}>
      <AppText variant="small" weight="600" color={colors.primary}>
        {text}
      </AppText>
    </View>
  );
}

function MetadataRow({ title, value }: { title: string; value: string }) {
  return (
    <View style={styles.metadataRow}>
      <AppText color={colors.textSecondary} variant="small">
        {title}
      </AppText>

      <AppText variant="small" weight="600" style={styles.metadataValue}>
        {value}
      </AppText>
    </View>
  );
}

export function ExerciseDetailScreen({ route }: Props) {
  const exercise = getExercise(route.params.exerciseId);

  if (!exercise) {
    return (
      <Screen scroll>
        <AppText variant="title" weight="700">
          Exercise not found
        </AppText>
        <AppText color={colors.textSecondary}>
          This exercise is unavailable in the current catalog.
        </AppText>
      </Screen>
    );
  }

  const primary =
    exercise.primaryMuscles.map(formatLabel).join(', ') || 'Not specified';

  const secondary =
    exercise.secondaryMuscles.map(formatLabel).join(', ') || 'None listed';

  return (
    <Screen scroll>
      <ExerciseGallery exercise={exercise} />

      <View style={styles.heading}>
        <AppText variant="caption" weight="700" color={colors.success}>
          {formatLabel(exercise.category).toUpperCase()}
        </AppText>

        <AppText variant="heading" weight="700" style={styles.title}>
          {exercise.name}
        </AppText>

        <View style={styles.tags}>
          <Tag text={formatLabel(exercise.level)} />
          <Tag text={formatLabel(exercise.equipment)} />
          {exercise.mechanic && <Tag text={formatLabel(exercise.mechanic)} />}
        </View>
      </View>

      <AppCard style={styles.section}>
        <View style={styles.sectionHeading}>
          <Target size={21} color={colors.primary} />
          <AppText variant="title" weight="700">
            Muscles worked
          </AppText>
        </View>

        <MetadataRow title="Primary" value={primary} />
        <MetadataRow title="Secondary" value={secondary} />
      </AppCard>

      <AppCard style={styles.section}>
        <AppText variant="title" weight="700">
          Exercise overview
        </AppText>

        <MetadataRow
          title="Equipment"
          value={formatLabel(exercise.equipment)}
        />
        <MetadataRow title="Difficulty" value={formatLabel(exercise.level)} />
        <MetadataRow title="Category" value={formatLabel(exercise.category)} />
        <MetadataRow title="Movement" value={formatLabel(exercise.mechanic)} />
        <MetadataRow title="Force" value={formatLabel(exercise.force)} />
      </AppCard>

      <View style={styles.instructions}>
        <AppText variant="title" weight="700">
          How to perform
        </AppText>

        <AppText
          variant="small"
          color={colors.textSecondary}
          style={{ marginTop: spacing.xs }}
        >
          Follow each step with control.
        </AppText>

        {exercise.instructions.length ? (
          exercise.instructions.map((instruction, index) => (
            <View style={styles.step} key={index}>
              <View style={styles.stepNumber}>
                <AppText weight="700" color={colors.textInverse}>
                  {index + 1}
                </AppText>
              </View>

              <View style={{ flex: 1 }}>
                <AppText>{instruction}</AppText>
              </View>
            </View>
          ))
        ) : (
          <AppText
            color={colors.textSecondary}
            style={{ marginTop: spacing.md }}
          >
            Instructions are not available for this exercise.
          </AppText>
        )}
      </View>

      <View style={styles.note}>
        <Info size={18} color={colors.textSecondary} />
        <View style={{ flex: 1 }}>
          <AppText variant="small" color={colors.textSecondary}>
            Exercise descriptions are educational and should be reviewed by
            qualified trainers before being treated as personalized technique
            advice.
          </AppText>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: {
    marginTop: spacing.xl,
  },
  title: {
    marginTop: spacing.xs,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  tag: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  metadataValue: {
    flex: 1,
    textAlign: 'right',
  },
  instructions: {
    marginTop: spacing.xxxl,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  stepNumber: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.xxxl,
    marginBottom: spacing.xl,
  },
});
