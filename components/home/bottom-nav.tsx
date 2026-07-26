import { Feather } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandColor, FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { navShadow } from '@/constants/shadow';

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
    router.navigate(tab.route as never);
  };

  return (
    <View style={[styles.wrapper, { marginBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.container}>
        {TABS.map((tab, index) => {
          const active = index === activeIndex;
          const color = active ? Palette.white : Palette.textTertiary;
          return (
            <Pressable
              key={tab.label}
              style={styles.tab}
              onPress={() => handlePress(tab, index)}>
              <View style={[styles.iconChip, active ? styles.iconChipActive : null]}>
                <Feather name={tab.icon} size={active ? 21 : 22} color={color} />
              </View>
              <Text
                style={[
                  styles.label,
                  { color: active ? BrandColor.tabActive : Palette.textTertiary, fontWeight: active ? '700' : '400' },
                ]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: Spacing.screen - 4,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingTop: 10,
    paddingBottom: 8,
    paddingHorizontal: 6,
    ...navShadow,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  iconChip: {
    width: 40,
    height: 30,
    borderRadius: Radius.tile - 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconChipActive: {
    backgroundColor: BrandColor.tabActive,
  },
  label: {
    fontSize: FontSize.tiny,
    letterSpacing: -0.1,
  },
});
