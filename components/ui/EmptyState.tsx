import { Feather } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { type IconName } from '@/components/ui/IconWell';
import { useTheme } from '@/contexts/theme';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { Radius, SettleSpring, Spacing, Type } from '@/theme';

/**
 * Rondivo empty/error state — one calm figure for every list without rows.
 *
 * A soft blue medallion, two lines of type, at most one action. Errors use
 * the same anatomy with a red-washed medallion (`tone="error"`) so failure
 * never introduces a new visual species. Rises into place with one soft
 * spring; static under reduced motion.
 */
export function EmptyState({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
  tone = 'default',
}: {
  icon: IconName;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: 'default' | 'error';
}) {
  const { palette } = useTheme();
  const reducedMotion = useReducedMotion();
  const enter = useRef(new Animated.Value(reducedMotion ? 1 : 0)).current;

  useEffect(() => {
    if (reducedMotion) return;
    Animated.spring(enter, { toValue: 1, useNativeDriver: true, ...SettleSpring }).start();
  }, [enter, reducedMotion]);

  const translateY = enter.interpolate({ inputRange: [0, 1], outputRange: [12, 0] });
  const wash = tone === 'error' ? palette.redSoft : palette.blueSoft;
  const ink = tone === 'error' ? palette.redInk : palette.blue;

  return (
    <Animated.View style={[styles.wrapper, { opacity: enter, transform: [{ translateY }] }]}>
      <View style={[styles.medallion, { backgroundColor: wash }]}>
        <Feather name={icon} size={26} color={ink} />
      </View>
      <Text style={[Type.heading, { color: palette.textPrimary, textAlign: 'center' }]}>
        {title}
      </Text>
      <Text style={[Type.footnote, styles.subtitle, { color: palette.textSecondary }]}>
        {subtitle}
      </Text>
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} compact fullWidth={false} />
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    paddingHorizontal: Spacing.screen,
    paddingTop: 56,
  },
  medallion: {
    width: 72,
    height: 72,
    borderRadius: Radius.card + 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl - 4,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 22,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
  },
});
