import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { createThemedStyles, FontSize, iconButtonShadow, Palette, Radius, Spacing } from '@/theme';

type Props = {
  onEdit?: () => void;
  onStart?: () => void;
  onComplete?: () => void;
  started?: boolean;
  completed?: boolean;
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

export function InterventionFooter({ onEdit, onStart, onComplete, started, completed }: Props) {
  const insets = useSafeAreaInsets();
  const edit = usePressScale();
  const start = usePressScale();

  const label = completed ? 'Intervention terminée' : started ? 'Terminer l’intervention' : 'Commencer l’intervention';
  const icon = completed ? 'check-circle' : started ? 'check' : 'play';
  const onPress = completed ? undefined : started ? onComplete : onStart;

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 14) }]}>
      <Pressable style={styles.editWrapper} onPressIn={edit.onPressIn} onPressOut={edit.onPressOut} onPress={onEdit}>
        <Animated.View style={[styles.editButton, { transform: [{ scale: edit.scale }] }]}>
          <Feather name="edit-2" size={16} color={Palette.textPrimary} />
          <Text style={styles.editText}>Modifier</Text>
        </Animated.View>
      </Pressable>

      <Pressable
        style={styles.startWrapper}
        onPressIn={completed ? undefined : start.onPressIn}
        onPressOut={completed ? undefined : start.onPressOut}
        onPress={onPress}
        disabled={completed}>
        <Animated.View style={[styles.startButton, completed ? styles.startButtonDone : null, { transform: [{ scale: start.scale }] }]}>
          <Feather name={icon} size={15} color={completed ? Palette.textPrimary : Palette.white} />
          <Text
            style={[styles.startText, completed ? styles.startTextDone : null]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.85}>
            {label}
          </Text>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = createThemedStyles(() => StyleSheet.create({
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
  startButtonDone: {
    backgroundColor: Palette.cardMuted,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  startText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.white,
    letterSpacing: -0.2,
  },
  startTextDone: {
    color: Palette.textPrimary,
  },
}));
