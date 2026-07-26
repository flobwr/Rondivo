import { Animated, StyleSheet, View } from 'react-native';

import { Palette, Radius, Spacing } from '@/constants/design';
import { useShimmer } from '@/hooks/use-shimmer';

function Shimmer({ style }: { style?: object }) {
  // Exact legacy shimmer preserved (900ms, ShimmerColors from → to); only the
  // duplicated loop boilerplate is now shared via useShimmer.
  const { backgroundColor } = useShimmer({ duration: 900 });

  return <Animated.View style={[{ backgroundColor }, style]} />;
}

// Skeleton that mirrors the timeline layout so the load feels seamless.
export function LoadingState() {
  return (
    <View style={styles.container}>
      {[0, 1, 2, 3].map((i) => (
        <View key={i} style={styles.row}>
          <View style={styles.gutter}>
            <View style={styles.dot} />
          </View>
          <Shimmer style={styles.card} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.screen,
    paddingTop: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  gutter: {
    width: 40,
    alignItems: 'center',
    paddingTop: 12,
  },
  dot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Palette.border,
  },
  card: {
    flex: 1,
    height: 84,
    borderRadius: Radius.card,
    marginLeft: 14,
  },
});
