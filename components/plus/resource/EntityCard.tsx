import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { FeatherIconName } from '@/components/documents/types';
import { IconTile, PressableScale, StatusPill } from '@/components/documents/shared/primitives';
import { cardShadow, FontSize, Palette, Radius, Spacing } from '@/theme';

const TILE = 38;

/**
 * One generic list row shared by the Employés/Véhicules/Matériel screens —
 * icon (or a colored initials avatar for people) + title/subtitle/meta +
 * optional status pill + chevron. Keeps the modules visually identical
 * without a data-shape-specific component each.
 */
export function EntityCard({
  icon,
  iconColor = Palette.blue,
  iconSoft = Palette.blueSoft,
  avatarInitials,
  avatarColor,
  title,
  subtitle,
  meta,
  statusLabel,
  statusColor,
  statusSoft,
  onPress,
}: {
  icon: FeatherIconName;
  iconColor?: string;
  iconSoft?: string;
  /** When set, renders a colored initials avatar instead of the icon tile — for people (Employés/Équipe). */
  avatarInitials?: string;
  avatarColor?: string;
  title: string;
  subtitle?: string;
  /** A third, even-quieter line — e.g. mileage + next service on a vehicle. */
  meta?: string;
  statusLabel?: string;
  statusColor?: string;
  statusSoft?: string;
  onPress: () => void;
}) {
  return (
    <PressableScale onPress={onPress} to={0.98} style={styles.card} accessibilityLabel={title}>
      {avatarInitials ? (
        <View style={[styles.avatar, { backgroundColor: avatarColor ?? Palette.blueAvatar }]}>
          <Text style={styles.avatarText}>{avatarInitials}</Text>
        </View>
      ) : (
        <IconTile icon={icon} color={iconColor} soft={iconSoft} size={TILE} iconSize={17} radius={13} />
      )}

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1} ellipsizeMode="tail">
            {subtitle}
          </Text>
        ) : null}
        {meta ? (
          <Text style={styles.meta} numberOfLines={1} ellipsizeMode="tail">
            {meta}
          </Text>
        ) : null}
      </View>

      {statusLabel && statusColor && statusSoft ? (
        <StatusPill label={statusLabel} color={statusColor} soft={statusSoft} />
      ) : null}

      <Feather name="chevron-right" size={16} color={Palette.textTertiary} style={styles.chevron} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingVertical: 11,
    paddingHorizontal: 14,
    gap: Spacing.sm + 2,
    ...cardShadow,
  },
  avatar: {
    width: TILE,
    height: TILE,
    borderRadius: TILE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    color: Palette.white,
    fontSize: 13.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15.5,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: FontSize.small,
    fontWeight: '400',
    color: Palette.textTertiary,
    letterSpacing: -0.1,
    marginTop: 2,
    opacity: 0.82,
  },
  meta: {
    fontSize: 11.5,
    fontWeight: '400',
    color: Palette.textTertiary,
    letterSpacing: -0.1,
    marginTop: 1,
    opacity: 0.7,
  },
  chevron: {
    opacity: 0.7,
    marginLeft: 2,
  },
});
