import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Spacing } from '@/constants/design';
import { PressableScale } from './PressableScale';

export type SegmentedTab<T extends string> = {
  key: T;
  label: string;
};

type Props<T extends string> = {
  tabs: SegmentedTab<T>[];
  active: T;
  onChange: (tab: T) => void;
};

/**
 * The one horizontal tab bar used across detail screens (Client, Intervention…)
 * — underline-on-active, no icons, scrolls if the tab set overflows.
 */
export function SegmentedTabs<T extends string>({ tabs, active, onChange }: Props<T>) {
  return (
    <View style={styles.wrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
        {tabs.map((tab) => {
          const isActive = tab.key === active;
          return (
            <PressableScale
              key={tab.key}
              onPress={() => onChange(tab.key)}
              to={0.95}
              haptic={false}
              style={styles.tab}
              accessibilityLabel={tab.label}>
              <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
              <View style={[styles.underline, isActive && styles.underlineActive]} />
            </PressableScale>
          );
        })}
      </ScrollView>
      <View style={styles.baseline} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  content: {
    gap: 24,
    paddingHorizontal: Spacing.xs,
  },
  tab: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  label: {
    fontSize: FontSize.label,
    fontWeight: '600',
    color: Palette.textTertiary,
    letterSpacing: -0.2,
  },
  labelActive: {
    color: Palette.blue,
    fontWeight: '700',
  },
  underline: {
    height: 2.5,
    width: '100%',
    borderRadius: 2,
    marginTop: 8,
    backgroundColor: 'transparent',
  },
  underlineActive: {
    backgroundColor: Palette.blue,
  },
  baseline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.border,
  },
});
