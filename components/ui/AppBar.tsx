import { type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { IconWell, type IconName } from '@/components/ui/IconWell';
import { useTheme } from '@/contexts/theme';
import { Size, Spacing, Type } from '@/theme';

/**
 * Rondivo app bar — the DS's one screen header.
 *
 * iOS-adjacent anatomy: a compact centered title (17 pt semibold — never a
 * shouting 22/800) flanked by circular icon wells. The bar itself is
 * invisible: no background, no border, no shadow — the paper runs straight
 * through it, and hierarchy comes from type and the wells alone.
 *
 * `right` accepts either a ready-made action (`{ icon, onPress, label }`)
 * or arbitrary chrome for the rare screen that needs more than one action.
 */
export function AppBar({
  title,
  onBack,
  right,
  subtitle,
}: {
  title: string;
  onBack?: () => void;
  right?: { icon: IconName; onPress: () => void; label: string } | ReactNode;
  subtitle?: string;
}) {
  const { palette } = useTheme();

  const rightNode =
    right && typeof right === 'object' && 'icon' in (right as object) ? (
      <IconWell
        icon={(right as { icon: IconName }).icon}
        onPress={(right as { onPress: () => void }).onPress}
        accessibilityLabel={(right as { label: string }).label}
      />
    ) : (
      (right as ReactNode)
    );

  return (
    <View style={styles.row}>
      <View style={styles.titleWrap} pointerEvents="none">
        <Text style={[Type.heading, { color: palette.textPrimary }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[Type.caption, { color: palette.textTertiary, marginTop: 1 }]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={styles.side}>
        {onBack ? <IconWell icon="chevron-left" iconSize={22} onPress={onBack} accessibilityLabel="Retour" /> : null}
      </View>
      <View style={[styles.side, styles.sideRight]}>{rightNode}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: Size.iconWell + 16,
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.md,
  },
  titleWrap: {
    position: 'absolute',
    left: Spacing.screen + Size.iconWell + Spacing.md,
    right: Spacing.screen + Size.iconWell + Spacing.md,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  side: {
    width: Size.iconWell,
    height: Size.iconWell,
  },
  sideRight: {
    alignItems: 'flex-end',
  },
});
