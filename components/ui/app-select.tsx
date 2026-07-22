import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ControlSize, IconSize, Palette, Radius, Spacing } from '@/constants/design';
import { AppBottomSheet } from './app-bottom-sheet';
import { AppDivider } from './app-divider';
import { AppText } from './app-text';
import { PressableScale } from './pressable-scale';

export type SelectOption<T extends string = string> = {
  label: string;
  value: T;
};

export type AppSelectProps<T extends string = string> = {
  /** Options presented in the picker sheet. */
  options: SelectOption<T>[];
  value?: T;
  onChange: (value: T) => void;
  placeholder?: string;
  /** Sheet title. */
  title?: string;
  invalid?: boolean;
  disabled?: boolean;
};

/**
 * A field that looks like AppInput but opens an AppBottomSheet to pick one
 * value. Keeps selection UX consistent instead of every screen wiring its own
 * dropdown. Built on the shared sheet + list primitives.
 */
export function AppSelect<T extends string = string>({
  options,
  value,
  onChange,
  placeholder = 'Sélectionner…',
  title,
  invalid = false,
  disabled = false,
}: AppSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <>
      <PressableScale
        accessibilityRole="button"
        accessibilityState={{ expanded: open, disabled }}
        disabled={disabled}
        pressScale={0.99}
        haptic={null}
        onPress={() => setOpen(true)}
        style={[
          styles.field,
          { borderColor: invalid ? Palette.notification : Palette.border },
          disabled ? styles.disabled : null,
        ]}>
        <AppText
          variant="body"
          color={selected ? 'primary' : 'tertiary'}
          style={styles.value}
          numberOfLines={1}>
          {selected ? selected.label : placeholder}
        </AppText>
        <Feather name="chevron-down" size={IconSize.lg} color={Palette.textTertiary} />
      </PressableScale>

      <AppBottomSheet visible={open} onClose={() => setOpen(false)} title={title}>
        {options.map((option, index) => {
          const active = option.value === value;
          return (
            <View key={option.value}>
              {index > 0 ? <AppDivider /> : null}
              <PressableScale
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                pressScale={0.99}
                haptic={null}
                onPress={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                style={styles.option}>
                <AppText variant="body" color={active ? 'accent' : 'primary'}>
                  {option.label}
                </AppText>
                {active ? <Feather name="check" size={IconSize.lg} color={Palette.blue} /> : null}
              </PressableScale>
            </View>
          );
        })}
      </AppBottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: ControlSize.lg,
    backgroundColor: Palette.card,
    borderRadius: Radius.tile,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  disabled: {
    opacity: 0.5,
  },
  value: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
  },
});
