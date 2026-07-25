import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { usePathname, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  BrandColor,
  FontSize,
  FontWeight,
  Gradient,
  HitSlop,
  IconSize,
  LetterSpacing,
  Palette,
  Spacing,
} from '@/constants/design';
import { Timing } from '@/constants/motion';
import { navShadow } from '@/constants/shadow';

// ── Metrics ───────────────────────────────────────────────────────────────────

const LABEL_LINE_HEIGHT = 14;
/** Height of the bar itself, above the safe-area inset. */
const BAR_HEIGHT = Spacing.md + IconSize.xl + Spacing.xs + LABEL_LINE_HEIGHT;
/** Height of the fade that dissolves scrolling content into the bar. */
const FADE_HEIGHT = Spacing.xl;

/**
 * Vertical space a scrolling screen must reserve at the bottom so its last item
 * is never trapped under the navigation.
 *
 * The bar is positioned absolutely — content passes *behind* it rather than
 * stopping above it — so every scroll container is responsible for its own
 * bottom padding. Ask for it here instead of guessing a number.
 */
export function useBottomNavSpace() {
  const insets = useSafeAreaInsets();
  return BAR_HEIGHT + Math.max(insets.bottom, Spacing.sm);
}

// ── Tabs ──────────────────────────────────────────────────────────────────────

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

/**
 * One tab. Active and inactive states are two stacked layers crossfading on the
 * micro token, rather than a colour swap: no layout jump, no icon resizing, and
 * the change is felt more than it is seen. Both layers are laid out identically
 * so a bold active label never nudges its neighbours.
 */
function TabItem({ tab, active, onPress }: { tab: Tab; active: boolean; onPress: () => void }) {
  const progress = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: active ? 1 : 0,
      useNativeDriver: true,
      ...Timing.micro,
    });
    animation.start();
    return () => animation.stop();
  }, [active, progress]);

  const idle = progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });

  return (
    <Pressable
      style={styles.tab}
      hitSlop={HitSlop.md}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={tab.label}
      onPress={onPress}>
      <View style={styles.iconBox}>
        <Animated.View style={[styles.layer, { opacity: idle }]}>
          <Feather name={tab.icon} size={IconSize.xl} color={Palette.textTertiary} />
        </Animated.View>
        <Animated.View style={[styles.layer, { opacity: progress }]}>
          <Feather name={tab.icon} size={IconSize.xl} color={BrandColor.tabActive} />
        </Animated.View>
      </View>

      <View style={styles.labelBox}>
        <Animated.Text style={[styles.label, styles.labelIdle, { opacity: idle }]} numberOfLines={1}>
          {tab.label}
        </Animated.Text>
        <Animated.Text
          style={[styles.label, styles.labelActive, { opacity: progress }]}
          numberOfLines={1}>
          {tab.label}
        </Animated.Text>
      </View>
    </Pressable>
  );
}

// ── Bar ───────────────────────────────────────────────────────────────────────

/**
 * The app's bottom navigation. Floats over the page: the content scrolls
 * underneath and dissolves into the bar through a short white fade, so the
 * screen reads as one continuous surface with the navigation resting on top.
 *
 * Deliberately not a blur/glass effect — depth here comes from the fade and a
 * very soft upward shadow, which stays legible on any background and costs
 * nothing at scroll time.
 */
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
    <View style={styles.root} pointerEvents="box-none">
      <LinearGradient colors={Gradient.navFade} style={styles.fade} pointerEvents="none" />

      <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, Spacing.sm) }]}>
        {TABS.map((tab, index) => (
          <TabItem
            key={tab.label}
            tab={tab}
            active={index === activeIndex}
            onPress={() => handlePress(tab, index)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  fade: {
    height: FADE_HEIGHT,
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: Palette.card,
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.sm,
    ...navShadow,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  iconBox: {
    width: IconSize.xl,
    height: IconSize.xl,
  },
  layer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelBox: {
    alignSelf: 'stretch',
    height: LABEL_LINE_HEIGHT,
  },
  label: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: FontSize.tiny,
    lineHeight: LABEL_LINE_HEIGHT,
    letterSpacing: LetterSpacing.slight,
  },
  labelIdle: {
    color: Palette.textTertiary,
    fontWeight: FontWeight.regular,
  },
  labelActive: {
    color: BrandColor.tabActive,
    fontWeight: FontWeight.semibold,
  },
});
