import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { useTheme } from '@/contexts/theme';
import { Spacing } from '@/theme';

// Keeps the primary submit action ("Créer le devis"/"Créer la facture"/…)
// reachable at all times on creation screens, regardless of scroll position.
// Pair with a bottom padding on the ScrollView content (see FOOTER_SPACE) so
// the last field is never hidden behind it.
export const FOOTER_SPACE = 92;

export function StickyFormFooter({
  label,
  onPress,
  disabled = false,
  loading = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  /** Shows a spinner and blocks re-entry while the submit handler is in flight — prevents a double-tap from creating a duplicate. */
  loading?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const { palette } = useTheme();

  return (
    <View
      style={[
        styles.footer,
        {
          backgroundColor: palette.screen,
          borderTopColor: palette.border,
          paddingBottom: Math.max(insets.bottom, 16),
        },
      ]}>
      <Button label={label} onPress={onPress} disabled={disabled} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
