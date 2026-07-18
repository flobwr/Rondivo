import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { compactAddress } from '@/components/home/format';
import {
  getDepartureState,
  parseTimeToMinutes,
  subtractMinutes,
  useNowMinutes,
} from '@/components/home/time';
import { Intervention } from '@/components/intervention/types';
import { Button } from '@/components/ui/Button';
import { PressableScale } from '@/components/ui/PressableScale';
import { useTheme } from '@/contexts/theme';
import { getElevation, Numeric, Radius, Type, type PaletteShape } from '@/theme';
import { openMapsTo } from '@/utils/openMaps';

const NAV_BUTTON = 54;

/**
 * The screen's one dominant card — "where am I due next".
 *
 * A single sheet in two registers: the top half is quiet ink (who, what,
 * where), the bottom half is a full-bleed departure board that carries the
 * only live data on the screen. The board stays neutral while the countdown
 * runs and only takes on colour when the situation demands a decision
 * (orange = leave now, red = missed). The round blue button is the screen's
 * sole primary action: launch the itinerary.
 */
export function NextInterventionCard({ intervention }: { intervention?: Intervention }) {
  const router = useRouter();
  const { palette, scheme } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const elevation = getElevation(scheme);
  const nowMin = useNowMinutes();

  if (!intervention) {
    return (
      <View style={[styles.card, styles.emptyCard, elevation.card]}>
        <View style={styles.emptyIcon}>
          <Feather name="sun" size={22} color={palette.blue} />
        </View>
        <Text style={styles.emptyTitle}>Journée libre</Text>
        <Text style={styles.emptySubtitle}>Aucune intervention prévue aujourd&apos;hui</Text>
        <View style={styles.emptyAction}>
          <Button
            label="Planifier une intervention"
            icon="plus"
            onPress={() => router.push('/appointment/new')}
          />
        </View>
      </View>
    );
  }

  const openDetail = () =>
    router.push({ pathname: '/intervention/[id]', params: { id: intervention.id } });

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

  // The board is calm paper while the countdown runs; it only takes on a
  // status wash once it needs the eye (leave now / running late).
  const board =
    departure.phase === 'late'
      ? { bg: palette.redSoft, ink: palette.redInk }
      : departure.phase === 'leave'
        ? { bg: palette.orangeSoft, ink: palette.orangeInk }
        : { bg: palette.cardMuted, ink: palette.blue };

  return (
    <View style={[styles.card, elevation.raised]}>
      <Pressable
        style={styles.body}
        onPress={openDetail}
        accessibilityRole="button"
        accessibilityLabel={`Prochaine intervention, ${intervention.client}, ${intervention.startTime}`}>
        <View style={styles.eyebrowRow}>
          <View style={styles.eyebrowPill}>
            <Text style={styles.eyebrowText}>PROCHAINE</Text>
          </View>
          <Text style={[styles.time, Numeric]}>{intervention.startTime}</Text>
        </View>

        <Text style={styles.client} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.72}>
          {intervention.client}
        </Text>
        <Text style={styles.type} numberOfLines={1}>
          {intervention.type}
        </Text>

        <View style={styles.addressRow}>
          <Feather name="map-pin" size={13} color={palette.textTertiary} />
          <Text style={styles.address} numberOfLines={1}>
            {compactAddress(intervention.address)}
          </Text>
        </View>
      </Pressable>

      <View style={[styles.board, { backgroundColor: board.bg }]}>
        <Pressable
          style={styles.boardInfo}
          onPress={openDetail}
          accessibilityRole="button"
          accessibilityLabel={`Départ ${departure.label}, conseillé à ${departureTime}`}>
          <Text
            style={[styles.boardHeadline, Numeric, { color: board.ink }]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}>
            {departure.urgent ? departure.label : `Départ ${departure.label}`}
          </Text>
          <Text style={[styles.boardSub, Numeric]} numberOfLines={1}>
            Conseillé à {departureTime} · {intervention.travelMinutes} min · {km} km
          </Text>
        </Pressable>

        <PressableScale
          style={[styles.navButton, elevation.float]}
          to={0.92}
          onPress={() => openMapsTo(intervention.address)}
          accessibilityLabel="Lancer l’itinéraire vers l’intervention">
          <Feather name="navigation" size={20} color={palette.onAccent} />
        </PressableScale>
      </View>
    </View>
  );
}

function createStyles(palette: PaletteShape) {
  return StyleSheet.create({
    card: {
      backgroundColor: palette.card,
      borderRadius: Radius.hero,
    },
    body: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 18,
    },
    eyebrowRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    eyebrowPill: {
      backgroundColor: palette.blueSoft,
      borderRadius: Radius.pill,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    eyebrowText: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1.2,
      color: palette.blue,
    },
    time: {
      ...Type.heading,
      fontWeight: '700',
      color: palette.textPrimary,
    },
    client: {
      fontSize: 25,
      lineHeight: 30,
      fontWeight: '800',
      letterSpacing: -0.6,
      color: palette.textPrimary,
      marginTop: 14,
    },
    type: {
      ...Type.subhead,
      color: palette.textSecondary,
      marginTop: 3,
    },
    addressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 10,
    },
    address: {
      ...Type.footnote,
      flex: 1,
      color: palette.textTertiary,
    },

    // ── Departure board — full-bleed footer ──────────────────────────────────
    board: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      paddingVertical: 14,
      paddingLeft: 20,
      paddingRight: 14,
      borderBottomLeftRadius: Radius.hero,
      borderBottomRightRadius: Radius.hero,
    },
    boardInfo: {
      flex: 1,
    },
    boardHeadline: {
      fontSize: 19,
      lineHeight: 24,
      fontWeight: '800',
      letterSpacing: -0.4,
    },
    boardSub: {
      ...Type.footnote,
      fontWeight: '500',
      color: palette.textSecondary,
      marginTop: 2,
    },
    navButton: {
      width: NAV_BUTTON,
      height: NAV_BUTTON,
      borderRadius: NAV_BUTTON / 2,
      backgroundColor: palette.blue,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // ── Empty state ──────────────────────────────────────────────────────────
    emptyCard: {
      alignItems: 'center',
      paddingVertical: 28,
      paddingHorizontal: 20,
    },
    emptyIcon: {
      width: 50,
      height: 50,
      borderRadius: 17,
      backgroundColor: palette.blueSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyTitle: {
      ...Type.title,
      fontSize: 20,
      color: palette.textPrimary,
      marginTop: 12,
    },
    emptySubtitle: {
      ...Type.subhead,
      fontWeight: '400',
      color: palette.textSecondary,
      marginTop: 3,
      textAlign: 'center',
    },
    emptyAction: {
      alignSelf: 'stretch',
      marginTop: 18,
    },
  });
}
