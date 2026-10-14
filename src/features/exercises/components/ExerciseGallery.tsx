import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Expand, X } from 'lucide-react-native';

import { AppText } from '../../../components/ui/AppText';
import { colors, radius, spacing } from '../../../theme';
import { ExerciseImage } from './ExerciseImage';
import type { Exercise } from '../types/exercise';

type Props = {
  exercise: Exercise;
};

export function ExerciseGallery({ exercise }: Props) {
  const [selected, setSelected] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <View>
      <View style={styles.hero}>
        <ExerciseImage
          exercise={exercise}
          index={selected}
          style={styles.heroImage}
        />

        {exercise.images.length > 0 && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="View exercise image fullscreen"
            onPress={() => setFullscreen(true)}
            style={styles.expand}
          >
            <Expand size={19} color={colors.primary} />
          </Pressable>
        )}
      </View>

      {exercise.images.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbnails}
        >
          {exercise.images.map((path, index) => (
            <Pressable
              key={`${path}-${index}`}
              onPress={() => setSelected(index)}
              accessibilityRole="button"
              accessibilityLabel={`Show image ${index + 1}`}
              accessibilityState={{ selected: index === selected }}
              style={[
                styles.thumbnail,
                selected === index && styles.thumbnailActive,
              ]}
            >
              <ExerciseImage
                exercise={exercise}
                index={index}
                style={{ width: 70, height: 70 }}
              />
            </Pressable>
          ))}
        </ScrollView>
      )}

      {exercise.images.length > 0 && (
        <Modal
          visible={fullscreen}
          animationType="fade"
          onRequestClose={() => setFullscreen(false)}
        >
          <View style={styles.fullscreen}>
            <Pressable
              onPress={() => setFullscreen(false)}
              accessibilityLabel="Close fullscreen image"
              accessibilityRole="button"
              style={styles.close}
            >
              <X size={24} color={colors.text} />
            </Pressable>

            <ExerciseImage
              exercise={exercise}
              index={selected}
              style={styles.fullscreenImage}
            />

            <AppText
              variant="small"
              color={colors.textSecondary}
              style={{ textAlign: 'center' }}
            >
              Image {selected + 1} of {exercise.images.length}
            </AppText>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: 280,
    borderRadius: radius.xl,
  },
  expand: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnails: {
    gap: spacing.sm,
    paddingTop: spacing.md,
  },
  thumbnail: {
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: radius.md,
    padding: 2,
  },
  thumbnailActive: {
    borderColor: colors.primary,
  },
  fullscreen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    gap: spacing.xl,
  },
  close: {
    position: 'absolute',
    right: spacing.xl,
    top: 55,
    width: 44,
    height: 44,
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: 380,
  },
});
