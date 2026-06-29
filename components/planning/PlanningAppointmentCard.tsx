import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { PlanningAppointment, AppointmentStatus } from './types';

// Status config
const STATUS_CONFIG: Record<
  AppointmentStatus,
  {
    borderColor: string;
    dotColor: string;
    badgeLabel?: string;
    badgeBg?: string;
    badgeColor?: string;
    muted: boolean;
    timeColor: string;
    extraShadow: boolean;
    icon?: 'check' | 'alert-circle' | 'radio';
  }
> = {
  done: {
    borderColor: Palette.green,
    dotColor: Palette.green,
    muted: true,
    timeColor: Palette.textSecondary,
    extraShadow: false,
    icon: 'check',
  },
  inProgress: {
    borderColor: Palette.blue,
    dotColor: Palette.blue,
    badgeLabel: 'EN COURS',
    badgeBg: Palette.blueSoft,
    badgeColor: Palette.blue,
    muted: false,
    timeColor: Palette.blue,
    extraShadow: true,
    icon: 'radio',
  },
  urgent: {
    borderColor: Palette.orange,
    dotColor: Palette.orange,
    badgeLabel: 'URGENT',
    badgeBg: Palette.orangeSoft,
    badgeColor: Palette.orange,
    muted: false,
    timeColor: Palette.orange,
    extraShadow: false,
  },
  normal: {
    borderColor: Palette.border,
    dotColor: Palette.textTertiary,
    muted: false,
    timeColor: Palette.textSecondary,
    extraShadow: false,
  },
};

type Props = {
  appointment: PlanningAppointment;
};

export function PlanningAppointmentCard({ appointment }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const cfg = STATUS_CONFIG[appointment.status];

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, { toValue: 0.98, useNativeDriver: true, friction: 6, tension: 300 }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  const cardStyle = [
    styles.card,
    { borderColor: cfg.borderColor },
    cfg.muted && styles.cardMuted,
    cfg.extraShadow && styles.cardInProgress,
  ];

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={[cardStyle, { transform: [{ scale }] }]}>
        {/* Left dot indicator */}
        <View style={styles.dotWrapper}>
          {appointment.status === 'done' ? (
            <View style={[styles.dotCircle, { backgroundColor: Palette.greenSoft, borderColor: Palette.green }]}>
              <Feather name="check" size={10} color={Palette.green} />
            </View>
          ) : appointment.status === 'inProgress' ? (
            <View style={[styles.dotCircle, { backgroundColor: Palette.blueSoft, borderColor: Palette.blue }]}>
              <View style={[styles.dotInner, { backgroundColor: Palette.blue }]} />
            </View>
          ) : appointment.status === 'urgent' ? (
            <View style={[styles.dotCircle, { backgroundColor: Palette.orangeSoft, borderColor: Palette.orange }]}>
              <Feather name="alert-circle" size={10} color={Palette.orange} />
            </View>
          ) : (
            <View style={[styles.dotCircle, { backgroundColor: Palette.screen, borderColor: Palette.border }]}>
              <View style={[styles.dotInner, { backgroundColor: Palette.textTertiary }]} />
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={[styles.client, cfg.muted && styles.textMuted]} numberOfLines={1}>
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

        {/* Right column: time + badge/duration */}
        <View style={styles.rightCol}>
          <Text style={[styles.time, { color: cfg.timeColor }]}>{appointment.time}</Text>
          <Text style={styles.duration}>{appointment.duration}</Text>

          {cfg.badgeLabel ? (
            <View style={[styles.badge, { backgroundColor: cfg.badgeBg }]}>
              <Text style={[styles.badgeText, { color: cfg.badgeColor }]}>{cfg.badgeLabel}</Text>
            </View>
          ) : appointment.status === 'done' ? (
            <View style={[styles.badge, { backgroundColor: Palette.greenSoft }]}>
              <Feather name="check" size={11} color={Palette.green} />
            </View>
          ) : null}
        </View>
      </Animated.View>
    </Pressable>
  );
}

const inProgressShadow = Platform.select({
  ios: {
    shadowColor: Palette.blue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  android: { elevation: 5 },
  default: { boxShadow: '0px 6px 20px rgba(37, 99, 235, 0.14)' },
});

const baseShadow = Platform.select({
  ios: {
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  android: { elevation: 2 },
  default: { boxShadow: '0px 4px 12px rgba(15, 23, 41, 0.06)' },
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Palette.card,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    ...baseShadow,
  },
  cardMuted: {
    opacity: 0.72,
  },
  cardInProgress: {
    ...inProgressShadow,
  },
  dotWrapper: {
    width: 30,
    alignItems: 'center',
    paddingTop: 2,
  },
  dotCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  info: {
    flex: 1,
    marginLeft: 10,
    gap: 3,
  },
  client: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  textMuted: {
    color: Palette.textSecondary,
  },
  type: {
    fontSize: FontSize.small,
    fontWeight: '400',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  address: {
    flex: 1,
    fontSize: 11,
    color: Palette.textTertiary,
    letterSpacing: 0,
  },
  rightCol: {
    alignItems: 'flex-end',
    gap: 2,
    marginLeft: 8,
    minWidth: 56,
  },
  time: {
    fontSize: FontSize.label,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  duration: {
    fontSize: FontSize.small,
    fontWeight: '400',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
  },
  badge: {
    borderRadius: Radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
