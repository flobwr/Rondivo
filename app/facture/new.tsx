import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ClientPickerSheet } from '@/components/appointment/ClientPickerSheet';
import { type Client } from '@/components/clients/types';
import { CreationConfirmationSheet } from '@/components/documents/shared/CreationConfirmationSheet';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { FormField, FormSection, FormSubmitButton } from '@/components/documents/shared/FormScaffold';
import { InterventionPickerSheet } from '@/components/documents/imports/InterventionPickerSheet';
import {
  computeLineAmount,
  computeTotals,
  createDraftLine,
  DraftLine,
  LineItemsEditor,
} from '@/components/documents/shared/LineItemsEditor';
import { MessageComposerModal } from '@/components/documents/shared/MessageComposerModal';
import { Palette, Radius, Spacing } from '@/constants/design';
import { getClientById } from '@/data/clients';
import { formatAmount } from '@/data/documents/date-utils';
import { Facture, MOCK_FACTURES } from '@/data/documents/factures';
import { buildSendMessage } from '@/data/documents/messaging';
import { generateDocumentPdf, shareDocumentPdf } from '@/data/documents/pdf';
import { DocumentLine } from '@/data/documents/lines';
import { MOCK_DEVIS } from '@/data/documents/devis';
import { PHOTO_INTERVENTIONS, PhotoIntervention } from '@/data/documents/photos';

const DUE_PRESETS = [
  { label: '15 jours', days: 15 },
  { label: '30 jours', days: 30 },
  { label: '45 jours', days: 45 },
];

function linesToDraft(lines: DocumentLine[] | undefined): DraftLine[] {
  if (!lines || lines.length === 0) return [createDraftLine()];
  return lines.map((l) => ({ id: l.id, label: l.label, quantity: '1', unitPrice: String(l.amount) }));
}

function nearestDuePreset(issuedAt: string, dueAt: string): number {
  const diffDays = Math.round((new Date(dueAt).getTime() - new Date(issuedAt).getTime()) / 86_400_000);
  return DUE_PRESETS.reduce((prev, curr) => (Math.abs(curr.days - diffDays) < Math.abs(prev.days - diffDays) ? curr : prev)).days;
}

export default function NewFactureScreen() {
  const router = useRouter();
  const { editId, duplicateFromId, fromDevisId, interventionId } = useLocalSearchParams<{
    editId?: string;
    duplicateFromId?: string;
    fromDevisId?: string;
    interventionId?: string;
  }>();

  const editingFacture = useMemo(() => (editId ? MOCK_FACTURES.find((f) => f.id === editId) : undefined), [editId]);

  const [client, setClient] = useState<Client | null>(null);
  const [clientPickerOpen, setClientPickerOpen] = useState(false);
  const [intervention, setIntervention] = useState<PhotoIntervention | null>(null);
  const [interventionPickerOpen, setInterventionPickerOpen] = useState(false);
  const [lines, setLines] = useState<DraftLine[]>([createDraftLine()]);
  const [vatRate, setVatRate] = useState(20);
  const [dueDays, setDueDays] = useState(30);
  const [notes, setNotes] = useState('');

  const [createdFacture, setCreatedFacture] = useState<Facture | null>(null);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);

  const isEditing = !!editingFacture;

  useEffect(() => {
    const source = editingFacture
      ? editingFacture
      : duplicateFromId
        ? MOCK_FACTURES.find((f) => f.id === duplicateFromId)
        : fromDevisId
          ? MOCK_DEVIS.find((d) => d.id === fromDevisId)
          : undefined;

    if (source) {
      setClient(getClientById(source.clientId) ?? null);
      setLines(linesToDraft(source.lines));
      setNotes(source.notes ?? '');
      if (source.interventionId) {
        const linked = PHOTO_INTERVENTIONS.find((i) => i.id === source.interventionId);
        if (linked) setIntervention(linked);
      }
      if (editingFacture) setDueDays(nearestDuePreset(editingFacture.issuedAt, editingFacture.dueAt));
      return;
    }

    if (interventionId) {
      const preselected = PHOTO_INTERVENTIONS.find((i) => i.id === interventionId);
      if (preselected) {
        setIntervention(preselected);
        setClient(getClientById(preselected.clientId) ?? null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId, duplicateFromId, fromDevisId, interventionId]);

  const handleSelectIntervention = (selected: PhotoIntervention) => {
    setIntervention(selected);
    setClient(getClientById(selected.clientId) ?? null);
    setInterventionPickerOpen(false);
  };

  const { total } = computeTotals(lines, vatRate);

  const buildFacture = (): Facture => {
    const finalLines: DocumentLine[] = lines
      .filter((l) => l.label.trim().length > 0)
      .map((l) => ({ id: l.id, label: l.label.trim(), amount: computeLineAmount(l) }));
    return {
      id: editingFacture?.id ?? `fa-draft-${Date.now()}`,
      number: editingFacture?.number ?? `FA-${new Date().getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`,
      clientId: client!.id,
      clientName: client!.name,
      amount: total,
      issuedAt: editingFacture?.issuedAt ?? new Date().toISOString(),
      dueAt: new Date(Date.now() + dueDays * 86_400_000).toISOString(),
      status: editingFacture?.status ?? 'brouillon',
      interventionId: intervention?.id,
      payments: editingFacture?.payments ?? [],
      lines: finalLines,
      notes: notes.trim() || undefined,
    };
  };

  const handleCreate = () => {
    if (!client) {
      Alert.alert('Client requis', 'Choisissez un client pour créer la facture.');
      return;
    }
    if (isEditing) {
      Alert.alert('Modifications enregistrées', `La facture ${editingFacture!.number} a bien été mise à jour.`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
      return;
    }
    setCreatedFacture(buildFacture());
    setConfirmationVisible(true);
  };

  const handleSharePdf = async () => {
    if (!createdFacture) return;
    const uri = await generateDocumentPdf('facture', createdFacture, createdFacture.clientName);
    await shareDocumentPdf(uri, `Facture ${createdFacture.number} — ${createdFacture.clientName} — ${formatAmount(createdFacture.amount)}`);
  };

  const handleMarkPaid = () => {
    Alert.alert('Facture marquée comme payée', `${createdFacture?.clientName} — ${formatAmount(createdFacture?.amount ?? 0)}`, [
      { text: 'OK', onPress: () => { setConfirmationVisible(false); router.back(); } },
    ]);
  };

  const composedMessage = createdFacture ? buildSendMessage('facture', createdFacture, createdFacture.clientName) : { subject: '', body: '' };
  const createdClient = createdFacture ? getClientById(createdFacture.clientId) : undefined;

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title={isEditing ? 'Modifier la facture' : 'Nouvelle facture'} onBack={() => router.back()} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <FormSection title="Client" icon="user">
            <FormField
              label="Client"
              value={client?.name}
              placeholder="Choisir un client"
              onPress={() => setClientPickerOpen(true)}
            />
          </FormSection>

          <FormSection title="Intervention" icon="briefcase">
            <FormField
              label="Intervention liée"
              value={intervention?.label}
              placeholder="Aucune"
              onPress={() => setInterventionPickerOpen(true)}
            />
          </FormSection>

          <View style={styles.linesSection}>
            <View style={styles.linesHeader}>
              <Text style={styles.linesTitle}>Lignes</Text>
            </View>
            <LineItemsEditor lines={lines} onChange={setLines} vatRate={vatRate} onVatRateChange={setVatRate} />
          </View>

          <View style={styles.dueSection}>
            <Text style={styles.dueLabel}>Échéance de paiement</Text>
            <View style={styles.dueRow}>
              {DUE_PRESETS.map((preset) => {
                const active = preset.days === dueDays;
                return (
                  <Pressable
                    key={preset.days}
                    onPress={() => setDueDays(preset.days)}
                    style={[styles.duePill, active ? styles.duePillActive : null]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}>
                    <Text style={[styles.duePillText, active ? styles.duePillTextActive : null]}>{preset.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <FormSection title="Notes" icon="file-text">
            <FormField
              label="Notes"
              value={notes}
              placeholder="Ajouter une note interne…"
              onChangeText={setNotes}
              multiline
            />
          </FormSection>

          <FormSubmitButton label={isEditing ? 'Enregistrer les modifications' : 'Créer la facture'} onPress={handleCreate} />
        </ScrollView>
      </SafeAreaView>

      <ClientPickerSheet
        visible={clientPickerOpen}
        onClose={() => setClientPickerOpen(false)}
        onSelect={(selected) => {
          setClient(selected);
          setClientPickerOpen(false);
        }}
        selectedId={client?.id}
      />

      <InterventionPickerSheet
        visible={interventionPickerOpen}
        onClose={() => setInterventionPickerOpen(false)}
        onSelect={handleSelectIntervention}
      />

      {createdFacture ? (
        <>
          <CreationConfirmationSheet
            visible={confirmationVisible}
            title="Facture créée"
            subtitle={`${createdFacture.clientName} — ${formatAmount(createdFacture.amount)}`}
            primaryAction={{
              key: 'send',
              icon: 'send',
              label: 'Envoyer',
              onPress: () => {
                setConfirmationVisible(false);
                setComposerOpen(true);
              },
            }}
            secondaryActions={[
              { key: 'share', icon: 'share', label: 'Partager', onPress: handleSharePdf },
              { key: 'paid', icon: 'check-circle', label: 'Marquer comme payée', onPress: handleMarkPaid },
            ]}
            onDismiss={() => {
              setConfirmationVisible(false);
              router.back();
            }}
          />

          <MessageComposerModal
            visible={composerOpen}
            title="Envoyer la facture"
            recipientName={createdFacture.clientName}
            recipientEmail={createdClient?.email}
            subject={composedMessage.subject}
            body={composedMessage.body}
            onClose={() => {
              setComposerOpen(false);
              router.back();
            }}
            onSent={() => {
              setComposerOpen(false);
              router.back();
            }}
          />
        </>
      ) : null}
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
  linesSection: {
    marginTop: Spacing.section,
  },
  linesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  linesTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
    color: Palette.textTertiary,
    textTransform: 'uppercase',
    marginLeft: 2,
  },
  dueSection: {
    marginTop: Spacing.section,
  },
  dueLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
    color: Palette.textTertiary,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginLeft: 2,
  },
  dueRow: {
    flexDirection: 'row',
    gap: 8,
  },
  duePill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: Radius.tile,
    backgroundColor: Palette.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  duePillActive: {
    backgroundColor: Palette.blueSoft,
    borderColor: Palette.blue,
  },
  duePillText: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
  },
  duePillTextActive: {
    color: Palette.blue,
  },
});
