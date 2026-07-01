import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FontSize, Palette } from '@/constants/design';

type Tab = {
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  route?: '/' | '/clients';
};

const TABS: Tab[] = [
  { label: 'Accueil', icon: 'home', route: '/' },
  { label: 'Planning', icon: 'calendar' },
  { label: 'Clients', icon: 'users', route: '/clients' },
  { label: 'Documents', icon: 'file-text' },
  { label: 'Plus', icon: 'menu' },
];

export function BottomNav({ activeIndex = 0 }: { activeIndex?: number }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {TABS.map((tab, index) => {
        const active = index === activeIndex;
        const color = active ? '#1A50E2' : Palette.textTertiary;
        return (
          <Pressable
            key={tab.label}
            style={styles.tab}
            onPress={tab.route ? () => router.push(tab.route!) : undefined}>
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
