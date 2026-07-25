import { useEffect, useMemo, useRef } from 'react';
import { Animated } from 'react-native';

import {
  EntranceScale,
  EntranceTravel,
  StaggerDelay,
  Timing,
  type TimingToken,
} from '@/constants/motion';

type Options = {
  /** List position — drives a light staggered entrance (index * StaggerDelay). */
  index?: number;
  /** Vertical travel distance in px. Defaults to the shared token. */
  translateY?: number;
  /** Scale to animate up from. Defaults to the shared token (1 disables scale). */
  fromScale?: number;
  /** Override the motion token. Defaults to the card transition. */
  timing?: TimingToken;
};

/**
 * The "a card appeared" entrance: fade + a hint of rise + a hint of scale.
 *
 * Curve-based, not spring-based, and on purpose: an entrance is something the
 * app decides, not something the finger drives, so it belongs to the timing
 * side of the motion system (see constants/motion.ts). Every card in the app
 * therefore arrives in exactly 220 ms on exactly the same curve.
 *
 * Returns a ready-to-spread `style` (opacity + transform) plus the raw
 * `progress` value for callers composing extra interpolations — e.g. a
 * completed card multiplying opacity to step back visually.
 */
export function useEntrance(options: Options = {}) {
  const {
    index = 0,
    translateY = EntranceTravel,
    fromScale = EntranceScale,
    timing = Timing.card,
  } = options;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      useNativeDriver: true,
      delay: index * StaggerDelay,
      ...timing,
    });
    animation.start();
    return () => animation.stop();
  }, [index, progress, timing]);

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
