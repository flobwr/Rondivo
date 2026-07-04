import { StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius } from '@/constants/design';

type StatusConfig = {
  label: string;
  color: string;
  background: string;
};

const INVOICE_STATUSES: Record<string, StatusConfig> = {
  draft: { label: 'Brouillon', color: Palette.textSecondary, background: '#F3F4F6' },
  sent: { label: 'Envoyée', color: Palette.blue, background: Palette.blueSoft },
  overdue: { label: 'En retard', color: Palette.red, background: Palette.redSoft },
  paid: { label: 'Payée', color: Palette.green, background: Palette.greenSoft },
};

const QUOTE_STATUSES: Record<string, StatusConfig> = {
  draft: { label: 'Brouillon', color: Palette.textSecondary, background: '#F3F4F6' },
  sent: { label: 'Envoyé', color: Palette.blue, background: Palette.blueSoft },
  viewed: { label: 'Vu', color: Palette.purple, background: Palette.purpleSoft },
  accepted: { label: 'Accepté', color: Palette.green, background: Palette.greenSoft },
  expired: { label: 'Expiré', color: Palette.orange, background: Palette.orangeSoft },
};

const REPORT_STATUSES: Record<string, StatusConfig> = {
  toComplete: { label: 'À compléter', color: Palette.orange, background: Palette.orangeSoft },
  inProgress: { label: 'En cours', color: Palette.blue, background: Palette.blueSoft },
  completed: { label: 'Terminé', color: Palette.green, background: Palette.greenSoft },
  pdfGenerated: { label: 'PDF généré', color: Palette.purple, background: Palette.purpleSoft },
};

const CONTRACT_STATUSES: Record<string, StatusConfig> = {
  draft: { label: 'Brouillon', color: Palette.textSecondary, background: '#F3F4F6' },
  pendingSignature: {
    label: 'En attente de signature',
    color: Palette.orange,
    background: Palette.orangeSoft,
  },
  signed: { label: 'Signé', color: Palette.green, background: Palette.greenSoft },
  expired: { label: 'Expiré', color: Palette.textSecondary, background: '#F3F4F6' },
};

const STATUS_MAPS: Record<string, Record<string, StatusConfig>> = {
  invoice: INVOICE_STATUSES,
  quote: QUOTE_STATUSES,
  report: REPORT_STATUSES,
  contract: CONTRACT_STATUSES,
};

type Props = {
  type: 'invoice' | 'quote' | 'report' | 'contract';
  status: string;
};

export function StatusBadge({ type, status }: Props) {
  const config = STATUS_MAPS[type]?.[status];
  if (!config) return null;

  return (
    <View style={[styles.badge, { backgroundColor: config.background }]}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.label, { color: config.color }]} numberOfLines={1}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: FontSize.tiny,
    fontWeight: '600',
  },
});
