import { Feather } from '@expo/vector-icons';
import { memo } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { actionShadow, createThemedStyles, Palette, PressScale } from '@/theme';
import { useTheme } from '@/contexts/theme';
import { useEntrance } from '@/hooks/use-entrance';
import { usePressScale } from '@/hooks/use-press-scale';
import { TravelLeg } from './types';

type Props = {
  travel: TravelLeg;
  index?: number;
  onNavigate?: () => void;
};

// A travel leg is a *connector*, not a card: slim capsule, unchanged size —
// but it now carries the same whisper-tier shadow as the intervention cards
// so the two read as the same family. The tiny coloured dot is the
// live-traffic hook; the round button will open GPS navigation.
function TravelLinkBase({ travel, index = 0, onNavigate }: Props) {
  const kmLabel = travel.km.toFixed(1).replace('.', ',');
  const { progress: enter } = useEntrance({ index });
  const { scale: pressScale, onPressIn, onPressOut } = usePressScale({ to: PressScale.icon });
  const { palette } = useTheme();

  const trafficColor: Record<TravelLeg['traffic'], string> = {
    fluid: palette.green,
    dense: palette.orange,
    jammed: palette.red,
  };

  return (
    <Animated.View style={[styles.wrapper, { opacity: enter }]}>
      <View style={styles.capsule}>
        <View style={[styles.trafficDot, { backgroundColor: trafficColor[travel.traffic] }]} />
        <Feather name="truck" size={13} color={Palette.textTertiary} />
        <Text style={styles.label}>
          {travel.minutes} min · {kmLabel} km
        </Text>

        <View style={styles.spacer} />

        <Animated.View style={{ transform: [{ scale: pressScale }] }}>
          <Pressable
            hitSlop={10}
            style={styles.navButton}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={onNavigate}>
            <Feather name="navigation" size={13} color={Palette.blue} />
          </Pressable>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

export const TravelLink = memo(TravelLinkBase);

const styles = createThemedStyles(() => StyleSheet.create({
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
    backgroundColor: Palette.cardMuted,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
    paddingVertical: 8,
    paddingLeft: 15,
    paddingRight: 6,
    gap: 9,
    ...actionShadow,
  },
  trafficDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
  },
  spacer: {
    flex: 1,
  },
  navButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Palette.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
