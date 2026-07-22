import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import * as Haptics from 'expo-haptics';

import { PressScale, Spring } from '@/constants/motion';

type Options = {
  /** Target scale while pressed. Defaults to the "control" press scale. */
  to?: number;
  /** Haptic style on press-in. Pass `null` to disable haptics. */
  haptic?: Haptics.ImpactFeedbackStyle | null;
};

/**
 * Springy press-feedback used all over the app.
 *
 * Replaces the ~10 hand-rolled copies of the same
 * `useRef(new Animated.Value(1))` + onPressIn/onPressOut spring pattern, each
 * with slightly different magic numbers. Wire the returned handlers to a
 * Pressable and apply `{ transform: [{ scale }] }` to the animated child.
 *
 * @example
 * const { scale, onPressIn, onPressOut } = usePressScale();
 * <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
 *   <Animated.View style={{ transform: [{ scale }] }}>…</Animated.View>
 * </Pressable>
 */
export function usePressScale(options: Options = {}) {
  const { to = PressScale.control, haptic = Haptics.ImpactFeedbackStyle.Light } = options;
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    if (haptic !== null) {
      Haptics.impactAsync(haptic);
    }
    Animated.spring(scale, { toValue: to, useNativeDriver: true, ...Spring.pressIn }).start();
  }, [haptic, scale, to]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, ...Spring.pressOut }).start();
  }, [scale]);

  return { scale, onPressIn, onPressOut };
}
