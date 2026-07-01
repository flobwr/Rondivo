import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { Palette, Radius } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';

function Shimmer({ style }: { style?: object }) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 850, useNativeDriver: false }),
        Animated.timing(shimmer, { toValue: 0, duration: 850, useNativeDriver: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [shimmer]);

  const backgroundColor = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: ['#EAEEF4', '#DCE2EB'],
  });

  return <Animated.View style={[{ backgroundColor }, style]} />;
}

/** A single skeleton card that mirrors {@link ClientCard} so the load feels seamless. */
export function ClientCardSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Shimmer style={styles.avatar} />
        <View style={styles.identity}>
          <Shimmer style={[styles.line, { width: '55%' }]} />
          <Shimmer style={[styles.line, styles.badge, { width: '38%' }]} />
        </View>
      </View>

      <Shimmer style={[styles.line, styles.address, { width: '72%' }]} />
      <Shimmer style={[styles.line, styles.highlight, { width: '50%' }]} />

      <View style={styles.divider} />

      <View style={styles.footer}>
        <Shimmer style={[styles.line, { width: 90 }]} />
        <Shimmer style={[styles.line, { width: 60 }]} />
      </View>
      <View style={styles.actions}>
        <Shimmer style={styles.circle} />
        <Shimmer style={styles.circle} />
      </View>
    </View>
  );
}

/** A short stack of skeleton cards for the initial page load. */
export function ClientListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <View style={styles.list}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={i > 0 ? styles.gap : null}>
          <ClientCardSkeleton />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingTop: 4,
  },
  gap: {
    marginTop: 12,
  },
  card: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingVertical: 15,
    paddingHorizontal: 16,
    ...cardShadow,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  identity: {
    flex: 1,
    marginLeft: 12,
    gap: 8,
  },
  line: {
    height: 11,
    borderRadius: 6,
  },
  badge: {
    height: 16,
    borderRadius: 8,
  },
  address: {
    marginTop: 14,
  },
  highlight: {
    marginTop: 12,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.border,
    marginVertical: 14,
  },
  footer: {
    flexDirection: 'row',
    gap: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  circle: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
});
