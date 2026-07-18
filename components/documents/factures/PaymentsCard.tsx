import { StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette } from '@/theme';
import { IconTile, PressableScale, SectionCard } from '@/components/documents/shared/primitives';
import { formatAmount, formatShortDate } from '@/data/documents/date-utils';
import { PAYMENT_METHOD_LABEL, Payment } from '@/data/documents/factures';

export function PaymentsCard({
  payments,
  remaining,
  onRecordPayment,
}: {
  payments: Payment[];
  remaining: number;
  onRecordPayment: () => void;
}) {
  return (
    <SectionCard icon="credit-card" title="Paiements">
      {payments.length === 0 ? (
        <Text style={styles.empty}>Aucun paiement enregistré pour le moment.</Text>
      ) : (
        <View style={styles.list}>
          {payments.map((payment, index) => (
            <View key={payment.id} style={[styles.row, index > 0 ? styles.rowBorder : null]}>
              <IconTile icon="check" color={Palette.green} soft={Palette.greenSoft} size={32} iconSize={14} />
              <View style={styles.rowInfo}>
                <Text style={styles.rowAmount}>{formatAmount(payment.amount)}</Text>
                <Text style={styles.rowMeta}>
                  {formatShortDate(payment.date)} · {PAYMENT_METHOD_LABEL[payment.method]}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {remaining > 0 ? (
        <PressableScale onPress={onRecordPayment} to={0.98} style={styles.recordButton} accessibilityLabel="Enregistrer un paiement">
          <Text style={styles.recordButtonText}>
            Enregistrer un paiement · {formatAmount(remaining)} restant{remaining > 1 ? 's' : ''}
          </Text>
        </PressableScale>
      ) : null}
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  empty: {
    fontSize: FontSize.small,
    fontWeight: '400',
    color: Palette.textTertiary,
    letterSpacing: -0.1,
  },
  list: {
    gap: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  rowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Palette.border,
  },
  rowInfo: {
    flex: 1,
  },
  rowAmount: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  rowMeta: {
    fontSize: 12,
    fontWeight: '400',
    color: Palette.textTertiary,
    letterSpacing: -0.1,
    marginTop: 1,
  },
  recordButton: {
    marginTop: 12,
    backgroundColor: Palette.blueSoft,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  recordButtonText: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Palette.blue,
    letterSpacing: -0.1,
  },
});
