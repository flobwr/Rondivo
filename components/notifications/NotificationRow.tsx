import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { TINT_COLORS } from '@/components/clients/types';
import { IconTile, PressableScale } from '@/components/documents/shared/primitives';
import { FontSize, Palette, Spacing } from '@/constants/design';
import { NotificationItem } from '@/data/notifications';

type Props = {
  notification: NotificationItem;
  onPress: () => void;
  onDelete: () => void;
};

export function NotificationRow({ notification, onPress, onDelete }: Props) {
  const tint = TINT_COLORS[notification.tint];

  return (
    <PressableScale onPress={onPress} to={0.985} style={styles.row} accessibilityLabel={notification.title}>
      <IconTile icon={notification.icon} color={tint.color} soft={tint.soft} size={40} iconSize={17} />

      <View style={styles.info}>
        <View style={styles.titleRow}>
          {!notification.read ? <View style={styles.unreadDot} /> : null}
          <Text style={[styles.title, !notification.read && styles.titleUnread]} numberOfLines={1}>
            {notification.title}
          </Text>
        </View>
        <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
          {notification.description}
        </Text>
        <Text style={styles.time}>{notification.time}</Text>
      </View>

      <PressableScale onPress={onDelete} to={0.9} style={styles.deleteButton} accessibilityLabel="Supprimer">
        <Feather name="trash-2" size={15} color={Palette.textTertiary} />
      </PressableScale>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 13,
    gap: Spacing.md,
  },
  info: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.blue,
  },
  title: {
    flexShrink: 1,
    fontSize: FontSize.label,
    fontWeight: '500',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  titleUnread: {
    fontWeight: '700',
  },
  description: {
    fontSize: FontSize.small,
    fontWeight: '400',
    color: Palette.textSecondary,
    marginTop: 3,
    lineHeight: 18,
  },
  time: {
    fontSize: 11.5,
    fontWeight: '500',
    color: Palette.textTertiary,
    marginTop: 5,
  },
  deleteButton: {
    padding: 6,
    marginTop: -6,
    marginRight: -6,
  },
});
