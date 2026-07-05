import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormCard } from '@/components/documents/form/FormCard';
import { FormRow } from '@/components/documents/form/FormRow';
import { PickerModal } from '@/components/documents/form/PickerModal';
import { PhotoPlaceholder } from '@/components/documents/PhotoPlaceholder';
import { PillSelect } from '@/components/documents/form/PillSelect';
import { SectionLabel } from '@/components/documents/form/SectionLabel';
import { ScreenHeader } from '@/components/documents/ScreenHeader';
import { MOCK_CLIENTS, MOCK_INTERVENTIONS, PHOTO_INTERVENTIONS } from '@/constants/documents-data';
import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';

const DURATION_OPTIONS = [
  { key: '1h', label: '1h' },
  { key: '1h30', label: '1h30' },
  { key: '2h', label: '2h' },
  { key: '2h30+', label: '2h30+' },
];

const TECHNICIANS = ['Florian Martin', 'Marc Petit', 'Sophie Bernard'];

export default function NouveauRapportScreen() {
  const router = useRouter();

  const [interventionId, setInterventionId] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [duration, setDuration] = useState('1h30');
  const [technician, setTechnician] = useState(TECHNICIANS[0]);
  const [description, setDescription] = useState('');
  const [signed, setSigned] = useState(false);
  const [interventionPickerOpen, setInterventionPickerOpen] = useState(false);
  const [clientPickerOpen, setClientPickerOpen] = useState(false);
  const [technicianPickerOpen, setTechnicianPickerOpen] = useState(false);

  const intervention = MOCK_INTERVENTIONS.find((i) => i.id === interventionId);
  const client = MOCK_CLIENTS.find((c) => c.id === clientId);
  const matchingPhotos = PHOTO_INTERVENTIONS.find((p) => p.title === intervention?.title);
  const matchingPhotoCount = matchingPhotos
    ? Math.min(matchingPhotos.before + matchingPhotos.during + matchingPhotos.after, 3)
    : 0;

  const handleSelectIntervention = (id: string) => {
    const picked = MOCK_INTERVENTIONS.find((i) => i.id === id);
    setInterventionId(id);
    setInterventionPickerOpen(false);
    if (picked && !clientId) {
      const match = MOCK_CLIENTS.find((c) => c.name === picked.client);
      if (match) setClientId(match.id);
    }
  };

  const handleGeneratePdf = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleCreate = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <ScreenHeader title="Nouveau rapport" />

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={12}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            <FormCard label="Intervention">
              <FormRow
                label="Intervention liée"
                value={intervention?.title}
                placeholder="Choisir une intervention"
                onPress={() => setInterventionPickerOpen(true)}
              />
              <FormRow
                label="Client"
                value={client?.name}
                placeholder="Choisir un client"
                onPress={() => setClientPickerOpen(true)}
              />
            </FormCard>

            <View style={styles.section}>
              <SectionLabel>Durée de l’intervention</SectionLabel>
              <PillSelect options={DURATION_OPTIONS} value={duration} onChange={setDuration} />
            </View>

            <View style={styles.section}>
              <FormCard label="Technicien">
                <FormRow label="Technicien" value={technician} onPress={() => setTechnicianPickerOpen(true)} />
              </FormCard>
            </View>

            <View style={styles.section}>
              <FormCard label="Description">
                <View style={styles.notesRow}>
                  <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Décrire l’intervention réalisée…"
                    placeholderTextColor={Palette.textTertiary}
                    style={styles.notesInput}
                    multiline
                  />
                </View>
              </FormCard>
            </View>

            <View style={styles.section}>
              <SectionLabel>Photos associées</SectionLabel>
              <View style={styles.photoRow}>
                {Array.from({ length: matchingPhotoCount }).map((_, index) => (
                  <PhotoPlaceholder
                    key={index}
                    seed={`${intervention?.id}-${index}`}
                    style={styles.photoThumb}
                    iconSize={16}
                  />
                ))}
                <Pressable style={styles.addPhotoTile}>
                  <Feather name="camera" size={18} color={Palette.blue} />
                  <Text style={styles.addPhotoLabel}>Ajouter</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.section}>
              <SectionLabel>Signature client</SectionLabel>
              <Pressable
                style={[styles.signatureBox, signed ? styles.signatureBoxDone : null]}
                onPress={() => setSigned((v) => !v)}>
                <Feather
                  name={signed ? 'check-circle' : 'edit-2'}
                  size={20}
                  color={signed ? '#128A5E' : Palette.textTertiary}
                />
                <Text style={[styles.signatureText, signed ? styles.signatureTextDone : null]}>
                  {signed ? 'Signature enregistrée' : 'Toucher pour faire signer le client'}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={styles.footer}>
          <Pressable style={styles.pdfButton} onPress={handleGeneratePdf}>
            <Feather name="file-text" size={17} color={Palette.blue} />
            <Text style={styles.pdfLabel}>Générer le PDF</Text>
          </Pressable>
          <Pressable style={styles.submitButton} onPress={handleCreate}>
            <Text style={styles.submitLabel}>Créer le rapport</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <PickerModal
        visible={interventionPickerOpen}
        title="Choisir une intervention"
        options={MOCK_INTERVENTIONS.map((i) => ({ key: i.id, label: i.title, subtitle: i.client }))}
        selectedKey={interventionId ?? undefined}
        onSelect={handleSelectIntervention}
        onClose={() => setInterventionPickerOpen(false)}
      />

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
        visible={technicianPickerOpen}
        title="Choisir un technicien"
        options={TECHNICIANS.map((name) => ({ key: name, label: name }))}
        selectedKey={technician}
        onSelect={(key) => {
          setTechnician(key);
          setTechnicianPickerOpen(false);
        }}
        onClose={() => setTechnicianPickerOpen(false)}
      />
    </View>
  );
}

const THUMB = 64;

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
  notesRow: {
    paddingVertical: Spacing.md,
  },
  notesInput: {
    fontSize: FontSize.body,
    color: Palette.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
    padding: 0,
  },
  photoRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  photoThumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: Radius.tile,
    backgroundColor: '#E4E8EF',
  },
  addPhotoTile: {
    width: THUMB,
    height: THUMB,
    borderRadius: Radius.tile,
    borderWidth: 1.5,
    borderColor: Palette.blueSoft,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  addPhotoLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.blue,
  },
  signatureBox: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    borderWidth: 1.5,
    borderColor: Palette.border,
    borderStyle: 'dashed',
    paddingVertical: 26,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  signatureBoxDone: {
    borderColor: '#128A5E',
    borderStyle: 'solid',
    backgroundColor: Palette.greenSoft,
  },
  signatureText: {
    fontSize: FontSize.label,
    fontWeight: '600',
    color: Palette.textTertiary,
  },
  signatureTextDone: {
    color: '#128A5E',
  },
  footer: {
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Palette.screen,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Palette.border,
    gap: Spacing.sm,
  },
  pdfButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: Radius.card,
    borderWidth: 1.5,
    borderColor: Palette.blueSoft,
    paddingVertical: 15,
  },
  pdfLabel: {
    fontSize: FontSize.label,
    fontWeight: '700',
    color: Palette.blue,
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
