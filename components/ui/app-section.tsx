import { StyleSheet, View, ViewProps } from 'react-native';

import { Spacing } from '@/constants/design';
import { AppText } from './app-text';

export type AppSectionProps = ViewProps & {
  /** Section heading. Omit for an unlabelled grouping. */
  title?: string;
  /** Optional supporting line under the title. */
  subtitle?: string;
  /** Right-aligned accessory (e.g. a "Voir tout" link or AppButton). */
  action?: React.ReactNode;
  /** Vertical gap above the section. Defaults to the standard section gap. */
  gap?: keyof typeof Spacing | number;
  /** Heading emphasis: `section` (default) or the smaller `label` grouping. */
  emphasis?: 'section' | 'label';
};

/**
 * A titled block of a screen. Standardises the "section title + content"
 * rhythm repeated in Home ("Le reste de la journée") and Rappels (grouped
 * lists), so vertical spacing and heading styles never drift per screen.
 */
export function AppSection({
  title,
  subtitle,
  action,
  gap = 'section',
  emphasis = 'section',
  style,
  children,
  ...rest
}: AppSectionProps) {
  const marginTop = typeof gap === 'number' ? gap : Spacing[gap];

  return (
    <View style={[{ marginTop }, style]} {...rest}>
      {title || action ? (
        <View style={styles.headerRow}>
          <View style={styles.headingText}>
            {title ? (
              <AppText
                variant={emphasis === 'section' ? 'section' : 'subheadStrong'}
                color={emphasis === 'section' ? 'primary' : 'secondary'}>
                {title}
              </AppText>
            ) : null}
            {subtitle ? (
              <AppText variant="footnote" color="secondary" style={styles.subtitle}>
                {subtitle}
              </AppText>
            ) : null}
          </View>
          {action ? <View>{action}</View> : null}
        </View>
      ) : null}
      <View style={title || action ? styles.body : null}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headingText: {
    flex: 1,
  },
  subtitle: {
    marginTop: 2,
  },
  body: {
    marginTop: Spacing.md,
  },
});
