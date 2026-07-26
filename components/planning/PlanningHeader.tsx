import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { LargeTitleBar } from '@/components/ui/LargeTitleBar';
import { PressableScale } from '@/components/ui/PressableScale';
import { useTheme } from '@/contexts/theme';
import { glowShadow, PressScale, Radius, Spacing } from '@/theme';

type Props = {
  monthLabel: string; // e.g. "JUILLET 2026"
  onAdd?: () => void;
};

const WELL = 52;

/**
 * The add action reads as "create an intervention on the calendar", not a
 * bare "+": a filled calendar glyph with a small plus badge, in the same
 * badge-ring vocabulary (a screen-coloured ring cut into the well) already
 * used by Home's notification well. Perfectly round, and lifted with the
 * brand-inked `glowShadow` — the same halo the active intervention card and
 * the selected calendar day carry — so the blue surfaces on this screen all
 * cast the same light.
 */
function AddInterventionWell({ onPress }: { onPress?: () => void }) {
  const { palette } = useTheme();

  return (
    <PressableScale
      onPress={onPress}
      to={PressScale.control}
      accessibilityLabel="Ajouter une intervention"
      style={styles.wellSlot}>
      <View style={[styles.well, { backgroundColor: palette.blue }, glowShadow]}>
        <Feather name="calendar" size={20} color={palette.onAccent} />
        <View style={[styles.badge, { backgroundColor: palette.float, borderColor: palette.screen }]}>
          <Feather name="plus" size={10} color={palette.blue} />
        </View>
      </View>
    </PressableScale>
  );
}

/**
 * The Planning root header is the DS `LargeTitleBar` in its `hero` size —
 * the month IS the screen's graphic anchor, with no eyebrow above it to
 * compete for the eye. The add action sits a touch below the title's own
 * baseline and pulled in from the gutter, so it reads as composed with
 * "JUILLET 2026" rather than parked in the corner.
 */
export function PlanningHeader({ monthLabel, onAdd }: Props) {
  return (
    <LargeTitleBar
      title={monthLabel}
      size="hero"
      trailing={<AddInterventionWell onPress={onAdd} />}
    />
  );
}

const styles = StyleSheet.create({
  wellSlot: {
    marginRight: Spacing.xs,
    marginBottom: 6,
  },
  well: {
    width: WELL,
    height: WELL,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: Radius.pill,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
