import { Feather } from '@expo/vector-icons';
import { memo } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette, Radius } from '@/constants/design';
import { cardShadow, focalShadow } from '@/constants/shadow';
import { useEntrance } from '@/hooks/use-entrance';
import { usePressScale } from '@/hooks/use-press-scale';
import { AppointmentStatus, PlanningAppointment } from './types';

// ── Per-status visual config ──────────────────────────────────────────────────
// One source of truth so the hierarchy stays regular across every card. The
// status *icon* now lives on the timeline dot (see Timeline.tsx) — the card
// itself only carries the accent border, the time colour and an optional badge.

type StatusStyle = {
  borderColor: string;
  borderWidth: number;
  badgeLabel?: string;
  badgeBg?: string;
  badgeColor?: string;
  timeColor: string;
  muted: boolean;
  focal: boolean;
};

const STATUS_STYLE: Record<AppointmentStatus, StatusStyle> = {
  done: {
    borderColor: Palette.greenSoft,
    borderWidth: 1,
    timeColor: Palette.textTertiary,
    muted: true,
    focal: false,
  },
  inProgress: {
    borderColor: Palette.blue,
    borderWidth: 1.5,
    badgeLabel: 'EN COURS',
    badgeBg: Palette.blueSoft,
    badgeColor: Palette.blue,
    timeColor: Palette.blue,
    muted: false,
    focal: true,
  },
  urgent: {
    borderColor: Palette.orangeSoft,
    borderWidth: 1.25,
    badgeLabel: 'URGENT',
    badgeBg: Palette.orangeSoft,
    badgeColor: Palette.orange,
    timeColor: Palette.orange,
    muted: false,
    focal: false,
  },
  normal: {
    borderColor: Palette.border,
    borderWidth: 1,
    timeColor: Palette.textSecondary,
    muted: false,
    focal: false,
  },
};

type Props = {
  appointment: PlanningAppointment;
  /** position in the list — drives a light staggered entrance */
  index?: number;
  onPress?: () => void;
};

function PlanningAppointmentCardBase({ appointment, index = 0, onPress }: Props) {
  const { progress: enter } = useEntrance({ index });
  const { scale: pressScale, onPressIn, onPressOut } = usePressScale({
    to: 0.985,
    springIn: { friction: 7, tension: 300 },
  });
  const s = STATUS_STYLE[appointment.status];

  const translateY = enter.interpolate({ inputRange: [0, 1], outputRange: [10, 0] });
  const enterScale = enter.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1] });
  const scale = Animated.multiply(pressScale, enterScale);

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
      <Animated.View
        style={[
          styles.card,
          { borderColor: s.borderColor, borderWidth: s.borderWidth },
          s.focal ? styles.cardFocal : styles.cardShadow,
          { opacity: s.muted ? Animated.multiply(enter, 0.75) : enter, transform: [{ translateY }, { scale }] },
        ]}>
        <View style={styles.body}>
          {/* Header row: time on the left, status badge on the right */}
          <View style={styles.headerRow}>
            <View style={styles.timeRow}>
              <Feather name="clock" size={11} color={s.timeColor} />
              <Text style={[styles.time, { color: s.timeColor }]}>{appointment.time}</Text>
              <Text style={styles.duration}>· {appointment.duration}</Text>
            </View>

            {s.badgeLabel ? (
              <View style={[styles.badge, { backgroundColor: s.badgeBg }]}>
                <Text style={[styles.badgeText, { color: s.badgeColor }]}>{s.badgeLabel}</Text>
              </View>
            ) : null}
          </View>

          {/* Primary info */}
          <Text style={[styles.client, s.muted ? styles.clientMuted : null]} numberOfLines={1}>
            {appointment.client}
          </Text>
          <Text style={styles.type} numberOfLines={1}>
            {appointment.type}
          </Text>
          <View style={styles.addressRow}>
            <Feather name="map-pin" size={11} color={Palette.textTertiary} />
            <Text style={styles.address} numberOfLines={1}>
              {appointment.address}
            </Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export const PlanningAppointmentCard = memo(PlanningAppointmentCardBase);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  cardShadow: {
    ...cardShadow,
  },
  cardFocal: {
    ...focalShadow,
  },
  body: {
    gap: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  time: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  duration: {
    fontSize: 12,
    fontWeight: '400',
    color: Palette.textTertiary,
    letterSpacing: -0.1,
  },
  client: {
    fontSize: 17,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  clientMuted: {
    color: Palette.textSecondary,
  },
  type: {
    fontSize: 13.5,
    fontWeight: '400',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  address: {
    flex: 1,
    fontSize: 11,
    color: Palette.textTertiary,
    letterSpacing: 0,
  },
  badge: {
    borderRadius: Radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
