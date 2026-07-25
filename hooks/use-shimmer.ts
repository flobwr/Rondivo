import { useEffect, useMemo, useRef } from 'react';
import { Animated } from 'react-native';

import { Duration, ShimmerColors } from '@/constants/motion';

/**
 * Looping shimmer colour for skeleton loaders.
 *
 * Intentionally takes no options: there is one loading pulse in Rondivo. Home
 * and Planning used to breathe at 950 ms and 900 ms with two different
 * highlight colours — a difference nobody chose and everybody could feel.
 *
 * Note: colour interpolation cannot use the native driver, so this runs on the
 * JS driver. That is fine for a slow two-stop loop.
 */
export function useShimmer() {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: Duration.shimmer,
          useNativeDriver: false,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: Duration.shimmer,
          useNativeDriver: false,
        }),
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
