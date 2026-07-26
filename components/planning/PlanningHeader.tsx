import { Feather } from '@expo/vector-icons';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Spacing, Typography } from '@/constants/design';
import { focalShadow, iconButtonShadow } from '@/constants/shadow';
import { usePressScale } from '@/hooks/use-press-scale';

type Props = {
  monthLabel: string; // e.g. "JUILLET 2026"
  onAdd?: () => void;
};

export function PlanningHeader({ monthLabel, onAdd }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale({ to: 0.92 });

  return (
    <View style={styles.row}>
      <View style={styles.titleBlock}>
        <Text style={styles.eyebrow}>Planning</Text>
        <Text style={styles.month} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
          {monthLabel}
        </Text>
      </View>

      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable
          style={styles.addButton}
          hitSlop={6}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={onAdd}>
          <Feather name="calendar" size={22} color={Palette.white} />
          <View style={styles.addBadge}>
            <Feather name="plus" size={11} color={Palette.blue} />
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screen,
    paddingTop: 18,
    paddingBottom: 8,
  },
  titleBlock: {
    flex: 1,
  },
  eyebrow: {
    fontSize: FontSize.tiny,
    fontWeight: '600',
    color: Palette.textSecondary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  month: {
    ...Typography.giant,
    color: Palette.textPrimary,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginTop: 4,
    backgroundColor: Palette.blue,
    alignItems: 'center',
    justifyContent: 'center',
    ...focalShadow,
  },
  addBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Palette.white,
    borderWidth: 2,
    borderColor: Palette.screen,
    alignItems: 'center',
    justifyContent: 'center',
    ...iconButtonShadow,
  },
});
