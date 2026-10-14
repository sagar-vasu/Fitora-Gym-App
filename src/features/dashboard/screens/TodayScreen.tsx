import React from 'react';
import { ScrollView, View, StyleSheet, Pressable } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Dumbbell,
  Utensils,
  ChartNoAxesColumn,
  ArrowUpRight,
} from 'lucide-react-native';

import { AppText } from '../../../components/ui/AppText';
import { AppButton } from '../../../components/ui/AppButton';
import { AppCard } from '../../../components/ui/AppCard';
import { colors, spacing, radius } from '../../../theme';

export function TodayScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.root}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.xl },
      ]}
    >
      <View style={styles.header}>
        <AppText variant="caption" weight="700" color={colors.textSecondary}>
          YOUR FITNESS SPACE
        </AppText>

        <AppText
          variant="heading"
          weight="700"
          style={{ marginTop: spacing.xs }}
        >
          Good morning.
        </AppText>

        <AppText color={colors.textSecondary}>Let's make today count.</AppText>
      </View>

      <View style={styles.workoutCard}>
        <View style={styles.cardTop}>
          <AppText variant="caption" weight="700" color={colors.accent}>
            TODAY'S SESSION
          </AppText>

          <Dumbbell color={colors.accent} size={24} />
        </View>

        <AppText
          variant="title"
          weight="700"
          color={colors.textInverse}
          style={{ marginTop: spacing.xl }}
        >
          Upper Body Strength
        </AppText>

        <AppText
          variant="small"
          color="#C8D4CC"
          style={{ marginTop: spacing.xs }}
        >
          6 exercises · 45 min · Intermediate
        </AppText>

        <View style={{ marginTop: spacing.xl }}>
          <AppButton
            title="Start workout"
            variant="secondary"
            onPress={() => navigation.navigate('Train')}
          />
        </View>
      </View>

      <AppText variant="title" weight="700" style={{ marginTop: spacing.xxxl }}>
        Your everyday fitness
      </AppText>

      <View style={styles.cardRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go to Nutrition"
          style={styles.half}
          onPress={() => navigation.navigate('Nutrition')}
        >
          <AppCard>
            <Utensils color={colors.primary} size={24} />

            <AppText
              variant="caption"
              color={colors.textSecondary}
              style={{ marginTop: spacing.xl }}
            >
              NUTRITION
            </AppText>

            <AppText weight="700">Log a meal</AppText>
          </AppCard>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go to Progress"
          style={styles.half}
          onPress={() => navigation.navigate('Progress')}
        >
          <AppCard>
            <ChartNoAxesColumn color={colors.primary} size={24} />

            <AppText
              variant="caption"
              color={colors.textSecondary}
              style={{ marginTop: spacing.xl }}
            >
              PROGRESS
            </AppText>

            <AppText weight="700">View trends</AppText>
          </AppCard>
        </Pressable>
      </View>

      <AppCard style={{ marginTop: spacing.xl }}>
        <View style={styles.cardTop}>
          <View style={{ flex: 1 }}>
            <AppText variant="title" weight="700">
              Made for your pace.
            </AppText>

            <AppText
              variant="small"
              color={colors.textSecondary}
              style={{ marginTop: spacing.xs }}
            >
              No pressure. Just progress, one session at a time.
            </AppText>
          </View>

          <ArrowUpRight color={colors.primary} size={24} />
        </View>
      </AppCard>
    </ScrollView>
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
  header: {
    marginBottom: spacing.xxxl,
  },
  workoutCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: spacing.xl,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  half: {
    flex: 1,
  },
});
