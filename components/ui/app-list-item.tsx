import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { AccentName, IconSize, Palette, Spacing } from '@/constants/design';
import { PressScale } from '@/constants/motion';
import { AppIconTile } from './app-icon-tile';
import { AppText } from './app-text';
import { PressableScale, PressableScaleProps } from './pressable-scale';

type FeatherName = React.ComponentProps<typeof Feather>['name'];

export type AppListItemProps = Omit<PressableScaleProps, 'children' | 'style'> & {
  title: string;
  subtitle?: string;
  /** Leading icon shown inside an AppIconTile. */
  icon?: FeatherName;
  /** Accent for the leading tile. */
  accent?: AccentName;
  /** Custom leading node (overrides `icon`). */
  leading?: React.ReactNode;
  /** Custom trailing node. Defaults to a chevron when `onPress` is set. */
  trailing?: React.ReactNode;
  /** Show the default chevron even without a custom trailing node. */
  showChevron?: boolean;
};

/**
 * The canonical row: [leading tile] title / subtitle … [trailing/chevron].
 *
 * Replaces the bespoke rows in Rappels (ActionRow) and the reminders card.
 * Put several inside an AppCard with AppDivider between them for a grouped list.
 */
export function AppListItem({
  title,
  subtitle,
  icon,
  accent = 'blue',
  leading,
  trailing,
  showChevron,
  onPress,
  ...rest
}: AppListItemProps) {
  const chevron =
    trailing ??
    (showChevron ?? Boolean(onPress) ? (
      <Feather name="chevron-right" size={IconSize.lg} color={Palette.textTertiary} />
    ) : null);

  return (
    <PressableScale
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={onPress}
      disabled={!onPress}
      pressScale={onPress ? PressScale.surface : 1}
      haptic={onPress ? undefined : null}
      style={styles.row}
      {...rest}>
      {leading ?? (icon ? <AppIconTile icon={icon} accent={accent} /> : null)}
      <View style={styles.text}>
        <AppText variant="bodyStrong" numberOfLines={2}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="footnote" color="tertiary" numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {chevron}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  text: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  subtitle: {
    marginTop: 2,
  },
});
