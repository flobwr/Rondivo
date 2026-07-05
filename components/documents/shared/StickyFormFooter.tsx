import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { PressableScale } from './primitives';

// Keeps the primary submit action ("Créer le devis"/"Créer la facture"/…)
// reachable at all times on creation screens, regardless of scroll position.
// Pair with a bottom padding on the ScrollView content (see FOOTER_SPACE) so
// the last field is never hidden behind it.
export const FOOTER_SPACE = 92;

export function StickyFormFooter({ label, onPress }: { label: string; onPress: () => void }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      <PressableScale onPress={onPress} to={0.97} style={styles.button} accessibilityLabel={label}>
        <Text style={styles.buttonText}>{label}</Text>
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Palette.screen,
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Palette.border,
  },
  button: {
    backgroundColor: Palette.blue,
    borderRadius: Radius.tile,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: FontSize.label,
    fontWeight: '700',
    color: Palette.white,
    letterSpacing: -0.1,
  },
});
