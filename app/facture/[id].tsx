import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { ActionSheetMenu, type ActionSheetItem } from '@/components/documents/shared/ActionSheetMenu';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { HistoryCard } from '@/components/documents/shared/HistoryCard';
import { KeyValueRow, PressableScale, SectionCard } from '@/components/documents/shared/primitives';
import { QuickActionsRow, type QuickAction } from '@/components/documents/shared/QuickActionsRow';
import { FactureHero } from '@/components/documents/factures/FactureHero';
import { PaymentsCard } from '@/components/documents/factures/PaymentsCard';
import { RecordPaymentSheet } from '@/components/documents/factures/RecordPaymentSheet';
import { Palette, Spacing } from '@/constants/design';
import { formatAmount, formatLongDate } from '@/data/documents/date-utils';
import {
  FACTURE_STATUS_META,
  MOCK_FACTURES,
  PAYMENT_METHOD_LABEL,
  Payment,
  PaymentMethod,
} from '@/data/documents/factures';

export default function FactureDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const source = useMemo(() => MOCK_FACTURES.find((f) => f.id === id), [id]);

  const [status, setStatus] = useState(source?.status);
  const [payments, setPayments] = useState<Payment[]>(source?.payments ?? []);
  const [paymentSheetOpen, setPaymentSheetOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  if (!source || !status) {
    return (
      <View style={styles.root}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <DetailHeader title="Facture" onBack={() => router.back()} />
          <Text style={styles.notFound}>Facture introuvable.</Text>
        </SafeAreaView>
      </View>
    );
  }

  const facture = { ...source, status, payments };
  const paidAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const remaining = Math.max(facture.amount - paidAmount, 0);
  const meta = FACTURE_STATUS_META[status];

  const soon = (feature: string) => Alert.alert(feature, 'Cette action sera bientôt disponible.', [{ text: 'OK' }]);

  const handleSharePdf = () => {
    Share.share({
      message: `Facture ${facture.number} — ${facture.clientName} — ${formatAmount(facture.amount)}`,
    });
  };

  const handleMarkPaid = () => {
    setStatus('payee');
    if (remaining > 0) {
      setPayments((prev) => [
        ...prev,
        { id: `pay-${prev.length + 1}`, date: new Date().toISOString(), amount: remaining, method: 'virement' },
      ]);
    }
  };

  const handleRecordPayment = (amount: number, method: PaymentMethod) => {
    setPayments((prev) => [...prev, { id: `pay-${prev.length + 1}`, date: new Date().toISOString(), amount, method }]);
    if (paidAmount + amount >= facture.amount) setStatus('payee');
    setPaymentSheetOpen(false);
  };

  const handleDelete = () => {
    Alert.alert('Supprimer la facture', `Supprimer définitivement ${facture.number} ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => router.back() },
    ]);
  };

  const quickActions: QuickAction[] = [
    { key: 'send', icon: 'send', label: 'Envoyer', onPress: () => soon('Envoyer la facture') },
    { key: 'pdf', icon: 'share', label: 'Partager PDF', onPress: handleSharePdf },
    status !== 'payee'
      ? { key: 'paid', icon: 'check-circle', label: 'Marquer payée', onPress: handleMarkPaid }
      : { key: 'payment', icon: 'plus-circle', label: 'Paiement', onPress: () => setPaymentSheetOpen(true) },
    { key: 'reminder', icon: 'bell', label: 'Rappel', onPress: () => router.push('/rappels') },
  ];

  const menuItems: ActionSheetItem[] = [
    { key: 'edit', icon: 'edit-2', label: 'Modifier', onPress: () => router.push('/facture/new') },
    { key: 'duplicate', icon: 'copy', label: 'Dupliquer', onPress: () => soon('Dupliquer la facture') },
    { key: 'delete', icon: 'trash-2', label: 'Supprimer', onPress: handleDelete, destructive: true },
  ];

  const history = [
    { id: 'h-1', icon: 'file-plus' as const, label: 'Facture créée', date: formatLongDate(facture.issuedAt) },
    ...(status !== 'brouillon'
      ? [{ id: 'h-2', icon: 'send' as const, label: 'Envoyée au client', date: formatLongDate(facture.issuedAt) }]
      : []),
    ...payments.map((p, i) => ({
      id: `h-pay-${i}`,
      icon: 'check' as const,
      label: `Paiement reçu — ${formatAmount(p.amount)}`,
      date: formatLongDate(p.date),
    })),
  ];

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title={facture.number} onBack={() => router.back()} onMenu={() => setMenuOpen(true)} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <FactureHero facture={facture} onOpenClient={() => router.push(`/client/${facture.clientId}`)} />

          <View style={styles.actionsWrap}>
            <QuickActionsRow actions={quickActions} />
          </View>

          <SectionCard icon="info" title="Informations" style={styles.section}>
            <KeyValueRow label="Numéro" value={facture.number} />
            <KeyValueRow label="Statut" value={meta.label} valueColor={meta.color} />
            {facture.method ? (
              <KeyValueRow label="Méthode de paiement" value={PAYMENT_METHOD_LABEL[facture.method]} />
            ) : null}
            {facture.interventionId ? (
              <PressableScale
                onPress={() => router.push(`/intervention/${facture.interventionId}`)}
                to={0.98}
                accessibilityLabel="Ouvrir l’intervention liée">
                <KeyValueRow label="Intervention liée" value="Voir le détail" valueColor={Palette.blue} />
              </PressableScale>
            ) : null}
          </SectionCard>

          <View style={styles.section}>
            <PaymentsCard payments={payments} remaining={remaining} onRecordPayment={() => setPaymentSheetOpen(true)} />
          </View>

          <View style={styles.section}>
            <HistoryCard entries={history} />
          </View>
        </ScrollView>
      </SafeAreaView>

      <BottomNav activeIndex={3} />

      <ActionSheetMenu visible={menuOpen} title={facture.number} items={menuItems} onClose={() => setMenuOpen(false)} />

      <RecordPaymentSheet
        visible={paymentSheetOpen}
        remaining={remaining}
        onClose={() => setPaymentSheetOpen(false)}
        onSubmit={handleRecordPayment}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.screen },
  safeArea: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.section,
  },
  actionsWrap: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.section,
  },
  section: {
    marginTop: Spacing.md,
  },
  notFound: {
    textAlign: 'center',
    marginTop: 40,
    color: Palette.textSecondary,
    fontSize: 15,
  },
});
