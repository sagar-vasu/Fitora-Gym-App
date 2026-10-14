import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { colors, typography } from '../../theme';

type Variant = 'body' | 'small' | 'title' | 'heading' | 'caption';

type Props = TextProps & {
  variant?: Variant;
  color?: string;
  weight?: TextStyle['fontWeight'];
};

export function AppText({
  variant = 'body',
  color = colors.text,
  weight = '400',
  style,
  ...props
}: Props) {
  const sizeMap = {
    body: typography.size.body,
    small: typography.size.small,
    title: typography.size.title,
    heading: typography.size.heading,
    caption: typography.size.caption,
  };

  const lineHeightMap = {
    body: typography.lineHeight.body,
    small: typography.lineHeight.small,
    title: typography.lineHeight.title,
    heading: typography.lineHeight.heading,
    caption: typography.lineHeight.caption,
  };

  return (
    <Text
      {...props}
      allowFontScaling
      style={[
        {
          fontSize: sizeMap[variant],
          lineHeight: lineHeightMap[variant],
          color,
          fontWeight: weight,
        },
        style,
      ]}
    />
  );
}
