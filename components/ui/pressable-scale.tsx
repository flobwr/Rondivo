import { forwardRef } from 'react';
import {
  Animated,
  Pressable,
  PressableProps,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';

import { usePressScale } from '@/hooks/use-press-scale';
import { PressScale } from '@/constants/motion';

export type PressableScaleProps = PressableProps & {
  /** Target scale while pressed. Defaults to the "control" press scale. */
  pressScale?: number;
  /** Haptic style on press-in. Pass `null` to disable. */
  haptic?: Haptics.ImpactFeedbackStyle | null;
  /** Style applied to the animated inner view (the thing that scales). */
  style?: StyleProp<ViewStyle>;
};

/**
 * The one place press-scale animation lives. Every interactive primitive
 * (AppButton, AppCard, AppIconButton, AppListItem, AppChip…) is built on this
 * so the whole app shares a single, tuned press feel and a single haptics call.
 *
 * Behaves like a Pressable but animates a scale transform on the inner view.
 */
export const PressableScale = forwardRef<View, PressableScaleProps>(function PressableScale(
  { pressScale = PressScale.control, haptic, style, children, onPressIn: onPressInProp, onPressOut: onPressOutProp, ...rest },
  ref
) {
  const { scale, onPressIn, onPressOut } = usePressScale({ to: pressScale, haptic });

  return (
    <Pressable
      ref={ref}
      {...rest}
      onPressIn={(e) => {
        onPressIn();
        onPressInProp?.(e);
      }}
      onPressOut={(e) => {
        onPressOut();
        onPressOutProp?.(e);
      }}>
      {(state) => (
        <Animated.View style={[{ transform: [{ scale }] }, style]}>
          {typeof children === 'function' ? children(state) : children}
        </Animated.View>
      )}
    </Pressable>
  );
});
