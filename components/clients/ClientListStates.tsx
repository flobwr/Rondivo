import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette, Radius, Spacing } from '@/constants/design';
import { actionShadow } from '@/constants/shadow';

function PrimaryButton({
  icon,
  label,
  onPress,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  onPress?: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, friction: 6, tension: 300 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable style={styles.button} hitSlop={8} onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
        <Feather name={icon} size={16} color={Palette.white} />
        <Text style={styles.buttonText}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

export type EmptyMode = 'no-clients' | 'no-results' | 'no-filter-match';

const EMPTY_COPY: Record<EmptyMode, { icon: React.ComponentProps<typeof Feather>['name']; title: string; subtitle: string; reset: boolean }> = {
  'no-clients': {
    icon: 'users',
    title: 'Aucun client',
    subtitle: 'Ajoutez votre premier client pour le voir apparaître ici.',
    reset: false,
  },
  'no-results': {
    icon: 'search',
    title: 'Aucun résultat',
    subtitle: 'Aucun client ne correspond à votre recherche. Essayez un autre terme.',
    reset: true,
  },
  'no-filter-match': {
    icon: 'filter',
    title: 'Aucun client ici',
    subtitle: 'Aucun client dans cette catégorie pour le moment.',
    reset: true,
  },
};

/** Shown when the list is empty — the exact copy depends on why. */
export function ClientsEmptyState({ mode, onReset }: { mode: EmptyMode; onReset?: () => void }) {
  const enter = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(enter, { toValue: 1, useNativeDriver: true, friction: 8, tension: 70 }).start();
  }, [enter]);
  const translateY = enter.interpolate({ inputRange: [0, 1], outputRange: [12, 0] });
  const copy = EMPTY_COPY[mode];

  return (
    <Animated.View style={[styles.wrapper, { opacity: enter, transform: [{ translateY }] }]}>
      <View style={styles.iconRing}>
        <Feather name={copy.icon} size={26} color={Palette.blue} />
      </View>
      <Text style={styles.title}>{copy.title}</Text>
      <Text style={styles.subtitle}>{copy.subtitle}</Text>
      {copy.reset && onReset ? <PrimaryButton icon="rotate-ccw" label="Réinitialiser" onPress={onReset} /> : null}
    </Animated.View>
  );
}

/** Shown when the initial load fails. */
export function ClientsErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <View style={styles.wrapper}>
      <View style={[styles.iconRing, styles.iconRingMuted]}>
        <Feather name="wifi-off" size={25} color={Palette.textSecondary} />
      </View>
      <Text style={styles.title}>Connexion perdue</Text>
      <Text style={styles.subtitle}>Impossible de charger vos clients pour le moment.</Text>
      <PrimaryButton icon="refresh-cw" label="Réessayer" onPress={onRetry} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    paddingHorizontal: Spacing.screen,
    paddingTop: 56,
  },
  iconRing: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: Palette.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconRingMuted: {
    backgroundColor: Palette.cardMuted,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
    marginTop: 6,
    marginBottom: 22,
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Palette.blue,
    borderRadius: Radius.pill,
    paddingHorizontal: 20,
    paddingVertical: 12,
    ...actionShadow,
  },
  buttonText: {
    color: Palette.white,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});
