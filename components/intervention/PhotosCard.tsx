import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { SectionCard } from './SectionCard';
import { Photo, PhotoCategory } from './types';

const CATEGORY_CONFIG: Record<PhotoCategory, { label: string; background: string; color: string }> = {
  avant: { label: 'Avant', background: '#E7E9ED', color: Palette.textSecondary },
  apres: { label: 'Après', background: Palette.greenSoft, color: Palette.green },
  document: { label: 'Document', background: Palette.blueSoft, color: Palette.blue },
};

const VISIBLE_COUNT = 4;

type Props = {
  photos: Photo[];
  onSeeAll?: () => void;
  onAdd?: () => void;
};

export function PhotosCard({ photos, onSeeAll, onAdd }: Props) {
  const visible = photos.slice(0, VISIBLE_COUNT);
  const remaining = photos.length - VISIBLE_COUNT;
  const addScale = useRef(new Animated.Value(1)).current;

  const onAddPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(addScale, { toValue: 0.97, useNativeDriver: true, friction: 6, tension: 300 }).start();
  };
  const onAddPressOut = () => {
    Animated.spring(addScale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  return (
    <SectionCard
      icon="camera"
      iconColor={Palette.green}
      iconBackground={Palette.greenSoft}
      title="Photos"
      right={
        <Pressable style={styles.seeAll} onPress={onSeeAll} hitSlop={6}>
          <Text style={styles.seeAllText}>Voir tout ({photos.length})</Text>
          <Feather name="chevron-right" size={13} color={Palette.blue} />
        </Pressable>
      }>
      <View style={styles.grid}>
        {visible.map((photo, index) => {
          const isLastVisible = index === VISIBLE_COUNT - 1;
          const showOverflow = isLastVisible && remaining > 0;
          const category = CATEGORY_CONFIG[photo.category];

          return (
            <View key={photo.id} style={[styles.thumb, { backgroundColor: category.background }]}>
              {showOverflow ? (
                <View style={styles.overflow}>
                  <Text style={styles.overflowText}>+{remaining}</Text>
                </View>
              ) : (
                <>
                  <Feather name="image" size={20} color={category.color} style={styles.thumbIcon} />
                  <View style={styles.labelChip}>
                    <Text style={styles.labelChipText} numberOfLines={1}>
                      {category.label}
                    </Text>
                  </View>
                </>
              )}
            </View>
          );
        })}
      </View>

      <Pressable onPressIn={onAddPressIn} onPressOut={onAddPressOut} onPress={onAdd} style={styles.addWrapper}>
        <Animated.View style={[styles.addButton, { transform: [{ scale: addScale }] }]}>
          <Feather name="plus" size={15} color={Palette.blue} />
          <Text style={styles.addButtonText}>Ajouter une photo</Text>
        </Animated.View>
      </Pressable>
    </SectionCard>
  );
}

const THUMB = 72;

const styles = StyleSheet.create({
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontSize: FontSize.tiny,
    fontWeight: '600',
    color: Palette.blue,
    letterSpacing: -0.1,
  },
  grid: {
    flexDirection: 'row',
    gap: 10,
  },
  thumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbIcon: {
    opacity: 0.9,
  },
  labelChip: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    right: 5,
    backgroundColor: 'rgba(15, 23, 41, 0.55)',
    borderRadius: 6,
    paddingVertical: 2,
    alignItems: 'center',
  },
  labelChipText: {
    fontSize: 9,
    fontWeight: '700',
    color: Palette.white,
    letterSpacing: 0.2,
  },
  overflow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  overflowText: {
    fontSize: 17,
    fontWeight: '700',
    color: Palette.textSecondary,
  },
  addWrapper: {
    marginTop: Spacing.lg,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    height: 44,
    borderRadius: Radius.pill,
    backgroundColor: Palette.blueSoft,
  },
  addButtonText: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Palette.blue,
    letterSpacing: -0.1,
  },
});
