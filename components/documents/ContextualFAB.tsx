import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';

type Props = {
  label: string;
  icon?: React.ComponentProps<typeof Feather>['name'];
  onPress?: () => void;
};

export function ContextualFAB({ label, icon = 'plus', onPress }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.spring(scale, {
      toValue: 0.93,
      useNativeDriver: true,
      friction: 5,
      tension: 300,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
      tension: 100,
    }).start();
  };

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
        <Animated.View style={[styles.fab, { transform: [{ scale }] }]}>
          <Feather name={icon} size={18} color={Palette.white} />
          <Text style={styles.label}>{label}</Text>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: Spacing.screen,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.blue,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: Radius.pill,
    gap: 8,
    shadowColor: Palette.blue,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  label: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Palette.white,
  },
});
