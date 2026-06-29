import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { Palette, Radius, Spacing } from '@/constants/design';

function Shimmer({ style }: { style?: object }) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: false }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [shimmer]);

  const backgroundColor = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E8ECF2', '#D6DCE6'],
  });

  return <Animated.View style={[{ backgroundColor }, style]} />;
}

// Skeleton that mirrors the timeline layout so the load feels seamless.
export function LoadingState() {
  return (
    <View style={styles.container}>
      {[0, 1, 2, 3].map((i) => (
        <View key={i} style={styles.row}>
          <View style={styles.gutter}>
            <Shimmer style={styles.timePill} />
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
    paddingTop: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  gutter: {
    width: 50,
    alignItems: 'center',
    paddingTop: 14,
  },
  timePill: {
    width: 30,
    height: 11,
    borderRadius: 6,
    marginBottom: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Palette.border,
  },
  card: {
    flex: 1,
    height: 76,
    borderRadius: Radius.card,
  },
});
