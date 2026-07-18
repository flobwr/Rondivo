import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { ActionSheetMenu, type ActionSheetItem } from '@/components/documents/shared/ActionSheetMenu';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { EmptyState } from '@/components/documents/shared/EmptyState';
import { HistoryCard } from '@/components/documents/shared/HistoryCard';
import { MessageComposerModal } from '@/components/documents/shared/MessageComposerModal';
import { NextActionBanner } from '@/components/documents/shared/NextActionBanner';
import { CardSeparator, KeyValueRow, PressableScale, SectionCard } from '@/components/documents/shared/primitives';
import { QuickActionsRow, type QuickAction } from '@/components/documents/shared/QuickActionsRow';
import { FactureHero } from '@/components/documents/factures/FactureHero';
import { PaymentsCard } from '@/components/documents/factures/PaymentsCard';
import { RecordPaymentSheet } from '@/components/documents/factures/RecordPaymentSheet';
import { Palette, Spacing } from '@/theme';
import { getClientById } from '@/data/clients';
import { formatAmount, formatLongDate } from '@/data/documents/date-utils';
import { buildRelaunchMessage, buildSendMessage } from '@/data/documents/messaging';
import { generateDocumentPdf, shareDocumentPdf } from '@/data/documents/pdf';
import {
  FACTURE_STATUS_META,
  MOCK_FACTURES,
  PAYMENT_METHOD_LABEL,
  Payment,
  PaymentMethod,
} from '@/data/documents/factures';
import { addPayment, deleteFacture, updateFacture } from '@/services/documents/factures';

type Composer = 'send' | 'relance' | null;

export default function FactureDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const source = useMemo(() => MOCK_FACTURES.find((f) => f.id === id), [id]);

  const [status, setStatus] = useState(source?.status);
  const [payments, setPayments] = useState<Payment[]>(source?.payments ?? []);
  const [paymentSheetOpen, setPaymentSheetOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [composer, setComposer] = useState<Composer>(null);
  const [archived, setArchived] = useState(false);
  const [relaunched, setRelaunched] = useState(false);
  const [sent, setSent] = useState(false);

  if (!source || !status) {
    return (
      <View style={styles.root}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <DetailHeader title="Facture" onBack={() => router.back()} />
          <EmptyState icon="alert-circle" title="Facture introuvable" subtitle="Cette facture n’existe pas ou a été supprimée." />
        </SafeAreaView>
      </View>
    );
  }

  const facture = { ...source, status, payments };
  const paidAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const remaining = Math.max(facture.amount - paidAmount, 0);
  const meta = FACTURE_STATUS_META[status];
  const client = getClientById(facture.clientId);

  const handleCall = () => {
    if (!client?.phone) return;
    Linking.openURL(`tel:${client.phone.replace(/\s+/g, '')}`);
  };

  const handleSharePdf = async () => {
    const uri = await generateDocumentPdf('facture', facture, facture.clientName);
    await shareDocumentPdf(uri, `Facture ${facture.number} — ${facture.clientName} — ${formatAmount(facture.amount)}`);
  };

  const handleMarkPaid = async () => {
    const nextPayments =
      remaining > 0
        ? [...payments, { id: `pay-${payments.length + 1}`, date: new Date().toISOString(), amount: remaining, method: 'virement' as PaymentMethod }]
        : payments;
    setStatus('payee');
    setPayments(nextPayments);
    await updateFacture(facture.id, { status: 'payee', payments: nextPayments });
  };

  const handleRecordPayment = async (amount: number, method: PaymentMethod) => {
    const payment: Payment = { id: `pay-${payments.length + 1}`, date: new Date().toISOString(), amount, method };
    const nextStatus = paidAmount + amount >= facture.amount ? 'payee' : status;
    setPayments((prev) => [...prev, payment]);
    if (nextStatus !== status) setStatus(nextStatus);
    setPaymentSheetOpen(false);
    await addPayment(facture.id, payment);
    if (nextStatus !== status) await updateFacture(facture.id, { status: nextStatus });
  };

  const handleArchive = () => {
    Alert.alert('Archiver la facture', `Archiver définitivement ${facture.number} ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Archiver', onPress: () => setArchived(true) },
    ]);
  };

  const handleDelete = () => {
    Alert.alert('Supprimer la facture', `Supprimer définitivement ${facture.number} ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          await deleteFacture(facture.id);
          router.back();
        },
      },
    ]);
  };

  // Exactly one recommended action per status — the QuickActionsRow below
  // never repeats it, only genuinely distinct secondary actions.
  const nextAction =
    status === 'brouillon'
      ? { label: 'Envoyer la facture', icon: 'send' as const, onPress: () => setComposer('send') }
      : status === 'envoyee'
        ? { label: 'Partager PDF', icon: 'share' as const, onPress: handleSharePdf }
        : status === 'enRetard'
          ? { label: 'Relancer le client', icon: 'send' as const, onPress: () => setComposer('relance') }
          : status === 'payee' && !archived
            ? { label: 'Archiver la facture', icon: 'archive' as const, onPress: handleArchive }
            : null;

  const quickActions: QuickAction[] = [
    ...(status !== 'envoyee' ? [{ key: 'pdf', icon: 'share', label: 'Partager PDF', onPress: handleSharePdf } as QuickAction] : []),
    ...(status === 'envoyee' || status === 'enRetard'
      ? [{ key: 'paid', icon: 'check-circle', label: 'Marquer payée', onPress: handleMarkPaid } as QuickAction]
      : []),
    { key: 'call', icon: 'phone', label: 'Appeler', onPress: handleCall },
  ];

  const menuItems: ActionSheetItem[] = [
    { key: 'edit', icon: 'edit-2', label: 'Modifier', onPress: () => router.push(`/facture/new?editId=${facture.id}` as never) },
    { key: 'duplicate', icon: 'copy', label: 'Dupliquer', onPress: () => router.push(`/facture/new?duplicateFromId=${facture.id}` as never) },
    { key: 'delete', icon: 'trash-2', label: 'Supprimer', onPress: handleDelete, destructive: true },
  ];

  const history = [
    { id: 'h-1', icon: 'file-plus' as const, label: 'Facture créée', date: formatLongDate(facture.issuedAt) },
    ...(status !== 'brouillon' || sent
      ? [{ id: 'h-2', icon: 'send' as const, label: 'Envoyée au client', date: formatLongDate(facture.issuedAt) }]
      : []),
    ...payments.map((p, i) => ({
      id: `h-pay-${i}`,
      icon: 'check' as const,
      label: `Paiement reçu — ${formatAmount(p.amount)}`,
      date: formatLongDate(p.date),
    })),
    ...(relaunched
      ? [{ id: 'h-relance', icon: 'send' as const, label: 'Relance envoyée au client', date: formatLongDate(new Date().toISOString()) }]
      : []),
  ];

  const composedMessage =
    composer === 'send'
      ? buildSendMessage('facture', facture, facture.clientName)
      : composer === 'relance'
        ? buildRelaunchMessage('facture', facture, facture.clientName)
        : { subject: '', body: '' };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title={facture.number} onBack={() => router.back()} onMenu={() => setMenuOpen(true)} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <FactureHero facture={facture} onOpenClient={() => router.push(`/client/${facture.clientId}`)} />

          {nextAction ? (
            <View style={styles.bannerWrap}>
              <NextActionBanner label={nextAction.label} icon={nextAction.icon} onPress={nextAction.onPress} />
            </View>
          ) : null}

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

          {facture.lines && facture.lines.length > 0 ? (
            <SectionCard icon="list" title="Lignes" style={styles.section}>
              {facture.lines.map((line) => (
                <KeyValueRow key={line.id} label={line.label} value={formatAmount(line.amount)} />
              ))}
              <CardSeparator />
              <KeyValueRow label="Total" value={formatAmount(facture.amount)} valueColor={Palette.blue} />
            </SectionCard>
          ) : null}

          {facture.notes ? (
            <SectionCard icon="file-text" title="Notes" style={styles.section}>
              <Text style={styles.notes}>{facture.notes}</Text>
            </SectionCard>
          ) : null}

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

      <MessageComposerModal
        visible={composer !== null}
        title={composer === 'send' ? 'Envoyer la facture' : 'Relancer le client'}
        recipientName={facture.clientName}
        recipientEmail={client?.email}
        subject={composedMessage.subject}
        body={composedMessage.body}
        onClose={() => setComposer(null)}
        onSent={() => {
          if (composer === 'send') {
            setSent(true);
            if (status === 'brouillon') setStatus('envoyee');
          } else if (composer === 'relance') {
            setRelaunched(true);
          }
        }}
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
  bannerWrap: {
    marginTop: Spacing.md,
  },
  actionsWrap: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.section,
  },
  section: {
    marginTop: Spacing.md,
  },
  notes: {
    fontSize: 14,
    fontWeight: '400',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
    lineHeight: 19,
  },
});
