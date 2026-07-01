import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { type Client } from '@/components/clients/types';
import { FontSize, Palette } from '@/constants/design';
import { type ClientDetail } from '@/data/client-details';
import { CardSeparator, PressableScale, SectionCard } from './primitives';

type Props = {
  client: Client;
  detail: ClientDetail;
  onCall: () => void;
  onEmail: () => void;
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

function DefRow({
  label,
  value,
  onPress,
  action,
}: {
  label: string;
  value: string;
  onPress?: () => void;
  action?: React.ComponentProps<typeof Feather>['name'];
}) {
  return (
    <PressableScale onPress={onPress} to={0.99} style={styles.row} accessibilityLabel={label}>
      <View style={styles.rowTexts}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      {onPress && action ? (
        <View style={styles.action}>
          <Feather name={action} size={15} color={Palette.blue} />
        </View>
      ) : null}
    </PressableScale>
  );
}

export function InformationsCard({ client, detail, onCall, onEmail }: Props) {
  const accessParts = [
    detail.access.portail,
    detail.access.digicode,
    detail.access.batiment,
    detail.access.etage,
  ].filter(Boolean) as string[];

  const rows: {
    label: string;
    value: string;
    onPress?: () => void;
    action?: React.ComponentProps<typeof Feather>['name'];
  }[] = [
    { label: 'Type de client', value: detail.type === 'entreprise' ? 'Entreprise' : 'Particulier' },
    { label: 'Client depuis', value: formatSince(client.createdAt) },
    { label: 'Téléphone', value: client.phone, onPress: onCall, action: 'phone' },
    { label: 'Email', value: client.email, onPress: onEmail, action: 'mail' },
    { label: 'Adresse', value: client.address },
    { label: 'Mode de paiement', value: detail.paymentMethod },
  ];
  if (detail.type === 'entreprise') {
    rows.push({ label: 'TVA', value: detail.tva ?? '—' });
  }
  rows.push({ label: "Informations d'accès", value: accessParts.length ? accessParts.join(' · ') : '—' });
  if (detail.misc?.trim() && detail.misc !== '—') {
    rows.push({ label: 'Informations diverses', value: detail.misc });
  }

  return (
    <SectionCard icon="info" iconTint="blue" title="Informations">
      {rows.map((row, index) => (
        <View key={row.label}>
          {index > 0 ? <CardSeparator /> : null}
          <DefRow label={row.label} value={row.value} onPress={row.onPress} action={row.action} />
        </View>
      ))}
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 9,
  },
  rowTexts: {
    flex: 1,
  },
  label: {
    fontSize: FontSize.small,
    fontWeight: '500',
    color: Palette.textTertiary,
    letterSpacing: -0.1,
  },
  value: {
    fontSize: FontSize.label,
    fontWeight: '600',
    color: Palette.textPrimary,
    marginTop: 3,
    letterSpacing: -0.1,
  },
  action: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Palette.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
