import { Feather } from '@expo/vector-icons';
import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { formatWithMask, useMaskedInputProps } from 'react-native-mask-input';

import { PressableScale } from '@/components/appointment/AppointmentUI';
import { FormInput } from '@/components/ui/FormInput';
import { createThemedStyles, FontSize, Palette, Radius } from '@/theme';
import { CountryPickerSheet } from './CountryPickerSheet';
import { buildPhoneMask, digitsOnly, getCountryOption, getPhonePlaceholder, type CountryCode } from './phone-utils';

type Props = {
  country: CountryCode;
  onChangeCountry: (iso2: CountryCode) => void;
  /** Raw digits typed so far — the parent owns this, formatting is display-only here. */
  rawValue: string;
  onChangeRawValue: (raw: string) => void;
  returnKeyType?: 'next' | 'done';
  onSubmitEditing?: () => void;
};

/**
 * A WhatsApp-style dial-code selector + national number field.
 *
 * Live masking, cursor placement, mid-string deletion and paste are all
 * delegated to `react-native-mask-input` via `useMaskedInputProps` — not
 * hand-rolled. Three prior attempts at doing this ourselves (feeding
 * AsYouType the wrong text, tracking the cursor through onSelectionChange,
 * then diffing text by hand) each fixed one symptom and left the underlying
 * issue: any of those approaches actively *computes and reassigns* the
 * cursor position on every keystroke, and that's exactly where the reversed/
 * jumping-cursor behaviour kept coming from. `useMaskedInputProps`
 * deliberately does not touch `selection` at all for a plain mask (see its
 * source: `selection: undefined` in the non-obfuscated case) — it lets the
 * platform's own native cursor behaviour stand, which is what every native
 * masked field (Contacts, Phone, WhatsApp) actually relies on. That's a
 * well-exercised library default, not a guess.
 *
 * libphonenumber-js is still doing exactly what it's best at — parsing,
 * validating, converting to E.164 (see phone-utils.ts) — just no longer
 * anywhere near the keystroke path. Its only role here is building the
 * per-country mask shape once (`buildPhoneMask`, memoized on country).
 */
export const PhoneField = forwardRef<TextInput, Props>(function PhoneField(
  { country, onChangeCountry, rawValue, onChangeRawValue, returnKeyType = 'next', onSubmitEditing },
  ref
) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const mask = useMemo(() => buildPhoneMask(country), [country]);
  const option = useMemo(() => getCountryOption(country), [country]);
  const placeholder = useMemo(() => getPhonePlaceholder(country), [country]);

  // The masked text is local state — the mask library owns it end to end;
  // the parent only ever hears the raw digits (onChangeRawValue below).
  const [masked, setMasked] = useState(() => formatWithMask({ text: rawValue, mask }).masked);

  // Country switch: reformat the same digits under the new country's shape.
  useEffect(() => {
    setMasked(formatWithMask({ text: rawValue, mask }).masked);
    // Reacts only to the country changing; a rawValue change from typing is
    // already applied synchronously by handleChangeText below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country, mask]);

  const handleChangeText = useCallback(
    (newMasked: string, newUnmasked: string) => {
      setMasked(newMasked);
      onChangeRawValue(digitsOnly(newUnmasked));
    },
    [onChangeRawValue]
  );

  const maskedInputProps = useMaskedInputProps({ value: masked, onChangeText: handleChangeText, mask });

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
          {...maskedInputProps}
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

const styles = createThemedStyles(() => StyleSheet.create({
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
}));
