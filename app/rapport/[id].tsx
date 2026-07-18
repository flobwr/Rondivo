import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomDock } from '@/components/ui/BottomDock';
import { ActionSheetMenu, type ActionSheetItem } from '@/components/documents/shared/ActionSheetMenu';
import { ChecklistCard } from '@/components/documents/rapports/ChecklistCard';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { EmptyState } from '@/components/documents/shared/EmptyState';
import { NextActionBanner } from '@/components/documents/shared/NextActionBanner';
import { IconTile, KeyValueRow, PressableScale, SectionCard, StatusPill } from '@/components/documents/shared/primitives';
import { QuickActionsRow, type QuickAction } from '@/components/documents/shared/QuickActionsRow';
import { createThemedStyles, cardShadow, FontSize, Palette, Radius, Spacing } from '@/theme';
import { formatLongDate } from '@/data/documents/date-utils';
import { generateDocumentPdf, shareDocumentPdf } from '@/data/documents/pdf';
import { MOCK_RAPPORTS, RAPPORT_STATUS_META } from '@/data/documents/rapports';
import { PHOTO_INTERVENTIONS } from '@/data/documents/photos';
import { deleteRapport, updateRapport } from '@/services/documents/rapports';

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m}`;
}

export default function RapportDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const source = useMemo(() => MOCK_RAPPORTS.find((r) => r.id === id), [id]);

  const [status, setStatus] = useState(source?.status);
  const [checklist, setChecklist] = useState(source?.checklist ?? []);
  const [signed, setSigned] = useState(source?.signed ?? false);
  const [menuOpen, setMenuOpen] = useState(false);

  if (!source || !status) {
    return (
      <View style={styles.root}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <DetailHeader title="Rapport" onBack={() => router.back()} />
          <EmptyState icon="alert-circle" title="Rapport introuvable" subtitle="Ce rapport n’existe pas ou a été supprimé." />
        </SafeAreaView>
      </View>
    );
  }

  const rapport = { ...source, status, checklist, signed };
  const meta = RAPPORT_STATUS_META[status];
  const photoIntervention = PHOTO_INTERVENTIONS.find((p) => p.id === rapport.interventionId);
  const photosCount = photoIntervention?.photos.length ?? rapport.photosCount;

  const toggleChecklistItem = (itemId: string) => {
    const next = checklist.map((i) => (i.id === itemId ? { ...i, done: !i.done } : i));
    setChecklist(next);
    updateRapport(rapport.id, { checklist: next });
  };

  const handleCollectSignature = () => {
    Alert.alert('Signature recueillie', 'La signature du client a été enregistrée.');
    setSigned(true);
    updateRapport(rapport.id, { signed: true });
  };

  const handleGeneratePdf = async () => {
    setStatus('pdfGenere');
    await updateRapport(rapport.id, { status: 'pdfGenere' });
    const uri = await generateDocumentPdf('rapport', rapport, rapport.clientName);
    await shareDocumentPdf(uri, `Rapport ${rapport.number} — ${rapport.interventionLabel} — ${rapport.clientName}`);
  };

  const handleSharePdf = async () => {
    const uri = await generateDocumentPdf('rapport', rapport, rapport.clientName);
    await shareDocumentPdf(uri, `Rapport ${rapport.number} — ${rapport.interventionLabel} — ${rapport.clientName}`);
  };

  const handleMarkDone = () => {
    setStatus('termine');
    updateRapport(rapport.id, { status: 'termine' });
  };

  const handleDelete = () => {
    Alert.alert('Supprimer le rapport', `Supprimer définitivement ${rapport.number} ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          await deleteRapport(rapport.id);
          router.back();
        },
      },
    ]);
  };

  // Exactly one recommended action per status — QuickActionsRow only adds
  // the reminder shortcut, never a rewording of the primary action.
  const nextAction =
    status === 'aCompleter' || status === 'enCours'
      ? { label: 'Terminer le rapport', icon: 'check-circle' as const, onPress: handleMarkDone }
      : status === 'termine'
        ? { label: 'Générer le PDF', icon: 'file-text' as const, onPress: handleGeneratePdf }
        : status === 'pdfGenere'
          ? { label: 'Partager', icon: 'share' as const, onPress: handleSharePdf }
          : null;

  const quickActions: QuickAction[] = [
    { key: 'reminder', icon: 'bell', label: 'Rappel', onPress: () => router.push('/rappels') },
  ];

  const menuItems: ActionSheetItem[] = [
    { key: 'edit', icon: 'edit-2', label: 'Modifier', onPress: () => router.push(`/rapport/new?editId=${rapport.id}` as never) },
    { key: 'delete', icon: 'trash-2', label: 'Supprimer', onPress: handleDelete, destructive: true },
  ];

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title={rapport.number} onBack={() => router.back()} onMenu={() => setMenuOpen(true)} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <View style={styles.heroTop}>
              <PressableScale onPress={() => router.push(`/client/${rapport.clientId}`)} to={0.98} accessibilityLabel="Ouvrir le client" style={styles.heroClientWrap}>
                <Text style={styles.heroClient} numberOfLines={1}>
                  {rapport.clientName}
                </Text>
              </PressableScale>
              <StatusPill label={meta.label} color={meta.color} soft={meta.soft} />
            </View>

            <Text style={styles.heroTitle} numberOfLines={2}>
              {rapport.interventionLabel}
            </Text>

            <View style={styles.heroMetaRow}>
              <Text style={styles.heroMeta}>{formatLongDate(rapport.date)}</Text>
              <View style={styles.heroDot} />
              <Text style={styles.heroMeta}>{formatDuration(rapport.timeSpentMinutes)}</Text>
            </View>
          </View>

          {nextAction ? (
            <View style={styles.bannerWrap}>
              <NextActionBanner label={nextAction.label} icon={nextAction.icon} onPress={nextAction.onPress} />
            </View>
          ) : null}

          <View style={styles.actionsWrap}>
            <QuickActionsRow actions={quickActions} />
          </View>

          <ChecklistCard items={checklist} onToggle={toggleChecklistItem} />

          <SectionCard icon="tool" title="Matériel utilisé" style={styles.section}>
            {rapport.materialUsed.length === 0 ? (
              <Text style={styles.empty}>Aucun matériel enregistré.</Text>
            ) : (
              rapport.materialUsed.map((item) => (
                <KeyValueRow key={item.id} label={item.name} value={`× ${item.quantity}`} />
              ))
            )}
          </SectionCard>

          <SectionCard icon="camera" title="Photos" style={styles.section}>
            <PressableScale
              onPress={() => router.push(`/photos/${rapport.interventionId}` as never)}
              to={0.98}
              style={styles.photosRow}
              accessibilityLabel="Voir les photos">
              <IconTile icon="image" color={Palette.blue} soft={Palette.blueSoft} size={32} iconSize={14} />
              <Text style={styles.photosText}>{photosCount} photo{photosCount > 1 ? 's' : ''}</Text>
              <Feather name="chevron-right" size={16} color={Palette.textTertiary} />
            </PressableScale>
          </SectionCard>

          <SectionCard icon="file-text" title="Notes" style={styles.section}>
            <Text style={rapport.notes ? styles.notes : styles.empty}>
              {rapport.notes ?? 'Aucune note pour cette intervention.'}
            </Text>
          </SectionCard>

          <SectionCard icon="edit-3" title="Signature" style={styles.section}>
            {signed ? (
              <View style={styles.signedRow}>
                <IconTile icon="check" color={Palette.green} soft={Palette.greenSoft} size={32} iconSize={14} />
                <Text style={styles.signedText}>Signé par {rapport.clientName}</Text>
              </View>
            ) : (
              <PressableScale onPress={handleCollectSignature} to={0.98} style={styles.signButton} accessibilityLabel="Recueillir la signature">
                <Text style={styles.signButtonText}>Recueillir la signature</Text>
              </PressableScale>
            )}
          </SectionCard>
        </ScrollView>
      </SafeAreaView>

      <BottomDock activeIndex={3} />

      <ActionSheetMenu visible={menuOpen} title={rapport.number} items={menuItems} onClose={() => setMenuOpen(false)} />
    </View>
  );
}

const styles = createThemedStyles(() => StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.screen },
  safeArea: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.section,
  },
  hero: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    padding: Spacing.lg + 2,
    ...cardShadow,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  heroClientWrap: {
    flex: 1,
  },
  heroClient: {
    fontSize: 19,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.4,
  },
  heroTitle: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Palette.blue,
    letterSpacing: -0.2,
    marginTop: 8,
  },
  heroMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  bannerWrap: {
    marginTop: Spacing.md,
  },
  heroMeta: {
    fontSize: FontSize.small,
    fontWeight: '400',
    color: Palette.textTertiary,
    letterSpacing: -0.1,
  },
  heroDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Palette.textTertiary,
  },
  actionsWrap: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.section,
  },
  section: {
    marginTop: Spacing.md,
  },
  empty: {
    fontSize: FontSize.small,
    fontWeight: '400',
    color: Palette.textTertiary,
    letterSpacing: -0.1,
  },
  notes: {
    fontSize: FontSize.small,
    fontWeight: '400',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
    lineHeight: 19,
  },
  photosRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  photosText: {
    flex: 1,
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
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
  signButton: {
    backgroundColor: Palette.blueSoft,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  signButtonText: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Palette.blue,
    letterSpacing: -0.1,
  },
}));
