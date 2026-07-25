import { useEffect, useMemo, useRef } from 'react';
import { Animated } from 'react-native';

import {
  EntranceScale,
  EntranceTravel,
  StaggerRowCap,
  StaggerRowDelay,
  Timing,
  type TimingToken,
} from '@/theme';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

type Options = {
  /** List position — drives the staggered entrance, capped by StaggerRowCap. */
  index?: number;
  /** Vertical travel in px. Defaults to the shared token. */
  translateY?: number;
  /** Scale to grow from. Defaults to the shared token (1 disables scale). */
  fromScale?: number;
  /** Motion token. Defaults to the content transition. */
  timing?: TimingToken;
};

/**
 * The "a card appeared" entrance: fade + a hint of rise + a hint of scale.
 *
 * Curve-based, not spring-based, and on purpose: an entrance is something the
 * app decides, not something the finger drives, so it belongs to the timing
 * side of the motion system. Every card in the app therefore arrives over the
 * same duration on the same curve — and the stagger is capped, so a long list
 * never turns the last rows into a wait.
 *
 * Returns a ready-to-spread `style` plus the raw `progress` value for callers
 * composing extra interpolations (a done card multiplying opacity, a pressed
 * card multiplying scale).
 */
export function useEntrance(options: Options = {}) {
  const {
    index = 0,
    translateY = EntranceTravel,
    fromScale = EntranceScale,
    timing = Timing.content,
  } = options;
  const progress = useRef(new Animated.Value(0)).current;
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      progress.setValue(1);
      return;
    }
    const animation = Animated.timing(progress, {
      toValue: 1,
      useNativeDriver: true,
      delay: Math.min(index, StaggerRowCap) * StaggerRowDelay,
      ...timing,
    });
    animation.start();
    return () => animation.stop();
  }, [index, progress, reducedMotion, timing]);

  const style = useMemo(
    () => ({
      opacity: progress,
      transform: [
        { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [translateY, 0] }) },
        { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [fromScale, 1] }) },
      ],
    }),
    [progress, translateY, fromScale]
  );

  return { progress, style };
}
