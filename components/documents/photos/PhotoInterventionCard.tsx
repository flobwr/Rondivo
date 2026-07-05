import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { PressableScale } from '@/components/documents/shared/primitives';
import { formatShortDate } from '@/data/documents/date-utils';
import {
  PHOTO_CATEGORY_LABEL,
  PHOTO_CATEGORY_META,
  PHOTO_CATEGORY_ORDER,
  PhotoIntervention,
  photoCategoryCounts,
} from '@/data/documents/photos';

const THUMB = 46;
const MAX_THUMBS = 4;

export function PhotoInterventionCard({
  intervention,
  onPress,
}: {
  intervention: PhotoIntervention;
  onPress: () => void;
}) {
  const counts = photoCategoryCounts(intervention);
  const thumbs = intervention.photos.slice(0, MAX_THUMBS);
  const remaining = intervention.photos.length - thumbs.length;

  return (
    <PressableScale onPress={onPress} to={0.98} style={styles.card} accessibilityLabel={intervention.label}>
      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
        {intervention.clientName}
      </Text>

      <View style={styles.topRow}>
        <Text style={styles.meta} numberOfLines={1}>
          {intervention.label} · {formatShortDate(intervention.date)}
        </Text>

        <View style={styles.thumbRow}>
          {thumbs.map((photo, index) => (
            <View
              key={photo.id}
              style={[styles.thumbWrap, index > 0 ? { marginLeft: -14 } : null, { zIndex: thumbs.length - index }]}>
              <Image source={{ uri: photo.uri }} style={styles.thumb} contentFit="cover" />
              {index === thumbs.length - 1 && remaining > 0 ? (
                <View style={styles.moreOverlay}>
                  <Text style={styles.moreText}>+{remaining}</Text>
                </View>
              ) : null}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.pillRow}>
        {PHOTO_CATEGORY_ORDER.map((category) => {
          const meta = PHOTO_CATEGORY_META[category];
          const count = counts[category];
          return (
            <View key={category} style={[styles.pill, { backgroundColor: meta.soft }]}>
              <View style={[styles.pillDot, { backgroundColor: meta.color }]} />
              <Text style={[styles.pillText, { color: meta.color }]}>
                {count} {PHOTO_CATEGORY_LABEL[category]}
              </Text>
            </View>
          );
        })}
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    padding: Spacing.lg - 6,
    ...cardShadow,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    marginTop: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  meta: {
    flex: 1,
    fontSize: FontSize.small,
    fontWeight: '400',
    color: Palette.textTertiary,
    letterSpacing: -0.1,
  },
  thumbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
  },
  thumbWrap: {
    width: THUMB,
    height: THUMB,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Palette.card,
    backgroundColor: Palette.cardMuted,
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  moreOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 41, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: Palette.white,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: Radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4.5,
  },
  pillDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  pillText: {
    fontSize: 11.5,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
});
