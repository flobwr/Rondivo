import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { usePathname, useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  LinearTransition,
  useReducedMotion,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/contexts/theme';
import { getElevation, Motion, Radius, Size, Spacing } from '@/theme';

type Tab = {
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  route: string;
};

const TABS: Tab[] = [
  { label: 'Accueil', icon: 'home', route: '/' },
  { label: 'Planning', icon: 'calendar', route: '/planning' },
  { label: 'Clients', icon: 'users', route: '/clients' },
  { label: 'Documents', icon: 'file-text', route: '/documents' },
  { label: 'Plus', icon: 'menu', route: '/plus' },
];

/**
 * How much bottom padding a screen's scrollable content needs so its last
 * row clears the floating dock instead of hiding behind it. The dock is
 * absolutely positioned — content now scrolls the full height of the
 * screen and settles underneath it — so every root screen pads its list
 * with this instead of a flat `Spacing.section`.
 */
export function useBottomDockClearance(extra: number = Spacing.lg): number {
  const insets = useSafeAreaInsets();
  return Spacing.sm + Size.dockHeight + Math.max(insets.bottom, 14) + extra;
}

/**
 * Rondivo floating dock — the app's one piece of floating chrome.
 *
 * A capsule sitting one tone BELOW the paper (`dock`), so the bar reads as
 * machined chrome rather than another card, hovering on the strongest
 * shadow in the system. The active tab expands into a solid Bleu Rondivo
 * pill carrying its glyph and label — the single strongest accent on any
 * screen; inactive tabs are quiet glyphs. Selection reflows with one
 * gentle spring — no bounce, no sliding underline.
 *
 * Absolutely positioned over the screen's content — it floats, the page
 * scrolls behind it — so it must be the LAST sibling rendered in a root
 * screen (paints on top) and never wrapped in a flex sibling that would
 * claim layout space for it.
 *
 * `activeIndex` is the tab this screen belongs to; pass `-1` for screens
 * reachable from several tabs (Notes, Tâches) so no tab claims them.
 */
export function BottomDock({ activeIndex = 0 }: { activeIndex?: number }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const { palette, scheme, resolvedTheme } = useTheme();
  const reducedMotion = useReducedMotion();
  const elevation = getElevation(resolvedTheme);

  const handlePress = (tab: Tab, index: number) => {
    if (index === activeIndex || pathname === tab.route) return; // already here
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Tabs are flat, not a push hierarchy — replace so switching back and
    // forth never grows the stack (and its mounted screens/timers) unbounded.
    router.replace(tab.route as never);
  };

  const layout = reducedMotion
    ? undefined
    : LinearTransition.springify().damping(26).stiffness(280);

  return (
    <View
      style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 14) }]}
      pointerEvents="box-none">
      <View
        style={[
          styles.dock,
          elevation.float,
          {
            backgroundColor: palette.dock,
            // On night paper shadows vanish — a hairline edge keeps the
            // capsule legible against the dark screen behind it.
            borderColor: scheme === 'dark' ? palette.border : 'transparent',
          },
        ]}
        accessibilityRole="tablist">
        {TABS.map((tab, index) => {
          const active = index === activeIndex;
          return (
            <Animated.View key={tab.label} layout={layout}>
              <Pressable
                onPress={() => handlePress(tab, index)}
                accessibilityRole="tab"
                accessibilityLabel={tab.label}
                accessibilityState={{ selected: active }}
                hitSlop={6}
                style={({ pressed }) => [
                  styles.tab,
                  active && [styles.tabActive, { backgroundColor: palette.blue }],
                  // Inactive glyphs dim under the finger — the only press
                  // feedback the dock needs, no scale, no ripple.
                  pressed && !active && styles.tabPressed,
                ]}>
                <Feather
                  name={tab.icon}
                  size={21}
                  color={active ? palette.onAccent : palette.textTertiary}
                />
                {active && (
                  <Animated.Text
                    entering={reducedMotion ? undefined : FadeIn.duration(Motion.fast)}
                    numberOfLines={1}
                    style={[styles.label, { color: palette.onAccent }]}>
                    {tab.label}
                  </Animated.Text>
                )}
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.screen,
    alignItems: 'center',
  },
  dock: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: Size.dockHeight,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.sm + 2,
  },
  tab: {
    height: Size.touchTarget,
    minWidth: Size.touchTarget,
    borderRadius: Radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  tabActive: {
    paddingHorizontal: Spacing.lg,
  },
  tabPressed: {
    opacity: 0.55,
  },
  label: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
});
