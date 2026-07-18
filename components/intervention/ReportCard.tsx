import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useMemo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { createThemedStyles, FontSize, Palette, Radius, Spacing } from '@/theme';
import { SectionCard } from './SectionCard';
import { ReportItem } from './types';

type Props = {
  reportNote: string;
  hasVoiceNote: boolean;
  checklist: { completed: number; total: number };
  hasSignature: boolean;
  reportPdfReady: boolean;
  onComplete?: () => void;
};

function buildItems({
  reportNote,
  hasVoiceNote,
  checklist,
  hasSignature,
  reportPdfReady,
}: Omit<Props, 'onComplete'>): ReportItem[] {
  return [
    {
      id: 'notes',
      icon: 'file-text',
      label: 'Notes',
      value: reportNote ? 'Renseignées' : 'Aucune note',
      done: Boolean(reportNote),
    },
    {
      id: 'voice',
      icon: 'mic',
      label: 'Dictée vocale',
      value: hasVoiceNote ? '1 enregistrement' : 'Aucun enregistrement',
      done: hasVoiceNote,
    },
    {
      id: 'checklist',
      icon: 'check-square',
      label: 'Checklist',
      value: `${checklist.completed}/${checklist.total}`,
      done: checklist.total > 0 && checklist.completed === checklist.total,
    },
    {
      id: 'signature',
      icon: 'edit-3',
      label: 'Signature client',
      value: hasSignature ? 'Signée' : 'Non signée',
      done: hasSignature,
    },
    {
      id: 'liveTime',
      icon: 'activity',
      label: 'Temps réel',
      value: 'Bientôt disponible',
      done: false,
    },
    {
      id: 'pdf',
      icon: 'file',
      label: 'Rapport PDF',
      value: reportPdfReady ? 'Généré' : 'Non généré',
      done: reportPdfReady,
    },
  ];
}

export function ReportCard({ reportNote, hasVoiceNote, checklist, hasSignature, reportPdfReady, onComplete }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const items = useMemo(
    () => buildItems({ reportNote, hasVoiceNote, checklist, hasSignature, reportPdfReady }),
    [reportNote, hasVoiceNote, checklist, hasSignature, reportPdfReady]
  );
  const doneCount = items.filter((item) => item.done).length;
  const progress = items.length > 0 ? doneCount / items.length : 0;

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, friction: 6, tension: 300 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  return (
    <SectionCard icon="clipboard" iconColor={Palette.blue} iconBackground={Palette.blueSoft} title="Rapport">
      <View style={styles.progressRow}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.progressCaption}>
          {doneCount} sur {items.length} complétés
        </Text>
      </View>

      <View>
        {items.map((item, index) => {
          const isLive = item.id === 'liveTime';
          return (
            <View key={item.id}>
              {index > 0 ? <View style={styles.separator} /> : null}
              <View style={[styles.row, isLive ? styles.rowDisabled : null]}>
                <View style={[styles.rowIconTile, item.done ? styles.rowIconTileDone : null]}>
                  <Feather name={item.icon} size={15} color={item.done ? Palette.green : Palette.blue} />
                </View>
                <Text style={styles.rowLabel} numberOfLines={1}>
                  {item.label}
                </Text>
                <Text style={styles.rowValue} numberOfLines={1}>
                  {item.value}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onComplete} style={styles.ctaWrapper}>
        <Animated.View style={[styles.cta, { transform: [{ scale }] }]}>
          <Text style={styles.ctaText}>Compléter le rapport</Text>
        </Animated.View>
      </Pressable>
    </SectionCard>
  );
}

const styles = createThemedStyles(() => StyleSheet.create({
  progressRow: {
    marginBottom: 12,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.cardMuted,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: Palette.blue,
  },
  progressCaption: {
    fontSize: 12,
    fontWeight: '500',
    color: Palette.textTertiary,
    marginTop: 6,
    letterSpacing: -0.1,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  rowDisabled: {
    opacity: 0.55,
  },
  rowIconTile: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: Palette.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIconTileDone: {
    backgroundColor: Palette.greenSoft,
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
    flexShrink: 1,
    textAlign: 'right',
  },
  ctaWrapper: {
    marginTop: Spacing.md,
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
}));
