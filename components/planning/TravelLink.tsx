import { Feather } from '@expo/vector-icons';
import { memo, useMemo } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/contexts/theme';
import { useEntrance } from '@/hooks/use-entrance';
import { usePressScale } from '@/hooks/use-press-scale';
import {
  getElevation,
  Numeric,
  PressScale,
  Radius,
  Size,
  Spacing,
  Type,
  type PaletteShape,
} from '@/theme';
import { TravelLeg } from './types';

type Props = {
  travel: TravelLeg;
  index?: number;
  onNavigate?: () => void;
};

/**
 * A travel leg is a *connector*, not a card: a slim capsule at unchanged
 * height, starting on the very same left edge as the cards above and below
 * it so the eye runs straight down one axis.
 *
 * Everything inside it is centred on one line — the traffic dot, the truck,
 * the distance and the GPS button — and its right padding is set so the round
 * button is inset by exactly as much as it is from the top and bottom. It
 * carries the `whisper` tier: present, one step lighter than the cards it
 * links, the way a connector should be.
 */
function TravelLinkBase({ travel, index = 0, onNavigate }: Props) {
  const kmLabel = travel.km.toFixed(1).replace('.', ',');
  const { progress: enter } = useEntrance({ index });
  const { scale: pressScale, onPressIn, onPressOut } = usePressScale({ to: PressScale.icon });
  const { palette, resolvedTheme } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const elevation = getElevation(resolvedTheme);

  const trafficColor: Record<TravelLeg['traffic'], string> = {
    fluid: palette.green,
    dense: palette.orange,
    jammed: palette.red,
  };

  return (
    <Animated.View style={[styles.wrapper, { opacity: enter }]}>
      <View style={[styles.capsule, elevation.whisper]}>
        <View style={[styles.trafficDot, { backgroundColor: trafficColor[travel.traffic] }]} />
        <Feather name="truck" size={13} color={palette.textTertiary} />
        <Text style={[styles.label, Numeric]}>
          {travel.minutes} min · {kmLabel} km
        </Text>

        <View style={styles.spacer} />

        <Animated.View style={{ transform: [{ scale: pressScale }] }}>
          <Pressable
            hitSlop={10}
            style={styles.navButton}
            accessibilityRole="button"
            accessibilityLabel="Lancer l’itinéraire vers l’intervention suivante"
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={onNavigate}>
            <Feather name="navigation" size={13} color={palette.blue} />
          </Pressable>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

export const TravelLink = memo(TravelLinkBase);

/**
 * Padding that centres the nested GPS button in the capsule.
 *
 * The capsule's height is the button plus its vertical padding, so matching
 * the right padding to the vertical one is what makes the button sit in a
 * true circle of air rather than crowding the capsule's round end.
 */
const CAPSULE_PAD_Y = Spacing.sm;

function createStyles(palette: PaletteShape) {
  return StyleSheet.create({
    // No padding of its own: the gap above and below a travel leg comes
    // entirely from the timeline's shared ROW_GAP, same as every other row —
    // an extra wrapper inset here would make travel legs sit closer to their
    // neighbours than a card does.
    wrapper: {
      justifyContent: 'center',
    },
    capsule: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      minWidth: '66%',
      backgroundColor: palette.cardMuted,
      borderRadius: Radius.pill,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: palette.border,
      paddingVertical: CAPSULE_PAD_Y,
      paddingLeft: Spacing.lg,
      paddingRight: CAPSULE_PAD_Y,
      gap: Spacing.sm,
    },
    trafficDot: {
      width: 6,
      height: 6,
      borderRadius: Radius.pill,
    },
    label: {
      ...Type.footnote,
      fontWeight: '500',
      color: palette.textSecondary,
    },
    spacer: {
      flex: 1,
    },
    navButton: {
      width: Size.iconWellCompact,
      height: Size.iconWellCompact,
      borderRadius: Radius.pill,
      backgroundColor: palette.blueSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}
