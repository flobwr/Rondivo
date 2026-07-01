import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { PressableScale } from './primitives';
import { FontSize, Palette } from '@/constants/design';
import { iconButtonShadow } from '@/constants/shadow';

type Props = {
  onBack: () => void;
  onEdit: () => void;
  onMenu: () => void;
};

const BUTTON = 40;

export function DetailHeader({ onBack, onEdit, onMenu }: Props) {
  return (
    <View style={styles.row}>
      <PressableScale onPress={onBack} to={0.9} style={styles.iconButton} accessibilityLabel="Retour">
        <Feather name="chevron-left" size={24} color={Palette.textPrimary} />
      </PressableScale>

      <Text style={styles.title}>Client</Text>

      <View style={styles.rightGroup}>
        <PressableScale onPress={onEdit} to={0.9} style={styles.iconButton} accessibilityLabel="Modifier">
          <Feather name="edit-2" size={18} color={Palette.textPrimary} />
        </PressableScale>
        <PressableScale onPress={onMenu} to={0.9} style={styles.iconButton} accessibilityLabel="Menu">
          <Feather name="more-horizontal" size={20} color={Palette.textPrimary} />
        </PressableScale>
      </View>
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
  },
  title: {
    fontSize: FontSize.title,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.4,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
