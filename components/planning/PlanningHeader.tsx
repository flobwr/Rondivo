import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Spacing } from '@/constants/design';
import { iconButtonShadow } from '@/constants/shadow';

type Props = {
  monthLabel: string; // e.g. "JUIN 2025"
  onAdd?: () => void;
};

// The header carries three things — the month eyebrow, the title, and the
// one action that matters (add an intervention, hence calendar-plus rather
// than a bare +). The month label gives the big title somewhere to sit
// without floating in empty space.
export function PlanningHeader({ monthLabel, onAdd }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, { toValue: 0.9, useNativeDriver: true, friction: 6, tension: 300 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.month}>{monthLabel}</Text>
        <Text style={styles.title}>Planning</Text>
      </View>

      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable
          style={styles.addButton}
          hitSlop={8}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={onAdd}>
          <MaterialCommunityIcons name="calendar-plus" size={26} color={Palette.textPrimary} />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screen,
    paddingTop: 22,
    paddingBottom: 20,
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
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: Palette.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...iconButtonShadow,
  },
});
