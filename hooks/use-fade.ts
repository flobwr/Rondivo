import { useEffect, useMemo, useRef } from 'react';
import { Animated } from 'react-native';

import { Timing, type TimingToken } from '@/constants/motion';

type Options = {
  /** Delay before the fade starts (ms). */
  delay?: number;
  /** Which motion token to use. Defaults to the navigation transition. */
  timing?: TimingToken;
};

/**
 * Fades content in (or out) with the shared motion tokens.
 *
 * This is the "a screen just got its data" animation. Home and Planning each
 * hand-rolled their own `Animated.Value` + `Animated.timing` with different
 * durations (260 ms vs 280 ms) and no easing, which is exactly the kind of
 * invisible drift that makes an app feel assembled rather than designed.
 *
 * Always starts from 0 so mounting with `visible = true` still fades in.
 *
 * @example
 * const { style } = useFade(!isLoading);
 * <Animated.View style={style}>…</Animated.View>
 */
export function useFade(visible: boolean, options: Options = {}) {
  const { delay = 0, timing = Timing.navigation } = options;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      delay,
      useNativeDriver: true,
      ...timing,
    });
    animation.start();
    return () => animation.stop();
  }, [visible, delay, opacity, timing]);

  const style = useMemo(() => ({ opacity }), [opacity]);

  return { opacity, style };
}
