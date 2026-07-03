import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { SectionCard } from './SectionCard';

type Props = {
  reportNote: string;
  hasVoiceNote: boolean;
  checklist: { completed: number; total: number };
  onComplete?: () => void;
};

export function ReportCard({ reportNote, hasVoiceNote, checklist, onComplete }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const progress = checklist.total > 0 ? checklist.completed / checklist.total : 0;

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, friction: 6, tension: 300 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  return (
    <SectionCard icon="clipboard" iconColor={Palette.purple} iconBackground={Palette.purpleSoft} title="Rapport">
      <Text style={styles.note}>{reportNote || 'Aucune note pour le moment.'}</Text>

      <View style={styles.rows}>
        <View style={styles.row}>
          <View style={styles.rowIconTile}>
            <Feather name="mic" size={15} color={Palette.purple} />
          </View>
          <Text style={styles.rowLabel}>Dictée vocale</Text>
          <Text style={styles.rowValue}>{hasVoiceNote ? '1 enregistrement' : 'Aucun enregistrement'}</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.rowIconTile}>
            <Feather name="check-square" size={15} color={Palette.purple} />
          </View>
          <Text style={styles.rowLabel}>Checklist</Text>
          <Text style={styles.rowValue}>
            {checklist.completed}/{checklist.total}
          </Text>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onComplete} style={styles.ctaWrapper}>
        <Animated.View style={[styles.cta, { transform: [{ scale }] }]}>
          <Text style={styles.ctaText}>Compléter le rapport</Text>
        </Animated.View>
      </Pressable>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  note: {
    fontSize: FontSize.label,
    fontWeight: '400',
    color: Palette.textSecondary,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  rows: {
    marginTop: Spacing.md,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rowIconTile: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: Palette.purpleSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
    fontSize: FontSize.label,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
  },
  rowValue: {
    fontSize: FontSize.small,
    fontWeight: '500',
    color: Palette.textTertiary,
  },
  progressTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: Palette.cardMuted,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: Palette.purple,
  },
  ctaWrapper: {
    marginTop: Spacing.lg,
  },
  cta: {
    height: 48,
    borderRadius: Radius.pill,
    backgroundColor: Palette.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: Palette.white,
    fontSize: FontSize.label,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
});
