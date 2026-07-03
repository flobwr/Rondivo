import { Feather } from '@expo/vector-icons';
import { forwardRef, useRef } from 'react';
import { Animated, StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { type FeatherIconName } from '@/components/clients/types';
import { FontSize, Palette, Radius } from '@/constants/design';

type FormInputProps = Omit<TextInputProps, 'style' | 'placeholderTextColor'> & {
  icon?: FeatherIconName;
  multiline?: boolean;
};

/**
 * The one text input used across Rondivo's forms (appointment notes today,
 * every field of the client form). A hairline border by default; on focus it
 * eases to the accent blue with a light spring — the "animations de focus"
 * micro-interaction, centralised so every future form gets it for free.
 */
export const FormInput = forwardRef<TextInput, FormInputProps>(function FormInput(
  { icon, multiline, onFocus, onBlur, ...props },
  ref
) {
  const focus = useRef(new Animated.Value(0)).current;

  const handleFocus: TextInputProps['onFocus'] = (e) => {
    Animated.spring(focus, { toValue: 1, useNativeDriver: false, friction: 9, tension: 140 }).start();
    onFocus?.(e);
  };
  const handleBlur: TextInputProps['onBlur'] = (e) => {
    Animated.spring(focus, { toValue: 0, useNativeDriver: false, friction: 9, tension: 140 }).start();
    onBlur?.(e);
  };

  const borderColor = focus.interpolate({ inputRange: [0, 1], outputRange: [Palette.border, Palette.blue] });
  const iconColor = focus.interpolate({ inputRange: [0, 1], outputRange: [Palette.textTertiary as string, Palette.blue as string] });

  return (
    <Animated.View style={[styles.box, multiline && styles.boxMultiline, { borderColor }]}>
      {icon ? (
        <Animated.View style={styles.icon}>
          <AnimatedFeather name={icon} size={16} color={iconColor} />
        </Animated.View>
      ) : null}
      <TextInput
        ref={ref}
        style={[styles.input, multiline && styles.inputMultiline]}
        placeholderTextColor={Palette.textTertiary}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
    </Animated.View>
  );
});

const AnimatedFeather = Animated.createAnimatedComponent(Feather);

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Palette.card,
    borderRadius: Radius.tile,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1.5,
  },
  boxMultiline: {
    alignItems: 'flex-start',
    minHeight: 80,
    paddingVertical: 14,
  },
  icon: {
    width: 16,
  },
  input: {
    flex: 1,
    fontSize: FontSize.label,
    fontWeight: '500',
    color: Palette.textPrimary,
    padding: 0,
  },
  inputMultiline: {
    minHeight: 52,
    textAlignVertical: 'top',
  },
});
