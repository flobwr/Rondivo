import { Feather } from '@expo/vector-icons';
import { memo } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { AccentName, BorderWidth, Palette, Radius, SoftLayer, Spacing } from '@/constants/design';
import { cardShadow, focalShadow } from '@/constants/shadow';
import { AppBadge } from '@/components/ui';
import { useEntrance } from '@/hooks/use-entrance';
import { usePressScale } from '@/hooks/use-press-scale';
import { AppointmentStatus, PlanningAppointment } from './types';

// ── Per-status visual config ──────────────────────────────────────────────────
// One source of truth so the hierarchy stays regular across every card.

type StatusStyle = {
  borderColor: string;
  tileBg: string;
  tileColor: string;
  tileIcon?: 'check' | 'alert-circle';
  badgeLabel?: string;
  badgeAccent?: AccentName;
  timeColor: string;
  muted: boolean;
  focal: boolean;
};

const STATUS_STYLE: Record<AppointmentStatus, StatusStyle> = {
  done: {
    borderColor: Palette.green,
    tileBg: Palette.greenSoft,
    tileColor: Palette.green,
    tileIcon: 'check',
    timeColor: Palette.textTertiary,
    muted: true,
    focal: false,
  },
  inProgress: {
    borderColor: Palette.blue,
    tileBg: Palette.blueSoft,
    tileColor: Palette.blue,
    badgeLabel: 'EN COURS',
    badgeAccent: 'blue',
    timeColor: Palette.blue,
    muted: false,
    focal: true,
  },
  urgent: {
    borderColor: Palette.orange,
    tileBg: Palette.orangeSoft,
    tileColor: Palette.orange,
    tileIcon: 'alert-circle',
    badgeLabel: 'URGENT',
    badgeAccent: 'orange',
    timeColor: Palette.orange,
    muted: false,
    focal: false,
  },
  normal: {
    borderColor: Palette.border,
    tileBg: Palette.cardMuted,
    tileColor: Palette.textTertiary,
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
    <View style={styles.wrap}>
      {/* Soft Layer UI: a faint second surface peeking out behind the day's
          current intervention — the one card that should read as "in front". */}
      {s.focal ? <View style={styles.focalBackdrop} /> : null}

      <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
        <Animated.View
          style={[
            styles.card,
            { borderColor: s.borderColor },
            s.focal ? styles.cardFocal : null,
            { opacity: s.muted ? Animated.multiply(enter, 0.66) : enter, transform: [{ translateY }, { scale }] },
          ]}>
          {/* Status indicator */}
          <View style={[styles.tile, { backgroundColor: s.tileBg }]}>
            {s.tileIcon ? (
              <Feather name={s.tileIcon} size={17} color={s.tileColor} />
            ) : (
              <View style={[styles.tileDot, { backgroundColor: s.tileColor }]} />
            )}
          </View>

          {/* Primary info */}
          <View style={styles.info}>
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

          {/* Time + status */}
          <View style={styles.rightCol}>
            <Text style={[styles.time, { color: s.timeColor }]}>{appointment.time}</Text>
            <Text style={styles.duration}>{appointment.duration}</Text>

            {s.badgeLabel && s.badgeAccent ? (
              <View style={styles.badgeWrap}>
                <AppBadge label={s.badgeLabel} accent={s.badgeAccent} size="sm" uppercase />
              </View>
            ) : null}
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
}

export const PlanningAppointmentCard = memo(PlanningAppointmentCardBase);

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
  },
  focalBackdrop: {
    position: 'absolute',
    top: SoftLayer.offset,
    left: 6,
    right: 6,
    bottom: -SoftLayer.offset,
    borderRadius: Radius.card,
    backgroundColor: SoftLayer.focalBackdrop,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Palette.card,
    borderRadius: Radius.card, // identical corners to the Home cards
    borderWidth: BorderWidth.thin,
    paddingVertical: Spacing.md + 2,
    paddingHorizontal: Spacing.lg,
    ...cardShadow,
  },
  cardFocal: {
    ...focalShadow,
  },
  tile: {
    width: 40,
    height: 40,
    borderRadius: Radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  info: {
    flex: 1,
    marginLeft: Spacing.md,
    gap: 2,
  },
  client: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  clientMuted: {
    color: Palette.textSecondary,
  },
  type: {
    fontSize: 13,
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
  rightCol: {
    alignItems: 'flex-end',
    gap: 1,
    marginLeft: Spacing.sm,
    minWidth: 54,
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
  badgeWrap: {
    marginTop: 5,
  },
});
