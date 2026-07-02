import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { memo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { ClientAvatar } from '@/components/clients/ClientAvatar';
import { ClientStatusBadge } from '@/components/clients/ClientStatusBadge';
import { type Client, type ViewMode } from '@/components/clients/types';
import { Palette, Radius } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';

type ClientCardProps = {
  client: Client;
  variant: ViewMode;
  onPress: (client: Client) => void;
  onCall: (client: Client) => void;
};

// Round call button — the one real action that belongs on a list row. Its own
// press ring + haptic, and it swallows the touch so the card doesn't also open.
function CallButton({ onPress }: { onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, { toValue: 0.86, useNativeDriver: true, friction: 5, tension: 300 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };
  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut} hitSlop={6} accessibilityRole="button" accessibilityLabel="Appeler">
      <Animated.View style={[styles.callBtn, { transform: [{ scale }] }]}>
        <Feather name="phone" size={17} color={Palette.blue} />
      </Animated.View>
    </Pressable>
  );
}

function ClientCardComponent({ client, variant, onPress, onCall }: ClientCardProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const compact = variant === 'compact';

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, { toValue: 0.98, useNativeDriver: true, friction: 6, tension: 300 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={() => onPress(client)}
      accessibilityRole="button"
      accessibilityLabel={`Ouvrir la fiche de ${client.name}`}>
      <Animated.View style={[compact ? styles.compactCard : styles.card, { transform: [{ scale }] }]}>
        <ClientAvatar initials={client.initials} tint={client.avatarTint} size={compact ? 40 : 46} elevated />

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
            {client.name}
          </Text>

          <View style={styles.badgeRow}>
            <ClientStatusBadge status={client.status} />
          </View>

          {!compact ? (
            <View style={styles.addressRow}>
              <Feather name="map-pin" size={12} color={Palette.textTertiary} />
              <Text style={styles.address} numberOfLines={1} ellipsizeMode="tail">
                {client.address}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.actions}>
          <CallButton onPress={() => onCall(client)} />
          <Feather name="chevron-right" size={20} color={Palette.textTertiary} />
        </View>
      </Animated.View>
    </Pressable>
  );
}

export const ClientCard = memo(ClientCardComponent);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingVertical: 12,
    paddingHorizontal: 14,
    ...cardShadow,
  },
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingVertical: 10,
    paddingHorizontal: 14,
    ...cardShadow,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  badgeRow: {
    marginTop: 5,
    flexDirection: 'row',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
  },
  address: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '400',
    color: Palette.textTertiary,
    letterSpacing: -0.1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Palette.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
