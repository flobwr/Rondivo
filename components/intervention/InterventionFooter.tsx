import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { iconButtonShadow } from '@/constants/shadow';

type Props = {
  onEdit?: () => void;
  onStart?: () => void;
};

function usePressScale() {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, friction: 6, tension: 300 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };
  return { scale, onPressIn, onPressOut };
}

export function InterventionFooter({ onEdit, onStart }: Props) {
  const insets = useSafeAreaInsets();
  const edit = usePressScale();
  const start = usePressScale();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 14) }]}>
      <Pressable style={styles.editWrapper} onPressIn={edit.onPressIn} onPressOut={edit.onPressOut} onPress={onEdit}>
        <Animated.View style={[styles.editButton, { transform: [{ scale: edit.scale }] }]}>
          <Feather name="edit-2" size={16} color={Palette.textPrimary} />
          <Text style={styles.editText}>Modifier</Text>
        </Animated.View>
      </Pressable>

      <Pressable style={styles.startWrapper} onPressIn={start.onPressIn} onPressOut={start.onPressOut} onPress={onStart}>
        <Animated.View style={[styles.startButton, { transform: [{ scale: start.scale }] }]}>
          <Feather name="play" size={15} color={Palette.white} />
          <Text style={styles.startText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
            Commencer l&rsquo;intervention
          </Text>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: Palette.card,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Palette.border,
    paddingHorizontal: Spacing.screen,
    paddingTop: 14,
    ...iconButtonShadow,
  },
  editWrapper: {
    flex: 0.9,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: Radius.pill,
    backgroundColor: Palette.cardMuted,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  editText: {
    fontSize: FontSize.label,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
  },
  startWrapper: {
    flex: 2.6,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 52,
    borderRadius: Radius.pill,
    paddingHorizontal: 4,
    backgroundColor: Palette.blue,
  },
  startText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.white,
    letterSpacing: -0.2,
  },
});
