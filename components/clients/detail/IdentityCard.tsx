import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { ClientAvatar } from '@/components/clients/ClientAvatar';
import { ClientStatusBadge } from '@/components/clients/ClientStatusBadge';
import { type Client } from '@/components/clients/types';
import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { PressableScale } from './primitives';

type Props = {
  client: Client;
  onAddress: () => void;
};

/**
 * Compact identity header — the "who + where" glance.
 *
 * Phone, email and "client depuis" intentionally live in the Informations card
 * only: the phone is already one tap away behind Appeler, so showing it here
 * would just be noise. Keeps the top of the sheet under half a screen.
 */
export function IdentityCard({ client, onAddress }: Props) {
  return (
    <View style={styles.card}>
      <ClientAvatar initials={client.initials} tint={client.avatarTint} size={52} />

      <View style={styles.texts}>
        <Text style={styles.name} numberOfLines={1}>
          {client.name}
        </Text>
        <View style={styles.badgeRow}>
          <ClientStatusBadge status={client.status} />
        </View>
        <PressableScale onPress={onAddress} to={0.98} style={styles.addressRow} accessibilityLabel="Itinéraire">
          <Feather name="map-pin" size={13} color={Palette.textTertiary} />
          <Text style={styles.address} numberOfLines={1}>
            {client.address}
          </Text>
        </PressableScale>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    padding: Spacing.lg,
    ...cardShadow,
  },
  texts: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.5,
  },
  badgeRow: {
    marginTop: 6,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
  },
  address: {
    flex: 1,
    fontSize: FontSize.small,
    fontWeight: '500',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
  },
});
