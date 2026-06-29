import { Feather, Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { badgeShadow, iconButtonShadow } from '@/constants/shadow';

type RoundButtonProps = {
  children: React.ReactNode;
  notificationCount?: number;
};

function RoundButton({ children, notificationCount }: RoundButtonProps) {
  return (
    <Pressable style={styles.roundButton} hitSlop={8}>
      {children}
      {notificationCount ? (
        <View style={styles.notificationBadge}>
          <Text style={styles.notificationText}>{notificationCount}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

export function Header() {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>FM</Text>
        </View>

        <View style={styles.identity}>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
            Florian Martin
          </Text>
          <Text style={styles.role} numberOfLines={1} ellipsizeMode="tail">
            Chauffagiste
          </Text>
        </View>

        <View style={styles.actions}>
          <RoundButton notificationCount={3}>
            <Feather name="bell" size={19} color={Palette.textPrimary} />
          </RoundButton>
          <RoundButton>
            <Ionicons name="settings-outline" size={19} color={Palette.textPrimary} />
          </RoundButton>
        </View>
      </View>

      <View style={styles.badge}>
        <View style={styles.badgeDot} />
        <Text style={styles.badgeText} numberOfLines={1} ellipsizeMode="tail">
          5 interventions aujourd&rsquo;hui
        </Text>
      </View>
    </View>
  );
}

const AVATAR = 48;
const BUTTON = 38;

const styles = StyleSheet.create({
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
    backgroundColor: '#ECEEF2',
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
