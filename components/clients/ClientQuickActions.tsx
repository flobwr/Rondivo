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

const CIRCLE = 38;

function CircleButton({
  icon,
  label,
  onPress,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  onPress: () => void;
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
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={label}>
      <Animated.View style={[styles.circle, { transform: [{ scale }] }]}>
        <Feather name={icon} size={16} color={Palette.blue} />
      </Animated.View>
    </Pressable>
  );
}

function ClientQuickActionsComponent({ onCall, onNavigate, onOpen }: ClientQuickActionsProps) {
  const chevronScale = useRef(new Animated.Value(1)).current;

  const onChevronIn = () => {
    Animated.spring(chevronScale, { toValue: 0.85, useNativeDriver: true, friction: 5, tension: 300 }).start();
  };
  const onChevronOut = () => {
    Animated.spring(chevronScale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  return (
    <View style={styles.row}>
      <View style={styles.leftGroup}>
        <CircleButton icon="phone" label="Appeler" onPress={onCall} />
        <CircleButton icon="navigation" label="Itinéraire" onPress={onNavigate} />
      </View>

      <Pressable
        onPressIn={onChevronIn}
        onPressOut={onChevronOut}
        onPress={onOpen}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Ouvrir la fiche client">
        <Animated.View style={[styles.chevron, { transform: [{ scale: chevronScale }] }]}>
          <Feather name="chevron-right" size={20} color={Palette.textTertiary} />
        </Animated.View>
      </Pressable>
    </View>
  );
}

export const ClientQuickActions = memo(ClientQuickActionsComponent);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  circle: {
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    borderWidth: 1.3,
    borderColor: Palette.blueSoft,
    backgroundColor: Palette.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevron: {
    width: CIRCLE,
    height: CIRCLE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
