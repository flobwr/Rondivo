import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ClientPickerSheet } from '@/components/appointment/ClientPickerSheet';
import { type Client } from '@/components/clients/types';
import { CreationConfirmationSheet } from '@/components/documents/shared/CreationConfirmationSheet';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { DocumentSummaryCard } from '@/components/documents/shared/DocumentSummaryCard';
import { FormField, FormSection } from '@/components/documents/shared/FormScaffold';
import { InterventionPickerSheet } from '@/components/documents/imports/InterventionPickerSheet';
import {
  computeLineAmount,
  computeTotals,
  createDraftLine,
  DraftLine,
  LineItemsEditor,
} from '@/components/documents/shared/LineItemsEditor';
import { MessageComposerModal } from '@/components/documents/shared/MessageComposerModal';
import { IconTile } from '@/components/documents/shared/primitives';
import { FOOTER_SPACE, StickyFormFooter } from '@/components/documents/shared/StickyFormFooter';
import { SkeletonBlock } from '@/components/ui/Shimmer';
import { Palette, Radius, Spacing } from '@/theme';
import { useAsyncItem } from '@/hooks/use-async-item';
import { getClientById } from '@/services/clients';
import { formatAmount, formatShortDate } from '@/data/documents/date-utils';
import { Devis, createDevis, getDevis, updateDevis } from '@/services/documents/devis';
import { DocumentLine } from '@/data/documents/lines';
import { buildSendMessage } from '@/data/documents/messaging';
import { generateDocumentPdf, shareDocumentPdf } from '@/data/documents/pdf';
import { PhotoIntervention, listPhotoInterventions } from '@/services/documents/photos';

const VALIDITY_PRESETS = [
  { label: '15 jours', days: 15 },
  { label: '30 jours', days: 30 },
  { label: '60 jours', days: 60 },
];

function linesToDraft(lines: DocumentLine[] | undefined): DraftLine[] {
  if (!lines || lines.length === 0) return [createDraftLine()];
  return lines.map((l) => ({ id: l.id, label: l.label, quantity: '1', unitPrice: String(l.amount) }));
}

function nearestValidityPreset(issuedAt: string, validUntil: string): number {
  const diffDays = Math.round((new Date(validUntil).getTime() - new Date(issuedAt).getTime()) / 86_400_000);
  return VALIDITY_PRESETS.reduce((prev, curr) =>
    Math.abs(curr.days - diffDays) < Math.abs(prev.days - diffDays) ? curr : prev
  ).days;
}

function clientSubtitle(c: Client | null): string | undefined {
  if (!c) return undefined;
  return c.company || c.phone || c.address || undefined;
}

function interventionSubtitle(i: PhotoIntervention | null): string | undefined {
  if (!i) return undefined;
  return `${i.clientName} · ${formatShortDate(i.date)}`;
}

function isBlankDraft(lines: DraftLine[]): boolean {
  return lines.length === 1 && !lines[0].label.trim() && !lines[0].unitPrice.trim();
}

export default function NewDevisScreen() {
  const router = useRouter();
  const { editId, duplicateFromId, interventionId, clientId } = useLocalSearchParams<{
    editId?: string;
    duplicateFromId?: string;
    interventionId?: string;
    clientId?: string;
  }>();

  const isEditing = !!editId;

  const fetchInitialData = useCallback(async () => {
    const interventions = await listPhotoInterventions();
    const editingDevis = editId ? await getDevis(editId) : undefined;
    const source = editingDevis ?? (duplicateFromId ? await getDevis(duplicateFromId) : undefined);
    return { editingDevis, source, interventions };
  }, [editId, duplicateFromId]);
  const { data: initial, status: fetchStatus } = useAsyncItem(fetchInitialData);
  const editingDevis = initial?.editingDevis;

  const [client, setClient] = useState<Client | null>(null);
  const [clientPickerOpen, setClientPickerOpen] = useState(false);
  const [intervention, setIntervention] = useState<PhotoIntervention | null>(null);
  const [interventionPickerOpen, setInterventionPickerOpen] = useState(false);
  const [lines, setLines] = useState<DraftLine[]>([createDraftLine()]);
  const [vatRate, setVatRate] = useState(20);
  const [validityDays, setValidityDays] = useState(30);
  const [notes, setNotes] = useState('');
  const [initialized, setInitialized] = useState(false);

  const [createdDevis, setCreatedDevis] = useState<Devis | null>(null);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isLoadingEdit = isEditing && (fetchStatus === 'loading' || !initialized);

  useEffect(() => {
    if (!initial || initialized) return;
    const { source, interventions } = initial;

    if (source) {
      setClient(getClientById(source.clientId) ?? null);
      setLines(linesToDraft(source.lines));
      setNotes(source.notes ?? '');
      if (source.interventionId) {
        const linked = interventions.find((i) => i.id === source.interventionId);
        if (linked) setIntervention(linked);
      }
      if (editingDevis) setValidityDays(nearestValidityPreset(editingDevis.issuedAt, editingDevis.validUntil));
      setInitialized(true);
      return;
    }

    if (interventionId) {
      const preselected = interventions.find((i) => i.id === interventionId);
      if (preselected) {
        setIntervention(preselected);
        setClient(getClientById(preselected.clientId) ?? null);
        setLines((prev) => (isBlankDraft(prev) ? [createDraftLine(preselected.label)] : prev));
      }
    } else if (clientId) {
      setClient(getClientById(clientId) ?? null);
    }
    setInitialized(true);
  }, [initial, initialized, interventionId, clientId, editingDevis]);

  const handleSelectIntervention = (selected: PhotoIntervention) => {
    setIntervention(selected);
    setClient(getClientById(selected.clientId) ?? null);
    setLines((prev) => (isBlankDraft(prev) ? [createDraftLine(selected.label)] : prev));
    setInterventionPickerOpen(false);
  };

  const { subtotal, vat, total } = computeTotals(lines, vatRate);
  const lineCount = lines.filter((l) => l.label.trim().length > 0).length || lines.length;

  const buildLines = (): DocumentLine[] =>
    lines
      .filter((l) => l.label.trim().length > 0)
      .map((l) => ({ id: l.id, label: l.label.trim(), amount: computeLineAmount(l) }));

  const handleCreate = async () => {
    if (submitting) return;
    if (!client) {
      Alert.alert('Client requis', 'Choisissez un client pour créer le devis.');
      return;
    }

    const finalLines = buildLines();

    if (finalLines.length === 0) {
      Alert.alert('Lignes manquantes', 'Ajoutez au moins une ligne au devis avant de le créer.');
      return;
    }
    const validUntil = new Date(Date.now() + validityDays * 86_400_000).toISOString();

    setSubmitting(true);
    try {
      if (isEditing && editingDevis) {
        await updateDevis(editingDevis.id, {
          clientId: client.id,
          clientName: client.name,
          amount: total,
          validUntil,
          interventionId: intervention?.id,
          lines: finalLines,
          notes: notes.trim() || undefined,
        });
        Alert.alert('Modifications enregistrées', `Le devis ${editingDevis.number} a bien été mis à jour.`, [
          { text: 'OK', onPress: () => router.back() },
        ]);
        return;
      }

      const created = await createDevis({
        number: `DE-${new Date().getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`,
        clientId: client.id,
        clientName: client.name,
        amount: total,
        issuedAt: new Date().toISOString(),
        validUntil,
        status: 'brouillon',
        interventionId: intervention?.id,
        lines: finalLines,
        notes: notes.trim() || undefined,
      });
      setCreatedDevis(created);
      setConfirmationVisible(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSharePdf = async () => {
    if (!createdDevis) return;
    const uri = await generateDocumentPdf('devis', createdDevis, createdDevis.clientName);
    await shareDocumentPdf(uri, `Devis ${createdDevis.number} — ${createdDevis.clientName} — ${formatAmount(createdDevis.amount)}`);
  };

  const composedMessage = createdDevis ? buildSendMessage('devis', createdDevis, createdDevis.clientName) : { subject: '', body: '' };
  // The created devis' client is exactly the client already selected in this
  // form — no need to re-fetch it from the service.
  const createdClient = createdDevis ? client : undefined;

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title={isEditing ? 'Modifier le devis' : 'Nouveau devis'} onBack={() => router.back()} />

        {isLoadingEdit ? (
          <View style={styles.content}>
            <SkeletonBlock height={90} radius={20} />
            <SkeletonBlock height={160} radius={20} style={{ marginTop: Spacing.section }} />
          </View>
        ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <FormSection title="Client" icon="user">
            <FormField
              label="Client"
              value={client?.name}
              placeholder="Choisir un client"
              onPress={() => setClientPickerOpen(true)}
              subtitle={clientSubtitle(client)}
            />
          </FormSection>

          <FormSection title="Intervention" icon="briefcase">
            <FormField
              label="Intervention liée"
              value={intervention?.label}
              placeholder="Aucune"
              onPress={() => setInterventionPickerOpen(true)}
              subtitle={interventionSubtitle(intervention)}
            />
          </FormSection>

          <View style={styles.linesSection}>
            <View style={styles.linesHeader}>
              <IconTile icon="list" color={Palette.blue} soft={Palette.blueSoft} size={22} iconSize={12} radius={7} />
              <Text style={styles.linesTitle}>Lignes</Text>
            </View>
            <LineItemsEditor lines={lines} onChange={setLines} vatRate={vatRate} onVatRateChange={setVatRate} />
          </View>

          <View style={styles.validitySection}>
            <Text style={styles.validityLabel}>Durée de validité</Text>
            <View style={styles.validityRow}>
              {VALIDITY_PRESETS.map((preset) => {
                const active = preset.days === validityDays;
                return (
                  <Pressable
                    key={preset.days}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setValidityDays(preset.days);
                    }}
                    hitSlop={{ top: 5, bottom: 5 }}
                    style={[styles.validityPill, active ? styles.validityPillActive : null]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}>
                    <Text style={[styles.validityPillText, active ? styles.validityPillTextActive : null]}>
                      {preset.label}
                    </Text>
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

          <View style={styles.summarySection}>
            <DocumentSummaryCard
              clientName={client?.name}
              lineCount={lineCount}
              subtotal={subtotal}
              vat={vat}
              vatRate={vatRate}
              total={total}
              dateLabel="Validité"
              dateValue={`${validityDays} jours`}
            />
          </View>
        </ScrollView>
        )}
      </SafeAreaView>

      <StickyFormFooter
        label={isEditing ? 'Enregistrer les modifications' : 'Créer le devis'}
        onPress={handleCreate}
        loading={submitting}
      />

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

      {createdDevis ? (
        <>
          <CreationConfirmationSheet
            visible={confirmationVisible}
            title="Devis créé"
            subtitle={`${createdDevis.clientName} — ${formatAmount(createdDevis.amount)}`}
            primaryAction={{
              key: 'send',
              icon: 'send',
              label: 'Envoyer le devis',
              onPress: () => {
                setConfirmationVisible(false);
                setComposerOpen(true);
              },
            }}
            secondaryActions={[
              { key: 'pdf', icon: 'eye', label: 'Voir le PDF', onPress: handleSharePdf },
              { key: 'edit', icon: 'edit-2', label: 'Modifier', onPress: () => setConfirmationVisible(false) },
            ]}
            onDismiss={() => {
              setConfirmationVisible(false);
              router.back();
            }}
          />

          <MessageComposerModal
            visible={composerOpen}
            title="Envoyer le devis"
            recipientName={createdDevis.clientName}
            recipientEmail={createdClient?.email}
            subject={composedMessage.subject}
            body={composedMessage.body}
            note="Le PDF du devis est disponible via « Voir le PDF » — le mail ne peut pas le joindre automatiquement."
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
    paddingBottom: Spacing.section + FOOTER_SPACE,
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
  validitySection: {
    marginTop: Spacing.section,
  },
  validityLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
    color: Palette.textTertiary,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginLeft: 2,
  },
  validityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  validityPill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: Radius.tile,
    backgroundColor: Palette.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  validityPillActive: {
    backgroundColor: Palette.blueSoft,
    borderColor: Palette.blue,
  },
  validityPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
  },
  validityPillTextActive: {
    color: Palette.blue,
  },
  summarySection: {
    marginTop: Spacing.section,
  },
});
