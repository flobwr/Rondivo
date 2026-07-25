import * as Haptics from 'expo-haptics';
import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';

import { PressScale, PressSpring } from '@/theme';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

type Options = {
  /** Target scale while pressed. Defaults to the "control" press scale. */
  to?: number;
  /** Haptic style on press-in. Pass `null` to disable haptics. */
  haptic?: Haptics.ImpactFeedbackStyle | null;
};

/**
 * Springy press feedback, for the cases `PressableScale` cannot cover.
 *
 * Reach for `<PressableScale>` first. This hook exists for components that
 * must compose the press scale with another animated value — a card
 * multiplying it by its entrance scale, for instance — and so cannot delegate
 * the whole Pressable.
 *
 * Before it, eight components hand-rolled the same
 * `useRef(new Animated.Value(1))` + onPressIn/onPressOut pair, each with its
 * own magic numbers (0.985/f7t300, 0.94/f6t300, 0.88/f6t300, 0.93/f6t300…) and
 * none of them honouring "reduce motion".
 *
 * @example
 * const { scale, onPressIn, onPressOut } = usePressScale({ to: PressScale.surface });
 */
export function usePressScale(options: Options = {}) {
  const { to = PressScale.control, haptic = Haptics.ImpactFeedbackStyle.Light } = options;
  const scale = useRef(new Animated.Value(1)).current;
  const reducedMotion = useReducedMotion();

  const onPressIn = useCallback(() => {
    if (haptic !== null) Haptics.impactAsync(haptic);
    if (reducedMotion) return;
    Animated.spring(scale, { toValue: to, useNativeDriver: true, ...PressSpring.in }).start();
  }, [haptic, reducedMotion, scale, to]);

  const onPressOut = useCallback(() => {
    if (reducedMotion) return;
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, ...PressSpring.out }).start();
  }, [reducedMotion, scale]);

  return { scale, onPressIn, onPressOut };
}
