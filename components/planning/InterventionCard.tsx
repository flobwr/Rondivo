import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { memo, useEffect, useRef } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette } from '@/constants/design';
import { actionShadow } from '@/constants/shadow';
import { PRIORITY_META, STATUS_META, formatMinutes } from './status';
import { Intervention } from './types';

type Props = {
  intervention: Intervention;
  /** position in the list — drives a light staggered entrance */
  index?: number;
  onPress?: () => void;
};

// Card anatomy (ref 1): a time column inside the card (start → dotted
// connector → end), then the job itself, with a status chip pinned top-right
// so the whole day scans as a single column of states.
function InterventionCardBase({ intervention, index = 0, onPress }: Props) {
  const pressScale = useRef(new Animated.Value(1)).current;
  const enter = useRef(new Animated.Value(0)).current;

  const status = STATUS_META[intervention.status];
  const priority = PRIORITY_META[intervention.priority];
  const isActive = intervention.status === 'inProgress';
  const isDone = intervention.status === 'done';
  const isPostponed = intervention.status === 'postponed';

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
  const opacity = isDone ? Animated.multiply(enter, 0.68) : isPostponed ? Animated.multiply(enter, 0.85) : enter;

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
      <Animated.View
        style={[
          styles.card,
          isActive ? styles.cardActive : null,
          isPostponed ? styles.cardPostponed : null,
          { opacity, transform: [{ translateY }, { scale }] },
        ]}>
        {/* Time column */}
        <View style={styles.timeCol}>
          <Text style={[styles.startTime, isDone || isPostponed ? styles.timeMuted : null]}>
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
              style={[styles.client, isDone ? styles.clientMuted : null]}
              numberOfLines={1}>
              {intervention.client}
            </Text>
            <View
              style={[
                styles.chip,
                { backgroundColor: status.chipFilled ? status.color : status.soft },
              ]}>
              {status.chipFilled ? <View style={styles.chipDot} /> : null}
              <Text
                style={[styles.chipLabel, { color: status.chipFilled ? Palette.white : status.color }]}>
                {status.label}
              </Text>
            </View>
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

          <View style={styles.footer}>
            <View style={styles.durationPill}>
              <Feather name="clock" size={10} color={Palette.textSecondary} />
              <Text style={styles.durationLabel}>{formatMinutes(intervention.durationMin)}</Text>
            </View>

            {priority ? (
              <View style={[styles.priorityPill, { backgroundColor: priority.soft }]}>
                <Feather name={priority.icon} size={10} color={priority.color} />
                <Text style={[styles.priorityLabel, { color: priority.color }]}>
                  {priority.label}
                </Text>
              </View>
            ) : null}

            <View style={styles.spacer} />
            {/* detail affordance — future intervention sheet (photos, notes,
                pièces, signature, rapport) */}
            <Feather name="chevron-right" size={16} color="#C4CBD6" />
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export const InterventionCard = memo(InterventionCardBase);

// The active card carries a slightly stronger, brand-tinted lift; every other
// card keeps the barely-there shadow so the eye lands on the current job.
const activeShadow = Platform.select({
  ios: {
    shadowColor: Palette.blue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
  },
  android: { elevation: 5 },
  default: { boxShadow: '0px 6px 18px rgba(37, 99, 235, 0.16)' },
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Palette.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Palette.border,
    padding: 16,
    ...actionShadow,
  },
  cardActive: {
    backgroundColor: Palette.blueTint,
    borderColor: Palette.blueBorder,
    ...activeShadow,
  },
  cardPostponed: {
    borderStyle: 'dashed',
    borderColor: '#F0D9AC',
  },
  timeCol: {
    width: 46,
    alignItems: 'flex-start',
  },
  startTime: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.4,
    lineHeight: 20,
  },
  timeMuted: {
    color: Palette.textSecondary,
  },
  timeConnector: {
    gap: 3,
    marginVertical: 6,
    marginLeft: 2,
  },
  connectorDot: {
    width: 2.5,
    height: 2.5,
    borderRadius: 1.25,
    backgroundColor: '#CBD2DC',
  },
  endTime: {
    fontSize: 12.5,
    fontWeight: '500',
    color: Palette.textTertiary,
    letterSpacing: -0.2,
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
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  chipDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Palette.white,
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
    marginTop: 3,
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
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  durationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F5F9',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  durationLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
  },
  priorityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  priorityLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  spacer: {
    flex: 1,
  },
});
