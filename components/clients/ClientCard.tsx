import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { memo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette, Radius, Spacing } from '@/constants/design';
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

function ClientCardComponent({ client, variant, onPress, onCall, onNavigate }: ClientCardProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const accentColor = STATUS_META[client.status].color;
  const highlightColor = TINT_COLORS[client.highlightTint].color;
  const footerColor = TINT_COLORS[client.footerTint].color;

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
          <ClientAvatar initials={client.initials} tint={client.avatarTint} size={40} />
          <View style={styles.compactInfo}>
            <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
              {client.name}
            </Text>
            <Text style={styles.compactPhone} numberOfLines={1}>
              {client.phone}
            </Text>
          </View>
          <ClientStatusBadge status={client.status} />
          <Feather name="chevron-right" size={19} color={Palette.textTertiary} style={styles.compactChevron} />
        </Animated.View>
      </Pressable>
    );
  }

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={() => onPress(client)}>
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <View style={[styles.accentBar, { backgroundColor: accentColor }]} />

        <View style={styles.topRow}>
          <ClientAvatar initials={client.initials} tint={client.avatarTint} />

          <View style={styles.identity}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                {client.name}
              </Text>
              <ClientStatusBadge status={client.status} />
            </View>

            <View style={styles.metaRow}>
              <Feather name="map-pin" size={12} color={Palette.textTertiary} />
              <Text style={styles.metaText} numberOfLines={1} ellipsizeMode="tail">
                {client.address}
              </Text>
            </View>

            <View style={styles.metaRow}>
              <Feather name="phone" size={12} color={Palette.textTertiary} />
              <Text style={styles.metaText} numberOfLines={1}>
                {client.phone}
              </Text>
            </View>
          </View>

          <View style={styles.highlightCol}>
            <Text style={[styles.highlightText, { color: highlightColor }]} numberOfLines={2}>
              {client.highlightText}
            </Text>
            <Text style={styles.highlightSub} numberOfLines={1}>
              Dernière intervention {client.lastInterventionLabel}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.footer}>
          <View style={styles.statsRow}>
            <View style={styles.statGroup}>
              <View style={styles.statTop}>
                <Feather name="calendar" size={12} color={Palette.textTertiary} />
                <Text style={styles.statValue}>{client.interventionsCount}</Text>
              </View>
              <Text style={styles.statLabel} numberOfLines={1}>
                interventions
              </Text>
            </View>

            <View style={styles.footerDivider} />

            <View style={styles.statGroup}>
              <View style={styles.statTop}>
                <Feather name="file-text" size={12} color={Palette.textTertiary} />
                <Text style={styles.statValue}>{client.quotesPending || '—'}</Text>
              </View>
              <Text style={styles.statLabel} numberOfLines={1}>
                devis en attente
              </Text>
            </View>

            <View style={styles.footerDivider} />

            <View style={styles.statusGroup}>
              <Feather name={client.footerIcon} size={13} color={footerColor} />
              <Text style={[styles.statusText, { color: footerColor }]} numberOfLines={1} ellipsizeMode="tail">
                {client.footerText}
              </Text>
            </View>
          </View>

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
    paddingVertical: 16,
    paddingHorizontal: 18,
    overflow: 'hidden',
    ...cardShadow,
  },
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingVertical: 12,
    paddingHorizontal: 18,
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
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  identity: {
    flex: 1,
    marginLeft: Spacing.md,
    marginRight: Spacing.sm,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
    flexShrink: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 5,
  },
  metaText: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '400',
    color: Palette.textTertiary,
    letterSpacing: -0.1,
  },
  highlightCol: {
    alignItems: 'flex-end',
    maxWidth: 128,
  },
  highlightText: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
    letterSpacing: -0.1,
  },
  highlightSub: {
    fontSize: 11,
    fontWeight: '400',
    color: Palette.textTertiary,
    marginTop: 4,
    textAlign: 'right',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.border,
    marginVertical: 14,
  },
  footer: {
    gap: 12,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statGroup: {
    flexShrink: 0,
  },
  statTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  statLabel: {
    fontSize: 10.5,
    fontWeight: '500',
    color: Palette.textTertiary,
    marginTop: 2,
  },
  footerDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    backgroundColor: Palette.border,
    marginHorizontal: 12,
  },
  statusGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 0,
  },
  statusText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  compactInfo: {
    flex: 1,
  },
  compactPhone: {
    fontSize: 12.5,
    fontWeight: '400',
    color: Palette.textTertiary,
    marginTop: 2,
  },
  compactChevron: {
    marginLeft: 2,
  },
});
