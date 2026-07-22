import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import * as Haptics from 'expo-haptics';

import { PressScale, Spring } from '@/constants/motion';

type SpringConfig = { friction: number; tension: number };

type Options = {
  /** Target scale while pressed. Defaults to the "control" press scale. */
  to?: number;
  /** Haptic style on press-in. Pass `null` to disable haptics. */
  haptic?: Haptics.ImpactFeedbackStyle | null;
  /** Override the press-in spring. Defaults to the shared token. */
  springIn?: SpringConfig;
  /** Override the press-out spring. Defaults to the shared token. */
  springOut?: SpringConfig;
};

/**
 * Springy press-feedback used all over the app.
 *
 * Replaces the ~10 hand-rolled copies of the same
 * `useRef(new Animated.Value(1))` + onPressIn/onPressOut spring pattern, each
 * with slightly different magic numbers. Wire the returned handlers to a
 * Pressable and apply `{ transform: [{ scale }] }` to the animated child.
 *
 * `springIn`/`springOut` let a caller reproduce an exact legacy feel while the
 * duplicated boilerplate still disappears.
 *
 * @example
 * const { scale, onPressIn, onPressOut } = usePressScale();
 * <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
 *   <Animated.View style={{ transform: [{ scale }] }}>…</Animated.View>
 * </Pressable>
 */
export function usePressScale(options: Options = {}) {
  const {
    to = PressScale.control,
    haptic = Haptics.ImpactFeedbackStyle.Light,
    springIn = Spring.pressIn,
    springOut = Spring.pressOut,
  } = options;
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    if (haptic !== null) {
      Haptics.impactAsync(haptic);
    }
    Animated.spring(scale, { toValue: to, useNativeDriver: true, ...springIn }).start();
  }, [haptic, scale, to, springIn]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, ...springOut }).start();
  }, [scale, springOut]);

  return { scale, onPressIn, onPressOut };
}
