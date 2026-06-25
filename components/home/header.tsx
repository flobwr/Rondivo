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
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>FM</Text>
      </View>

      <View style={styles.identity}>
        <Text style={styles.name}>Florian Martin</Text>
        <Text style={styles.role}>Chauffagiste</Text>
      </View>

      <View style={styles.badge}>
        <View style={styles.badgeDot} />
        <Text style={styles.badgeText}>5 interventions{'\n'}aujourd&rsquo;hui</Text>
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
  );
}

const AVATAR = 52;
const BUTTON = 42;

const styles = StyleSheet.create({
  container: {
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
  },
  avatarText: {
    color: Palette.white,
    fontSize: 18,
    fontWeight: '700',
  },
  identity: {
    marginLeft: 10,
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
    backgroundColor: Palette.pillBlueBg,
    borderRadius: Radius.pill,
    paddingHorizontal: 11,
    paddingVertical: 8,
    marginLeft: Spacing.sm,
    flexShrink: 1,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.blue,
    marginRight: 6,
  },
  badgeText: {
    color: Palette.blue,
    fontSize: FontSize.small,
    fontWeight: '700',
    lineHeight: 17,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    paddingLeft: 6,
    gap: 6,
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
