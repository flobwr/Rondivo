import { Feather } from '@expo/vector-icons';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Spacing } from '@/constants/design';
import { iconButtonShadow } from '@/constants/shadow';
import { usePressScale } from '@/hooks/use-press-scale';

type Props = {
  monthLabel: string; // e.g. "JUIN 2025"
  onAdd?: () => void;
};

export function PlanningHeader({ monthLabel, onAdd }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale({ to: 0.92 });

  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.month}>{monthLabel}</Text>
        <Text style={styles.title}>Planning</Text>
      </View>

      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable
          style={styles.addButton}
          hitSlop={6}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={onAdd}>
          <Feather name="plus" size={22} color={Palette.blue} />
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
    paddingBottom: 4,
  },
  month: {
    fontSize: FontSize.tiny,
    fontWeight: '600',
    color: Palette.textSecondary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.8,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Palette.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...iconButtonShadow,
  },
});
