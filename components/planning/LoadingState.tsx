import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

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
    outputRange: ['#E8ECF2', '#DDE2EA'],
  });

  return <Animated.View style={[{ backgroundColor }, style]} />;
}

// Skeleton that mirrors the loaded layout — rail dots and tall cards — so the
// load feels seamless.
export function LoadingState() {
  return (
    <View style={styles.container}>
      {[0, 1, 2].map((i) => (
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
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  gutter: {
    width: 36,
    paddingTop: 17,
    alignItems: 'center',
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E3E7ED',
  },
  card: {
    flex: 1,
    height: 100,
    borderRadius: 24,
  },
});
