import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormField, FormSection } from '@/components/documents/shared/FormScaffold';
import { PressableScale } from '@/components/documents/shared/primitives';
import { FOOTER_SPACE, StickyFormFooter } from '@/components/documents/shared/StickyFormFooter';
import { formatIsoToFr, parseFrDateToIso } from '@/components/plus/resource/date-input';
import { PickerField, type PickerOption } from '@/components/plus/resource/PickerField';
import { Palette, Spacing } from '@/constants/design';
import {
  createMateriel,
  getMaterielById,
  MATERIEL_CATEGORY_LABEL,
  MATERIEL_CATEGORY_ORDER,
  MATERIEL_CONDITION_META,
  MATERIEL_CONDITION_ORDER,
  type MaterielCategory,
  type MaterielCondition,
  updateMateriel,
} from '@/data/plus/materiel';

const CATEGORY_ICON: Record<MaterielCategory, PickerOption['icon']> = {
  'outillage-electroportatif': 'tool',
  mesure: 'activity',
  securite: 'shield',
  levage: 'arrow-up',
  autre: 'box',
};

const CATEGORY_OPTIONS: PickerOption[] = MATERIEL_CATEGORY_ORDER.map((category) => ({
  key: category,
  label: MATERIEL_CATEGORY_LABEL[category],
  icon: CATEGORY_ICON[category],
}));

const CONDITION_OPTIONS: PickerOption[] = MATERIEL_CONDITION_ORDER.map((condition) => ({
  key: condition,
  label: MATERIEL_CONDITION_META[condition].label,
  icon: condition === 'bon-etat' ? 'check-circle' : condition === 'a-reviser' ? 'alert-triangle' : 'x-circle',
}));

export default function NewMaterielScreen() {
  const router = useRouter();
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const editing = editId ? getMaterielById(editId) : undefined;
  const isEditing = !!editing;

  const [name, setName] = useState(editing?.name ?? '');
  const [category, setCategory] = useState<MaterielCategory>(editing?.category ?? 'outillage-electroportatif');
  const [condition, setCondition] = useState<MaterielCondition>(editing?.condition ?? 'bon-etat');
  const [location, setLocation] = useState(editing?.location ?? '');
  const [purchaseDate, setPurchaseDate] = useState(editing?.purchaseDate ? formatIsoToFr(editing.purchaseDate) : '');
  const [serialNumber, setSerialNumber] = useState(editing?.serialNumber ?? '');

  const canSubmit = name.trim().length > 0 && location.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const input = {
      name: name.trim(),
      category,
      condition,
      location: location.trim(),
      purchaseDate: parseFrDateToIso(purchaseDate) ?? undefined,
      serialNumber: serialNumber.trim() || undefined,
    };
    if (isEditing) {
      updateMateriel(editing!.id, input);
      router.back();
    } else {
      const created = createMateriel(input);
      router.replace(`/plus/materiel/${created.id}` as never);
    }
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <PressableScale onPress={() => router.back()} to={0.9} style={styles.iconBtn} accessibilityLabel="Fermer">
            <Feather name="x" size={22} color={Palette.textPrimary} />
          </PressableScale>
          <Text style={styles.headerTitle}>{isEditing ? 'Modifier l’élément' : 'Nouveau matériel'}</Text>
          <View style={styles.iconBtn} />
        </View>

        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <FormSection title="Matériel" icon="tool">
              <FormField label="Nom" value={name} onChangeText={setName} placeholder="Ex. Perceuse Bosch GSB 18V" />
              <PickerField label="Catégorie" value={CATEGORY_OPTIONS.find((o) => o.key === category)} options={CATEGORY_OPTIONS} onSelect={(k) => setCategory(k as MaterielCategory)} />
              <PickerField label="État" value={CONDITION_OPTIONS.find((o) => o.key === condition)} options={CONDITION_OPTIONS} onSelect={(k) => setCondition(k as MaterielCondition)} />
            </FormSection>

            <FormSection title="Suivi" icon="map-pin">
              <FormField label="Emplacement" value={location} onChangeText={setLocation} placeholder="Ex. Atelier, ou nom de l’employé" />
              <FormField label="Date d’achat" value={purchaseDate} onChangeText={setPurchaseDate} placeholder="JJ/MM/AAAA" />
              <FormField label="N° de série" value={serialNumber} onChangeText={setSerialNumber} placeholder="Facultatif" />
            </FormSection>

            <View style={{ height: 12 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <StickyFormFooter
        label={isEditing ? 'Enregistrer les modifications' : 'Ajouter le matériel'}
        onPress={handleSubmit}
        disabled={!canSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.screen },
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screen,
    paddingTop: 6,
    paddingBottom: 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  content: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: FOOTER_SPACE,
  },
});
