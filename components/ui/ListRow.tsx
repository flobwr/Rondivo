import { Feather } from '@expo/vector-icons';
import { type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { type IconName } from '@/components/ui/IconWell';
import { PressableScale } from '@/components/ui/PressableScale';
import { useTheme } from '@/contexts/theme';
import { Radius, Spacing, Type } from '@/theme';

/**
 * Rondivo list row — the DS's one anatomy for a tappable line inside a card:
 * leading icon tile → title / subtitle → trailing meta → optional chevron.
 * Rows are separated by `RowSeparator`, never by borders on the row itself.
 */
export function ListRow({
  icon,
  iconTone,
  title,
  subtitle,
  meta,
  trailing,
  chevron = false,
  onPress,
}: {
  icon?: IconName;
  /** Tint for the icon tile; defaults to the quiet neutral well. */
  iconTone?: { ink: string; wash: string };
  title: string;
  subtitle?: string;
  /** Short trailing text (a date, an amount) — tabular where numeric. */
  meta?: string;
  /** Arbitrary trailing chrome (a Badge, a switch); wins over `meta`. */
  trailing?: ReactNode;
  chevron?: boolean;
  onPress?: () => void;
}) {
  const { palette } = useTheme();

  return (
    <PressableScale onPress={onPress} to={0.985} accessibilityLabel={title} style={styles.row}>
      {icon ? (
        <View
          style={[
            styles.tile,
            { backgroundColor: iconTone?.wash ?? palette.iconButtonBg },
          ]}>
          <Feather name={icon} size={16} color={iconTone?.ink ?? palette.textSecondary} />
        </View>
      ) : null}

      <View style={styles.body}>
        <Text style={[Type.subhead, { color: palette.textPrimary }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={[Type.footnote, { color: palette.textSecondary, marginTop: 2 }]}
            numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {trailing ??
        (meta ? (
          <Text style={[Type.caption, { color: palette.textTertiary }]} numberOfLines={1}>
            {meta}
          </Text>
        ) : null)}
      {chevron ? <Feather name="chevron-right" size={16} color={palette.textTertiary} /> : null}
    </PressableScale>
  );
}

export function RowSeparator({ inset = 0 }: { inset?: number }) {
  const { palette } = useTheme();
  return (
    <View
      style={{
        height: StyleSheet.hairlineWidth,
        backgroundColor: palette.separator,
        marginLeft: inset,
      }}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: 13,
    minHeight: 48,
  },
  tile: {
    width: 36,
    height: 36,
    borderRadius: Radius.control,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  body: {
    flex: 1,
  },
});
