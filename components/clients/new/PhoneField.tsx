import { Feather } from '@expo/vector-icons';
import { forwardRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { PressableScale } from '@/components/appointment/AppointmentUI';
import { FormInput } from '@/components/ui/FormInput';
import { FontSize, Palette, Radius } from '@/constants/design';
import { CountryPickerSheet } from './CountryPickerSheet';
import { formatNational, getCountryOption, type CountryCode } from './phone-utils';

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
// validation both come from libphonenumber-js (see phone-utils.ts) so every
// supported country gets its own real grouping, not a guessed one.
export const PhoneField = forwardRef<TextInput, Props>(function PhoneField(
  { country, onChangeCountry, rawValue, onChangeRawValue, returnKeyType = 'next', onSubmitEditing },
  ref
) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const option = getCountryOption(country);
  const displayValue = formatNational(rawValue, country);

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
          onChangeText={onChangeRawValue}
          placeholder="6 12 34 56 78"
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
