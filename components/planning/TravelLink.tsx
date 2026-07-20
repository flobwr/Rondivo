import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { memo, useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { createThemedStyles, Palette } from '@/theme';
import { useTheme } from '@/contexts/theme';
import { TravelLeg } from './types';

type Props = {
  travel: TravelLeg;
  index?: number;
  onNavigate?: () => void;
};

// A travel leg is a *connector*, not a card: slim capsule, no shadow. The tiny
// coloured dot is the live-traffic hook; the round button will open GPS
// navigation.
function TravelLinkBase({ travel, index = 0, onNavigate }: Props) {
  const kmLabel = travel.km.toFixed(1).replace('.', ',');
  const pressScale = useRef(new Animated.Value(1)).current;
  const enter = useRef(new Animated.Value(0)).current;
  const { palette } = useTheme();

  const trafficColor: Record<TravelLeg['traffic'], string> = {
    fluid: palette.green,
    dense: palette.orange,
    jammed: palette.red,
  };

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
    Animated.spring(pressScale, { toValue: 0.88, useNativeDriver: true, friction: 6, tension: 300 }).start();
  };
  const onPressOut = () => {
    Animated.spring(pressScale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  return (
    <Animated.View style={[styles.wrapper, { opacity: enter }]}>
      <View style={styles.capsule}>
        <View style={[styles.trafficDot, { backgroundColor: trafficColor[travel.traffic] }]} />
        <Feather name="truck" size={13} color={Palette.textTertiary} />
        <Text style={styles.label}>
          {travel.minutes} min · {kmLabel} km
        </Text>

        <View style={styles.spacer} />

        <Animated.View style={{ transform: [{ scale: pressScale }] }}>
          <Pressable
            hitSlop={10}
            style={styles.navButton}
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

export const TravelLink = memo(TravelLinkBase);

const styles = createThemedStyles(() => StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    paddingVertical: 2,
  },
  capsule: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    minWidth: '66%',
    backgroundColor: Palette.cardMuted,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
    paddingVertical: 9,
    paddingLeft: 15,
    paddingRight: 6,
    gap: 9,
  },
  trafficDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
  },
  spacer: {
    flex: 1,
  },
  navButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Palette.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
