import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, iconButtonShadow, Palette, Radius, Spacing } from '@/theme';
import { PRIORITY_CONFIG } from './priority';
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

function RoundButton({
  icon,
  onPress,
  accessibilityLabel,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  onPress?: () => void;
  accessibilityLabel: string;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, { toValue: 0.9, useNativeDriver: true, friction: 6, tension: 300 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}>
      <Animated.View style={[styles.roundButton, { transform: [{ scale }] }]}>
        <Feather name={icon} size={19} color={Palette.textPrimary} />
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
  const priority = PRIORITY_CONFIG[intervention.priority];
  const kmLabel = intervention.travelKm.toFixed(1).replace('.', ',');

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <RoundButton icon="chevron-left" onPress={onBack} accessibilityLabel="Retour" />
        <RoundButton icon="more-horizontal" onPress={onMore} accessibilityLabel="Options" />
      </View>

      <View style={styles.statusRow}>
        <View style={[styles.statusPill, { backgroundColor: status.background }]}>
          <View style={[styles.statusDot, { backgroundColor: status.color }]} />
          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: priority.background }]}>
          <Feather name="flag" size={10} color={priority.color} />
          <Text style={[styles.statusText, { color: priority.color }]}>{priority.shortLabel}</Text>
        </View>
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
          <Feather name="calendar" size={12} color={Palette.textSecondary} />
          <Text style={styles.metaText}>{intervention.dateLabel}</Text>
        </View>
        <View style={styles.metaDivider} />
        <View style={styles.metaItem}>
          <Feather name="clock" size={12} color={Palette.textSecondary} />
          <Text style={styles.metaText}>
            {intervention.startTime} – {intervention.endTime}
          </Text>
        </View>
        <View style={styles.metaDivider} />
        <View style={styles.metaItem}>
          <Feather name="hash" size={12} color={Palette.textSecondary} />
          <Text style={styles.metaText}>{intervention.duration}</Text>
        </View>
        <View style={styles.metaDivider} />
        <View style={styles.metaItem}>
          <Feather name="navigation" size={12} color={Palette.textSecondary} />
          <Text style={styles.metaText}>{kmLabel} km</Text>
        </View>
      </View>
    </View>
  );
}

const AVATAR = 26;

const styles = StyleSheet.create({
  container: {},
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roundButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.iconButtonBg,
    alignItems: 'center',
    justifyContent: 'center',
    ...iconButtonShadow,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
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
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Palette.textPrimary,
    marginTop: 8,
    letterSpacing: -0.5,
  },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
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
    fontSize: 11,
    fontWeight: '700',
  },
  clientName: {
    fontSize: FontSize.label,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    flexWrap: 'wrap',
    rowGap: 5,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaDivider: {
    width: StyleSheet.hairlineWidth,
    height: 11,
    backgroundColor: Palette.border,
    marginHorizontal: Spacing.sm,
  },
  metaText: {
    fontSize: FontSize.small,
    fontWeight: '500',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
  },
});
