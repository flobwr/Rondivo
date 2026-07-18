import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { Palette, Spacing, type PaletteShape } from '@/theme';
import { FeatherIconName } from '../types';
import { PressableScale } from './primitives';
import { Feather } from '@expo/vector-icons';

export function EmptyState({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
  palette = Palette,
}: {
  icon: FeatherIconName;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
  /** Defaults to the static light palette — pass the live `useTheme().palette`
   *  on screens that have opted into dark mode. */
  palette?: PaletteShape;
}) {
  const enter = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(enter, { toValue: 1, useNativeDriver: true, friction: 8, tension: 70 }).start();
  }, [enter]);
  const translateY = enter.interpolate({ inputRange: [0, 1], outputRange: [12, 0] });

  return (
    <Animated.View style={[styles.wrapper, { opacity: enter, transform: [{ translateY }] }]}>
      <View style={[styles.iconRing, { backgroundColor: palette.blueSoft }]}>
        <Feather name={icon} size={26} color={palette.blue} />
      </View>
      <Text style={[styles.title, { color: palette.textPrimary }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: palette.textSecondary }]}>{subtitle}</Text>
      {actionLabel && onAction ? (
        <PressableScale onPress={onAction} to={0.96} style={[styles.button, { backgroundColor: palette.blue }]} accessibilityLabel={actionLabel}>
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </PressableScale>
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
  iconRing: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: Palette.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
    marginTop: 6,
    marginBottom: 22,
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 20,
  },
  button: {
    backgroundColor: Palette.blue,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  buttonText: {
    color: Palette.white,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});
