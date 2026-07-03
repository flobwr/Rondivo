import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette, Radius, Spacing } from '@/constants/design';
import { actionShadow, heroShadow } from '@/constants/shadow';
import { SectionCard } from './SectionCard';

type MiniAction = {
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  onPress?: () => void;
};

function MiniActionButton({ label, icon, onPress }: MiniAction) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, { toValue: 0.94, useNativeDriver: true, friction: 5, tension: 300 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 100 }).start();
  };

  return (
    <Pressable style={styles.miniWrapper} onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
      <Animated.View style={[styles.miniInner, { transform: [{ scale }] }]}>
        <View style={styles.miniTile}>
          <Feather name={icon} size={19} color={Palette.blue} />
        </View>
        <Text style={styles.miniLabel} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

type Props = {
  onCall?: () => void;
  onSms?: () => void;
  onNavigate?: () => void;
  onEdit?: () => void;
  onStart?: () => void;
};

export function QuickActionsCard({ onCall, onSms, onNavigate, onEdit, onStart }: Props) {
  const ctaScale = useRef(new Animated.Value(1)).current;

  const onCtaPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.spring(ctaScale, { toValue: 0.97, useNativeDriver: true, friction: 6, tension: 300 }).start();
  };
  const onCtaPressOut = () => {
    Animated.spring(ctaScale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  const actions: MiniAction[] = [
    { label: 'Appeler', icon: 'phone', onPress: onCall },
    { label: 'SMS', icon: 'message-circle', onPress: onSms },
    { label: 'Itinéraire', icon: 'navigation', onPress: onNavigate },
    { label: 'Modifier', icon: 'edit-2', onPress: onEdit },
  ];

  return (
    <SectionCard>
      <View style={styles.row}>
        {actions.map((action) => (
          <MiniActionButton key={action.label} {...action} />
        ))}
      </View>

      <Pressable onPressIn={onCtaPressIn} onPressOut={onCtaPressOut} onPress={onStart} style={styles.ctaWrapper}>
        <Animated.View style={{ transform: [{ scale: ctaScale }] }}>
          <LinearGradient
            colors={[Palette.gradientStart, Palette.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cta}>
            <Feather name="play" size={16} color={Palette.white} />
            <Text style={styles.ctaText}>Commencer l&rsquo;intervention</Text>
          </LinearGradient>
        </Animated.View>
      </Pressable>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  miniWrapper: {
    flex: 1,
  },
  miniInner: {
    alignItems: 'center',
  },
  miniTile: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Palette.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
    ...actionShadow,
  },
  miniLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textPrimary,
    marginTop: 7,
    letterSpacing: -0.1,
    textAlign: 'center',
  },
  ctaWrapper: {
    marginTop: Spacing.md,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    height: 52,
    borderRadius: Radius.pill,
    ...heroShadow,
  },
  ctaText: {
    color: Palette.white,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
