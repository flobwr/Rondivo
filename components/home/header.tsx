import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PressableScale } from '@/components/ui/PressableScale';
import { FontSize, Palette, Radius, Spacing, type PaletteShape } from '@/constants/design';
import { badgeShadow, iconButtonShadow } from '@/constants/shadow';

type RoundButtonProps = {
  children: React.ReactNode;
  notificationCount?: number;
  onPress?: () => void;
  size?: number;
  styles: ReturnType<typeof createStyles>;
};

function RoundButton({ children, notificationCount, onPress, size = BUTTON, styles }: RoundButtonProps) {
  return (
    <PressableScale
      style={[styles.roundButton, { width: size, height: size, borderRadius: size / 2 }]}
      onPress={onPress}>
      {children}
      {notificationCount ? (
        <View style={styles.notificationBadge}>
          <Text style={styles.notificationText}>{notificationCount}</Text>
        </View>
      ) : null}
    </PressableScale>
  );
}

type HeaderProps = {
  name: string;
  role: string;
  initials: string;
  unreadNotificationCount: number;
  interventionsTodayCount: number;
  /** Defaults to the static light palette — pass `useTheme().palette` from screens that opted into dark mode. */
  palette?: PaletteShape;
};

export function Header({
  name,
  role,
  initials,
  unreadNotificationCount,
  interventionsTodayCount,
  palette = Palette,
}: HeaderProps) {
  const router = useRouter();
  const styles = useMemo(() => createStyles(palette), [palette]);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <View style={styles.identity}>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
            {name}
          </Text>
          <Text style={styles.role} numberOfLines={1} ellipsizeMode="tail">
            {role}
          </Text>
        </View>

        <View style={styles.actions}>
          <RoundButton notificationCount={unreadNotificationCount} size={44} onPress={() => router.push('/notifications')} styles={styles}>
            <Feather name="bell" size={21} color={palette.textPrimary} />
          </RoundButton>
        </View>
      </View>

      <View style={styles.badge}>
        <View style={styles.badgeDot} />
        <Text style={styles.badgeText} numberOfLines={1} ellipsizeMode="tail">
          {interventionsTodayCount} intervention{interventionsTodayCount > 1 ? 's' : ''} aujourd&rsquo;hui
        </Text>
      </View>
    </View>
  );
}

const AVATAR = 48;
const BUTTON = 38;

function createStyles(Palette: PaletteShape) {
  return StyleSheet.create({
    container: {},
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
      color: Palette.white,
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
      fontSize: 14,
      fontWeight: '400',
      color: Palette.textSecondary,
      marginTop: 2,
      letterSpacing: -0.1,
    },
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      maxWidth: '100%',
      backgroundColor: Palette.pillBlueBg,
      borderRadius: Radius.pill,
      paddingHorizontal: 11,
      paddingVertical: 5,
      marginTop: 8,
      marginLeft: AVATAR + 12,
      ...badgeShadow,
    },
    badgeDot: {
      width: 5,
      height: 5,
      borderRadius: 3,
      backgroundColor: Palette.blue,
      marginRight: 6,
    },
    badgeText: {
      color: Palette.blue,
      fontSize: FontSize.small,
      fontWeight: '600',
      letterSpacing: -0.1,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    roundButton: {
      width: BUTTON,
      height: BUTTON,
      borderRadius: BUTTON / 2,
      backgroundColor: Palette.iconButtonBg,
      alignItems: 'center',
      justifyContent: 'center',
      ...iconButtonShadow,
    },
    notificationBadge: {
      position: 'absolute',
      top: -3,
      right: -3,
      minWidth: 17,
      height: 17,
      borderRadius: 9,
      backgroundColor: Palette.notification,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
      borderWidth: 2,
      borderColor: Palette.screen,
    },
    notificationText: {
      color: Palette.white,
      fontSize: 9,
      fontWeight: '700',
    },
  });
}
