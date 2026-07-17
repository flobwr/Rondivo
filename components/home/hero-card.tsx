import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { Intervention } from '@/components/intervention/types';
import { PressableScale } from '@/components/ui/PressableScale';
import { getDepartureState, parseTimeToMinutes, subtractMinutes, useNowMinutes } from '@/components/home/time';
import { PressSpring } from '@/constants/animation';
import { FontSize, Palette, Radius, Spacing, type PaletteShape } from '@/constants/design';
import { cardShadow, heroShadow } from '@/constants/shadow';
import { openMapsTo } from '@/utils/openMaps';

type HeroCardProps = {
  isEmpty?: boolean;
  intervention?: Intervention;
  /** Defaults to the static light palette — pass `useTheme().palette` from screens that opted into dark mode. */
  palette?: PaletteShape;
};

/** '24 Av. Félix Faure, 69003 Lyon' → '24 Av. Félix Faure, Lyon' — drops the
 *  postcode noise, keeps street + city (what you actually read before driving). */
function compactAddress(address: string): string {
  return address.replace(/,\s*\d{4,5}\s+/g, ', ');
}

export function HeroCard({ isEmpty = false, intervention, palette = Palette }: HeroCardProps) {
  const router = useRouter();
  const scale = useRef(new Animated.Value(1)).current;
  const styles = useMemo(() => createStyles(palette), [palette]);
  const nowMin = useNowMinutes();

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, { toValue: 0.982, useNativeDriver: true, ...PressSpring.in }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, ...PressSpring.out }).start();
  };

  if (isEmpty || !intervention) {
    return (
      <View style={styles.emptyCard}>
        <View style={styles.emptyIconTile}>
          <Feather name="sun" size={22} color={palette.blue} />
        </View>
        <Text style={styles.emptyTitle}>Journée libre</Text>
        <Text style={styles.emptySubtitle}>Aucune intervention prévue aujourd&apos;hui</Text>
        <PressableScale
          style={styles.emptyAction}
          onPress={() => router.push('/appointment/new')}
          accessibilityLabel="Planifier une intervention">
          <Feather name="plus" size={16} color={palette.white} />
          <Text style={styles.emptyActionText}>Planifier une intervention</Text>
        </PressableScale>
      </View>
    );
  }

  const departureTime = subtractMinutes(intervention.startTime, intervention.travelMinutes);
  const departure = getDepartureState(
    parseTimeToMinutes(intervention.startTime) - intervention.travelMinutes,
    parseTimeToMinutes(intervention.startTime),
    nowMin
  );
  const km = intervention.travelKm.toLocaleString('fr-FR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <LinearGradient
        colors={[palette.gradientStart, palette.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}>
        {/* The info area opens the intervention detail; the Itinéraire button is
            a sibling (never nested) so the two presses can't fight each other. */}
        <Pressable
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={() => router.push({ pathname: '/intervention/[id]', params: { id: intervention.id } })}
          accessibilityRole="button"
          accessibilityLabel={`Prochaine intervention, ${intervention.client}, ${intervention.startTime}`}>
          <View style={styles.eyebrowRow}>
            <Text style={styles.eyebrow}>PROCHAINE INTERVENTION</Text>
            <Feather name="chevron-right" size={18} color="rgba(255,255,255,0.75)" />
          </View>

          <Text style={styles.client} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.72}>
            {intervention.client}
          </Text>

          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={15} color={Palette.white} style={styles.metaIcon} />
            <Text style={styles.metaText} numberOfLines={1}>
              <Text style={styles.metaTime}>{intervention.startTime}</Text>
              {'  ·  '}
              {intervention.type}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <Feather name="map-pin" size={14} color={Palette.white} style={styles.metaIcon} />
            <Text style={[styles.metaText, styles.metaAddress]} numberOfLines={1}>
              {compactAddress(intervention.address)}
            </Text>
          </View>

          <View style={styles.glassStrip}>
            <View style={styles.departColumn}>
              <Text style={styles.stripLabel}>DÉPART CONSEILLÉ</Text>
              <Text style={styles.departValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
                {departureTime}
              </Text>
              <View style={[styles.countdownPill, departure.urgent ? styles.countdownPillUrgent : null]}>
                <Text
                  style={[styles.countdownText, departure.urgent ? styles.countdownTextUrgent : null]}
                  numberOfLines={1}>
                  {departure.label}
                </Text>
              </View>
            </View>

            <View style={styles.stripDivider} />

            <View style={styles.travelColumn}>
              <Text style={styles.stripLabel}>TRAJET</Text>
              <Text style={styles.travelValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
                {intervention.travelMinutes} min
              </Text>
              <Text style={styles.travelSub} numberOfLines={1}>
                {km} km
              </Text>
            </View>
          </View>
        </Pressable>

        <PressableScale
          style={styles.navButton}
          to={0.97}
          onPress={() => openMapsTo(intervention.address)}
          accessibilityLabel="Lancer l’itinéraire vers l’intervention">
          <Feather name="navigation" size={17} color={Palette.blue} />
          <Text style={styles.navButtonText}>Itinéraire</Text>
        </PressableScale>
      </LinearGradient>
    </Animated.View>
  );
}

function createStyles(palette: PaletteShape) {
  return StyleSheet.create({
    card: {
      borderRadius: Radius.hero,
      paddingHorizontal: Spacing.cardPadding,
      paddingTop: 16,
      paddingBottom: Spacing.cardPadding,
      ...heroShadow,
    },
    eyebrowRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    eyebrow: {
      color: Palette.white,
      opacity: 0.78,
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1.4,
    },
    client: {
      color: Palette.white,
      fontSize: 30,
      fontWeight: '800',
      marginTop: 4,
      letterSpacing: -0.8,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 6,
      gap: 7,
    },
    metaIcon: {
      opacity: 0.9,
    },
    metaText: {
      flex: 1,
      color: Palette.white,
      fontSize: 15,
      fontWeight: '500',
      opacity: 0.95,
      letterSpacing: -0.1,
    },
    metaTime: {
      fontWeight: '700',
      fontVariant: ['tabular-nums'],
    },
    metaAddress: {
      opacity: 0.85,
      fontSize: 14,
    },
    glassStrip: {
      flexDirection: 'row',
      alignItems: 'stretch',
      backgroundColor: 'rgba(255,255,255,0.16)',
      borderRadius: 18,
      paddingVertical: 12,
      paddingHorizontal: 14,
      marginTop: 16,
    },
    departColumn: {
      flex: 1.4,
      minWidth: 0,
    },
    stripLabel: {
      color: Palette.white,
      opacity: 0.72,
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 1.0,
    },
    departValue: {
      color: Palette.white,
      fontSize: 26,
      fontWeight: '800',
      marginTop: 3,
      letterSpacing: -0.5,
      fontVariant: ['tabular-nums'],
    },
    countdownPill: {
      alignSelf: 'flex-start',
      backgroundColor: 'rgba(255,255,255,0.20)',
      borderRadius: Radius.pill,
      paddingHorizontal: 9,
      paddingVertical: 3,
      marginTop: 6,
    },
    countdownPillUrgent: {
      backgroundColor: Palette.white,
    },
    countdownText: {
      color: Palette.white,
      fontSize: FontSize.tiny,
      fontWeight: '700',
      letterSpacing: -0.1,
    },
    // The pill/button surfaces stay white in both themes, so their ink keeps
    // the light-mode blue — the dark palette's lighter blue would wash out.
    countdownTextUrgent: {
      color: Palette.blue,
    },
    stripDivider: {
      width: 1,
      backgroundColor: 'rgba(255,255,255,0.30)',
      marginHorizontal: 14,
    },
    travelColumn: {
      flex: 1,
      minWidth: 0,
    },
    travelValue: {
      color: Palette.white,
      fontSize: 19,
      fontWeight: '700',
      marginTop: 5,
      letterSpacing: -0.3,
      fontVariant: ['tabular-nums'],
    },
    travelSub: {
      color: Palette.white,
      opacity: 0.78,
      fontSize: FontSize.small,
      fontWeight: '500',
      marginTop: 4,
      fontVariant: ['tabular-nums'],
    },
    navButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      minHeight: 48,
      backgroundColor: Palette.white,
      borderRadius: Radius.tile,
      marginTop: 12,
    },
    navButtonText: {
      color: Palette.blue,
      fontSize: FontSize.body,
      fontWeight: '700',
      letterSpacing: -0.2,
    },

    // ── Empty state ───────────────────────────────────────────────────────────
    emptyCard: {
      backgroundColor: palette.card,
      borderRadius: Radius.hero,
      paddingVertical: 28,
      paddingHorizontal: Spacing.cardPadding,
      alignItems: 'center',
      ...cardShadow,
    },
    emptyIconTile: {
      width: 48,
      height: 48,
      borderRadius: 16,
      backgroundColor: palette.blueSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyTitle: {
      fontSize: 19,
      fontWeight: '700',
      color: palette.textPrimary,
      letterSpacing: -0.4,
      marginTop: 12,
    },
    emptySubtitle: {
      fontSize: FontSize.label,
      fontWeight: '400',
      color: palette.textSecondary,
      letterSpacing: -0.1,
      marginTop: 4,
      textAlign: 'center',
    },
    emptyAction: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      minHeight: 48,
      alignSelf: 'stretch',
      backgroundColor: palette.blue,
      borderRadius: Radius.tile,
      marginTop: 18,
      paddingHorizontal: 18,
    },
    emptyActionText: {
      color: Palette.white,
      fontSize: 15,
      fontWeight: '600',
      letterSpacing: -0.2,
    },
  });
}
