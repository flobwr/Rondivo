import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette } from '@/constants/design';
import { iconButtonShadow } from '@/constants/shadow';
import { PressableScale } from './primitives';

type Props = {
  title: string;
  onBack: () => void;
  onMenu?: () => void;
};

const BUTTON = 40;

export function DetailHeader({ title, onBack, onMenu }: Props) {
  return (
    <View style={styles.row}>
      <PressableScale onPress={onBack} to={0.9} style={styles.iconButton} accessibilityLabel="Retour">
        <Feather name="chevron-left" size={24} color={Palette.textPrimary} />
      </PressableScale>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      {onMenu ? (
        <PressableScale onPress={onMenu} to={0.9} style={styles.iconButton} accessibilityLabel="Plus d’options">
          <Feather name="more-horizontal" size={20} color={Palette.textPrimary} />
        </PressableScale>
      ) : (
        <View style={styles.iconButton} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 14,
    gap: 12,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: FontSize.title,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.4,
  },
  iconButton: {
    width: BUTTON,
    height: BUTTON,
    borderRadius: 13,
    backgroundColor: Palette.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...iconButtonShadow,
  },
});
