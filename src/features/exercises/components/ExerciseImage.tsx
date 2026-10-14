import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Dumbbell } from 'lucide-react-native';
import { colors, radius } from '../../../theme';
import { getExerciseImage } from '../services/exerciseCatalog';
import type { Exercise } from '../types/exercise';

type Props = {
  exercise: Exercise;
  index?: number;
  style?: StyleProp<ViewStyle>;
};

export function ExerciseImage({ exercise, index = 0, style }: Props) {
  const uri = getExerciseImage(exercise, index);
  const [failedUri, setFailedUri] = useState<string | null>(null);

  return (
    <View style={[styles.container, style]}>
      {uri && failedUri !== uri ? (
        <Image
          source={{ uri }}
          style={styles.image}
          resizeMode="contain"
          accessibilityLabel={`${exercise.name} demonstration`}
          onError={() => setFailedUri(uri)}
        />
      ) : (
        <Dumbbell size={32} color={colors.primary} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
