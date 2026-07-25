import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { ControlSize, FontWeight, LetterSpacing, Palette, Radius, Spacing, Typography } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { PressScale } from '@/constants/motion';
import { usePressScale } from '@/hooks/use-press-scale';

type Props = {
  monthLabel: string; // e.g. "JUILLET 2026"
  onAdd?: () => void;
};

// The add button reads as "create an intervention on the calendar", not a bare
// "+": a filled calendar glyph with a small plus badge, echoing the
// notification-badge treatment already used on the Home header.
function AddButton({ onAdd }: { onAdd?: () => void }) {
  const { scale, onPressIn, onPressOut } = usePressScale({
    to: PressScale.icon,
    haptic: Haptics.ImpactFeedbackStyle.Medium,
  });

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onAdd} hitSlop={10}>
      <Animated.View style={[styles.addButton, { transform: [{ scale }] }]}>
        <Feather name="calendar" size={20} color={Palette.white} />
        <View style={styles.addBadge}>
          <Feather name="plus" size={11} color={Palette.blue} />
        </View>
      </Animated.View>
    </Pressable>
  );
}

export function PlanningHeader({ monthLabel, onAdd }: Props) {
  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.eyebrow}>Planning</Text>
        <Text style={styles.month}>{monthLabel}</Text>
      </View>

      <AddButton onAdd={onAdd} />
    </View>
  );
}

const ADD_BUTTON = ControlSize.lg;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screen,
    paddingTop: 14,
    paddingBottom: 4,
  },
  eyebrow: {
    fontSize: Typography.overline.fontSize,
    fontWeight: FontWeight.bold,
    color: Palette.textSecondary,
    letterSpacing: LetterSpacing.overline,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  month: {
    fontSize: Typography.display.fontSize,
    fontWeight: FontWeight.heavy,
    color: Palette.textPrimary,
    letterSpacing: LetterSpacing.tighter,
  },
  addButton: {
    width: ADD_BUTTON,
    height: ADD_BUTTON,
    borderRadius: Radius.tile,
    backgroundColor: Palette.blue,
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow,
  },
  addBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Palette.white,
    borderWidth: 2,
    borderColor: Palette.screen,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
