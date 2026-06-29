import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
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
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={onAdd}>
          <Feather name="plus" size={22} color={Palette.textPrimary} />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screen,
    paddingTop: 14,
    paddingBottom: 4,
  },
  month: {
    fontSize: FontSize.tiny,
    fontWeight: '600',
    color: Palette.textSecondary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.8,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.tile,
    backgroundColor: Palette.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...iconButtonShadow,
  },
});
