import * as Haptics from 'expo-haptics';
import { useRef, type ReactNode } from 'react';
import { Animated, Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { PressSpring } from '@/constants/animation';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

// Default touch-area padding for every PressableScale that doesn't already
// meet the ~48px minimum visually — most call sites are icon-sized (32-44px),
// this closes the gap without changing any layout.
const DEFAULT_HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

/**
 * The one canonical press-feedback wrapper used app-wide — a subtle native-style
 * scale + light haptic. Re-exported by the Documents, Clients-detail and
 * Appointment shared-primitives modules so existing imports keep working.
 */
export function PressableScale({
  children,
  onPress,
  style,
  disabled,
  to = 0.97,
  accessibilityLabel,
  haptic = true,
  hitSlop = DEFAULT_HIT_SLOP,
}: {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  to?: number;
  accessibilityLabel?: string;
  haptic?: boolean;
  hitSlop?: PressableProps['hitSlop'];
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const reducedMotion = useReducedMotion();

  const onPressIn = () => {
    if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (reducedMotion) return;
    Animated.spring(scale, { toValue: to, useNativeDriver: true, ...PressSpring.in }).start();
  };
  const onPressOut = () => {
    if (reducedMotion) return;
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, ...PressSpring.out }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled || !onPress}
      hitSlop={hitSlop}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={accessibilityLabel}>
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}
