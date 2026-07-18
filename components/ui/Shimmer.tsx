import { useEffect, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';

import { ShimmerDuration } from '@/theme';

const SHIMMER_COLORS: [string, string] = ['#E8ECF2', '#CED4DE'];

/** The one canonical ambient shimmer used by every skeleton/loading state in the app. */
export function Shimmer({ style }: { style?: StyleProp<ViewStyle> }) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: ShimmerDuration, useNativeDriver: false }),
        Animated.timing(shimmer, { toValue: 0, duration: ShimmerDuration, useNativeDriver: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [shimmer]);

  const backgroundColor = shimmer.interpolate({ inputRange: [0, 1], outputRange: SHIMMER_COLORS });

  return <Animated.View style={[{ backgroundColor }, style]} />;
}

/** A rectangular shimmer block — the common case (a skeleton "line" or "tile"). */
export function SkeletonBlock({
  height,
  radius = 12,
  style,
}: {
  height: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return <Shimmer style={[{ height, borderRadius: radius }, style]} />;
}
