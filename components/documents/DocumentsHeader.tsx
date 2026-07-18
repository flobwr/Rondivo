import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useMemo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, iconButtonShadow, Palette, Spacing, type PaletteShape } from '@/theme';
import { FeatherIconName } from './types';

type Props = {
  onSearch?: () => void;
  onAdd?: () => void;
  /** Defaults to the static light palette — pass `useTheme().palette` from screens that opted into dark mode. */
  palette?: PaletteShape;
};

function HeaderButton({
  icon,
  onPress,
  accessibilityLabel,
  styles,
  palette,
}: {
  icon: FeatherIconName;
  onPress?: () => void;
  accessibilityLabel: string;
  styles: ReturnType<typeof createStyles>;
  palette: PaletteShape;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, { toValue: 0.92, useNativeDriver: true, friction: 6, tension: 300 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        style={styles.button}
        hitSlop={6}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}>
        <Feather name={icon} size={20} color={palette.textPrimary} />
      </Pressable>
    </Animated.View>
  );
}

export function DocumentsHeader({ onSearch, onAdd, palette = Palette }: Props) {
  const styles = useMemo(() => createStyles(palette), [palette]);
  return (
    <View style={styles.row}>
      <View style={styles.titles}>
        <Text style={styles.title}>Documents</Text>
        <Text style={styles.subtitle}>Tous vos documents</Text>
      </View>

      <View style={styles.actions}>
        <HeaderButton icon="search" onPress={onSearch} accessibilityLabel="Rechercher" styles={styles} palette={palette} />
        <HeaderButton icon="plus" onPress={onAdd} accessibilityLabel="Créer un document" styles={styles} palette={palette} />
      </View>
    </View>
  );
}

function createStyles(Palette: PaletteShape) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.screen,
      paddingTop: 14,
      paddingBottom: 2,
    },
    titles: {
      flex: 1,
      paddingRight: Spacing.sm,
    },
    title: {
      fontSize: 30,
      fontWeight: '700',
      color: Palette.textPrimary,
      letterSpacing: -0.8,
    },
    subtitle: {
      fontSize: FontSize.small,
      fontWeight: '400',
      color: Palette.textSecondary,
      letterSpacing: -0.1,
      marginTop: 3,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    button: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: Palette.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Palette.border,
      alignItems: 'center',
      justifyContent: 'center',
      ...iconButtonShadow,
    },
  });
}
