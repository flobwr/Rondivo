import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { Accent, AccentName, IconSize, Palette } from '@/constants/design';
import { AppText } from './app-text';

type FeatherName = React.ComponentProps<typeof Feather>['name'];

export type AppMetricProps = {
  /** Small uppercase label above the value (e.g. "TRAJET", "DÉPART CONSEILLÉ"). */
  label: string;
  /** The headline value (e.g. "10:12", "18 min • 7,4 km"). */
  value: string;
  /** Optional secondary line under the value. */
  hint?: string;
  /** Optional leading icon. */
  icon?: FeatherName;
  accent?: AccentName;
  /** Use the large value size (hero-style figure). */
  emphasized?: boolean;
  /** Render value/label in white for use on coloured surfaces (hero card). */
  onColor?: boolean;
};

/**
 * A labelled figure: overline label + value (+ optional hint). This is the
 * "DÉPART CONSEILLÉ / 10:12" and "TRAJET / 18 min" pattern from the hero card,
 * generalised so dashboards and detail screens stay consistent.
 */
export function AppMetric({
  label,
  value,
  hint,
  icon,
  accent = 'blue',
  emphasized = false,
  onColor = false,
}: AppMetricProps) {
  const labelColor = onColor ? 'inverse' : 'tertiary';
  const valueColor = onColor ? 'inverse' : 'primary';

  return (
    <View style={styles.wrapper}>
      <AppText variant="overline" color={labelColor}>
        {label}
      </AppText>
      <View style={styles.valueRow}>
        {icon ? (
          <Feather
            name={icon}
            size={IconSize.md}
            color={onColor ? Palette.white : Accent[accent].solid}
          />
        ) : null}
        <AppText variant={emphasized ? 'title2' : 'bodyStrong'} color={valueColor} numberOfLines={1}>
          {value}
        </AppText>
      </View>
      {hint ? (
        <AppText variant="caption" color={onColor ? 'inverse' : 'tertiary'} numberOfLines={1}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 3,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
