import { Feather } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { FeatherIconName } from '../types';
import { NextActionBanner } from './NextActionBanner';
import { IconTile, PressableScale } from './primitives';

export type ConfirmationAction = { key: string; icon: FeatherIconName; label: string; onPress: () => void };

// The "what's next" step after creating a document — replaces the old
// Alert+router.back() stub so the artisan can naturally continue the
// workflow (send it, share it, mark it paid…) instead of landing back on a
// blank list.
export function CreationConfirmationSheet({
  visible,
  title,
  subtitle,
  primaryAction,
  secondaryActions,
  onDismiss,
}: {
  visible: boolean;
  title: string;
  subtitle: string;
  primaryAction: ConfirmationAction;
  secondaryActions: ConfirmationAction[];
  onDismiss: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(progress, { toValue: visible ? 1 : 0, useNativeDriver: true, friction: 11, tension: 90 }).start();
  }, [visible, progress]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [height, 0] });

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onDismiss} statusBarTranslucent>
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, { opacity: progress }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onDismiss} accessibilityLabel="Fermer" />
        </Animated.View>

        <Animated.View
          style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) + 8, transform: [{ translateY }] }]}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <IconTile icon="check" color={Palette.green} soft={Palette.greenSoft} size={44} iconSize={20} radius={22} />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          <View style={styles.actions}>
            <NextActionBanner label={primaryAction.label} icon={primaryAction.icon} onPress={primaryAction.onPress} />

            {secondaryActions.map((action) => (
              <PressableScale
                key={action.key}
                onPress={action.onPress}
                to={0.98}
                style={styles.secondaryRow}
                accessibilityLabel={action.label}>
                <IconTile icon={action.icon} color={Palette.textPrimary} soft={Palette.cardMuted} size={36} iconSize={16} />
                <Text style={styles.secondaryLabel}>{action.label}</Text>
                <Feather name="chevron-right" size={17} color={Palette.textTertiary} />
              </PressableScale>
            ))}
          </View>

          <Pressable onPress={onDismiss} hitSlop={8} style={styles.dismiss} accessibilityLabel="Terminé">
            <Text style={styles.dismissText}>Terminé</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15, 23, 41, 0.38)' },
  sheet: {
    backgroundColor: Palette.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: Spacing.screen,
    paddingTop: 10,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D7DCE4',
    marginBottom: 18,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.section,
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.4,
    marginTop: 12,
  },
  subtitle: {
    fontSize: FontSize.small,
    fontWeight: '500',
    color: Palette.textTertiary,
    letterSpacing: -0.1,
    marginTop: 4,
    textAlign: 'center',
  },
  actions: {
    gap: 10,
  },
  secondaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Palette.cardMuted,
    borderRadius: Radius.tile,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  secondaryLabel: {
    flex: 1,
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  dismiss: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  dismissText: {
    fontSize: FontSize.small,
    fontWeight: '600',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
  },
});
