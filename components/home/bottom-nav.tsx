import { Feather } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FontSize, Palette, type PaletteShape } from '@/theme';

type Tab = {
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  /** Expo Router path. `undefined` = screen not built yet (inert). */
  route?: string;
};

const TABS: Tab[] = [
  { label: 'Accueil', icon: 'home', route: '/' },
  { label: 'Planning', icon: 'calendar', route: '/planning' },
  { label: 'Clients', icon: 'users', route: '/clients' },
  { label: 'Documents', icon: 'file-text', route: '/documents' },
  { label: 'Plus', icon: 'menu', route: '/plus' },
];

export function BottomNav({
  activeIndex = 0,
  palette = Palette,
}: {
  activeIndex?: number;
  /** Defaults to the static light palette — pass the live `useTheme().palette`
   *  from screens that have opted into dark mode; every other screen keeps
   *  today's light nav bar regardless of the global appearance setting. */
  palette?: PaletteShape;
}) {
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
    <View
      style={[
        styles.container,
        { backgroundColor: palette.card, borderTopColor: palette.border, paddingBottom: Math.max(insets.bottom, 8) },
      ]}>
      {TABS.map((tab, index) => {
        const active = index === activeIndex;
        const color = active ? palette.blue : palette.textTertiary;
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
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 10,
    paddingHorizontal: 6,
  },
  tab: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  label: {
    fontSize: FontSize.tiny,
    letterSpacing: -0.1,
  },
});
