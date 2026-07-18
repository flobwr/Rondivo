import { ReactNode, useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

import { Spacing } from '@/theme';

type Props = {
  index?: number;
  children: ReactNode;
};

// Same staggered spring entrance used by the Planning timeline cards — gives
// the detail screen the same fluid, premium feel as the rest of the app.
export function AnimatedSection({ index = 0, children }: Props) {
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(enter, {
      toValue: 1,
      useNativeDriver: true,
      friction: 9,
      tension: 80,
      delay: index * 40,
    }).start();
  }, [enter, index]);

  const translateY = enter.interpolate({ inputRange: [0, 1], outputRange: [14, 0] });

  return (
    <Animated.View style={[styles.section, { opacity: enter, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: Spacing.section,
  },
});
