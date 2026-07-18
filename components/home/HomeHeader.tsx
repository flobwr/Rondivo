import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PressableScale } from '@/components/ui/PressableScale';
import { useTheme } from '@/contexts/theme';
import { getElevation, Numeric, Radius, Type, type PaletteShape } from '@/theme';

const WELL = 42;

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
 * largest type on any Rondivo screen, grounded by a one-line summary of what
 * the day holds. No bars, no boxes: type and air only.
 */
export function HomeHeader({
  name,
  initials,
  unreadNotificationCount,
  summary,
}: {
  name: string;
  initials: string;
  unreadNotificationCount: number;
  /** "5 interventions aujourd'hui · 2 rappels" — built by the screen. */
  summary: string;
}) {
  const router = useRouter();
  const { palette, scheme } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const elevation = getElevation(scheme);
  const firstName = name.split(' ')[0] || name;

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
      <Text style={styles.summary} numberOfLines={1}>
        {summary}
      </Text>
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
      color: palette.textSecondary,
      marginTop: 6,
      ...Numeric,
    },
  });
}
