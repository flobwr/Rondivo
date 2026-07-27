import { Feather } from '@expo/vector-icons';
import { memo, useMemo } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/contexts/theme';
import { useEntrance } from '@/hooks/use-entrance';
import { usePressScale } from '@/hooks/use-press-scale';
import {
  EntranceScale,
  EntranceTravel,
  getElevation,
  Numeric,
  PressScale,
  Radius,
  Spacing,
  Type,
  type PaletteShape,
} from '@/theme';
import { getStatusMeta } from './status';
import { Intervention } from './types';

type Props = {
  intervention: Intervention;
  /** position in the list — drives a light staggered entrance */
  index?: number;
  onPress?: () => void;
  /**
   * Render at rest, with no entrance. Set by the living transition layer when
   * it redraws this card as the first frame of an expansion — that copy must
   * be identical to the one already on screen, not a card arriving.
   */
  atRest?: boolean;
};

/**
 * One job on the day — the Planning's counterpart of Home's `ScheduleCard`,
 * and deliberately the SAME object: same radius, same padding, same 12 pt
 * gap, same pressed time chip on the left, same client / type / address
 * stack, same elevation tier. Open the Home and the Planning back to back
 * and the two lists are the same list.
 *
 * The one thing this card adds is the end time, sitting quietly under the
 * chip. It used to carry a small clock glyph and a three-dot connector as
 * well — decoration standing in for the hierarchy the chip now provides.
 *
 * Status colours follow the existing Rondivo logic: done is greyed back,
 * in-progress is tinted, upcoming stays on the paper's own sheet.
 */
function InterventionCardBase({ intervention, index = 0, onPress, atRest = false }: Props) {
  const { progress: enter } = useEntrance({ index, skip: atRest });
  const { scale: pressScale, onPressIn, onPressOut } = usePressScale({ to: PressScale.surface });
  const { palette, resolvedTheme } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const elevation = getElevation(resolvedTheme);

  const meta = getStatusMeta(palette)[intervention.status];
  const isActive = intervention.status === 'inProgress';
  const isDone = intervention.status === 'done';
  const isPostponed = intervention.status === 'postponed';
  const isCancelled = intervention.status === 'cancelled';
  const showChip = intervention.status !== 'planned';

  const translateY = enter.interpolate({ inputRange: [0, 1], outputRange: [EntranceTravel, 0] });
  const enterScale = enter.interpolate({ inputRange: [0, 1], outputRange: [EntranceScale, 1] });
  const scale = Animated.multiply(pressScale, enterScale);
  const opacity = isDone
    ? Animated.multiply(enter, 0.66)
    : isCancelled
      ? Animated.multiply(enter, 0.6)
      : isPostponed
        ? Animated.multiply(enter, 0.85)
        : enter;

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
      <Animated.View
        style={[
          styles.card,
          // `card`, the same tier Home's schedule rows rest on — a wide, soft
          // ambient shadow rather than the tighter one this list used to have.
          elevation.card,
          isActive ? [styles.cardActive, elevation.raised] : null,
          isPostponed ? styles.cardPostponed : null,
          { opacity, transform: [{ translateY }, { scale }] },
        ]}>
        {/* Time — the pressed chip from Home's schedule row, with the end
            time hung underneath it. */}
        <View style={styles.timeCol}>
          <View style={styles.timeChip}>
            <Text
              style={[styles.time, Numeric, isDone || isCancelled ? styles.timeMuted : null]}>
              {intervention.start}
            </Text>
          </View>
          <Text style={[styles.endTime, Numeric]}>{intervention.end}</Text>
        </View>

        {/* Job */}
        <View style={styles.main}>
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.client,
                isDone ? styles.clientMuted : null,
                isCancelled ? styles.clientCancelled : null,
              ]}
              numberOfLines={1}>
              {intervention.client}
            </Text>
            {showChip ? (
              <View
                style={[
                  styles.chip,
                  { backgroundColor: meta.dot === 'pulse' && isActive ? meta.color : meta.soft },
                ]}>
                <Text style={[styles.chipLabel, { color: isActive ? palette.onAccent : meta.color }]}>
                  {meta.label}
                </Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.type} numberOfLines={1}>
            {intervention.type}
          </Text>

          <View style={styles.addressRow}>
            <Feather name="map-pin" size={11} color={palette.textTertiary} />
            <Text style={styles.address} numberOfLines={1}>
              {intervention.address}
            </Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export const InterventionCard = memo(InterventionCardBase);

function createStyles(palette: PaletteShape) {
  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: Spacing.md,
      // A sheet let down onto the paper rather than laid on top of it: a
      // sliver of the page tints it through, and a hairline edge gives it a
      // definition the softened shadow no longer has to carry alone. Both
      // are deliberately at the threshold of visible — this is surface life,
      // not glass.
      backgroundColor: palette.cardTranslucent,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: palette.border,
      borderRadius: Radius.card,
      paddingVertical: 14,
      paddingHorizontal: 14,
    },
    cardActive: {
      backgroundColor: palette.blueTint,
      borderColor: palette.blueBorder,
    },
    cardPostponed: {
      borderStyle: 'dashed',
      borderWidth: 1, // a hairline dash renders as a solid line — this one needs body
      borderColor: palette.orangeBorder,
    },
    timeCol: {
      alignItems: 'center',
    },
    timeChip: {
      backgroundColor: palette.inset,
      borderRadius: Radius.control,
      paddingHorizontal: Spacing.sm,
      paddingVertical: 5,
    },
    time: {
      fontSize: 14,
      fontWeight: '700',
      letterSpacing: -0.2,
      color: palette.textPrimary,
    },
    timeMuted: {
      color: palette.textSecondary,
    },
    endTime: {
      ...Type.caption,
      color: palette.textTertiary,
      marginTop: 5,
    },
    main: {
      flex: 1,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    client: {
      ...Type.bodyStrong,
      flex: 1,
      fontWeight: '700',
      color: palette.textPrimary,
    },
    clientMuted: {
      color: palette.textSecondary,
    },
    clientCancelled: {
      color: palette.textTertiary,
      textDecorationLine: 'line-through',
    },
    // The status badge. Every number here is optical rather than round:
    // 11 pt type needs a taller than wide bed to sit in a capsule without
    // looking pinched (3 pt of lead under 11 pt of type read as squeezed), and
    // small type set tight is what made it read as generic. Positive tracking
    // is the single biggest difference between a label and a badge at this
    // size — it is the same move a watch face makes on its smallest legends.
    chip: {
      borderRadius: Radius.pill,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    chipLabel: {
      fontSize: 11,
      lineHeight: 13,
      fontWeight: '600',
      letterSpacing: 0.2,
    },
    // Name and job are ONE pair, address is the metadata under it: 3 points
    // inside the pair, 7 below it. They were 2 and 5 — too close to read as
    // two levels, so the three lines flattened into one grey block.
    type: {
      ...Type.footnote,
      fontWeight: '500',
      color: palette.textSecondary,
      marginTop: 3,
    },
    addressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      marginTop: 7,
    },
    // 12, not 12.5: at half a point under the job line the two were the same
    // size wearing different colours. A full point of separation, plus the
    // tertiary ink, puts the address firmly on the third level.
    address: {
      flex: 1,
      fontSize: 12,
      lineHeight: 16,
      color: palette.textTertiary,
    },
  });
}
