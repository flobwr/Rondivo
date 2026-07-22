import { useEffect, useMemo, useRef } from 'react';
import { Animated } from 'react-native';

import { Duration, ShimmerColors } from '@/constants/motion';

type Options = {
  /** Loop half-period in ms. Defaults to the shared shimmer duration. */
  duration?: number;
  /** Start colour of the pulse. Defaults to the shared token. */
  from?: string;
  /** End colour of the pulse. Defaults to the shared token. */
  to?: string;
};

/**
 * Looping shimmer colour for skeleton loaders.
 *
 * Replaces the two near-identical shimmer loops (home `SkeletonBlock` and
 * planning `LoadingState`). Returns an animated `backgroundColor` to spread onto
 * an Animated.View. `from`/`to` let a caller keep an exact legacy colour while
 * the duplicated loop disappears.
 *
 * Note: colour interpolation cannot use the native driver, so this intentionally
 * runs on the JS driver — matching the existing skeleton implementations.
 */
export function useShimmer(options: Options = {}) {
  const { duration = Duration.shimmer, from = ShimmerColors.from, to = ShimmerColors.to } = options;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, { toValue: 1, duration, useNativeDriver: false }),
        Animated.timing(progress, { toValue: 0, duration, useNativeDriver: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [progress, duration]);

  const backgroundColor = useMemo(
    () => progress.interpolate({ inputRange: [0, 1], outputRange: [from, to] }),
    [progress, from, to]
  );

  return { backgroundColor };
}
