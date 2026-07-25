import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import {
  Accent,
  AccentName,
  BadgeSize,
  BadgeSizeName,
  FontWeight,
  LetterSpacing,
  Radius,
  Spacing,
} from '@/constants/design';
import { AppText } from './app-text';

type FeatherName = React.ComponentProps<typeof Feather>['name'];

export type AppBadgeProps = {
  label: string;
  /** Accent family — sets the soft background + solid text/icon colour. */
  accent?: AccentName;
  size?: BadgeSizeName;
  /** Uppercase micro-label (e.g. "EN COURS", "URGENT"). */
  uppercase?: boolean;
  /** Optional leading icon, sized by the badge size token. */
  icon?: FeatherName;
};

/**
 * The one status pill of the app.
 *
 * Geometry (height, padding, radius, text size, icon size) comes entirely from
 * `BadgeSize`, so "Confirmé" on Home and "EN COURS" on Planning are the same
 * object in two colours — never two pills that merely resemble each other.
 * A fixed height, rather than vertical padding, is what guarantees badges line
 * up across screens whatever their label.
 *
 * For interactive filter pills use AppChip.
 */
export function AppBadge({
  label,
  accent = 'blue',
  size = 'md',
  uppercase = false,
  icon,
}: AppBadgeProps) {
  const a = Accent[accent];
  const s = BadgeSize[size];

  return (
    <View
      style={[
        styles.base,
        { height: s.height, paddingHorizontal: s.paddingHorizontal, backgroundColor: a.soft },
      ]}>
      {icon ? <Feather name={icon} size={s.iconSize} color={a.solid} /> : null}
      <AppText
        style={[
          styles.label,
          {
            fontSize: s.fontSize,
            color: a.solid,
            letterSpacing: uppercase ? LetterSpacing.wide : LetterSpacing.slight,
          },
        ]}
        numberOfLines={1}>
        {uppercase ? label.toUpperCase() : label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    borderRadius: Radius.pill,
    alignSelf: 'flex-start',
  },
  label: {
    fontWeight: FontWeight.semibold,
  },
});
