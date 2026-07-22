import { StyleSheet, View, ViewProps } from 'react-native';

import { Palette, Spacing } from '@/constants/design';
import { AppText } from './app-text';

export type AppFormFieldProps = ViewProps & {
  label?: string;
  /** Helper text shown under the control when there's no error. */
  hint?: string;
  /** Error message — replaces the hint and turns red. */
  error?: string;
  /** Mark the label with a required asterisk. */
  required?: boolean;
  children: React.ReactNode;
};

/**
 * Wraps any control (AppInput, AppSelect, a toggle…) with a label, optional
 * hint and an error slot. Keeping label/error layout here means every form row
 * across the app aligns identically.
 */
export function AppFormField({
  label,
  hint,
  error,
  required = false,
  style,
  children,
  ...rest
}: AppFormFieldProps) {
  return (
    <View style={[styles.wrapper, style]} {...rest}>
      {label ? (
        <AppText variant="subheadStrong" color="secondary" style={styles.label}>
          {label}
          {required ? <AppText variant="subheadStrong" color="accent"> *</AppText> : null}
        </AppText>
      ) : null}
      {children}
      {error ? (
        <AppText variant="caption" style={[styles.message, styles.error]}>
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption" color="tertiary" style={styles.message}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.sm,
  },
  label: {
    marginLeft: Spacing.xs,
  },
  message: {
    marginLeft: Spacing.xs,
  },
  error: {
    color: Palette.notification,
  },
});
