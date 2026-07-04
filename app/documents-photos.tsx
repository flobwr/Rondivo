import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ContextualFAB } from '@/components/documents/ContextualFAB';
import { DocumentHeader } from '@/components/documents/DocumentHeader';
import { PHOTO_INTERVENTIONS } from '@/components/documents/mock-data';
import type { PhotoIntervention } from '@/components/documents/types';
import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';

function PhotoThumbnail({ color }: { color: string }) {
  return <View style={[styles.thumbnail, { backgroundColor: color }]} />;
}

function InterventionCard({ intervention }: { intervention: PhotoIntervention }) {
  const router = useRouter();
  const scale = useRef(new Animated.Value(1)).current;

  const beforeCount = intervention.photos.filter((p) => p.phase === 'before').length;
  const duringCount = intervention.photos.filter((p) => p.phase === 'during').length;
  const afterCount = intervention.photos.filter((p) => p.phase === 'after').length;
  const totalCount = intervention.photos.length;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      friction: 5,
      tension: 300,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
      tension: 100,
    }).start();
  };

  const thumbColors = ['#D1D5DB', '#E5E7EB', '#C7CBD1', '#B8BCC4'];

  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(`/documents-photos-detail?id=${intervention.id}` as never);
      }}>
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {intervention.title}
            </Text>
            <Text style={styles.cardMeta}>
              {intervention.client} · {intervention.date}
            </Text>
          </View>
          <View style={styles.photoBadge}>
            <Feather name="image" size={14} color={Palette.blue} />
            <Text style={styles.photoBadgeText}>{totalCount}</Text>
          </View>
        </View>

        <View style={styles.thumbnailRow}>
          {thumbColors.slice(0, Math.min(4, totalCount)).map((color, i) => (
            <PhotoThumbnail key={i} color={color} />
          ))}
          {totalCount > 4 ? (
            <View style={styles.moreThumb}>
              <Text style={styles.moreText}>+{totalCount - 4}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.phaseTags}>
          {beforeCount > 0 ? (
            <View style={styles.phaseTag}>
              <View style={[styles.phaseDot, { backgroundColor: Palette.blue }]} />
              <Text style={styles.phaseText}>Avant ({beforeCount})</Text>
            </View>
          ) : null}
          {duringCount > 0 ? (
            <View style={styles.phaseTag}>
              <View style={[styles.phaseDot, { backgroundColor: Palette.orange }]} />
              <Text style={styles.phaseText}>Pendant ({duringCount})</Text>
            </View>
          ) : null}
          {afterCount > 0 ? (
            <View style={styles.phaseTag}>
              <View style={[styles.phaseDot, { backgroundColor: Palette.green }]} />
              <Text style={styles.phaseText}>Après ({afterCount})</Text>
            </View>
          ) : null}
        </View>
      </Animated.View>
    </Pressable>
  );
}

export default function PhotosScreen() {
  const totalPhotos = PHOTO_INTERVENTIONS.reduce(
    (sum, i) => sum + i.photos.length,
    0,
  );

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DocumentHeader title="Photos" />

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>
              {PHOTO_INTERVENTIONS.length}
            </Text>
            <Text style={styles.statLabel}>interventions</Text>
          </View>
          <View style={[styles.stat, styles.statBorder]}>
            <Text style={styles.statValue}>{totalPhotos}</Text>
            <Text style={styles.statLabel}>photos</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}>
          {PHOTO_INTERVENTIONS.map((intervention) => (
            <InterventionCard
              key={intervention.id}
              intervention={intervention}
            />
          ))}
        </ScrollView>
      </SafeAreaView>

      <ContextualFAB label="Ajouter des photos" icon="camera" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Palette.screen,
  },
  safeArea: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing.screen,
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.lg,
    ...cardShadow,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statBorder: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: Palette.border,
  },
  statValue: {
    fontSize: FontSize.title,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  statLabel: {
    fontSize: FontSize.tiny,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  scroll: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: 100,
    gap: Spacing.md,
  },
  card: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    padding: Spacing.cardPadding,
    ...cardShadow,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  cardInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  cardTitle: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  cardMeta: {
    fontSize: FontSize.small,
    color: Palette.textTertiary,
    marginTop: 2,
  },
  photoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.blueSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 4,
  },
  photoBadgeText: {
    fontSize: FontSize.tiny,
    fontWeight: '600',
    color: Palette.blue,
  },
  thumbnailRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  thumbnail: {
    flex: 1,
    height: 60,
    borderRadius: Radius.tile,
  },
  moreThumb: {
    flex: 1,
    height: 60,
    borderRadius: Radius.tile,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreText: {
    fontSize: FontSize.small,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  phaseTags: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  phaseTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  phaseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  phaseText: {
    fontSize: FontSize.tiny,
    color: Palette.textSecondary,
    fontWeight: '500',
  },
});
