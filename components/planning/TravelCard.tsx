import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { memo, useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette, Radius } from '@/constants/design';
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
  const pressScale = useRef(new Animated.Value(1)).current;
  const enter = useRef(new Animated.Value(0)).current;

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
    Animated.spring(pressScale, { toValue: 0.9, useNativeDriver: true, friction: 6, tension: 300 }).start();
  };
  const onPressOut = () => {
    Animated.spring(pressScale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

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
