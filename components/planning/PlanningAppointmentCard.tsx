import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette, Radius } from '@/constants/design';
import { actionShadow } from '@/constants/shadow';
import { AppointmentStatus, PlanningAppointment } from './types';

// ── Per-status visual config ──────────────────────────────────────────────────
// One source of truth so the hierarchy stays regular across every card.

type StatusStyle = {
  borderColor: string;
  borderWidth: number;
  dotBg: string;
  dotBorder: string;
  dotColor: string;
  dotIcon?: 'check' | 'alert-circle';
  badgeLabel?: string;
  badgeBg?: string;
  badgeColor?: string;
  timeColor: string;
  muted: boolean;
  focal: boolean;
};

const STATUS_STYLE: Record<AppointmentStatus, StatusStyle> = {
  done: {
    borderColor: Palette.green,
    borderWidth: 1,
    dotBg: Palette.greenSoft,
    dotBorder: Palette.green,
    dotColor: Palette.green,
    dotIcon: 'check',
    timeColor: Palette.textTertiary,
    muted: true,
    focal: false,
  },
  inProgress: {
    borderColor: Palette.blue,
    borderWidth: 1.5,
    dotBg: Palette.blueSoft,
    dotBorder: Palette.blue,
    dotColor: Palette.blue,
    badgeLabel: 'EN COURS',
    badgeBg: Palette.blueSoft,
    badgeColor: Palette.blue,
    timeColor: Palette.blue,
    muted: false,
    focal: true,
  },
  urgent: {
    borderColor: Palette.orange,
    borderWidth: 1.25,
    dotBg: Palette.orangeSoft,
    dotBorder: Palette.orange,
    dotColor: Palette.orange,
    dotIcon: 'alert-circle',
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
    dotBg: Palette.screen,
    dotBorder: Palette.border,
    dotColor: Palette.textTertiary,
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

export function PlanningAppointmentCard({ appointment, index = 0, onPress }: Props) {
  const pressScale = useRef(new Animated.Value(1)).current;
  const enter = useRef(new Animated.Value(0)).current;
  const s = STATUS_STYLE[appointment.status];

  useEffect(() => {
    Animated.spring(enter, {
      toValue: 1,
      useNativeDriver: true,
      friction: 9,
      tension: 80,
      delay: index * 45,
    }).start();
  }, [enter, index]);

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(pressScale, { toValue: 0.985, useNativeDriver: true, friction: 7, tension: 300 }).start();
  };

  const onPressOut = () => {
    Animated.spring(pressScale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  const translateY = enter.interpolate({ inputRange: [0, 1], outputRange: [10, 0] });
  const enterScale = enter.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1] });
  const scale = Animated.multiply(pressScale, enterScale);

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
      <Animated.View
        style={[
          styles.card,
          { borderColor: s.borderColor, borderWidth: s.borderWidth },
          s.focal ? styles.cardFocal : null,
          s.muted ? styles.cardMuted : null,
          { opacity: s.muted ? Animated.multiply(enter, 0.66) : enter, transform: [{ translateY }, { scale }] },
        ]}>
        {/* Status indicator */}
        <View style={styles.dotWrapper}>
          <View style={[styles.dotCircle, { backgroundColor: s.dotBg, borderColor: s.dotBorder }]}>
            {s.dotIcon ? (
              <Feather name={s.dotIcon} size={11} color={s.dotColor} />
            ) : (
              <View style={[styles.dotInner, { backgroundColor: s.dotColor }]} />
            )}
          </View>
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

          {s.badgeLabel ? (
            <View style={[styles.badge, { backgroundColor: s.badgeBg }]}>
              <Text style={[styles.badgeText, { color: s.badgeColor }]}>{s.badgeLabel}</Text>
            </View>
          ) : null}
        </View>
      </Animated.View>
    </Pressable>
  );
}

// Focal (in-progress) card carries a slightly stronger, brand-tinted lift.
// Every other card uses the barely-there action shadow from the design system,
// so the eye lands on the current intervention first.
const focalShadow = Platform.select({
  ios: {
    shadowColor: Palette.blue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
  },
  android: { elevation: 5 },
  default: { boxShadow: '0px 6px 18px rgba(37, 99, 235, 0.16)' },
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Palette.card,
    borderRadius: Radius.card, // identical corners to the Home cards
    paddingVertical: 11,
    paddingHorizontal: 14,
    ...actionShadow,
  },
  cardFocal: {
    ...focalShadow,
  },
  cardMuted: {
    // opacity is driven by the entrance animation (see component)
  },
  dotWrapper: {
    width: 26,
    alignItems: 'center',
    paddingTop: 1,
  },
  dotCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotInner: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  info: {
    flex: 1,
    marginLeft: 10,
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
    marginLeft: 8,
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
  badge: {
    borderRadius: Radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
