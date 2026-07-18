import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomDock } from '@/components/ui/BottomDock';
import { ActionSheetMenu, type ActionSheetItem } from '@/components/documents/shared/ActionSheetMenu';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { DocumentHero } from '@/components/documents/shared/DocumentHero';
import { EmptyState } from '@/components/documents/shared/EmptyState';
import { MessageComposerModal } from '@/components/documents/shared/MessageComposerModal';
import { NextActionBanner } from '@/components/documents/shared/NextActionBanner';
import { IconTile, SectionCard } from '@/components/documents/shared/primitives';
import { QuickActionsRow, type QuickAction } from '@/components/documents/shared/QuickActionsRow';
import { FontSize, Palette, Spacing } from '@/theme';
import { getClientById } from '@/data/clients';
import { formatLongDate } from '@/data/documents/date-utils';
import { buildSendMessage } from '@/data/documents/messaging';
import { generateDocumentPdf, shareDocumentPdf } from '@/data/documents/pdf';
import { CONTRAT_STATUS_META, MOCK_CONTRATS } from '@/data/documents/contrats';
import { deleteContrat, updateContrat } from '@/services/documents/contrats';

export default function ContratDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const source = useMemo(() => MOCK_CONTRATS.find((c) => c.id === id), [id]);

  const [status, setStatus] = useState(source?.status);
  const [menuOpen, setMenuOpen] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);

  if (!source || !status) {
    return (
      <View style={styles.root}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <DetailHeader title="Contrat" onBack={() => router.back()} />
          <EmptyState icon="alert-circle" title="Contrat introuvable" subtitle="Ce contrat n’existe pas ou a été supprimé." />
        </SafeAreaView>
      </View>
    );
  }

  const contrat = { ...source, status };
  const meta = CONTRAT_STATUS_META[status];
  const client = getClientById(contrat.clientId);

  const handleSign = () => {
    Alert.alert('Signature électronique', `Confirmer la signature de ${contrat.clientName} ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Confirmer',
        onPress: () => {
          setStatus('signe');
          updateContrat(contrat.id, { status: 'signe' });
        },
      },
    ]);
  };

  const handleDelete = () => {
    Alert.alert('Supprimer le contrat', `Supprimer définitivement ${contrat.number} ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          await deleteContrat(contrat.id);
          router.back();
        },
      },
    ]);
  };

  const handleSharePdf = async () => {
    const uri = await generateDocumentPdf('contrat', contrat, contrat.clientName);
    await shareDocumentPdf(uri, `Contrat ${contrat.number} — ${contrat.title} — ${contrat.clientName}`);
  };

  // Exactly one recommended action per status — QuickActionsRow only adds
  // genuinely distinct secondary actions, never a rewording of this one.
  const nextAction =
    status === 'brouillon' || status === 'enAttenteSignature'
      ? { label: 'Envoyer le contrat', icon: 'send' as const, onPress: () => setComposerOpen(true) }
      : status === 'signe'
        ? { label: 'Partager PDF', icon: 'share' as const, onPress: handleSharePdf }
        : null;

  const quickActions: QuickAction[] = [
    ...(status === 'brouillon' || status === 'enAttenteSignature'
      ? [{ key: 'sign', icon: 'edit-3', label: 'Signer', onPress: handleSign } as QuickAction]
      : []),
    ...(status === 'expire' ? [{ key: 'pdf', icon: 'file-text', label: 'PDF', onPress: handleSharePdf } as QuickAction] : []),
  ];

  const menuItems: ActionSheetItem[] = [
    { key: 'edit', icon: 'edit-2', label: 'Modifier', onPress: () => router.push(`/contrat/new?editId=${contrat.id}` as never) },
    { key: 'delete', icon: 'trash-2', label: 'Supprimer', onPress: handleDelete, destructive: true },
  ];

  const composedMessage = buildSendMessage('contrat', contrat, contrat.clientName);

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title={contrat.number} onBack={() => router.back()} onMenu={() => setMenuOpen(true)} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <DocumentHero
            clientName={contrat.clientName}
            onOpenClient={() => router.push(`/client/${contrat.clientId}`)}
            title={contrat.title}
            statusLabel={meta.label}
            statusColor={meta.color}
            statusSoft={meta.soft}
            dates={[
              { label: 'Début', value: formatLongDate(contrat.startDate) },
              ...(contrat.endDate ? [{ label: 'Fin', value: formatLongDate(contrat.endDate) }] : []),
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

          <SectionCard icon="edit-3" title="Signature">
            {status === 'signe' ? (
              <View style={styles.signedRow}>
                <IconTile icon="check" color={Palette.green} soft={Palette.greenSoft} size={32} iconSize={14} />
                <Text style={styles.signedText}>Signé par {contrat.clientName}</Text>
              </View>
            ) : (
              <Text style={styles.pending}>En attente de la signature du client.</Text>
            )}
          </SectionCard>
        </ScrollView>
      </SafeAreaView>

      <BottomDock activeIndex={3} />

      <ActionSheetMenu visible={menuOpen} title={contrat.number} items={menuItems} onClose={() => setMenuOpen(false)} />

      <MessageComposerModal
        visible={composerOpen}
        title="Envoyer le contrat"
        recipientName={contrat.clientName}
        recipientEmail={client?.email}
        subject={composedMessage.subject}
        body={composedMessage.body}
        note="Le PDF du contrat est disponible via le bouton PDF — le mail ne peut pas le joindre automatiquement."
        onClose={() => setComposerOpen(false)}
        onSent={() => {
          if (status === 'brouillon') {
            setStatus('enAttenteSignature');
            updateContrat(contrat.id, { status: 'enAttenteSignature' });
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
  signedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  signedText: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
  },
  pending: {
    fontSize: FontSize.small,
    fontWeight: '400',
    color: Palette.textTertiary,
    letterSpacing: -0.1,
  },
});
