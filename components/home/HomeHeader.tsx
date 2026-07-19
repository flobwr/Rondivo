import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import type { HomeStatus, StatusTone } from '@/components/home/status';
import { PressableScale } from '@/components/ui/PressableScale';
import { useTheme } from '@/contexts/theme';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { getElevation, Motion, Numeric, Radius, Type, type PaletteShape } from '@/theme';

const WELL = 42;

/** Colour + weight per tone — urgency earns ink, everything else stays quiet. */
function toneStyle(tone: StatusTone, palette: PaletteShape, statusInk: Record<'red' | 'orange' | 'blue', string>) {
  switch (tone) {
    case 'urgent':
      return { color: statusInk.red, fontWeight: '700' as const };
    case 'warning':
      return { color: statusInk.orange, fontWeight: '700' as const };
    case 'active':
      return { color: statusInk.blue, fontWeight: '700' as const };
    case 'quiet':
      return { color: palette.textTertiary, fontWeight: '500' as const };
    default:
      return { color: palette.textPrimary, fontWeight: '600' as const };
  }
}

/** "vendredi 18 juillet" → "VENDREDI 18 JUILLET" — the header's date eyebrow. */
function todayEyebrow(): string {
  return new Date()
    .toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
    .toUpperCase();
}

/** Greeting keyed to the clock — the Home speaks first. */
function greeting(): string {
  return new Date().getHours() < 18 ? 'Bonjour' : 'Bonsoir';
}

/**
 * Home masthead — the greeting IS the interface. A small-caps date eyebrow,
 * two floating wells (notifications, account), then the day's headline in the
 * largest type on any Rondivo screen, grounded by ONE contextual line: the
 * single most important thing about right now — never a tally. No bars, no
 * boxes: type and air only.
 */
export function HomeHeader({
  name,
  initials,
  unreadNotificationCount,
  status,
}: {
  name: string;
  initials: string;
  unreadNotificationCount: number;
  /** "Départ conseillé dans 8 h", "Intervention en cours"… always exactly one fact. */
  status: HomeStatus;
}) {
  const router = useRouter();
  const { palette, resolvedTheme, statusInk } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const elevation = getElevation(resolvedTheme);
  const reducedMotion = useReducedMotion();
  const firstName = name.split(' ')[0] || name;
  const tone = toneStyle(status.tone, palette, statusInk);

  return (
    <View>
      <View style={styles.topRow}>
        <Text style={styles.eyebrow} numberOfLines={1}>
          {todayEyebrow()}
        </Text>

        <View style={styles.wells}>
          <PressableScale
            style={[styles.well, elevation.whisper]}
            onPress={() => router.push('/notifications')}
            accessibilityLabel={
              unreadNotificationCount
                ? `Notifications, ${unreadNotificationCount} non lues`
                : 'Notifications'
            }>
            <Feather name="bell" size={19} color={palette.textPrimary} />
            {unreadNotificationCount ? (
              <View style={styles.badge}>
                <Text style={[styles.badgeText, Numeric]}>{unreadNotificationCount}</Text>
              </View>
            ) : null}
          </PressableScale>

          <PressableScale
            style={[styles.well, styles.avatar]}
            onPress={() => router.push('/plus/compte')}
            accessibilityLabel="Mon compte">
            <Text style={styles.avatarText}>{initials}</Text>
          </PressableScale>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
        {greeting()} {firstName}
      </Text>
      <Animated.Text
        key={status.label}
        entering={reducedMotion ? undefined : FadeIn.duration(Motion.fast)}
        style={[styles.summary, { color: tone.color, fontWeight: tone.fontWeight }]}
        numberOfLines={1}>
        {status.label}
      </Animated.Text>
    </View>
  );
}

function createStyles(palette: PaletteShape) {
  return StyleSheet.create({
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    eyebrow: {
      ...Type.caption,
      flexShrink: 1,
      color: palette.textTertiary,
      fontWeight: '700',
      letterSpacing: 1.4,
      ...Numeric,
    },
    wells: {
      flexDirection: 'row',
      gap: 10,
    },
    well: {
      width: WELL,
      height: WELL,
      borderRadius: Radius.pill,
      backgroundColor: palette.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatar: {
      backgroundColor: palette.blueAvatar,
    },
    avatarText: {
      fontSize: 14,
      fontWeight: '700',
      letterSpacing: 0.4,
      color: palette.onAccent,
    },
    badge: {
      position: 'absolute',
      top: -3,
      right: -3,
      minWidth: 17,
      height: 17,
      borderRadius: 9,
      paddingHorizontal: 4,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: palette.notification,
      borderWidth: 2,
      borderColor: palette.screen,
    },
    badgeText: {
      fontSize: 9,
      fontWeight: '700',
      color: palette.white,
    },
    title: {
      fontSize: 34,
      lineHeight: 40,
      fontWeight: '800',
      letterSpacing: -0.9,
      color: palette.textPrimary,
      marginTop: 18,
    },
    summary: {
      ...Type.subhead,
      // Colour and weight come from `toneStyle` — only urgency ever earns ink.
      marginTop: 6,
      ...Numeric,
    },
  });
}
