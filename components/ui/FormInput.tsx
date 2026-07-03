import { Feather } from '@expo/vector-icons';
import { forwardRef, useRef } from 'react';
import { Animated, StyleSheet, TextInput, type TextInputProps, View } from 'react-native';

import { type FeatherIconName } from '@/components/clients/types';
import { FontSize, Palette, Radius } from '@/constants/design';

type FormInputProps = Omit<TextInputProps, 'style' | 'placeholderTextColor'> & {
  icon?: FeatherIconName;
  multiline?: boolean;
};

/**
 * The one text input used across Rondivo's forms. A hairline border by
 * default; on focus it eases to the accent blue with a light spring.
 *
 * The icon never goes through `Animated.createAnimatedComponent` — wrapping
 * @expo/vector-icons' `Feather` (a class component from react-native-vector-
 * icons' `createIconSet`) that way crashes under Fabric: Animated's JS-driven
 * driver (color interpolation has no native-driver equivalent) calls
 * `setNativeProps` on the wrapper's ref, but that ref resolves to the icon
 * instance before its internal `this._icon` glyph ref is attached, so the
 * call lands on `undefined` — "this._icon.setNativeProps is not a function".
 * Two plain, un-animated icons cross-fade instead: the opacity animation runs
 * on an `Animated.View` (a real host component with a stable native ref), and
 * it can use the native driver, so it's both correct and cheaper.
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

  return (
    <Animated.View style={[styles.box, multiline && styles.boxMultiline, { borderColor }]}>
      {icon ? (
        <View style={styles.icon}>
          <Feather name={icon} size={16} color={Palette.textTertiary} />
          <Animated.View style={[styles.iconOverlay, { opacity: focus }]}>
            <Feather name={icon} size={16} color={Palette.blue} />
          </Animated.View>
        </View>
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

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Palette.card,
    borderRadius: Radius.tile,
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderWidth: 1.5,
  },
  boxMultiline: {
    alignItems: 'flex-start',
    minHeight: 68,
    paddingVertical: 12,
  },
  icon: {
    width: 16,
    height: 16,
  },
  iconOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  input: {
    flex: 1,
    fontSize: FontSize.label,
    fontWeight: '500',
    color: Palette.textPrimary,
    padding: 0,
  },
  inputMultiline: {
    minHeight: 44,
    textAlignVertical: 'top',
  },
});
