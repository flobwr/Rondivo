import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette, Radius, Spacing } from '@/constants/design';
import { actionShadow } from '@/constants/shadow';
import { useEntrance } from '@/hooks/use-entrance';
import { usePressScale } from '@/hooks/use-press-scale';

type Props = {
  onPlan?: () => void;
};

export function EmptyState({ onPlan }: Props) {
  const { progress: enter } = useEntrance({ spring: { friction: 8, tension: 70 } });
  const { scale: pressScale, onPressIn, onPressOut } = usePressScale({
    to: 0.96,
    haptic: Haptics.ImpactFeedbackStyle.Medium,
  });

  const translateY = enter.interpolate({ inputRange: [0, 1], outputRange: [12, 0] });

  return (
    <Animated.View style={[styles.wrapper, { opacity: enter, transform: [{ translateY }] }]}>
      {/* minimalist illustration */}
      <View style={styles.illustration}>
        <View style={styles.iconRing}>
          <Feather name="calendar" size={28} color={Palette.blue} />
        </View>
      </View>

      <Text style={styles.title}>Journée libre</Text>
      <Text style={styles.subtitle}>Aucune intervention planifiée ce jour.</Text>

      <Animated.View style={{ transform: [{ scale: pressScale }] }}>
        <Pressable
          style={styles.button}
          hitSlop={8}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={onPlan}>
          <Feather name="plus" size={17} color={Palette.white} />
          <Text style={styles.buttonText}>Planifier une intervention</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    paddingHorizontal: Spacing.screen,
    paddingTop: 64,
  },
  illustration: {
    marginBottom: 20,
  },
  iconRing: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: Palette.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
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
