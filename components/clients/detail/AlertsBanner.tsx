import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRef, useState } from 'react';
import {
  Animated,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';

import { TINT_COLORS, type Tint } from '@/components/clients/types';
import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { type AlertSeverity, type ClientAlert } from '@/data/client-details';
import { PressableScale } from './primitives';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
  alerts: ClientAlert[];
  onPressAlert?: (alert: ClientAlert) => void;
};

const SEVERITY_TINT: Record<AlertSeverity, Tint> = {
  critical: 'red',
  warning: 'orange',
  info: 'blue',
};

/**
 * One compact banner instead of a stack of cards. Collapsed it says how many
 * things need attention; tapping expands the detail inline. When nothing is
 * pending it renders nothing — no reassurance card taking space.
 */
export function AlertsBanner({ alerts, onPressAlert }: Props) {
  const [open, setOpen] = useState(false);
  const chevron = useRef(new Animated.Value(0)).current;

  if (alerts.length === 0) return null;

  const topTint = SEVERITY_TINT[alerts[0].severity];
  const accent = TINT_COLORS[topTint].color;
  const soft = TINT_COLORS[topTint].soft;
  const count = alerts.length;

  const toggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    LayoutAnimation.configureNext(LayoutAnimation.create(220, 'easeInEaseOut', 'opacity'));
    Animated.spring(chevron, { toValue: open ? 0 : 1, useNativeDriver: true, friction: 7, tension: 120 }).start();
    setOpen((v) => !v);
  };

  const rotate = chevron.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

  return (
    <View style={[styles.banner, { backgroundColor: soft }]}>
      <Pressable style={styles.summary} onPress={toggle} accessibilityRole="button">
        <View style={[styles.iconTile, { backgroundColor: Palette.card }]}>
          <Feather name="alert-triangle" size={16} color={accent} />
        </View>
        <Text style={styles.summaryText}>
          {count} action{count > 1 ? 's' : ''} nécessite{count > 1 ? 'nt' : ''} votre attention
        </Text>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Feather name="chevron-down" size={18} color={accent} />
        </Animated.View>
      </Pressable>

      {open ? (
        <View style={styles.list}>
          {alerts.map((alert) => {
            const tint = SEVERITY_TINT[alert.severity];
            const color = TINT_COLORS[tint].color;
            return (
              <PressableScale
                key={alert.id}
                onPress={onPressAlert ? () => onPressAlert(alert) : undefined}
                to={0.98}
                style={styles.row}
                accessibilityLabel={alert.title}>
                <View style={[styles.rowIcon, { backgroundColor: Palette.card }]}>
                  <Feather name={alert.icon} size={15} color={color} />
                </View>
                <View style={styles.rowTexts}>
                  <Text style={styles.rowTitle}>{alert.title}</Text>
                  {alert.subtitle ? <Text style={styles.rowSubtitle}>{alert.subtitle}</Text> : null}
                </View>
                <Feather name="chevron-right" size={16} color={color} />
              </PressableScale>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    ...cardShadow,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconTile: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryText: {
    flex: 1,
    fontSize: FontSize.label,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  list: {
    marginTop: 12,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Palette.card,
    borderRadius: Radius.tile,
    padding: 12,
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  rowTexts: {
    flex: 1,
  },
  rowTitle: {
    fontSize: FontSize.label,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  rowSubtitle: {
    fontSize: FontSize.small,
    fontWeight: '500',
    color: Palette.textSecondary,
    marginTop: 2,
  },
});
