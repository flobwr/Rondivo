import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette, Spacing } from '@/constants/design';
import { iconButtonShadow } from '@/constants/shadow';

type FeatherName = React.ComponentProps<typeof Feather>['name'];

type Props = {
  monthLabel: string; // 'Juin 2025'
  onPickMonth?: () => void;
  onSearch?: () => void;
  onAdd?: () => void;
  onPickView?: () => void; // future: day / week / month / map switcher
};

// Small circular header button with the standard press spring + haptic.
function IconButton({
  icon,
  primary,
  onPress,
}: {
  icon: FeatherName;
  primary?: boolean;
  onPress?: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, { toValue: 0.9, useNativeDriver: true, friction: 6, tension: 300 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        style={[styles.iconButton, primary ? styles.iconButtonPrimary : null]}
        hitSlop={6}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}>
        <Feather name={icon} size={19} color={primary ? Palette.white : Palette.textPrimary} />
      </Pressable>
    </Animated.View>
  );
}

export function PlanningHeader({ monthLabel, onPickMonth, onSearch, onAdd, onPickView }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Planning</Text>
        <View style={styles.actions}>
          <IconButton icon="search" onPress={onSearch} />
          <IconButton icon="plus" primary onPress={onAdd} />
        </View>
      </View>

      <View style={styles.subRow}>
        {/* Month picker affordance — ref 2's "May 2026 ⌄" */}
        <Pressable style={styles.monthButton} hitSlop={8} onPress={onPickMonth}>
          <Text style={styles.month}>{monthLabel}</Text>
          <Feather name="chevron-down" size={16} color={Palette.textSecondary} />
        </Pressable>

        {/* View switcher — will grow into Jour / Semaine / Mois / Carte */}
        <Pressable style={styles.viewButton} hitSlop={8} onPress={onPickView}>
          <Feather name="layout" size={13} color={Palette.textSecondary} />
          <Text style={styles.viewLabel}>Jour</Text>
          <Feather name="chevron-down" size={14} color={Palette.textTertiary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.screen,
    paddingTop: 12,
    paddingBottom: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.9,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Palette.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...iconButtonShadow,
  },
  iconButtonPrimary: {
    backgroundColor: Palette.blue,
    borderColor: Palette.blue,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  monthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  month: {
    fontSize: 16,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Palette.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
    borderRadius: 999,
    paddingLeft: 12,
    paddingRight: 9,
    paddingVertical: 7,
  },
  viewLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
  },
});
