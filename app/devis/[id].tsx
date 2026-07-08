import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { ActionSheetMenu, type ActionSheetItem } from '@/components/documents/shared/ActionSheetMenu';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { DocumentHero } from '@/components/documents/shared/DocumentHero';
import { EmptyState } from '@/components/documents/shared/EmptyState';
import { HistoryCard } from '@/components/documents/shared/HistoryCard';
import { MessageComposerModal } from '@/components/documents/shared/MessageComposerModal';
import { NextActionBanner } from '@/components/documents/shared/NextActionBanner';
import { CardSeparator, KeyValueRow, PressableScale, SectionCard } from '@/components/documents/shared/primitives';
import { QuickActionsRow, type QuickAction } from '@/components/documents/shared/QuickActionsRow';
import { SkeletonBlock } from '@/components/ui/Shimmer';
import { type Client } from '@/components/clients/types';
import { Palette, Spacing } from '@/constants/design';
import { useAsyncItem } from '@/hooks/use-async-item';
import { getClientById } from '@/services/clients';
import { formatAmount, formatLongDate } from '@/data/documents/date-utils';
import { buildRelaunchMessage, buildSendMessage } from '@/data/documents/messaging';
import { generateDocumentPdf, shareDocumentPdf } from '@/data/documents/pdf';
import { DEVIS_STATUS_META, DevisStatus, deleteDevis, getDevis, updateDevis } from '@/services/documents/devis';

type Composer = 'send' | 'relance' | null;

export default function DevisDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const fetchDevis = useCallback(() => getDevis(id), [id]);
  const { data: source, status: fetchStatus, refresh } = useAsyncItem(fetchDevis);

  const [statusOverride, setStatusOverride] = useState<DevisStatus | undefined>(undefined);
  const [menuOpen, setMenuOpen] = useState(false);
  const [relaunched, setRelaunched] = useState(false);
  const [sent, setSent] = useState(false);
  const [composer, setComposer] = useState<Composer>(null);
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    setStatusOverride(undefined);
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    if (source) {
      const c = getClientById(source.clientId);
      if (!cancelled) setClient(c ?? null);
    }
    return () => {
      cancelled = true;
    };
  }, [source]);

  if (fetchStatus === 'loading') {
    return (
      <View style={styles.root}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <DetailHeader title="Devis" onBack={() => router.back()} />
          <View style={styles.content}>
            <SkeletonBlock height={160} radius={24} />
            <SkeletonBlock height={120} radius={24} style={{ marginTop: Spacing.md }} />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (fetchStatus === 'error') {
    return (
      <View style={styles.root}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <DetailHeader title="Devis" onBack={() => router.back()} />
          <EmptyState icon="alert-circle" title="Impossible de charger" subtitle="Une erreur est survenue." actionLabel="Réessayer" onAction={refresh} />
        </SafeAreaView>
      </View>
    );
  }

  if (!source) {
    return (
      <View style={styles.root}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <DetailHeader title="Devis" onBack={() => router.back()} />
          <Text style={styles.notFound}>Devis introuvable.</Text>
        </SafeAreaView>
      </View>
    );
  }

  const status = statusOverride ?? source.status;
  const devis = { ...source, status };
  const meta = DEVIS_STATUS_META[status];

  const handleSign = () => {
    Alert.alert('Marquer comme accepté', `Confirmer la signature de ${devis.clientName} ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Confirmer',
        onPress: async () => {
          setStatusOverride('accepte');
          await updateDevis(devis.id, { status: 'accepte' });
        },
      },
    ]);
  };

  const handleConvert = () => {
    Alert.alert('Convertir en facture', `Créer une facture de ${formatAmount(devis.amount)} pour ${devis.clientName} ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Convertir', onPress: () => router.push(`/facture/new?fromDevisId=${devis.id}` as never) },
    ]);
  };

  const handleDelete = () => {
    Alert.alert('Supprimer le devis', `Supprimer définitivement ${devis.number} ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          await deleteDevis(devis.id);
          router.back();
        },
      },
    ]);
  };

  const handleSharePdf = async () => {
    const uri = await generateDocumentPdf('devis', devis, devis.clientName);
    await shareDocumentPdf(uri, `Devis ${devis.number} — ${devis.clientName} — ${formatAmount(devis.amount)}`);
  };

  const canSign = status === 'envoye' || status === 'vu';
  const canConvert = status === 'accepte';

  // Exactly one recommended action per status — QuickActionsRow only ever
  // adds genuinely distinct secondary actions (never a rewording of this one).
  const nextAction =
    status === 'brouillon'
      ? { label: 'Envoyer le devis', icon: 'send' as const, onPress: () => setComposer('send') }
      : canSign
        ? { label: 'Relancer le client', icon: 'send' as const, onPress: () => setComposer('relance') }
        : canConvert
          ? { label: 'Créer une facture', icon: 'file-text' as const, onPress: handleConvert }
          : status === 'expire'
            ? {
                label: 'Dupliquer le devis',
                icon: 'copy' as const,
                onPress: () => router.push(`/devis/new?duplicateFromId=${devis.id}` as never),
              }
            : null;

  const quickActions: QuickAction[] = [
    { key: 'share', icon: 'share', label: 'Partager', onPress: handleSharePdf },
    ...(canSign ? [{ key: 'sign', icon: 'edit-3', label: 'Signer', onPress: handleSign } as QuickAction] : []),
    ...(status === 'refuse' ? [{ key: 'reminder', icon: 'bell', label: 'Rappel', onPress: () => router.push('/rappels') } as QuickAction] : []),
  ];

  const menuItems: ActionSheetItem[] = [
    { key: 'edit', icon: 'edit-2', label: 'Modifier', onPress: () => router.push(`/devis/new?editId=${devis.id}` as never) },
    { key: 'duplicate', icon: 'copy', label: 'Dupliquer', onPress: () => router.push(`/devis/new?duplicateFromId=${devis.id}` as never) },
    { key: 'delete', icon: 'trash-2', label: 'Supprimer', onPress: handleDelete, destructive: true },
  ];

  const history = [
    { id: 'h-1', icon: 'file-plus' as const, label: 'Devis créé', date: formatLongDate(devis.issuedAt) },
    ...(status !== 'brouillon' || sent
      ? [{ id: 'h-2', icon: 'send' as const, label: 'Envoyé au client', date: formatLongDate(devis.issuedAt) }]
      : []),
    ...(status === 'accepte' ? [{ id: 'h-3', icon: 'check' as const, label: 'Accepté par le client', date: formatLongDate(devis.validUntil) }] : []),
    ...(status === 'refuse' ? [{ id: 'h-4', icon: 'x' as const, label: 'Refusé par le client', date: formatLongDate(devis.validUntil) }] : []),
    ...(relaunched
      ? [{ id: 'h-relance', icon: 'send' as const, label: 'Relance envoyée au client', date: formatLongDate(new Date().toISOString()) }]
      : []),
  ];

  const composedMessage =
    composer === 'send'
      ? buildSendMessage('devis', devis, devis.clientName)
      : composer === 'relance'
        ? buildRelaunchMessage('devis', devis, devis.clientName)
        : { subject: '', body: '' };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title={devis.number} onBack={() => router.back()} onMenu={() => setMenuOpen(true)} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <DocumentHero
            clientName={devis.clientName}
            onOpenClient={() => router.push(`/client/${devis.clientId}`)}
            amount={formatAmount(devis.amount)}
            statusLabel={meta.label}
            statusColor={meta.color}
            statusSoft={meta.soft}
            dates={[
              { label: 'Émis le', value: formatLongDate(devis.issuedAt) },
              { label: 'Valable jusqu’au', value: formatLongDate(devis.validUntil) },
            ]}
          />

          {nextAction ? (
            <View style={styles.bannerWrap}>
              <NextActionBanner label={nextAction.label} icon={nextAction.icon} onPress={nextAction.onPress} />
            </View>
          ) : null}

          <View style={styles.actionsWrap}>
            <QuickActionsRow actions={quickActions} />
          </View>

          <SectionCard icon="info" title="Informations">
            <KeyValueRow label="Numéro" value={devis.number} />
            <KeyValueRow label="Statut" value={meta.label} valueColor={meta.color} />
            {devis.interventionId ? (
              <PressableScale
                onPress={() => router.push(`/intervention/${devis.interventionId}`)}
                to={0.98}
                accessibilityLabel="Ouvrir l’intervention liée">
                <KeyValueRow label="Intervention liée" value="Voir le détail" valueColor={Palette.blue} />
              </PressableScale>
            ) : null}
          </SectionCard>

          {devis.lines && devis.lines.length > 0 ? (
            <SectionCard icon="list" title="Lignes" style={styles.section}>
              {devis.lines.map((line) => (
                <KeyValueRow key={line.id} label={line.label} value={formatAmount(line.amount)} />
              ))}
              <CardSeparator />
              <KeyValueRow label="Total" value={formatAmount(devis.amount)} valueColor={Palette.blue} />
            </SectionCard>
          ) : null}

          {devis.notes ? (
            <SectionCard icon="file-text" title="Notes" style={styles.section}>
              <Text style={styles.notes}>{devis.notes}</Text>
            </SectionCard>
          ) : null}

          <View style={styles.section}>
            <HistoryCard entries={history} />
          </View>
        </ScrollView>
      </SafeAreaView>

      <BottomNav activeIndex={3} />

      <ActionSheetMenu visible={menuOpen} title={devis.number} items={menuItems} onClose={() => setMenuOpen(false)} />

      <MessageComposerModal
        visible={composer !== null}
        title={composer === 'send' ? 'Envoyer le devis' : 'Relancer le client'}
        recipientName={devis.clientName}
        recipientEmail={client?.email}
        subject={composedMessage.subject}
        body={composedMessage.body}
        note={composer === 'send' ? 'Le PDF du devis est disponible via "Partager" — le mail ne peut pas le joindre automatiquement.' : undefined}
        onClose={() => setComposer(null)}
        onSent={async () => {
          if (composer === 'send') {
            setSent(true);
            if (status === 'brouillon') {
              setStatusOverride('envoye');
              await updateDevis(devis.id, { status: 'envoye' });
            }
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
  notFound: {
    textAlign: 'center',
    marginTop: 40,
    color: Palette.textSecondary,
    fontSize: 15,
  },
});
