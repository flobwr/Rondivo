import { Feather } from '@expo/vector-icons';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { ControlSize, HitSlop, IconSize, Palette, Radius, Spacing } from '@/constants/design';
import { PressScale } from '@/constants/motion';
import { iconButtonShadow } from '@/constants/shadow';
import { usePressScale } from '@/hooks/use-press-scale';

type Props = {
  monthLabel: string; // e.g. "JUIN 2025"
  onAdd?: () => void;
};

export function PlanningHeader({ monthLabel, onAdd }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale({ to: PressScale.icon });

  return (
    <View style={styles.row}>
      <View>
        {/* Same eyebrow treatment as the Home hero card. */}
        <AppText variant="overline" color="secondary">
          {monthLabel}
        </AppText>
        <AppText variant="title1" style={styles.title}>
          Planning
        </AppText>
      </View>

      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable
          style={styles.addButton}
          hitSlop={HitSlop.sm}
          accessibilityRole="button"
          accessibilityLabel="Ajouter une intervention"
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={onAdd}>
          <Feather name="plus" size={IconSize.xl} color={Palette.blue} />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screen,
    paddingTop: 14,
    paddingBottom: Spacing.xs,
  },
  title: {
    marginTop: 2,
  },
  addButton: {
    width: ControlSize.lg,
    height: ControlSize.lg,
    borderRadius: Radius.tile, // same squircle as the calendar bubble
    backgroundColor: Palette.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...iconButtonShadow,
  },
});
