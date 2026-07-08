import { Feather } from '@expo/vector-icons';
import { useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';

import { PressableScale } from '@/components/documents/shared/primitives';
import { FontSize, Palette, Radius, type PaletteShape } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';

export function LogoutButton({ onPress, palette = Palette }: { onPress: () => void; palette?: PaletteShape }) {
  const styles = useMemo(() => createStyles(palette), [palette]);
  return (
    <PressableScale onPress={onPress} to={0.98} style={styles.card} accessibilityLabel="Se déconnecter">
      <Feather name="log-out" size={15} color={palette.danger} />
      <Text style={styles.text}>Se déconnecter</Text>
    </PressableScale>
  );
}

function createStyles(Palette: PaletteShape) {
  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      backgroundColor: Palette.card,
      borderRadius: Radius.card,
      paddingVertical: 17,
      ...cardShadow,
    },
    text: {
      fontSize: FontSize.small,
      fontWeight: '600',
      color: Palette.danger,
      letterSpacing: -0.1,
    },
  });
}
