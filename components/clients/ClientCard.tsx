import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { memo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette, Radius } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { ClientAvatar } from '@/components/clients/ClientAvatar';
import { ClientQuickActions } from '@/components/clients/ClientQuickActions';
import { ClientStatusBadge } from '@/components/clients/ClientStatusBadge';
import { STATUS_META, TINT_COLORS, type Client, type ViewMode } from '@/components/clients/types';

type ClientCardProps = {
  client: Client;
  variant: ViewMode;
  onPress: (client: Client) => void;
  onCall: (client: Client) => void;
  onNavigate: (client: Client) => void;
};

/** Compact relative label for the top-right slot — kept short on purpose so it
 *  never competes with the client name for width. Returns null when there is
 *  nothing meaningful to show (brand-new clients). */
function shortLastLabel(daysAgo: number): string | null {
  if (daysAgo >= 9999) return null;
  if (daysAgo <= 0) return "Auj.";
  if (daysAgo === 1) return 'Hier';
  if (daysAgo < 31) return `${daysAgo} j`;
  const months = Math.round(daysAgo / 30);
  return `${months} mois`;
}

function StatChip({
  icon,
  value,
  label,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  value: string | number;
  label: string;
}) {
  return (
    <View style={styles.statChip}>
      <Feather name={icon} size={13} color={Palette.textTertiary} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function ClientCardComponent({ client, variant, onPress, onCall, onNavigate }: ClientCardProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const accentColor = STATUS_META[client.status].accent;
  const highlightColor = TINT_COLORS[client.highlightTint].color;
  const lastLabel = shortLastLabel(client.lastInterventionDaysAgo);

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, { toValue: 0.98, useNativeDriver: true, friction: 6, tension: 300 }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  if (variant === 'compact') {
    return (
      <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={() => onPress(client)}>
        <Animated.View style={[styles.compactCard, { transform: [{ scale }] }]}>
          <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
          <ClientAvatar initials={client.initials} tint={client.avatarTint} size={38} />
          <View style={styles.compactInfo}>
            <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
              {client.name}
            </Text>
            <View style={styles.compactMetaRow}>
              <Feather name={client.highlightIcon} size={12} color={highlightColor} />
              <Text style={[styles.compactMeta, { color: highlightColor }]} numberOfLines={1} ellipsizeMode="tail">
                {client.highlightText}
              </Text>
            </View>
          </View>
          <Feather name="chevron-right" size={19} color={Palette.textTertiary} style={styles.compactChevron} />
        </Animated.View>
      </Pressable>
    );
  }

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={() => onPress(client)}>
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <View style={[styles.accentBar, { backgroundColor: accentColor }]} />

        {/* Identity */}
        <View style={styles.header}>
          <ClientAvatar initials={client.initials} tint={client.avatarTint} />

          <View style={styles.identity}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                {client.name}
              </Text>
              {lastLabel ? <Text style={styles.timeAgo}>{lastLabel}</Text> : null}
            </View>

            <View style={styles.badgeRow}>
              <ClientStatusBadge status={client.status} />
            </View>
          </View>
        </View>

        {/* Address */}
        <View style={styles.metaRow}>
          <Feather name="map-pin" size={13} color={Palette.textTertiary} />
          <Text style={styles.metaText} numberOfLines={1} ellipsizeMode="tail">
            {client.address}
          </Text>
        </View>

        {/* Primary status — full width so it never truncates */}
        <View style={styles.highlightRow}>
          <Feather name={client.highlightIcon} size={14} color={highlightColor} />
          <Text style={[styles.highlightText, { color: highlightColor }]} numberOfLines={1} ellipsizeMode="tail">
            {client.highlightText}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Counts */}
        <View style={styles.statsRow}>
          <StatChip icon="calendar" value={client.interventionsCount} label="interventions" />
          <StatChip icon="file-text" value={client.quotesPending || '—'} label="devis" />
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <ClientQuickActions
            onCall={() => onCall(client)}
            onNavigate={() => onNavigate(client)}
            onOpen={() => onPress(client)}
          />
        </View>
      </Animated.View>
    </Pressable>
  );
}

export const ClientCard = memo(ClientCardComponent);

const ACCENT_WIDTH = 4;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingVertical: 15,
    paddingHorizontal: 16,
    overflow: 'hidden',
    ...cardShadow,
  },
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingVertical: 12,
    paddingHorizontal: 16,
    overflow: 'hidden',
    gap: 12,
    ...cardShadow,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: ACCENT_WIDTH,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  identity: {
    flex: 1,
    marginLeft: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  timeAgo: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: '500',
    color: Palette.textTertiary,
    letterSpacing: -0.1,
  },
  badgeRow: {
    marginTop: 7,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 12,
  },
  metaText: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '400',
    color: Palette.textTertiary,
    letterSpacing: -0.1,
  },

  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 8,
  },
  highlightText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.1,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.border,
    marginVertical: 13,
  },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  statLabel: {
    fontSize: 12.5,
    fontWeight: '400',
    color: Palette.textTertiary,
    letterSpacing: -0.1,
  },

  actions: {
    marginTop: 14,
  },

  // Compact
  compactInfo: {
    flex: 1,
  },
  compactMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 3,
  },
  compactMeta: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  compactChevron: {
    marginLeft: 4,
  },
});
