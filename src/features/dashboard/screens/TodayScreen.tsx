import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
  Dumbbell,
  Utensils,
  ChartNoAxesColumn,
  ChevronRight,
  Sparkles,
} from 'lucide-react-native';

import { Screen } from '../../../components/layout/Screen';
import { AppText } from '../../../components/ui/AppText';
import { AppButton } from '../../../components/ui/AppButton';
import { AppCard } from '../../../components/ui/AppCard';
import { QuickActionCard } from '../components/QuickActionCard';

import { MainTabParamList } from '../../../app/navigation/types';
import { colors, spacing, radius } from '../../../theme';

type Props = BottomTabScreenProps<MainTabParamList, 'Today'>;

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good morning.';
  if (hour < 17) return 'Good afternoon.';
  return 'Good evening.';
}

export function TodayScreen({ navigation }: Props) {
  return (
    <Screen scroll>
      <View style={styles.header}>
        <AppText variant="caption" weight="700" color={colors.textSecondary}>
          YOUR FITNESS SPACE
        </AppText>

        <AppText variant="heading" weight="700" style={styles.greeting}>
          {getGreeting()}
        </AppText>

        <AppText color={colors.textSecondary}>
          Stronger every day, at your own pace.
        </AppText>
      </View>

      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.heroIcon}>
            <Dumbbell color={colors.accent} size={24} />
          </View>

          <AppText variant="caption" weight="700" color={colors.accent}>
            TRAINING
          </AppText>
        </View>

        <AppText
          variant="title"
          weight="700"
          color={colors.textInverse}
          style={styles.heroTitle}
        >
          Ready for your next session?
        </AppText>

        <AppText variant="small" color="#D3DDD5" style={styles.heroDescription}>
          Find a movement, build your routine, and start training with
          confidence.
        </AppText>

        <AppButton
          title="Explore workouts"
          variant="secondary"
          style={styles.heroButton}
          onPress={() => navigation.navigate('Train')}
        />
      </View>

      <View style={styles.sectionHeader}>
        <AppText variant="title" weight="700">
          Your fitness space
        </AppText>

        <ChevronRight size={20} color={colors.textSecondary} />
      </View>

      <View style={styles.quickActions}>
        <QuickActionCard
          title="Nutrition"
          subtitle="Track your meals"
          icon={Utensils}
          onPress={() => navigation.navigate('Nutrition')}
        />

        <QuickActionCard
          title="Progress"
          subtitle="See your growth"
          icon={ChartNoAxesColumn}
          onPress={() => navigation.navigate('Progress')}
        />
      </View>

      <AppCard style={styles.messageCard}>
        <View style={styles.messageHeader}>
          <Sparkles size={20} color={colors.primary} />

          <AppText weight="700">Built around your goals</AppText>
        </View>

        <AppText
          variant="small"
          color={colors.textSecondary}
          style={styles.message}
        >
          Your workout plans, nutrition and progress will come together in one
          simple place.
        </AppText>
      </AppCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.xxl,
  },
  greeting: {
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  hero: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: spacing.xl,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.09)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    marginTop: spacing.xxl,
  },
  heroDescription: {
    marginTop: spacing.sm,
  },
  heroButton: {
    marginTop: spacing.xxl,
  },
  sectionHeader: {
    marginTop: spacing.xxxl,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  messageCard: {
    marginTop: spacing.xl,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  message: {
    marginTop: spacing.sm,
  },
});
