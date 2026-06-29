import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Animated, Platform, Pressable, StyleSheet } from 'react-native';

import { Palette } from '@/constants/design';

type Props = {
  onPress?: () => void;
  bottom?: number;
};

const fabShadow = Platform.select({
  ios: {
    shadowColor: Palette.blue,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
  },
  android: { elevation: 10 },
  default: { boxShadow: '0px 8px 24px rgba(37, 99, 235, 0.30)' },
});

export function FAB({ onPress, bottom = 20 }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.spring(scale, { toValue: 0.92, useNativeDriver: true, friction: 5, tension: 300 }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  return (
    <Animated.View style={[styles.fab, { bottom }, fabShadow, { transform: [{ scale }] }]}>
      <Pressable style={styles.inner} onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
        <Feather name="plus" size={26} color={Palette.white} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Palette.blue,
    zIndex: 100,
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
