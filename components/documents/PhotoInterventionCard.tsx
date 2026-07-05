import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PhotoIntervention } from '@/constants/documents-data';
import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { PhotoPlaceholder } from './PhotoPlaceholder';

const THUMB_COUNT = 4;

function CountPill({ label, count, color, background }: { label: string; count: number; color: string; background: string }) {
  return (
    <View style={[pillStyles.pill, { backgroundColor: background }]}>
      <Text style={[pillStyles.count, { color }]}>{count}</Text>
      <Text style={[pillStyles.label, { color }]}>{label}</Text>
    </View>
  );
}

const pillStyles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  count: {
    fontSize: FontSize.small,
    fontWeight: '800',
  },
  label: {
    fontSize: FontSize.tiny,
    fontWeight: '600',
  },
});

type Props = {
  intervention: PhotoIntervention;
  onPress?: () => void;
};

export function PhotoInterventionCard({ intervention, onPress }: Props) {
  const total = intervention.before + intervention.during + intervention.after;
  const visibleCount = Math.min(total, THUMB_COUNT);
  const overflow = total - visibleCount;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {intervention.title}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {intervention.client} · {intervention.date}
          </Text>
        </View>
        <View style={styles.totalTag}>
          <Feather name="image" size={12} color={Palette.blue} />
          <Text style={styles.totalText}>{total} photos</Text>
        </View>
      </View>

      <View style={styles.thumbRow}>
        {Array.from({ length: visibleCount }).map((_, index) => {
          const isLast = index === visibleCount - 1;
          return (
            <View key={index} style={styles.thumbWrapper}>
              <PhotoPlaceholder seed={`${intervention.id}-${index}`} style={styles.thumb} />
              {isLast && overflow > 0 ? (
                <View style={styles.overlay}>
                  <Text style={styles.overlayText}>+{overflow}</Text>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>

      <View style={styles.pillRow}>
        <CountPill label="Avant" count={intervention.before} color={Palette.textSecondary} background="#EEF0F3" />
        <CountPill label="Pendant" count={intervention.during} color="#B7791F" background={Palette.orangeSoft} />
        <CountPill label="Après" count={intervention.after} color="#128A5E" background={Palette.greenSoft} />
      </View>
    </Pressable>
  );
}

const GAP = 8;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    padding: Spacing.lg,
    ...cardShadow,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.section,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  meta: {
    fontSize: FontSize.small,
    color: Palette.textTertiary,
    marginTop: 3,
  },
  totalTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Palette.blueSoft,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 2,
  },
  totalText: {
    fontSize: FontSize.tiny,
    fontWeight: '700',
    color: Palette.blue,
  },
  thumbRow: {
    flexDirection: 'row',
    gap: GAP,
    marginTop: Spacing.md,
  },
  thumbWrapper: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: Radius.tile,
    overflow: 'hidden',
    backgroundColor: '#E4E8EF',
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 41, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayText: {
    color: Palette.white,
    fontSize: 15,
    fontWeight: '800',
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: Spacing.md,
  },
});
