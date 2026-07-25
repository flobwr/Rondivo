import { ReactNode } from 'react';
import { Animated, StyleSheet } from 'react-native';

import { Spacing } from '@/theme';
import { useEntrance } from '@/hooks/use-entrance';

type Props = {
  index?: number;
  children: ReactNode;
};

// The same entrance as the Planning timeline cards — literally the same hook,
// so the detail screen cannot drift away from the rest of the app.
export function AnimatedSection({ index = 0, children }: Props) {
  const { style } = useEntrance({ index, fromScale: 1 });

  return <Animated.View style={[styles.section, style]}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  section: {
    marginTop: Spacing.section,
  },
});
