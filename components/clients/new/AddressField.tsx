import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { FormInput } from '@/components/ui/FormInput';
import { createThemedStyles, FontSize, Palette, Radius } from '@/theme';
import { formatAddress, mockAddressProvider, type AddressProvider, type AddressSuggestion } from './address-provider';
import { easeLayout } from './client-form-utils';

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  onSubmitEditing?: () => void;
  /** Defaults to the local mock — pass a real Google Places/Mapbox/HERE-backed
   *  provider here later; the field itself never needs to change. */
  provider?: AddressProvider;
};

// Free text always works — the suggestion list below is a fast path, not a
// gate. Selecting a suggestion just fills the same field faster.
export const AddressField = forwardRef<TextInput, Props>(function AddressField(
  { value, onChangeText, onSubmitEditing, provider = mockAddressProvider },
  ref
) {
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState<AddressSuggestion[]>([]);
  const requestRef = useRef(0);

  useEffect(() => {
    if (!focused) {
      setResults([]);
      return;
    }
    const requestId = ++requestRef.current;
    Promise.resolve(provider.search(value)).then((next) => {
      if (requestId !== requestRef.current) return; // stale response — a newer keystroke already fired
      easeLayout();
      setResults(next);
    });
  }, [focused, value, provider]);

  const select = (suggestion: AddressSuggestion) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChangeText(formatAddress(suggestion));
    setFocused(false);
  };

  return (
    <View>
      <FormInput
        ref={ref}
        icon="map-pin"
        value={value}
        onChangeText={onChangeText}
        placeholder="Numéro, rue, ville…"
        autoCapitalize="words"
        returnKeyType="done"
        onSubmitEditing={onSubmitEditing}
        onFocus={() => setFocused(true)}
        // Delayed so a tap on a suggestion registers before the list unmounts.
        onBlur={() => setTimeout(() => setFocused(false), 150)}
      />

      {focused && results.length > 0 ? (
        <View style={styles.suggestions}>
          {results.map((suggestion, index) => (
            <Pressable
              key={suggestion.id}
              onPress={() => select(suggestion)}
              style={[styles.row, index > 0 && styles.rowBorder]}
              accessibilityRole="button"
              accessibilityLabel={formatAddress(suggestion)}>
              <Feather name="map-pin" size={13} color={Palette.textTertiary} />
              <View style={styles.texts}>
                <Text style={styles.line} numberOfLines={1}>
                  {suggestion.line}
                </Text>
                <Text style={styles.city} numberOfLines={1}>
                  {suggestion.postalCode} {suggestion.city}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
});

const styles = createThemedStyles(() => StyleSheet.create({
  suggestions: {
    marginTop: 7,
    backgroundColor: Palette.card,
    borderRadius: Radius.tile,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  rowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Palette.border,
  },
  texts: {
    flex: 1,
  },
  line: {
    fontSize: FontSize.small,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
  },
  city: {
    fontSize: 11.5,
    fontWeight: '500',
    color: Palette.textTertiary,
    marginTop: 1,
  },
}));
