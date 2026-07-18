import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ClientPickerSheet } from '@/components/appointment/ClientPickerSheet';
import { type Client } from '@/components/clients/types';
import { CreationConfirmationSheet } from '@/components/documents/shared/CreationConfirmationSheet';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { FormField, FormSection } from '@/components/documents/shared/FormScaffold';
import { MessageComposerModal } from '@/components/documents/shared/MessageComposerModal';
import { FOOTER_SPACE, StickyFormFooter } from '@/components/documents/shared/StickyFormFooter';
import { formatIsoToFr, parseFrDateToIso, todayIso } from '@/components/plus/resource/date-input';
import { createThemedStyles, Palette, Spacing } from '@/theme';
import { getClientById } from '@/data/clients';
import { buildSendMessage } from '@/data/documents/messaging';
import { generateDocumentPdf, shareDocumentPdf } from '@/data/documents/pdf';
import { Contrat, ContratInput, MOCK_CONTRATS } from '@/data/documents/contrats';
import { createContrat, updateContrat } from '@/services/documents/contrats';

function clientSubtitle(c: Client | null): string | undefined {
  if (!c) return undefined;
  return c.company || c.phone || c.address || undefined;
}

export default function NewContratScreen() {
  const router = useRouter();
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const editingContrat = editId ? MOCK_CONTRATS.find((c) => c.id === editId) : undefined;
  const isEditing = !!editingContrat;

  const [client, setClient] = useState<Client | null>(null);
  const [clientPickerOpen, setClientPickerOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(formatIsoToFr(todayIso()));
  const [endDate, setEndDate] = useState('');

  const [createdContrat, setCreatedContrat] = useState<Contrat | null>(null);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingContrat) {
      setClient(getClientById(editingContrat.clientId) ?? null);
      setTitle(editingContrat.title);
      setStartDate(formatIsoToFr(editingContrat.startDate));
      setEndDate(editingContrat.endDate ? formatIsoToFr(editingContrat.endDate) : '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId]);

  const handleCreate = async () => {
    if (submitting) return;
    if (!client) {
      Alert.alert('Client requis', 'Choisissez un client pour créer le contrat.');
      return;
    }
    if (!title.trim()) {
      Alert.alert('Titre requis', 'Donnez un titre au contrat.');
      return;
    }

    const input: ContratInput = {
      number: editingContrat?.number ?? `CO-${new Date().getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`,
      title: title.trim(),
      clientId: client.id,
      clientName: client.name,
      startDate: parseFrDateToIso(startDate) ?? todayIso(),
      endDate: endDate.trim() ? (parseFrDateToIso(endDate) ?? undefined) : undefined,
      status: editingContrat?.status ?? 'brouillon',
    };

    setSubmitting(true);
    try {
      if (isEditing && editingContrat) {
        await updateContrat(editingContrat.id, input);
        Alert.alert('Modifications enregistrées', `Le contrat ${editingContrat.number} a bien été mis à jour.`, [
          { text: 'OK', onPress: () => router.back() },
        ]);
        return;
      }

      const created = await createContrat(input);
      setCreatedContrat(created);
      setConfirmationVisible(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSharePdf = async () => {
    if (!createdContrat) return;
    const uri = await generateDocumentPdf('contrat', createdContrat, createdContrat.clientName);
    await shareDocumentPdf(uri, `Contrat ${createdContrat.number} — ${createdContrat.title} — ${createdContrat.clientName}`);
  };

  const composedMessage = createdContrat
    ? buildSendMessage('contrat', createdContrat, createdContrat.clientName)
    : { subject: '', body: '' };
  // The created contrat's client is exactly the client already selected in
  // this form — no need to re-fetch it.
  const createdClient = createdContrat ? client : undefined;

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title={isEditing ? 'Modifier le contrat' : 'Nouveau contrat'} onBack={() => router.back()} />

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

          <FormSection title="Contrat" icon="file-text">
            <FormField label="Titre" value={title} onChangeText={setTitle} placeholder="Ex. Contrat d’entretien chaudière" />
          </FormSection>

          <FormSection title="Durée" icon="calendar">
            <FormField label="Date de début" value={startDate} onChangeText={setStartDate} placeholder="JJ/MM/AAAA" />
            <FormField label="Date de fin" value={endDate} onChangeText={setEndDate} placeholder="Facultatif — JJ/MM/AAAA" />
          </FormSection>
        </ScrollView>
      </SafeAreaView>

      <StickyFormFooter
        label={isEditing ? 'Enregistrer les modifications' : 'Créer le contrat'}
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

      {createdContrat ? (
        <>
          <CreationConfirmationSheet
            visible={confirmationVisible}
            title="Contrat créé"
            subtitle={`${createdContrat.clientName} — ${createdContrat.title}`}
            primaryAction={{
              key: 'send',
              icon: 'send',
              label: 'Envoyer le contrat',
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
            title="Envoyer le contrat"
            recipientName={createdContrat.clientName}
            recipientEmail={createdClient?.email}
            subject={composedMessage.subject}
            body={composedMessage.body}
            note="Le PDF du contrat est disponible via « Voir le PDF » — le mail ne peut pas le joindre automatiquement."
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

const styles = createThemedStyles(() => StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.screen },
  safeArea: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.section + FOOTER_SPACE,
  },
}));
