import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FontSize, Palette, Spacing } from '@/constants/design';

type Tab = {
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
};

const TABS: Tab[] = [
  { label: 'Accueil', icon: 'home' },
  { label: 'Planning', icon: 'calendar' },
  { label: 'Clients', icon: 'users' },
  { label: 'Documents', icon: 'file-text' },
  { label: 'Plus', icon: 'menu' },
];

export function BottomNav({ activeIndex = 0 }: { activeIndex?: number }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, Spacing.sm) }]}>
      {TABS.map((tab, index) => {
        const active = index === activeIndex;
        const color = active ? Palette.blue : Palette.textTertiary;
        return (
          <Pressable key={tab.label} style={styles.tab}>
            <Feather name={tab.icon} size={24} color={color} />
            <Text style={[styles.label, { color }]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Palette.card,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Palette.border,
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
  },
  label: {
    fontSize: FontSize.tiny,
    fontWeight: '600',
  },
});
