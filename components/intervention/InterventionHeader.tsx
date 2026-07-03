import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { Intervention, InterventionStatus } from './types';

const STATUS_CONFIG: Record<InterventionStatus, { label: string; color: string; background: string }> = {
  planifiee: { label: 'Planifiée', color: Palette.blue, background: Palette.blueSoft },
  enCours: { label: 'En cours', color: Palette.orange, background: Palette.orangeSoft },
  terminee: { label: 'Terminée', color: Palette.green, background: Palette.greenSoft },
  annulee: { label: 'Annulée', color: Palette.red, background: Palette.redSoft },
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

function RoundButton({ icon, onPress }: { icon: React.ComponentProps<typeof Feather>['name']; onPress?: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, { toValue: 0.9, useNativeDriver: true, friction: 6, tension: 300 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress} hitSlop={6}>
      <Animated.View style={[styles.roundButton, { transform: [{ scale }] }]}>
        <Feather name={icon} size={20} color={Palette.textPrimary} />
      </Animated.View>
    </Pressable>
  );
}

type Props = {
  intervention: Intervention;
  onBack?: () => void;
  onMore?: () => void;
};

export function InterventionHeader({ intervention, onBack, onMore }: Props) {
  const status = STATUS_CONFIG[intervention.status];

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <RoundButton icon="chevron-left" onPress={onBack} />
        <RoundButton icon="more-horizontal" onPress={onMore} />
      </View>

      <View style={styles.statusRow}>
        <View style={[styles.statusPill, { backgroundColor: status.background }]}>
          <View style={[styles.statusDot, { backgroundColor: status.color }]} />
          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
        <Text style={styles.reference} numberOfLines={1}>
          {intervention.reference}
        </Text>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {intervention.type}
      </Text>

      <View style={styles.clientRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(intervention.client)}</Text>
        </View>
        <Text style={styles.clientName} numberOfLines={1}>
          {intervention.client}
        </Text>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Feather name="calendar" size={13} color={Palette.textSecondary} />
          <Text style={styles.metaText}>{intervention.dateLabel}</Text>
        </View>
        <View style={styles.metaDivider} />
        <View style={styles.metaItem}>
          <Feather name="clock" size={13} color={Palette.textSecondary} />
          <Text style={styles.metaText}>
            {intervention.startTime} – {intervention.endTime}
          </Text>
        </View>
        <View style={styles.metaDivider} />
        <View style={styles.metaItem}>
          <Feather name="hash" size={13} color={Palette.textSecondary} />
          <Text style={styles.metaText}>{intervention.duration}</Text>
        </View>
      </View>
    </View>
  );
}

const AVATAR = 30;

const styles = StyleSheet.create({
  container: {},
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ECEEF2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.pill,
    paddingHorizontal: 11,
    paddingVertical: 6,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: FontSize.small,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  reference: {
    fontSize: FontSize.tiny,
    fontWeight: '500',
    color: Palette.textTertiary,
    letterSpacing: 0,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Palette.textPrimary,
    marginTop: 12,
    letterSpacing: -0.6,
  },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    backgroundColor: Palette.blueAvatar,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Palette.white,
    fontSize: 12,
    fontWeight: '700',
  },
  clientName: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
    flexWrap: 'wrap',
    rowGap: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaDivider: {
    width: 1,
    height: 12,
    backgroundColor: Palette.border,
    marginHorizontal: 10,
  },
  metaText: {
    fontSize: FontSize.small,
    fontWeight: '500',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
  },
});
