import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { memo, useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { createThemedStyles, actionShadow, Palette } from '@/theme';
import { STATUS_META } from './status';
import { Intervention } from './types';

type Props = {
  intervention: Intervention;
  /** position in the list — drives a light staggered entrance */
  index?: number;
  onPress?: () => void;
};

// Card anatomy from the reference: a small clock, the time range stacked with
// a dotted connector (no side hour column anywhere), then the job — client,
// type, address. Status colours follow the existing Rondivo logic: done is
// greyed out, in-progress is tinted, upcoming stays white.
function InterventionCardBase({ intervention, index = 0, onPress }: Props) {
  const pressScale = useRef(new Animated.Value(1)).current;
  const enter = useRef(new Animated.Value(0)).current;

  const meta = STATUS_META[intervention.status];
  const isActive = intervention.status === 'inProgress';
  const isDone = intervention.status === 'done';
  const isPostponed = intervention.status === 'postponed';
  const isCancelled = intervention.status === 'cancelled';
  const showChip = intervention.status !== 'planned';

  useEffect(() => {
    Animated.spring(enter, {
      toValue: 1,
      useNativeDriver: true,
      friction: 9,
      tension: 80,
      delay: index * 45,
    }).start();
  }, [enter, index]);

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(pressScale, { toValue: 0.985, useNativeDriver: true, friction: 7, tension: 300 }).start();
  };
  const onPressOut = () => {
    Animated.spring(pressScale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  const translateY = enter.interpolate({ inputRange: [0, 1], outputRange: [10, 0] });
  const enterScale = enter.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1] });
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
          isActive ? styles.cardActive : null,
          isPostponed ? styles.cardPostponed : null,
          { opacity, transform: [{ translateY }, { scale }] },
        ]}>
        {/* Time range — part of the card, stacked like the reference */}
        <View style={styles.timeCol}>
          <Feather name="clock" size={13} color={Palette.textTertiary} style={styles.clockIcon} />
          <Text style={[styles.startTime, isDone || isCancelled ? styles.timeMuted : null]}>
            {intervention.start}
          </Text>
          <View style={styles.timeConnector}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={styles.connectorDot} />
            ))}
          </View>
          <Text style={styles.endTime}>{intervention.end}</Text>
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
                <Text
                  style={[
                    styles.chipLabel,
                    { color: isActive ? Palette.white : meta.color },
                  ]}>
                  {meta.label}
                </Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.type} numberOfLines={1}>
            {intervention.type}
          </Text>

          <View style={styles.addressRow}>
            <Feather name="map-pin" size={11} color={Palette.textTertiary} />
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

// The in-progress card carries a slightly stronger, brand-tinted lift; every
// other card keeps the barely-there shadow so the eye lands on the active job.
// Two-layer boxShadow like every DS elevation, but inked in Bleu Rondivo
// (rgb of Palette.blue) instead of the warm shadow ink.
const activeShadow = {
  boxShadow: '0 3px 7px rgba(36, 71, 207, 0.12), 0 14px 32px rgba(36, 71, 207, 0.16)',
};

const styles = createThemedStyles(() => StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Palette.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Palette.border,
    paddingVertical: 12,
    paddingHorizontal: 16,
    ...actionShadow,
  },
  cardActive: {
    backgroundColor: Palette.blueTint,
    borderColor: Palette.blueBorder,
    ...activeShadow,
  },
  cardPostponed: {
    borderStyle: 'dashed',
    borderColor: Palette.orange + '55',
  },
  timeCol: {
    width: 48,
    alignItems: 'flex-start',
  },
  clockIcon: {
    marginBottom: 5,
  },
  startTime: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.4,
    lineHeight: 20,
    fontVariant: ['tabular-nums'],
  },
  timeMuted: {
    color: Palette.textSecondary,
  },
  timeConnector: {
    gap: 3,
    marginVertical: 4,
    marginLeft: 2,
  },
  connectorDot: {
    width: 2.5,
    height: 2.5,
    borderRadius: 1.25,
    backgroundColor: Palette.insetDeep,
  },
  endTime: {
    fontSize: 12.5,
    fontWeight: '500',
    color: Palette.textTertiary,
    letterSpacing: -0.2,
    fontVariant: ['tabular-nums'],
  },
  main: {
    flex: 1,
    marginLeft: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  client: {
    flex: 1,
    fontSize: 16.5,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.4,
  },
  clientMuted: {
    color: Palette.textSecondary,
  },
  clientCancelled: {
    color: Palette.textTertiary,
    textDecorationLine: 'line-through',
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  chipLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  type: {
    fontSize: 13.5,
    fontWeight: '500',
    color: Palette.textSecondary,
    letterSpacing: -0.2,
    marginTop: 4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  address: {
    flex: 1,
    fontSize: 12.5,
    color: Palette.textTertiary,
    letterSpacing: -0.1,
  },
}));
