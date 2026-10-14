import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

import { AppText } from '../../../components/ui/AppText';
import { colors, radius, spacing } from '../../../theme';

type Props = {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  onPress: () => void;
};

export function QuickActionCard({
  title,
  subtitle,
  icon: Icon,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${subtitle}`}
      style={({ pressed }) => [styles.card, { opacity: pressed ? 0.8 : 1 }]}
    >
      <View style={styles.iconContainer}>
        <Icon size={22} color={colors.primary} />
      </View>

      <AppText weight="700" style={styles.title}>
        {title}
      </AppText>

      <AppText variant="small" color={colors.textSecondary}>
        {subtitle}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 150,
  },
  iconContainer: {
    height: 44,
    width: 44,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: spacing.md,
  },
});
