import { Feather } from '@expo/vector-icons';
import { forwardRef, useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import {
  ControlSize,
  FontSize,
  IconSize,
  LetterSpacing,
  Palette,
  Radius,
  Spacing,
} from '@/constants/design';

type FeatherName = React.ComponentProps<typeof Feather>['name'];

export type AppInputProps = TextInputProps & {
  /** Leading icon inside the field. */
  icon?: FeatherName;
  /** Trailing node (e.g. a clear button). */
  trailing?: React.ReactNode;
  /** Error state — red border + tint. */
  invalid?: boolean;
};

/**
 * The single text-field primitive: consistent height, radius, border, focus
 * ring and placeholder colour, all from tokens. Wrap it in AppFormField to add
 * a label and error message.
 */
export const AppInput = forwardRef<TextInput, AppInputProps>(function AppInput(
  { icon, trailing, invalid = false, style, onFocus, onBlur, ...rest },
  ref
) {
  const [focused, setFocused] = useState(false);

  const borderColor = invalid
    ? Palette.notification
    : focused
      ? Palette.blue
      : Palette.border;

  return (
    <View style={[styles.field, { borderColor }]}>
      {icon ? <Feather name={icon} size={IconSize.md} color={Palette.textTertiary} style={styles.icon} /> : null}
      <TextInput
        ref={ref}
        style={[styles.input, style]}
        placeholderTextColor={Palette.textTertiary}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />
      {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: ControlSize.lg,
    backgroundColor: Palette.card,
    borderRadius: Radius.tile,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.lg,
  },
  icon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: FontSize.body,
    color: Palette.textPrimary,
    letterSpacing: LetterSpacing.slight,
  },
  trailing: {
    marginLeft: Spacing.sm,
  },
});
