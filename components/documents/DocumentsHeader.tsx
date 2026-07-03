import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Spacing } from '@/constants/design';
import { iconButtonShadow } from '@/constants/shadow';
import { FeatherIconName } from './types';

type Props = {
  onSearch?: () => void;
  onAdd?: () => void;
};

function HeaderButton({ icon, onPress }: { icon: FeatherIconName; onPress?: () => void }) {
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
      <Pressable style={styles.button} hitSlop={6} onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
        <Feather name={icon} size={20} color={Palette.textPrimary} />
      </Pressable>
    </Animated.View>
  );
}

export function DocumentsHeader({ onSearch, onAdd }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.titles}>
        <Text style={styles.title}>Documents</Text>
        <Text style={styles.subtitle}>Toute votre gestion documentaire</Text>
      </View>

      <View style={styles.actions}>
        <HeaderButton icon="search" onPress={onSearch} />
        <HeaderButton icon="plus" onPress={onAdd} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screen,
    paddingTop: 14,
    paddingBottom: 4,
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
