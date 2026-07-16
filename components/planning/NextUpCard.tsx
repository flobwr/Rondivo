import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { memo, useEffect, useRef } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette } from '@/constants/design';
import { formatMinutes, formatTime, parseTime } from './status';
import { Intervention, TravelLeg } from './types';

type FeatherName = React.ComponentProps<typeof Feather>['name'];

type Props = {
  intervention: Intervention;
  /** the leg that leads to this intervention — rendered inside the card */
  travel: TravelLeg | null;
  nowMin: number;
  onPrimary?: () => void;
  onNavigate?: () => void;
  onCall?: () => void;
  onCamera?: () => void;
  onPress?: () => void;
};

type HeroContent = {
  eyebrow: string;
  headline: string;
  topRight: string | null;
  pills: { icon: FeatherName; label: string }[];
  primaryLabel: string;
  primaryIcon: FeatherName;
  secondaries: { icon: FeatherName; action: 'navigate' | 'call' | 'camera' }[];
};

// The hero is a state machine: what it says and what its main button does
// depend on where the artisan is in the intervention lifecycle. This is where
// the future field workflow (photos, signature, rapport, minuteur) plugs in.
function buildContent(apt: Intervention, travel: TravelLeg | null, nowMin: number): HeroContent {
  const start = parseTime(apt.start);
  const end = parseTime(apt.end);
  const kmLabel = travel ? travel.km.toFixed(1).replace('.', ',') : null;
  const slotPill = {
    icon: 'clock' as FeatherName,
    label: `${apt.start} – ${apt.end} · ${formatMinutes(apt.durationMin)}`,
  };

  switch (apt.status) {
    case 'enRoute': {
      const eta = travel ? nowMin + travel.minutes : start;
      return {
        eyebrow: 'En route',
        headline: `Arrivée ~${formatTime(eta)}`,
        topRight: `RDV ${apt.start}`,
        pills: travel
          ? [{ icon: 'truck', label: `${travel.minutes} min · ${kmLabel} km restants` }, slotPill]
          : [slotPill],
        primaryLabel: 'Je suis arrivé',
        primaryIcon: 'map-pin',
        secondaries: [
          { icon: 'navigation', action: 'navigate' },
          { icon: 'phone', action: 'call' },
        ],
      };
    }
    case 'arrived':
      return {
        eyebrow: 'Sur place',
        headline: 'Prêt à démarrer',
        topRight: `RDV ${apt.start}`,
        pills: [slotPill],
        primaryLabel: 'Démarrer',
        primaryIcon: 'play',
        secondaries: [{ icon: 'phone', action: 'call' }],
      };
    case 'inProgress': {
      const elapsed = Math.max(1, nowMin - start);
      const remaining = end - nowMin;
      return {
        eyebrow: 'Intervention en cours',
        headline: `depuis ${formatMinutes(elapsed)}`,
        topRight: `Fin ~${apt.end}`,
        pills:
          remaining > 0
            ? [{ icon: 'clock', label: `restant ~${formatMinutes(remaining)}` }, {
                icon: 'calendar',
                label: `${apt.start} – ${apt.end}`,
              }]
            : [slotPill],
        primaryLabel: 'Terminer',
        primaryIcon: 'check',
        secondaries: [
          { icon: 'camera', action: 'camera' },
          { icon: 'phone', action: 'call' },
        ],
      };
    }
    default: {
      // planned — waiting to leave
      const departure = start - (travel?.minutes ?? 0);
      const leaveIn = departure - nowMin;
      return {
        eyebrow: travel ? 'Prochain départ' : 'Prochaine intervention',
        headline: leaveIn > 0 ? `dans ${formatMinutes(leaveIn)}` : 'Partez maintenant',
        topRight: travel ? `Départ ${formatTime(departure)}` : `Début ${apt.start}`,
        pills: travel
          ? [{ icon: 'truck', label: `${travel.minutes} min · ${kmLabel} km` }, slotPill]
          : [slotPill],
        primaryLabel: 'Itinéraire',
        primaryIcon: 'navigation',
        secondaries: [{ icon: 'phone', action: 'call' }],
      };
    }
  }
}

function NextUpCardBase({
  intervention,
  travel,
  nowMin,
  onPrimary,
  onNavigate,
  onCall,
  onCamera,
  onPress,
}: Props) {
  const enter = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;
  const primaryScale = useRef(new Animated.Value(1)).current;

  const content = buildContent(intervention, travel, nowMin);

  useEffect(() => {
    Animated.spring(enter, { toValue: 1, useNativeDriver: true, friction: 9, tension: 80 }).start();
  }, [enter]);

  const cardPressIn = () => {
    Animated.spring(pressScale, { toValue: 0.99, useNativeDriver: true, friction: 7, tension: 300 }).start();
  };
  const cardPressOut = () => {
    Animated.spring(pressScale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  const primaryPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.spring(primaryScale, { toValue: 0.96, useNativeDriver: true, friction: 6, tension: 300 }).start();
  };
  const primaryPressOut = () => {
    Animated.spring(primaryScale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  const secondaryHandler = (action: 'navigate' | 'call' | 'camera') =>
    action === 'navigate' ? onNavigate : action === 'call' ? onCall : onCamera;

  const translateY = enter.interpolate({ inputRange: [0, 1], outputRange: [12, 0] });

  return (
    <Pressable onPressIn={cardPressIn} onPressOut={cardPressOut} onPress={onPress}>
      <Animated.View
        style={[styles.shadowWrap, { opacity: enter, transform: [{ translateY }, { scale: pressScale }] }]}>
        <LinearGradient
          colors={[Palette.gradientStart, Palette.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1.2, y: 1.2 }}
          style={styles.card}>
          {/* Status line: what matters right now, in one glance */}
          <View style={styles.statusRow}>
            <View style={styles.eyebrowWrap}>
              <View style={styles.eyebrowDot} />
              <Text style={styles.eyebrow}>{content.eyebrow.toUpperCase()}</Text>
            </View>
            {content.topRight ? <Text style={styles.topRight}>{content.topRight}</Text> : null}
          </View>
          <Text style={styles.headline}>{content.headline}</Text>

          {/* Who and where */}
          <Text style={styles.client} numberOfLines={1}>
            {intervention.client}
          </Text>
          <Text style={styles.type} numberOfLines={1}>
            {intervention.type}
          </Text>
          <View style={styles.addressRow}>
            <Feather name="map-pin" size={12} color="rgba(255,255,255,0.75)" />
            <Text style={styles.address} numberOfLines={1}>
              {intervention.address}
            </Text>
          </View>

          {/* Trip + slot */}
          <View style={styles.pillRow}>
            {content.pills.map((pill) => (
              <View key={pill.label} style={styles.pill}>
                <Feather name={pill.icon} size={11} color={Palette.white} />
                <Text style={styles.pillLabel}>{pill.label}</Text>
              </View>
            ))}
          </View>

          {/* Actions */}
          <View style={styles.actionRow}>
            <Animated.View style={[styles.primaryWrap, { transform: [{ scale: primaryScale }] }]}>
              <Pressable
                style={styles.primary}
                onPressIn={primaryPressIn}
                onPressOut={primaryPressOut}
                onPress={onPrimary}>
                <Feather name={content.primaryIcon} size={16} color={Palette.blue} />
                <Text style={styles.primaryLabel}>{content.primaryLabel}</Text>
              </Pressable>
            </Animated.View>
            {content.secondaries.map((s) => (
              <Pressable
                key={s.icon}
                style={styles.secondary}
                hitSlop={6}
                onPress={secondaryHandler(s.action)}>
                <Feather name={s.icon} size={17} color={Palette.white} />
              </Pressable>
            ))}
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

export const NextUpCard = memo(NextUpCardBase);

const heroShadow = Platform.select({
  ios: {
    shadowColor: Palette.blue,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 22,
  },
  android: { elevation: 8 },
  default: { boxShadow: '0px 10px 22px rgba(37, 99, 235, 0.22)' },
});

const styles = StyleSheet.create({
  shadowWrap: {
    borderRadius: 26,
    ...heroShadow,
  },
  card: {
    borderRadius: 26,
    padding: 20,
    overflow: 'hidden',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrowWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eyebrowDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.white,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 0.8,
  },
  topRight: {
    fontSize: 12.5,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: -0.1,
  },
  headline: {
    fontSize: 27,
    fontWeight: '700',
    color: Palette.white,
    letterSpacing: -0.7,
    marginTop: 4,
  },
  client: {
    fontSize: 17,
    fontWeight: '700',
    color: Palette.white,
    letterSpacing: -0.4,
    marginTop: 14,
  },
  type: {
    fontSize: 13.5,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: -0.2,
    marginTop: 2,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
  },
  address: {
    flex: 1,
    fontSize: 12.5,
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: -0.1,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pillLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.white,
    letterSpacing: -0.1,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
  },
  primaryWrap: {
    flex: 1,
  },
  primary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: Palette.white,
    borderRadius: 999,
    paddingVertical: 12,
  },
  primaryLabel: {
    fontSize: 14.5,
    fontWeight: '700',
    color: Palette.blue,
    letterSpacing: -0.2,
  },
  secondary: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
