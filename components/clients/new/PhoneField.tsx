import { Feather } from '@expo/vector-icons';
import { forwardRef, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type NativeSyntheticEvent,
  type TextInputSelectionChangeEventData,
} from 'react-native';

import { PressableScale } from '@/components/appointment/AppointmentUI';
import { FormInput } from '@/components/ui/FormInput';
import { FontSize, Palette, Radius } from '@/constants/design';
import { CountryPickerSheet } from './CountryPickerSheet';
import {
  diffEditRegion,
  digitsOnly,
  formatNational,
  getCountryOption,
  getPhonePlaceholder,
  indexAfterDigitCount,
  type CountryCode,
} from './phone-utils';

type Props = {
  country: CountryCode;
  onChangeCountry: (iso2: CountryCode) => void;
  /** Raw digits typed so far — the parent owns this, formatting is display-only here. */
  rawValue: string;
  onChangeRawValue: (raw: string) => void;
  returnKeyType?: 'next' | 'done';
  onSubmitEditing?: () => void;
};

// A WhatsApp-style dial-code selector + national number field. Formatting and
// validation both come from libphonenumber-js's AsYouType (see phone-utils.ts),
// re-run on every keystroke — so every supported country gets its own real
// grouping, not a guessed one.
export const PhoneField = forwardRef<TextInput, Props>(function PhoneField(
  { country, onChangeCountry, rawValue, onChangeRawValue, returnKeyType = 'next', onSubmitEditing },
  ref
) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selection, setSelection] = useState<{ start: number; end: number } | undefined>(undefined);

  const option = getCountryOption(country);
  // What's on screen *this render*, before whatever keystroke is about to
  // happen — `handleChangeText` below closes over this exact value, so it
  // always diffs against the right "before" state with no ref/event needed.
  const displayValue = formatNational(rawValue, country);
  const placeholder = getPhonePlaceholder(country);

  // Switching country reformats the same digits under new rules (handled by
  // the `displayValue` recompute above); just let the cursor go back to
  // wherever RN puts it by default rather than keep a now-stale index.
  useEffect(() => {
    setSelection(undefined);
  }, [country]);

  // Only used so a manual tap-to-reposition isn't fought on the next render —
  // never consulted for the reformat-cursor math below (see diffEditRegion's
  // doc comment for why that would be unreliable).
  const handleSelectionChange = (e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
    setSelection(e.nativeEvent.selection);
  };

  // AsYouType always runs on pure digits extracted fresh from whatever the
  // native field reports — never on text that already contains the spaces/
  // parens it previously inserted, which is what silently broke live
  // reformatting. The cursor is relocated by diffing this render's displayed
  // text against the new text: that pinpoints exactly what was typed/deleted
  // and where, so a separator appearing mid-typing doesn't shove the cursor
  // to the wrong spot.
  const handleChangeText = (nativeText: string) => {
    const { position, insertedCount } = diffEditRegion(displayValue, nativeText);
    const digitsBeforeEdit = digitsOnly(displayValue.slice(0, position)).length;
    const insertedDigits = digitsOnly(nativeText.slice(position, position + insertedCount)).length;

    const digits = digitsOnly(nativeText);
    onChangeRawValue(digits);

    const reformatted = formatNational(digits, country);
    const nextCursor = indexAfterDigitCount(reformatted, digitsBeforeEdit + insertedDigits);
    setSelection({ start: nextCursor, end: nextCursor });
  };

  return (
    <View style={styles.row}>
      <PressableScale onPress={() => setPickerOpen(true)} to={0.96} style={styles.countryBtn} accessibilityLabel="Choisir l'indicatif">
        <Text style={styles.flag}>{option?.flag}</Text>
        <Text style={styles.callingCode}>+{option?.callingCode}</Text>
        <Feather name="chevron-down" size={13} color={Palette.textTertiary} />
      </PressableScale>

      <View style={styles.flex}>
        <FormInput
          ref={ref}
          value={displayValue}
          onChangeText={handleChangeText}
          onSelectionChange={handleSelectionChange}
          selection={selection}
          placeholder={placeholder}
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          autoComplete="tel"
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
        />
      </View>

      <CountryPickerSheet visible={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={onChangeCountry} selected={country} />
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  flex: { flex: 1 },
  countryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Palette.card,
    borderRadius: Radius.tile,
    paddingHorizontal: 11,
    borderWidth: 1.5,
    borderColor: Palette.border,
  },
  flag: {
    fontSize: 18,
  },
  callingCode: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
  },
});
