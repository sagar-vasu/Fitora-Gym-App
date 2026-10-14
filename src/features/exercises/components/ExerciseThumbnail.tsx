
import React, {useState} from 'react';
import {
  Image,
  StyleSheet,
  View,
} from 'react-native';
import {Dumbbell} from 'lucide-react-native';

import {colors, radius} from '../../../theme';
import {imageUrl} from '../services/exerciseCatalog';
import type {Exercise} from '../types/exercise';

type Props = {
  exercise: Exercise;
  height?: number;
  imageIndex?: number;
};

export function ExerciseThumbnail({
  exercise,
  height = 94,
  imageIndex = 0,
}: Props) {
  const [failedUri, setFailedUri] =
    useState<string | null>(null);

  const uri = imageUrl(exercise, imageIndex);

  return (
    <View style={[styles.wrap, {height}]}>
      {uri && failedUri !== uri ? (
        <Image
          source={{uri}}
          accessibilityLabel={`${exercise.name}, illustration ${
            imageIndex + 1
          }`}
          resizeMode="contain"
          style={styles.image}
          onError={() => setFailedUri(uri)}
        />
      ) : (
        <Dumbbell
          size={29}
          color={colors.primary}
          accessibilityLabel="Image unavailable"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
