import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { FontSize, iconButtonShadow, Palette } from '@/theme';
import { PressableScale } from './primitives';

type Props = {
  title: string;
  onBack: () => void;
  onMenu?: () => void;
  /** Trailing "+" button instead of the "…" menu — for list screens that create a new item. */
  onAdd?: () => void;
};

const BUTTON = 40;

export function DetailHeader({ title, onBack, onMenu, onAdd }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.titleWrap} pointerEvents="none">
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>

      <PressableScale onPress={onBack} to={0.9} style={styles.iconButton} accessibilityLabel="Retour">
        <Feather name="chevron-left" size={24} color={Palette.textPrimary} />
      </PressableScale>

      {onAdd ? (
        <PressableScale onPress={onAdd} to={0.9} style={styles.iconButton} accessibilityLabel="Ajouter">
          <Feather name="plus" size={20} color={Palette.textPrimary} />
        </PressableScale>
      ) : onMenu ? (
        <PressableScale onPress={onMenu} to={0.9} style={styles.iconButton} accessibilityLabel="Plus d’options">
          <Feather name="more-horizontal" size={20} color={Palette.textPrimary} />
        </PressableScale>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 14,
  },
  titleWrap: {
    position: 'absolute',
    left: 60,
    right: 60,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
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
