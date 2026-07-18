import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PressableScale } from '@/components/ui/PressableScale';
import { useTheme } from '@/contexts/theme';
import { Radius, type PaletteShape } from '@/theme';

type HeaderProps = {
  name: string;
  role: string;
  initials: string;
  unreadNotificationCount: number;
  /** Accepted for compatibility — the header reads the theme itself. */
  palette?: PaletteShape;
};

const AVATAR = 46;
const WELL = 44;

/**
 * Home identity header — the one root header that isn't a `LargeTitleBar`:
 * the person IS the title. Avatar in the signature blue, name and role,
 * and a notifications well in the same icon-well vocabulary as every
 * other bar in the app.
 */
export function Header({ name, role, initials, unreadNotificationCount }: HeaderProps) {
  const router = useRouter();
  const { palette } = useTheme();

  return (
    <View style={styles.topRow}>
      <PressableScale
        style={[styles.avatar, { backgroundColor: palette.blueAvatar }]}
        onPress={() => router.push('/plus/compte')}
        accessibilityLabel="Mon compte">
        <Text style={[styles.avatarText, { color: palette.onAccent }]}>{initials}</Text>
      </PressableScale>

      <View style={styles.identity}>
        <Text style={[styles.name, { color: palette.textPrimary }]} numberOfLines={1} ellipsizeMode="tail">
          {name}
        </Text>
        <Text style={[styles.role, { color: palette.textSecondary }]} numberOfLines={1} ellipsizeMode="tail">
          {role}
        </Text>
      </View>

      <PressableScale
        style={[styles.well, { backgroundColor: palette.iconButtonBg }]}
        onPress={() => router.push('/notifications')}
        accessibilityLabel={
          unreadNotificationCount
            ? `Notifications, ${unreadNotificationCount} non lues`
            : 'Notifications'
        }>
        <Feather name="bell" size={20} color={palette.textPrimary} />
        {unreadNotificationCount ? (
          <View
            style={[
              styles.notificationBadge,
              { backgroundColor: palette.notification, borderColor: palette.screen },
            ]}>
            <Text style={[styles.notificationText, { color: palette.white }]}>
              {unreadNotificationCount}
            </Text>
          </View>
        ) : null}
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  identity: {
    flex: 1,
    paddingRight: 8,
  },
  name: {
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  role: {
    fontSize: 13.5,
    fontWeight: '400',
    marginTop: 1,
    letterSpacing: -0.1,
  },
  well: {
    width: WELL,
    height: WELL,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    // Ring in the paper colour so the badge reads as a cut-out.
    borderWidth: 2,
  },
  notificationText: {
    fontSize: 9,
    fontWeight: '700',
  },
});
