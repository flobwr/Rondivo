import { Feather } from '@expo/vector-icons';
import { memo } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette, Radius } from '@/constants/design';
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
  },
  capsule: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.cardMuted,
    borderRadius: Radius.pill,
    paddingVertical: 6,
    paddingLeft: 11,
    paddingRight: 5,
    gap: 7,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
  },
  spacer: {
    flex: 1,
  },
  navBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Palette.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
