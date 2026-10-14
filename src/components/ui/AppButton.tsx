
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useReducedMotion,
  withSpring,
} from 'react-native-reanimated';

import {AppText} from './AppText';
import {colors, radius, spacing, motion} from '../../theme';

type ButtonVariant = 'primary' | 'secondary';

type Props = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}: Props) {
  const scale = useSharedValue(1);
  const reducedMotion = useReducedMotion();

  const isDisabled = disabled || loading;
  const isPrimary = variant === 'primary';

  const backgroundColor = isPrimary
    ? colors.primary
    : colors.primarySoft;

  const textColor = isPrimary
    ? colors.textInverse
    : colors.primary;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  function animateTo(value: number) {
    if (reducedMotion) {
      scale.value = 1;
      return;
    }

    scale.value = withSpring(value, motion.spring);
  }

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{
          disabled: isDisabled,
          busy: loading,
        }}
        disabled={isDisabled}
        onPress={onPress}
        onPressIn={() => animateTo(motion.scale.pressed)}
        onPressOut={() => animateTo(1)}
        style={[
          styles.button,
          {
            backgroundColor,
            opacity: isDisabled ? 0.55 : 1,
          },
        ]}>
        {loading ? (
          <ActivityIndicator color={textColor} />
        ) : (
          <AppText
            weight="700"
            color={textColor}
            style={styles.label}>
            {title}
          </AppText>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    borderRadius: radius.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    textAlign: 'center',
  },
});
