import { useEffect, useMemo, useRef } from 'react';
import { Animated } from 'react-native';

import { Spring, StaggerDelay } from '@/constants/motion';

type SpringConfig = { friction: number; tension: number };

type Options = {
  /** List position — drives a light staggered entrance (index * StaggerDelay). */
  index?: number;
  /** Vertical travel distance in px. Defaults to 10. */
  translateY?: number;
  /** Scale to animate up from. Defaults to 0.98 (set to 1 to disable scale). */
  fromScale?: number;
  /** Override the entrance spring. Defaults to the shared token. */
  spring?: SpringConfig;
};

/**
 * Gentle "fade + rise + settle" entrance used by planning cards, empty states
 * and travel legs. Consolidates the duplicated `enter` Animated.Value +
 * spring-with-delay pattern.
 *
 * Returns a ready-to-spread `style` object (opacity + transform) plus the raw
 * `progress` value for callers that need to compose additional interpolations
 * (e.g. muted cards multiplying opacity).
 */
export function useEntrance(options: Options = {}) {
  const { index = 0, translateY = 10, fromScale = 0.98, spring = Spring.entrance } = options;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.spring(progress, {
      toValue: 1,
      useNativeDriver: true,
      delay: index * StaggerDelay,
      ...spring,
    });
    animation.start();
    return () => animation.stop();
  }, [index, progress, spring]);

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
