import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette, Radius } from '@/constants/design';
import { TravelLeg } from './types';

type Props = {
  travel: TravelLeg;
  onNavigate?: () => void;
};

// A travel leg is a *connector*, not a card: lighter fill, no shadow, smaller.
// It makes the day read as intervention → trajet → intervention.
export function TravelCard({ travel, onNavigate }: Props) {
  const kmLabel = travel.km.toFixed(1).replace('.', ',');
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, { toValue: 0.9, useNativeDriver: true, friction: 6, tension: 300 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.capsule}>
        <Feather name="truck" size={13} color={Palette.textTertiary} />
        <Text style={styles.label}>
          {travel.minutes} min • {kmLabel} km
        </Text>

        <View style={styles.spacer} />

        <Animated.View style={{ transform: [{ scale }] }}>
          <Pressable
            hitSlop={8}
            style={styles.navBtn}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={onNavigate}>
            <Feather name="navigation" size={14} color={Palette.blue} />
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    // vertically centre the slim capsule within the row's content height
    justifyContent: 'center',
    paddingVertical: 2,
  },
  capsule: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.cardMuted,
    borderRadius: Radius.pill,
    paddingVertical: 7,
    paddingLeft: 12,
    paddingRight: 6,
    gap: 7,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
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
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Palette.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
