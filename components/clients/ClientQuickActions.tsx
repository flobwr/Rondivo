import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { memo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

import { Palette } from '@/constants/design';

type ClientQuickActionsProps = {
  onCall: () => void;
  onNavigate: () => void;
  onOpen: () => void;
};

const BUTTON = 36;

function IconButton({
  icon,
  onPress,
  circle = true,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  onPress: () => void;
  circle?: boolean;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, { toValue: 0.88, useNativeDriver: true, friction: 5, tension: 300 }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress} hitSlop={8}>
      <Animated.View style={[circle ? styles.circle : styles.plain, { transform: [{ scale }] }]}>
        <Feather name={icon} size={circle ? 16 : 18} color={circle ? Palette.blue : Palette.textTertiary} />
      </Animated.View>
    </Pressable>
  );
}

function ClientQuickActionsComponent({ onCall, onNavigate, onOpen }: ClientQuickActionsProps) {
  return (
    <View style={styles.row}>
      <IconButton icon="phone" onPress={onCall} />
      <IconButton icon="navigation" onPress={onNavigate} />
      <IconButton icon="chevron-right" onPress={onOpen} circle={false} />
    </View>
  );
}

export const ClientQuickActions = memo(ClientQuickActionsComponent);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  circle: {
    width: BUTTON,
    height: BUTTON,
    borderRadius: BUTTON / 2,
    borderWidth: 1.3,
    borderColor: Palette.blueSoft,
    backgroundColor: Palette.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plain: {
    width: BUTTON,
    height: BUTTON,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
