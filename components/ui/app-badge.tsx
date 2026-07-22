import { StyleSheet } from 'react-native';

import { Accent, AccentName, FontWeight, LetterSpacing, Radius, Spacing } from '@/constants/design';
import { AppText } from './app-text';

type Size = 'sm' | 'md';

export type AppBadgeProps = {
  label: string;
  /** Accent family — sets the soft background + solid text colour. */
  accent?: AccentName;
  size?: Size;
  /** Uppercase micro-label (e.g. "EN COURS", "URGENT"). */
  uppercase?: boolean;
};

/**
 * A small status pill (soft background, accent text). Replaces the ad-hoc
 * status pills in appointment cards, the header "5 interventions" badge and the
 * planning EN COURS / URGENT badges. For interactive filter pills use AppChip.
 */
export function AppBadge({ label, accent = 'blue', size = 'md', uppercase = false }: AppBadgeProps) {
  const a = Accent[accent];
  const s = size === 'sm' ? styles.sm : styles.md;

  return (
    <AppText
      style={[
        styles.base,
        s,
        {
          backgroundColor: a.soft,
          color: a.solid,
          letterSpacing: uppercase ? LetterSpacing.wide : LetterSpacing.slight,
        },
      ]}
      numberOfLines={1}>
      {uppercase ? label.toUpperCase() : label}
    </AppText>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.pill,
    overflow: 'hidden',
    fontWeight: FontWeight.semibold,
    alignSelf: 'flex-start',
  },
  sm: {
    fontSize: 10,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  md: {
    fontSize: 12,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
});
