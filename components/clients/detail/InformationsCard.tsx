import { StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette } from '@/constants/design';
import { type ClientDetail } from '@/data/client-details';
import { CardSeparator, SectionCard } from './primitives';

type Props = {
  detail: ClientDetail;
};

function DefRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export function InformationsCard({ detail }: Props) {
  const accessParts = [
    detail.access.portail,
    detail.access.digicode,
    detail.access.batiment,
    detail.access.etage,
  ].filter(Boolean) as string[];

  const rows: { label: string; value: string }[] = [
    { label: 'Type de client', value: detail.type === 'entreprise' ? 'Entreprise' : 'Particulier' },
    { label: 'Mode de paiement préféré', value: detail.paymentMethod },
  ];
  if (detail.type === 'entreprise') {
    rows.push({ label: 'TVA', value: detail.tva ?? '—' });
  }
  rows.push({ label: 'Accès', value: accessParts.length ? accessParts.join(' · ') : '—' });
  rows.push({ label: 'Informations diverses', value: detail.misc?.trim() ? detail.misc : '—' });

  return (
    <SectionCard icon="info" iconTint="blue" title="Informations">
      {rows.map((row, index) => (
        <View key={row.label}>
          {index > 0 ? <CardSeparator /> : null}
          <DefRow label={row.label} value={row.value} />
        </View>
      ))}
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 10,
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
});
