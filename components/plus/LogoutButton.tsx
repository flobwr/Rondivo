import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text } from 'react-native';

import { PressableScale } from '@/components/documents/shared/primitives';
import { FontSize, Palette, Radius } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';

export function LogoutButton({ onPress }: { onPress: () => void }) {
  return (
    <PressableScale onPress={onPress} to={0.98} style={styles.card} accessibilityLabel="Se déconnecter">
      <Feather name="log-out" size={15} color={Palette.danger} />
      <Text style={styles.text}>Se déconnecter</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingVertical: 12,
    ...cardShadow,
  },
  text: {
    fontSize: FontSize.small,
    fontWeight: '600',
    color: Palette.danger,
    letterSpacing: -0.1,
  },
});
