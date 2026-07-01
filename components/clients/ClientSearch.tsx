import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';

type ClientSearchProps = {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress: () => void;
  filtersActive?: boolean;
};

const BUTTON = 48;

export function ClientSearch({ value, onChangeText, onFilterPress, filtersActive }: ClientSearchProps) {
  const scale = useRef(new Animated.Value(1)).current;

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
        <Feather name="search" size={18} color={Palette.textTertiary} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Rechercher un client, téléphone, adresse..."
          placeholderTextColor={Palette.textTertiary}
          style={styles.input}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onFilterPress} hitSlop={8}>
        <Animated.View style={[styles.filterButton, { transform: [{ scale }] }]}>
          <Feather name="filter" size={19} color={Palette.textPrimary} />
          {filtersActive ? <View style={styles.dot} /> : null}
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
