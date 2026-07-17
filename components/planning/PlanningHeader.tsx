import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette, Spacing } from '@/constants/design';
import { iconButtonShadow } from '@/constants/shadow';

type Props = {
  onAdd?: () => void;
};

// Deliberately spare: the screen is for reading the day, so the header carries
// exactly two things — the title, and the one action that matters (add an
// intervention, hence calendar-plus rather than a bare +).
export function PlanningHeader({ onAdd }: Props) {
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
      <Text style={styles.title}>Planning</Text>

      <Animated.View style={[styles.buttonWrap, { transform: [{ scale }] }]}>
        <Pressable
          style={styles.addButton}
          hitSlop={8}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={onAdd}>
          <MaterialCommunityIcons name="calendar-plus" size={24} color={Palette.textPrimary} />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 92,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.screen,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.8,
  },
  buttonWrap: {
    position: 'absolute',
    right: Spacing.screen,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: Palette.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...iconButtonShadow,
  },
});
