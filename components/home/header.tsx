import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PressableScale } from '@/components/ui/PressableScale';
import { iconButtonShadow, Palette, Spacing, type PaletteShape } from '@/theme';

type HeaderProps = {
  name: string;
  role: string;
  initials: string;
  unreadNotificationCount: number;
  /** Defaults to the static light palette — pass `useTheme().palette` from screens that opted into dark mode. */
  palette?: PaletteShape;
};

export function Header({ name, role, initials, unreadNotificationCount, palette = Palette }: HeaderProps) {
  const router = useRouter();
  const styles = useMemo(() => createStyles(palette), [palette]);

  return (
    <View style={styles.topRow}>
      <PressableScale
        style={styles.avatar}
        onPress={() => router.push('/plus/compte')}
        accessibilityLabel="Mon compte">
        <Text style={styles.avatarText}>{initials}</Text>
      </PressableScale>

      <View style={styles.identity}>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {name}
        </Text>
        <Text style={styles.role} numberOfLines={1} ellipsizeMode="tail">
          {role}
        </Text>
      </View>

      <PressableScale
        style={styles.roundButton}
        onPress={() => router.push('/notifications')}
        accessibilityLabel={
          unreadNotificationCount
            ? `Notifications, ${unreadNotificationCount} non lues`
            : 'Notifications'
        }>
        <Feather name="bell" size={21} color={palette.textPrimary} />
        {unreadNotificationCount ? (
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationText}>{unreadNotificationCount}</Text>
          </View>
        ) : null}
      </PressableScale>
    </View>
  );
}

const AVATAR = 46;
const BUTTON = 44;

function createStyles(Palette: PaletteShape) {
  return StyleSheet.create({
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: AVATAR,
      height: AVATAR,
      borderRadius: AVATAR / 2,
      backgroundColor: Palette.blueAvatar,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    avatarText: {
      color: Palette.onAccent,
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    identity: {
      flex: 1,
      paddingRight: Spacing.sm,
    },
    name: {
      fontSize: 19,
      fontWeight: '700',
      color: Palette.textPrimary,
      letterSpacing: -0.4,
    },
    role: {
      fontSize: 13.5,
      fontWeight: '400',
      color: Palette.textSecondary,
      marginTop: 1,
      letterSpacing: -0.1,
    },
    // White disc on the paper (same family as the Quick Actions) rather than a
    // grey fill — the header stays airy.
    roundButton: {
      width: BUTTON,
      height: BUTTON,
      borderRadius: BUTTON / 2,
      backgroundColor: Palette.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Palette.border,
      alignItems: 'center',
      justifyContent: 'center',
      ...iconButtonShadow,
    },
    notificationBadge: {
      position: 'absolute',
      top: -2,
      right: -2,
      minWidth: 17,
      height: 17,
      borderRadius: 9,
      backgroundColor: Palette.notification,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
      borderWidth: 2,
      // Ring matches the (now white) bell button, so the badge reads as a
      // cut-out rather than a sticker.
      borderColor: Palette.card,
    },
    notificationText: {
      color: Palette.white,
      fontSize: 9,
      fontWeight: '700',
    },
  });
}
