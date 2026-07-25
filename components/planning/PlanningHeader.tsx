import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { LargeTitleBar } from '@/components/ui/LargeTitleBar';
import { PressableScale } from '@/components/ui/PressableScale';
import { useTheme } from '@/contexts/theme';
import { getElevation, PressScale, Radius } from '@/theme';

type Props = {
  monthLabel: string; // e.g. "JUIN 2025"
  onAdd?: () => void;
};

const WELL = 44;

/**
 * The add action reads as "create an intervention on the calendar", not a
 * bare "+": a filled calendar glyph with a small plus badge, in the same
 * badge-ring vocabulary (a screen-coloured ring cut into the well) already
 * used by Home's notification well.
 */
function AddInterventionWell({ onPress }: { onPress?: () => void }) {
  const { palette, resolvedTheme } = useTheme();
  const elevation = getElevation(resolvedTheme);

  return (
    <PressableScale
      onPress={onPress}
      to={PressScale.control}
      accessibilityLabel="Ajouter une intervention"
      style={[styles.well, { backgroundColor: palette.blue }, elevation.card]}>
      <Feather name="calendar" size={19} color={palette.onAccent} />
      <View style={[styles.badge, { backgroundColor: palette.float, borderColor: palette.screen }]}>
        <Feather name="plus" size={10} color={palette.blue} />
      </View>
    </PressableScale>
  );
}

/**
 * Compatibility shim — the Planning root header is the DS `LargeTitleBar`,
 * with the month carrying the large title (the graphic anchor of the
 * screen) and "Planning" reduced to the small-caps eyebrow above it — the
 * reverse of a plain section header, on purpose.
 */
export function PlanningHeader({ monthLabel, onAdd }: Props) {
  return (
    <LargeTitleBar eyebrow="Planning" title={monthLabel} trailing={<AddInterventionWell onPress={onAdd} />} />
  );
}

const styles = StyleSheet.create({
  well: {
    width: WELL,
    height: WELL,
    borderRadius: Radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 19,
    height: 19,
    borderRadius: Radius.pill,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
