import { Feather } from '@expo/vector-icons';
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { PressableScale } from '@/components/appointment/AppointmentUI';
import { FormInput } from '@/components/ui/FormInput';
import { FontSize, Palette, Radius } from '@/constants/design';
import { CountryPickerSheet } from './CountryPickerSheet';
import { diffEditRegion, digitsOnly, formatNational, getCountryOption, getPhonePlaceholder, indexAfterDigitCount, type CountryCode } from './phone-utils';

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
 * A WhatsApp-style dial-code selector + national number field, reformatted
 * live via libphonenumber-js's AsYouType.
 *
 * The displayed text and the cursor are both *local* state, set together in
 * a single call inside the same keystroke handler — so React commits them in
 * one batch, in one render, and RN's TextInput applies both natively in the
 * same pass. The parent is still notified (`onChangeRawValue`) for its own
 * purposes — the footer preview, E.164 computation at submit — but that's a
 * separate, independent update this field's own redraw never waits on.
 * That decoupling is what removes the flash/jump: previously the displayed
 * text was *derived from the parent's state* on every keystroke, so the
 * field's own redraw was hostage to the parent re-rendering everything else
 * (footer, avatar…) first.
 *
 * `display`/`country` are also mirrored into refs, read (and written)
 * synchronously inside the handler instead of the closed-over state value —
 * two keystrokes fired back-to-back, faster than React can re-render between
 * them, would otherwise diff the second one against a stale "before" string.
 * That also keeps `handleChangeText` itself referentially stable (it no
 * longer needs `display`/`country` in its dependency array), so AsYouType is
 * only ever constructed inside an actual keystroke/country-change handler —
 * never as a side effect of some unrelated re-render.
 */
export const PhoneField = forwardRef<TextInput, Props>(function PhoneField(
  { country, onChangeCountry, rawValue, onChangeRawValue, returnKeyType = 'next', onSubmitEditing },
  ref
) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [display, setDisplay] = useState(() => formatNational(rawValue, country));
  const [selection, setSelection] = useState<{ start: number; end: number } | undefined>(undefined);

  const displayRef = useRef(display);
  const countryRef = useRef(country);
  countryRef.current = country;

  const option = useMemo(() => getCountryOption(country), [country]);
  const placeholder = useMemo(() => getPhonePlaceholder(country), [country]);

  // The only other time the displayed text should change: switching country
  // via the picker reformats whatever digits are already there under the new
  // country's rules.
  useEffect(() => {
    const reformatted = formatNational(rawValue, country);
    displayRef.current = reformatted;
    setDisplay(reformatted);
    setSelection(undefined);
    // Reacts only to the country changing; a rawValue change from typing is
    // already applied synchronously by handleChangeText below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country]);

  const handleChangeText = useCallback(
    (nativeText: string) => {
      // Diffs this keystroke's result against what was just on screen to
      // find exactly what changed and where — independent of any selection
      // event, whose ordering relative to onChangeText isn't guaranteed
      // (see diffEditRegion's doc comment).
      const before = displayRef.current;
      const { position, insertedCount } = diffEditRegion(before, nativeText);
      const digitsBeforeEdit = digitsOnly(before.slice(0, position)).length;
      const insertedDigits = digitsOnly(nativeText.slice(position, position + insertedCount)).length;

      const digits = digitsOnly(nativeText);
      const reformatted = formatNational(digits, countryRef.current);
      const nextCursor = indexAfterDigitCount(reformatted, digitsBeforeEdit + insertedDigits);

      displayRef.current = reformatted;
      setDisplay(reformatted);
      setSelection({ start: nextCursor, end: nextCursor });
      onChangeRawValue(digits);
    },
    [onChangeRawValue]
  );

  // Only for a manual tap-to-reposition (no text change) — mirrors reality
  // back into state so a stale `selection` never fights the user's own tap.
  const handleSelectionChange = useCallback((e: { nativeEvent: { selection: { start: number; end: number } } }) => {
    setSelection(e.nativeEvent.selection);
  }, []);

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
          value={display}
          selection={selection}
          onChangeText={handleChangeText}
          onSelectionChange={handleSelectionChange}
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
