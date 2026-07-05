import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AmountSummary } from '@/components/documents/form/AmountSummary';
import { FormCard } from '@/components/documents/form/FormCard';
import { FormRow } from '@/components/documents/form/FormRow';
import { computeLinesTotal, LineItem, LineItemsEditor, makeEmptyLine } from '@/components/documents/form/LineItemsEditor';
import { PickerModal } from '@/components/documents/form/PickerModal';
import { PillSelect } from '@/components/documents/form/PillSelect';
import { SectionLabel } from '@/components/documents/form/SectionLabel';
import { ScreenHeader } from '@/components/documents/ScreenHeader';
import { MOCK_CLIENTS, MOCK_INTERVENTIONS } from '@/constants/documents-data';
import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';

const VALIDITY_OPTIONS = [
  { key: '15', label: '15 jours' },
  { key: '30', label: '30 jours' },
  { key: '60', label: '60 jours' },
];

const PAYMENT_TERMS_OPTIONS = [
  { key: 'signature', label: '100 % signature' },
  { key: 'acompte', label: '30 % acompte' },
  { key: 'reception', label: 'Comptant livraison' },
];

export default function NouveauDevisScreen() {
  const router = useRouter();

  const [clientId, setClientId] = useState<string | null>(null);
  const [interventionId, setInterventionId] = useState<string | null>(null);
  const [lines, setLines] = useState<LineItem[]>([makeEmptyLine()]);
  const [tva, setTva] = useState('20');
  const [validity, setValidity] = useState('30');
  const [paymentTerms, setPaymentTerms] = useState('signature');
  const [notes, setNotes] = useState('');
  const [clientPickerOpen, setClientPickerOpen] = useState(false);
  const [interventionPickerOpen, setInterventionPickerOpen] = useState(false);

  const client = MOCK_CLIENTS.find((c) => c.id === clientId);
  const intervention = MOCK_INTERVENTIONS.find((i) => i.id === interventionId);
  const amountHT = computeLinesTotal(lines);

  const handleSelectIntervention = (id: string) => {
    const picked = MOCK_INTERVENTIONS.find((i) => i.id === id);
    setInterventionId(id);
    setInterventionPickerOpen(false);
    if (picked && !clientId) {
      const matchingClient = MOCK_CLIENTS.find((c) => c.name === picked.client);
      if (matchingClient) setClientId(matchingClient.id);
    }
  };

  const handleGenerateFromIntervention = () => {
    if (!intervention) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLines(intervention.suggestedLines.map((line) => ({ ...line, id: `${intervention.id}-${line.description}` })));
  };

  const handleCreate = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <ScreenHeader title="Nouveau devis" />

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={12}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            <FormCard label="Client">
              <FormRow
                label="Client"
                value={client?.name}
                placeholder="Choisir un client"
                onPress={() => setClientPickerOpen(true)}
              />
            </FormCard>

            <View style={styles.section}>
              <FormCard label="Intervention">
                <FormRow
                  label="Intervention liée"
                  value={intervention?.title}
                  placeholder="Aucune"
                  onPress={() => setInterventionPickerOpen(true)}
                />
              </FormCard>

              {intervention ? (
                <Pressable style={styles.generateButton} onPress={handleGenerateFromIntervention}>
                  <Feather name="zap" size={15} color={Palette.blue} />
                  <Text style={styles.generateLabel}>Générer les lignes depuis cette intervention</Text>
                </Pressable>
              ) : null}
            </View>

            <View style={styles.section}>
              <LineItemsEditor label="Lignes du devis" lines={lines} onChange={setLines} />
            </View>

            <View style={styles.section}>
              <AmountSummary amountHT={amountHT} tvaRate={tva} onChangeTva={setTva} />
            </View>

            <View style={styles.section}>
              <SectionLabel>Durée de validité</SectionLabel>
              <PillSelect options={VALIDITY_OPTIONS} value={validity} onChange={setValidity} />
            </View>

            <View style={styles.section}>
              <SectionLabel>Conditions de paiement</SectionLabel>
              <PillSelect options={PAYMENT_TERMS_OPTIONS} value={paymentTerms} onChange={setPaymentTerms} />
            </View>

            <View style={styles.section}>
              <FormCard label="Notes internes">
                <View style={styles.notesRow}>
                  <TextInput
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Ajouter une note interne…"
                    placeholderTextColor={Palette.textTertiary}
                    style={styles.notesInput}
                    multiline
                  />
                </View>
              </FormCard>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={styles.footer}>
          <Pressable style={styles.submitButton} onPress={handleCreate}>
            <Text style={styles.submitLabel}>Créer le devis</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <PickerModal
        visible={clientPickerOpen}
        title="Choisir un client"
        options={MOCK_CLIENTS.map((c) => ({ key: c.id, label: c.name }))}
        selectedKey={clientId ?? undefined}
        onSelect={(key) => {
          setClientId(key);
          setClientPickerOpen(false);
        }}
        onClose={() => setClientPickerOpen(false)}
      />

      <PickerModal
        visible={interventionPickerOpen}
        title="Choisir une intervention"
        options={MOCK_INTERVENTIONS.map((i) => ({ key: i.id, label: i.title, subtitle: i.client }))}
        selectedKey={interventionId ?? undefined}
        onSelect={handleSelectIntervention}
        onClose={() => setInterventionPickerOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Palette.screen,
  },
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.section,
    gap: 0,
  },
  section: {
    marginTop: Spacing.section,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: Radius.tile,
    borderWidth: 1.5,
    borderColor: Palette.blueSoft,
    paddingVertical: 13,
    marginTop: Spacing.sm,
  },
  generateLabel: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Palette.blue,
  },
  notesRow: {
    paddingVertical: Spacing.md,
  },
  notesInput: {
    fontSize: FontSize.body,
    color: Palette.textPrimary,
    minHeight: 60,
    textAlignVertical: 'top',
    padding: 0,
  },
  footer: {
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Palette.screen,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Palette.border,
  },
  submitButton: {
    backgroundColor: Palette.blue,
    borderRadius: Radius.card,
    paddingVertical: 17,
    alignItems: 'center',
    ...cardShadow,
  },
  submitLabel: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Palette.white,
    letterSpacing: -0.1,
  },
});
