
import React from 'react';
import {FlatList, Pressable, StyleSheet} from 'react-native';

import {AppText} from '../../../components/ui/AppText';
import {colors, radius, spacing} from '../../../theme';
import {MUSCLE_GROUPS} from '../constants/muscleGroups';

type Props = {
  selected: string;
  onChange: (value: string) => void;
};

export function MuscleSelector({selected, onChange}: Props) {
  return (
    <FlatList
      horizontal
      data={MUSCLE_GROUPS}
      keyExtractor={item => item.id}
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.row}
      renderItem={({item}) => {
        const active = selected === item.id;

        return (
          <Pressable
            onPress={() => onChange(item.id)}
            accessibilityRole="button"
            accessibilityState={{selected: active}}
            style={[
              styles.chip,
              active && styles.active,
            ]}>
            <AppText
              variant="small"
              weight={active ? '700' : '500'}
              color={active ? colors.textInverse : colors.text}>
              {item.label}
            </AppText>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  chip: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  active: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});
