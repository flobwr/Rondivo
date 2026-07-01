import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { ClientAvatar } from '@/components/clients/ClientAvatar';
import { ClientStatusBadge } from '@/components/clients/ClientStatusBadge';
import { type Client, type FeatherIconName } from '@/components/clients/types';
import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { type ClientDetail } from '@/data/client-details';
import { PressableScale, TintIcon } from './primitives';

type Props = {
  client: Client;
  detail: ClientDetail;
  onCall: () => void;
  onEmail: () => void;
  onAddress: () => void;
};

const MONTHS = [
  'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin',
  'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.',
];

function formatSince(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function ContactRow({
  icon,
  value,
  onPress,
  last,
}: {
  icon: FeatherIconName;
  value: string;
  onPress: () => void;
  last?: boolean;
}) {
  return (
    <PressableScale onPress={onPress} to={0.98} style={[styles.contactRow, last && styles.contactRowLast]}>
      <TintIcon icon={icon} tint="blue" size={34} iconSize={15} />
      <Text style={styles.contactValue} numberOfLines={1} ellipsizeMode="tail">
        {value}
      </Text>
      <Feather name="chevron-right" size={16} color={Palette.textTertiary} />
    </PressableScale>
  );
}

export function IdentityCard({ client, detail, onCall, onEmail, onAddress }: Props) {
  const sinceLabel = detail.type === 'entreprise' ? 'Entreprise depuis' : 'Client depuis';

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <ClientAvatar initials={client.initials} tint={client.avatarTint} size={60} />

        <View style={styles.identity}>
          <Text style={styles.name} numberOfLines={2}>
            {client.name}
          </Text>
          <View style={styles.badgeRow}>
            <ClientStatusBadge status={client.status} />
          </View>
        </View>

        <View style={styles.sinceCard}>
          <Text style={styles.sinceLabel}>{sinceLabel}</Text>
          <Text style={styles.sinceValue}>{formatSince(client.createdAt)}</Text>
        </View>
      </View>

      <View style={styles.contacts}>
        <ContactRow icon="phone" value={client.phone} onPress={onCall} />
        <ContactRow icon="mail" value={client.email} onPress={onEmail} />
        <ContactRow icon="map-pin" value={client.address} onPress={onAddress} last />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    padding: Spacing.cardPadding,
    ...cardShadow,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  identity: {
    flex: 1,
    paddingTop: 2,
  },
  name: {
    fontSize: 21,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.5,
  },
  badgeRow: {
    marginTop: 7,
  },
  sinceCard: {
    backgroundColor: Palette.cardMuted,
    borderRadius: Radius.tile,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
    alignItems: 'flex-end',
  },
  sinceLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: Palette.textTertiary,
    letterSpacing: 0.1,
  },
  sinceValue: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginTop: 2,
    letterSpacing: -0.2,
  },
  contacts: {
    marginTop: Spacing.lg,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Palette.border,
  },
  contactRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  contactValue: {
    flex: 1,
    fontSize: FontSize.body,
    fontWeight: '500',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
});
