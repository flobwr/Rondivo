import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { memo, useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette } from '@/constants/design';
import { actionShadow } from '@/constants/shadow';
import { STATUS_META } from './status';
import { Intervention } from './types';

type Props = {
  intervention: Intervention;
  /** position in the list — drives a light staggered entrance */
  index?: number;
  onPress?: () => void;
};

// Upcoming-job card: time column (start → dotted connector → end), then just
// the essentials — client, job, address. No chip for a planned job: its
// position in the timeline already says everything. The chevron opens the
// future intervention sheet (photos, notes, checklist, rapport, signature).
function InterventionCardBase({ intervention, index = 0, onPress }: Props) {
  const pressScale = useRef(new Animated.Value(1)).current;
  const enter = useRef(new Animated.Value(0)).current;

  const meta = STATUS_META[intervention.status];
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

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
      <Animated.View style={[styles.card, { opacity: enter, transform: [{ translateY }, { scale }] }]}>
        {/* Time column */}
        <View style={styles.timeCol}>
          <Text style={styles.startTime}>{intervention.start}</Text>
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
            <Text style={styles.client} numberOfLines={1}>
              {intervention.client}
            </Text>
            {showChip ? (
              <View style={[styles.chip, { backgroundColor: meta.soft }]}>
                <Text style={[styles.chipLabel, { color: meta.color }]}>{meta.label}</Text>
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

        <View style={styles.chevronCol}>
          <Feather name="chevron-right" size={16} color="#C4CBD6" />
        </View>
      </Animated.View>
    </Pressable>
  );
}

export const InterventionCard = memo(InterventionCardBase);

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
    fontVariant: ['tabular-nums'],
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
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.4,
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
  chevronCol: {
    justifyContent: 'center',
    marginLeft: 6,
  },
});
