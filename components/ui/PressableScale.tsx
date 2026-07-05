import * as Haptics from 'expo-haptics';
import { useRef, type ReactNode } from 'react';
import { Animated, Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { PressSpring } from '@/constants/animation';

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
}: {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  to?: number;
  accessibilityLabel?: string;
  haptic?: boolean;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, { toValue: to, useNativeDriver: true, ...PressSpring.in }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, ...PressSpring.out }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled || !onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={accessibilityLabel}>
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}
