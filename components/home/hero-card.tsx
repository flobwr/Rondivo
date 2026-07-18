import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useMemo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { Intervention } from '@/components/intervention/types';
import { PressableScale } from '@/components/ui/PressableScale';
import { getDepartureState, parseTimeToMinutes, subtractMinutes, useNowMinutes } from '@/components/home/time';
import { cardShadow, FontSize, heroShadow, Palette, PressSpring, Radius, Spacing, type PaletteShape } from '@/theme';
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

/**
 * The Rondivo hero: a white card, not a gradient poster. Ink typography does
 * the talking; the only saturated surface is the full-width blue CTA, so the
 * eye lands on "Itinéraire" without anything shouting. The departure board is
 * the live element — it changes colour with the situation (blue = on time,
 * orange = leave now, red = late), which makes it the one thing worth
 * glancing at all morning.
 */
export function HeroCard({ isEmpty = false, intervention, palette = Palette }: HeroCardProps) {
  const router = useRouter();
  const scale = useRef(new Animated.Value(1)).current;
  const styles = useMemo(() => createStyles(palette), [palette]);
  const nowMin = useNowMinutes();

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, { toValue: 0.985, useNativeDriver: true, ...PressSpring.in }).start();
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
          <Feather name="plus" size={16} color={palette.onAccent} />
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

  // The departure board wears the state colour system: blue while the
  // countdown runs, orange when it's time to go, red once the slot is missed.
  const board =
    departure.phase === 'late'
      ? { bg: palette.redSoft, ink: palette.redInk }
      : departure.phase === 'leave'
        ? { bg: palette.orangeSoft, ink: palette.orangeInk }
        : { bg: palette.blueTint, ink: palette.blue };

  return (
    <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
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
          <Feather name="chevron-right" size={17} color={palette.textTertiary} />
        </View>

        <Text style={styles.client} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.72}>
          {intervention.client}
        </Text>

        <Text style={styles.metaText} numberOfLines={1}>
          <Text style={styles.metaTime}>{intervention.startTime}</Text>
          <Text style={styles.metaDot}>{'   ·   '}</Text>
          {intervention.type}
        </Text>

        <View style={styles.addressRow}>
          <Feather name="map-pin" size={13} color={palette.textTertiary} style={styles.addressIcon} />
          <Text style={styles.address} numberOfLines={1}>
            {compactAddress(intervention.address)}
          </Text>
        </View>

        {/* Departure board: the LIVE information ("when do I leave") is the
            headline; the static advice and travel maths are one quiet line. */}
        <View style={[styles.board, { backgroundColor: board.bg }]}>
          <Text
            style={[styles.boardHeadline, { color: board.ink }]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}>
            {departure.urgent ? departure.label : `Départ ${departure.label}`}
          </Text>
          <Text style={styles.boardSub} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
            Conseillé à {departureTime} · Trajet {intervention.travelMinutes} min · {km} km
          </Text>
        </View>
      </Pressable>

      <PressableScale
        style={styles.navButton}
        to={0.97}
        onPress={() => openMapsTo(intervention.address)}
        accessibilityLabel="Lancer l’itinéraire vers l’intervention">
        <Feather name="navigation" size={17} color={palette.onAccent} />
        <Text style={styles.navButtonText}>Itinéraire</Text>
      </PressableScale>
    </Animated.View>
  );
}

function createStyles(palette: PaletteShape) {
  return StyleSheet.create({
    card: {
      backgroundColor: palette.card,
      borderRadius: Radius.hero,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: palette.border,
      paddingHorizontal: Spacing.cardPadding,
      paddingTop: 18,
      paddingBottom: Spacing.cardPadding,
      ...heroShadow,
    },
    eyebrowRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    eyebrow: {
      color: palette.blue,
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1.3,
    },
    client: {
      color: palette.textPrimary,
      fontSize: 28,
      fontWeight: '700',
      marginTop: 6,
      letterSpacing: -0.7,
    },
    metaText: {
      color: palette.textSecondary,
      fontSize: 15,
      fontWeight: '500',
      marginTop: 7,
      letterSpacing: -0.1,
    },
    metaTime: {
      color: palette.textPrimary,
      fontWeight: '700',
      fontVariant: ['tabular-nums'],
    },
    metaDot: {
      color: palette.textTertiary,
    },
    addressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 5,
      gap: 6,
    },
    addressIcon: {
      marginTop: 1,
    },
    address: {
      flex: 1,
      color: palette.textSecondary,
      fontSize: 14,
      fontWeight: '400',
      letterSpacing: -0.1,
    },
    board: {
      borderRadius: Radius.tile,
      paddingVertical: 13,
      paddingHorizontal: 16,
      marginTop: 16,
    },
    boardHeadline: {
      fontSize: 20,
      fontWeight: '800',
      letterSpacing: -0.4,
      fontVariant: ['tabular-nums'],
    },
    boardSub: {
      color: palette.textSecondary,
      fontSize: FontSize.small,
      fontWeight: '500',
      marginTop: 3,
      letterSpacing: -0.1,
      fontVariant: ['tabular-nums'],
    },
    navButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      minHeight: 52,
      backgroundColor: palette.blue,
      borderRadius: Radius.tile,
      marginTop: 12,
    },
    navButtonText: {
      color: palette.onAccent,
      fontSize: FontSize.body,
      fontWeight: '700',
      letterSpacing: -0.2,
    },

    // ── Empty state ───────────────────────────────────────────────────────────
    emptyCard: {
      backgroundColor: palette.card,
      borderRadius: Radius.hero,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: palette.border,
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
      color: palette.onAccent,
      fontSize: 15,
      fontWeight: '600',
      letterSpacing: -0.2,
    },
  });
}
