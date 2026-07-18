import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useMemo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { cardShadow, Palette, Radius, Spacing, type PaletteShape } from '@/theme';

type ClientSearchProps = {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress: () => void;
  filtersActive?: boolean;
  /** Defaults to the static light palette — pass `useTheme().palette` from screens that opted into dark mode. */
  palette?: PaletteShape;
};

const BUTTON = 48;

export function ClientSearch({ value, onChangeText, onFilterPress, filtersActive, palette = Palette }: ClientSearchProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const styles = useMemo(() => createStyles(palette), [palette]);

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, { toValue: 0.92, useNativeDriver: true, friction: 5, tension: 300 }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  return (
    <View style={styles.row}>
      <View style={styles.searchBox}>
        <Feather name="search" size={18} color={palette.textTertiary} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Rechercher un client…"
          placeholderTextColor={palette.textTertiary}
          style={styles.input}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onFilterPress}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Filtrer et trier">
        <Animated.View style={[styles.filterButton, { transform: [{ scale }] }]}>
          <Feather name="filter" size={19} color={palette.textPrimary} />
          {filtersActive ? <View style={styles.dot} /> : null}
        </Animated.View>
      </Pressable>
    </View>
  );
}

function createStyles(Palette: PaletteShape) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    searchBox: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Palette.card,
      borderRadius: Radius.tile,
      paddingHorizontal: Spacing.lg,
      height: BUTTON,
      gap: 10,
      ...cardShadow,
    },
    input: {
      flex: 1,
      fontSize: 15,
      color: Palette.textPrimary,
      letterSpacing: -0.1,
      padding: 0,
    },
    filterButton: {
      width: BUTTON,
      height: BUTTON,
      borderRadius: Radius.tile,
      backgroundColor: Palette.card,
      alignItems: 'center',
      justifyContent: 'center',
      ...cardShadow,
    },
    dot: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: Palette.blue,
      borderWidth: 1.5,
      borderColor: Palette.card,
    },
  });
}
