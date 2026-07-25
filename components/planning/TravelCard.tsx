import { Feather } from '@expo/vector-icons';
import { memo } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { HitSlop, IconSize, Palette, Radius, Spacing } from '@/constants/design';
import { PressScale } from '@/constants/motion';
import { useEntrance } from '@/hooks/use-entrance';
import { usePressScale } from '@/hooks/use-press-scale';
import type { TravelLeg } from './types';

type Props = {
  travel: TravelLeg;
  index?: number;
  onNavigate?: () => void;
};

const NAV_BUTTON = 28;

/**
 * A travel leg is a *connector*, not a card: lighter fill, no shadow, slim. It
 * belongs to the timeline and makes the day read as
 * intervention → trajet → intervention.
 */
function TravelCardBase({ travel, index = 0, onNavigate }: Props) {
  const kmLabel = travel.km.toFixed(1).replace('.', ',');
  const { progress: enter } = useEntrance({ index });
  const { scale: pressScale, onPressIn, onPressOut } = usePressScale({ to: PressScale.icon });

  return (
    <Animated.View style={[styles.wrapper, { opacity: enter }]}>
      <View style={styles.capsule}>
        <Feather name="truck" size={IconSize.xs} color={Palette.textTertiary} />
        <AppText variant="caption" color="secondary">
          {travel.minutes} min • {kmLabel} km
        </AppText>

        <View style={styles.spacer} />

        <Animated.View style={{ transform: [{ scale: pressScale }] }}>
          <Pressable
            hitSlop={HitSlop.md}
            style={styles.navButton}
            accessibilityRole="button"
            accessibilityLabel="Lancer la navigation"
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={onNavigate}>
            <Feather name="navigation" size={IconSize.sm} color={Palette.blue} />
          </Pressable>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

export const TravelCard = memo(TravelCardBase);

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
  },
  capsule: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.cardMuted,
    borderRadius: Radius.pill,
    paddingVertical: Spacing.xs,
    paddingLeft: Spacing.md,
    paddingRight: Spacing.xs,
    gap: Spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  spacer: {
    flex: 1,
  },
  navButton: {
    width: NAV_BUTTON,
    height: NAV_BUTTON,
    borderRadius: NAV_BUTTON / 2,
    backgroundColor: Palette.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
