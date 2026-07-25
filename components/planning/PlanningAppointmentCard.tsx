import { Feather } from '@expo/vector-icons';
import { memo } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

import { IconSize, Opacity, Palette, Radius, Spacing } from '@/constants/design';
import { EntranceScale, EntranceTravel, PressScale } from '@/constants/motion';
import { cardShadow, focalShadow } from '@/constants/shadow';
import { AppBadge, AppText } from '@/components/ui';
import { useEntrance } from '@/hooks/use-entrance';
import { usePressScale } from '@/hooks/use-press-scale';
import { STATUS_VISUAL } from './status';
import type { PlanningAppointment } from './types';

type Props = {
  appointment: PlanningAppointment;
  /** Position in the list — drives the staggered entrance. */
  index?: number;
  onPress?: () => void;
};

/**
 * An intervention in the planning timeline.
 *
 * Same object as the Home appointment card: white surface, card radius, card
 * shadow, client → type → address. No coloured outline per status — the timeline
 * already carries the status in its dot and its time label, and a card ringed in
 * orange shouts at the user for information they have already read.
 *
 * The time is *not* repeated here: it belongs to the timeline gutter, which is
 * the day's axis. One piece of information, one place.
 */
function PlanningAppointmentCardBase({ appointment, index = 0, onPress }: Props) {
  const status = STATUS_VISUAL[appointment.status];
  const { progress: enter } = useEntrance({ index });
  const { scale: pressScale, onPressIn, onPressOut } = usePressScale({ to: PressScale.surface });

  const translateY = enter.interpolate({
    inputRange: [0, 1],
    outputRange: [EntranceTravel, 0],
  });
  const enterScale = enter.interpolate({ inputRange: [0, 1], outputRange: [EntranceScale, 1] });
  const scale = Animated.multiply(pressScale, enterScale);
  const opacity = status.muted ? Animated.multiply(enter, Opacity.soft) : enter;

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
      <Animated.View
        style={[
          styles.card,
          status.focal ? styles.cardFocal : null,
          { opacity, transform: [{ translateY }, { scale }] },
        ]}>
        <View style={styles.header}>
          <AppText variant="headline" numberOfLines={1} style={styles.client}>
            {appointment.client}
          </AppText>
          {status.badge ? (
            <AppBadge label={status.badge} accent={status.accent} size="sm" uppercase />
          ) : null}
        </View>

        <AppText variant="footnote" color="secondary" numberOfLines={1}>
          {appointment.type} • {appointment.duration}
        </AppText>

        <View style={styles.addressRow}>
          <Feather name="map-pin" size={IconSize.xs} color={Palette.textTertiary} />
          <AppText variant="micro" color="tertiary" numberOfLines={1} style={styles.address}>
            {appointment.address}
          </AppText>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export const PlanningAppointmentCard = memo(PlanningAppointmentCardBase);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card, // identical corners to the Home cards
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs,
    ...cardShadow,
  },
  cardFocal: {
    // The only lift that differs, and only for the intervention in progress.
    ...focalShadow,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  client: {
    flex: 1,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  address: {
    flex: 1,
  },
});
