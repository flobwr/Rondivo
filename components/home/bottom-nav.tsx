import { Feather } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FontSize, Palette } from '@/constants/design';

type Tab = {
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  /** Expo Router path. `undefined` = screen not built yet (inert). */
  route?: string;
};

const TABS: Tab[] = [
  { label: 'Accueil', icon: 'home', route: '/' },
  { label: 'Planning', icon: 'calendar', route: '/planning' },
  { label: 'Clients', icon: 'users' },
  { label: 'Documents', icon: 'file-text' },
  { label: 'Plus', icon: 'menu' },
];

export function BottomNav({ activeIndex = 0 }: { activeIndex?: number }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();

  const handlePress = (tab: Tab, index: number) => {
    if (!tab.route) return; // screen not built yet
    if (index === activeIndex || pathname === tab.route) return; // already here
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Tabs are flat, not a push hierarchy — replace so switching back and
    // forth never grows the stack (and its mounted screens/timers) unbounded.
    router.replace(tab.route as never);
  };

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {TABS.map((tab, index) => {
        const active = index === activeIndex;
        const color = active ? '#1A50E2' : Palette.textTertiary;
        return (
          <Pressable
            key={tab.label}
            style={styles.tab}
            onPress={() => handlePress(tab, index)}>
            <Feather name={tab.icon} size={active ? 24 : 23} color={color} />
            <Text style={[styles.label, { color, fontWeight: active ? '600' : '400' }]}>
              {tab.label}
            </Text>
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
    paddingTop: 10,
    paddingHorizontal: 6,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: FontSize.tiny,
    letterSpacing: -0.1,
  },
});
