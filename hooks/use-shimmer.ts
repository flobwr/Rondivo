import { useEffect, useMemo, useRef } from 'react';
import { Animated } from 'react-native';

import { Duration, ShimmerColors } from '@/constants/motion';

/**
 * Looping shimmer colour for skeleton loaders.
 *
 * Replaces the two near-identical shimmer loops (home `SkeletonBlock` and
 * planning `LoadingState`). Returns an animated `backgroundColor` to spread onto
 * an Animated.View.
 *
 * Note: colour interpolation cannot use the native driver, so this intentionally
 * runs on the JS driver — matching the existing skeleton implementations.
 */
export function useShimmer() {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, { toValue: 1, duration: Duration.shimmer, useNativeDriver: false }),
        Animated.timing(progress, { toValue: 0, duration: Duration.shimmer, useNativeDriver: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [progress]);

  const backgroundColor = useMemo(
    () =>
      progress.interpolate({
        inputRange: [0, 1],
        outputRange: [ShimmerColors.from, ShimmerColors.to],
      }),
    [progress]
  );

  return { backgroundColor };
}
