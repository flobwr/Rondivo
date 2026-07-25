import { Feather } from '@expo/vector-icons';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppBadge } from '@/components/ui';
import { FontSize, IconSize, Palette, Radius, Spacing } from '@/constants/design';
import { PressScale } from '@/constants/motion';
import { cardShadow } from '@/constants/shadow';
import { usePressScale } from '@/hooks/use-press-scale';

export type Appointment = {
  id: string;
  time: string;
  client: string;
  type: string;
  address: string;
  status?: string;
};

type AppointmentCardProps = {
  appointment: Appointment;
};

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  const { scale, onPressIn, onPressOut } = usePressScale({ to: PressScale.surface });

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <View style={styles.timeColumn}>
          <Text style={styles.time}>{appointment.time}</Text>
          <View style={styles.dot} />
        </View>

        <View style={styles.info}>
          <Text style={styles.client} numberOfLines={1}>
            {appointment.client}
          </Text>
          <Text style={styles.type} numberOfLines={1} ellipsizeMode="tail">
            {appointment.type}
          </Text>
          <View style={styles.addressRow}>
            <Feather
              name="map-pin"
              size={IconSize.xs}
              color={Palette.textTertiary}
              style={styles.mapIcon}
            />
            <Text style={styles.address} numberOfLines={2} ellipsizeMode="tail">
              {appointment.address}
            </Text>
          </View>
        </View>

        {appointment.status ? (
          <View style={styles.status}>
            <AppBadge label={appointment.status} accent="blue" />
          </View>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingVertical: 16,
    paddingHorizontal: 18,
    ...cardShadow,
  },
  timeColumn: {
    alignItems: 'center',
    width: 42,
  },
  time: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.blue,
    marginTop: 10,
    opacity: 0.85,
  },
  info: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  client: {
    fontSize: 17,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  type: {
    fontSize: 13,
    fontWeight: '400',
    color: Palette.textSecondary,
    marginTop: 3,
    letterSpacing: -0.1,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
    gap: 5,
  },
  mapIcon: {
    marginTop: 1,
    opacity: 0.7,
  },
  address: {
    flex: 1,
    fontSize: 11,
    fontWeight: '400',
    color: Palette.textTertiary,
    letterSpacing: 0,
  },
  status: {
    marginLeft: Spacing.sm,
    alignSelf: 'flex-start',
  },
});
