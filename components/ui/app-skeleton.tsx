import { Animated, DimensionValue, StyleProp, ViewStyle } from 'react-native';

import { Radius } from '@/constants/design';
import { useShimmer } from '@/hooks/use-shimmer';

export type AppSkeletonProps = {
  width?: DimensionValue;
  height?: number;
  /** Corner radius token or raw number. Defaults to the `tile` radius. */
  radius?: keyof typeof Radius | number;
  style?: StyleProp<ViewStyle>;
};

/**
 * A single shimmering placeholder block. Compose several to mirror a screen's
 * real layout while it loads. Replaces the two bespoke shimmer blocks (home
 * `SkeletonBlock`, planning `LoadingState`'s `Shimmer`).
 */
export function AppSkeleton({ width = '100%', height = 16, radius = 'tile', style }: AppSkeletonProps) {
  const { backgroundColor } = useShimmer();
  const borderRadius = typeof radius === 'number' ? radius : Radius[radius];

  return <Animated.View style={[{ width, height, borderRadius, backgroundColor }, style]} />;
}
