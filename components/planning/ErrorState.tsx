import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette, Radius, Spacing } from '@/constants/design';
import { actionShadow } from '@/constants/shadow';

type Props = {
  onRetry?: () => void;
};

export function ErrorState({ onRetry }: Props) {
  const pressScale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.spring(pressScale, { toValue: 0.96, useNativeDriver: true, friction: 6, tension: 300 }).start();
  };
  const onPressOut = () => {
    Animated.spring(pressScale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.iconRing}>
        <Feather name="wifi-off" size={26} color={Palette.textSecondary} />
      </View>

      <Text style={styles.title}>Connexion perdue</Text>
      <Text style={styles.subtitle}>Impossible de charger le planning pour le moment.</Text>

      <Animated.View style={{ transform: [{ scale: pressScale }] }}>
        <Pressable
          style={styles.button}
          hitSlop={8}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={onRetry}>
          <Feather name="refresh-cw" size={16} color={Palette.white} />
          <Text style={styles.buttonText}>Réessayer</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    paddingHorizontal: Spacing.screen,
    paddingTop: 64,
  },
  iconRing: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: Palette.cardMuted,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 19,
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
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Palette.blue,
    borderRadius: Radius.pill,
    paddingHorizontal: 20,
    paddingVertical: 13,
    ...actionShadow,
  },
  buttonText: {
    color: Palette.white,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});
