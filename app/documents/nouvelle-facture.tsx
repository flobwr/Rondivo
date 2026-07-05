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
import { MOCK_CLIENTS, MOCK_INTERVENTIONS, QUOTES } from '@/constants/documents-data';
import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';

const PAYMENT_METHOD_OPTIONS = [
  { key: 'virement', label: 'Virement' },
  { key: 'carte', label: 'Carte' },
  { key: 'cheque', label: 'Chèque' },
];

const DUE_DATE_OPTIONS = [
  { key: '15', label: '15 jours' },
  { key: '30', label: '30 jours' },
  { key: '45', label: '45 jours' },
];

export default function NouvelleFactureScreen() {
  const router = useRouter();

  const [clientId, setClientId] = useState<string | null>(null);
  const [quoteId, setQuoteId] = useState<string | null>(null);
  const [interventionId, setInterventionId] = useState<string | null>(null);
  const [lines, setLines] = useState<LineItem[]>([makeEmptyLine()]);
  const [tva, setTva] = useState('20');
  const [paymentMethod, setPaymentMethod] = useState('virement');
  const [dueDate, setDueDate] = useState('30');
  const [notes, setNotes] = useState('');
  const [clientPickerOpen, setClientPickerOpen] = useState(false);
  const [quotePickerOpen, setQuotePickerOpen] = useState(false);
  const [interventionPickerOpen, setInterventionPickerOpen] = useState(false);

  const client = MOCK_CLIENTS.find((c) => c.id === clientId);
  const quote = QUOTES.find((q) => q.id === quoteId);
  const intervention = MOCK_INTERVENTIONS.find((i) => i.id === interventionId);
  const amountHT = computeLinesTotal(lines);

  const selectClientByName = (name: string) => {
    const match = MOCK_CLIENTS.find((c) => c.name === name);
    if (match) setClientId(match.id);
  };

  const handleSelectQuote = (id: string) => {
    const picked = QUOTES.find((q) => q.id === id);
    setQuoteId(id);
    setQuotePickerOpen(false);
    if (picked && !clientId) selectClientByName(picked.client);
  };

  const handleSelectIntervention = (id: string) => {
    const picked = MOCK_INTERVENTIONS.find((i) => i.id === id);
    setInterventionId(id);
    setInterventionPickerOpen(false);
    if (picked && !clientId) selectClientByName(picked.client);
  };

  const handleGenerateFromQuote = () => {
    if (!quote) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLines([{ id: `${quote.id}-solde`, description: `Solde du devis ${quote.number}`, qty: '1', unitPrice: String(quote.amount) }]);
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
        <ScreenHeader title="Nouvelle facture" />

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
              <FormCard label="Génération">
                <FormRow
                  label="Devis lié"
                  value={quote ? `${quote.number} — ${quote.client}` : undefined}
                  placeholder="Aucun"
                  onPress={() => setQuotePickerOpen(true)}
                />
                <FormRow
                  label="Intervention liée"
                  value={intervention?.title}
                  placeholder="Aucune"
                  onPress={() => setInterventionPickerOpen(true)}
                />
              </FormCard>

              {quote ? (
                <Pressable style={styles.generateButton} onPress={handleGenerateFromQuote}>
                  <Feather name="zap" size={15} color={Palette.blue} />
                  <Text style={styles.generateLabel}>Générer les lignes depuis ce devis</Text>
                </Pressable>
              ) : intervention ? (
                <Pressable style={styles.generateButton} onPress={handleGenerateFromIntervention}>
                  <Feather name="zap" size={15} color={Palette.blue} />
                  <Text style={styles.generateLabel}>Générer les lignes depuis cette intervention</Text>
                </Pressable>
              ) : null}
            </View>

            <View style={styles.section}>
              <LineItemsEditor label="Lignes de la facture" lines={lines} onChange={setLines} />
            </View>

            <View style={styles.section}>
              <AmountSummary amountHT={amountHT} tvaRate={tva} onChangeTva={setTva} />
            </View>

            <View style={styles.section}>
              <SectionLabel>Mode de paiement</SectionLabel>
              <PillSelect options={PAYMENT_METHOD_OPTIONS} value={paymentMethod} onChange={setPaymentMethod} />
            </View>

            <View style={styles.section}>
              <SectionLabel>Échéance de paiement</SectionLabel>
              <PillSelect options={DUE_DATE_OPTIONS} value={dueDate} onChange={setDueDate} />
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
            <Text style={styles.submitLabel}>Créer la facture</Text>
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
        visible={quotePickerOpen}
        title="Choisir un devis"
        options={QUOTES.map((q) => ({ key: q.id, label: `${q.number} — ${q.client}`, subtitle: q.status }))}
        selectedKey={quoteId ?? undefined}
        onSelect={handleSelectQuote}
        onClose={() => setQuotePickerOpen(false)}
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
