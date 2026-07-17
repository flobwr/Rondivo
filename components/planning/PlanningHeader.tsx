import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Spacing } from '@/constants/design';
import { iconButtonShadow } from '@/constants/shadow';

type Props = {
  monthLabel: string; // e.g. "JUIN 2025"
  onAdd?: () => void;
};

export function PlanningHeader({ monthLabel, onAdd }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, { toValue: 0.92, useNativeDriver: true, friction: 6, tension: 300 }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.month}>{monthLabel}</Text>
        <Text style={styles.title}>Planning</Text>
      </View>

      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable
          style={styles.addButton}
          hitSlop={6}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={onAdd}>
          <Feather name="plus" size={24} color={Palette.blue} />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screen,
    paddingTop: 28,
    paddingBottom: 22,
  },
  month: {
    fontSize: FontSize.tiny,
    fontWeight: '700',
    color: Palette.textSecondary,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -1.2,
  },
  addButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Palette.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...iconButtonShadow,
  },
});
