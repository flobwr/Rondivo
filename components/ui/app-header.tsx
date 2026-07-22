import { StyleSheet, View, ViewProps } from 'react-native';

import { Spacing } from '@/constants/design';
import { AppText } from './app-text';

export type AppHeaderProps = ViewProps & {
  title: string;
  subtitle?: string;
  /** Small uppercase eyebrow above the title (e.g. a month, a category). */
  eyebrow?: string;
  /** Leading node — typically a back AppIconButton or an AppAvatar. */
  leading?: React.ReactNode;
  /** Trailing node(s) — action buttons. */
  trailing?: React.ReactNode;
  /** Title scale. `screen` = large screen title, `page` = compact. */
  size?: 'screen' | 'page';
};

/**
 * A screen header: optional leading (back / avatar), a title block, and
 * trailing actions. Generalises the Rappels back-header and the Planning
 * month/title header so every screen's top area is built the same way.
 */
export function AppHeader({
  title,
  subtitle,
  eyebrow,
  leading,
  trailing,
  size = 'screen',
  style,
  ...rest
}: AppHeaderProps) {
  return (
    <View style={[styles.row, style]} {...rest}>
      {leading ? <View style={styles.leading}>{leading}</View> : null}
      <View style={styles.titleBlock}>
        {eyebrow ? <AppText variant="overline" color="secondary">{eyebrow}</AppText> : null}
        <AppText variant={size === 'screen' ? 'title1' : 'title2'} numberOfLines={1}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="footnote" color="secondary" numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
  leading: {
    marginRight: Spacing.md,
  },
  titleBlock: {
    flex: 1,
  },
  subtitle: {
    marginTop: 2,
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginLeft: Spacing.sm,
  },
});
