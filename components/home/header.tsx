import { Feather, Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';

type RoundButtonProps = {
  children: React.ReactNode;
  notificationCount?: number;
};

function RoundButton({ children, notificationCount }: RoundButtonProps) {
  return (
    <Pressable style={styles.roundButton} hitSlop={6}>
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
            <Feather name="bell" size={20} color={Palette.textPrimary} />
          </RoundButton>
          <RoundButton>
            <Ionicons name="settings-outline" size={20} color={Palette.textPrimary} />
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

const AVATAR = 52;
const BUTTON = 42;

const styles = StyleSheet.create({
  container: {
    // header is a vertical stack: top row + badge underneath
  },
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
    marginRight: Spacing.md,
  },
  avatarText: {
    color: Palette.white,
    fontSize: 18,
    fontWeight: '700',
  },
  identity: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  role: {
    fontSize: 15,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    maxWidth: '100%',
    backgroundColor: Palette.pillBlueBg,
    borderRadius: Radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginTop: Spacing.md,
    marginLeft: AVATAR + Spacing.md,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.blue,
    marginRight: 7,
  },
  badgeText: {
    color: Palette.blue,
    fontSize: FontSize.small,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  roundButton: {
    width: BUTTON,
    height: BUTTON,
    borderRadius: BUTTON / 2,
    backgroundColor: '#EFF1F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
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
    fontSize: 10,
    fontWeight: '700',
  },
});
