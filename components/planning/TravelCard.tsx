import { Feather } from '@expo/vector-icons';
import { memo } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette, Radius } from '@/constants/design';
import { actionShadow, iconButtonShadow } from '@/constants/shadow';
import { useEntrance } from '@/hooks/use-entrance';
import { usePressScale } from '@/hooks/use-press-scale';
import { TravelLeg } from './types';

type Props = {
  travel: TravelLeg;
  index?: number;
  onNavigate?: () => void;
};

// A travel leg is a *connector*, not a card: lighter fill, no shadow, slim.
// It belongs to the timeline and makes the day read as
// intervention → trajet → intervention.
function TravelCardBase({ travel, index = 0, onNavigate }: Props) {
  const kmLabel = travel.km.toFixed(1).replace('.', ',');
  const { progress: enter } = useEntrance({ index });
  const { scale: pressScale, onPressIn, onPressOut } = usePressScale({ to: 0.9 });

  return (
    <Animated.View style={[styles.wrapper, { opacity: enter }]}>
      <View style={styles.capsule}>
        <View style={styles.statusDot} />
        <Feather name="truck" size={12} color={Palette.textTertiary} />
        <Text style={styles.label}>
          {travel.minutes} min • {kmLabel} km
        </Text>

        <View style={styles.spacer} />

        <Animated.View style={{ transform: [{ scale: pressScale }] }}>
          <Pressable
            hitSlop={8}
            style={styles.navBtn}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={onNavigate}>
            <Feather name="navigation" size={13} color={Palette.blue} />
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
    paddingVertical: 4,
  },
  capsule: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.card,
    borderRadius: Radius.pill,
    paddingVertical: 9,
    paddingLeft: 14,
    paddingRight: 6,
    gap: 8,
    ...actionShadow,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.green,
  },
  label: {
    fontSize: 12.5,
    fontWeight: '500',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
  },
  spacer: {
    flex: 1,
  },
  navBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Palette.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
    ...iconButtonShadow,
  },
});
