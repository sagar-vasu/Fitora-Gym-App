import React from 'react';
import {View, StyleSheet} from 'react-native';
import {AppText} from './AppText';
import {colors, spacing} from '../../theme';

type Props = {
  title: string;
  description: string;
};

export function FeaturePlaceholder({title, description}: Props) {
  return (
    <View style={styles.container}>
      <AppText variant="heading" weight="700">
        {title}
      </AppText>

      <AppText
        color={colors.textSecondary}
        style={{marginTop: spacing.sm}}>
        {description}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
    paddingTop: spacing.xxxl,
  },
});