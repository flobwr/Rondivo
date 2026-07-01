import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette, Radius } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';

type ClientHeaderProps = {
  onAddPress?: () => void;
};

const BUTTON = 48;

export function ClientHeader({ onAddPress }: ClientHeaderProps) {
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
      <View style={styles.texts}>
        <Text style={styles.title}>Clients</Text>
        <Text style={styles.subtitle}>Tous vos clients, à portée de main.</Text>
      </View>

      <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onAddPress} hitSlop={8}>
        <Animated.View style={[styles.addButton, { transform: [{ scale }] }]}>
          <Feather name="plus" size={22} color={Palette.blue} />
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  texts: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: Palette.textSecondary,
    marginTop: 4,
    letterSpacing: -0.1,
  },
  addButton: {
    width: BUTTON,
    height: BUTTON,
    borderRadius: Radius.tile,
    backgroundColor: Palette.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow,
  },
});
