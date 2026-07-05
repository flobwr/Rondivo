import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormField, FormSection } from '@/components/documents/shared/FormScaffold';
import { PressableScale } from '@/components/documents/shared/primitives';
import { FOOTER_SPACE, StickyFormFooter } from '@/components/documents/shared/StickyFormFooter';
import { PickerField, type PickerOption } from '@/components/plus/resource/PickerField';
import { Palette, Spacing } from '@/constants/design';
import {
  createSupplier,
  getSupplierById,
  SUPPLIER_CATEGORY_LABEL,
  SUPPLIER_CATEGORY_ORDER,
  type SupplierCategory,
  updateSupplier,
} from '@/data/plus/suppliers';

const CATEGORY_OPTIONS: PickerOption[] = SUPPLIER_CATEGORY_ORDER.map((category) => ({
  key: category,
  label: SUPPLIER_CATEGORY_LABEL[category],
  icon: 'package',
}));

export default function NewFournisseurScreen() {
  const router = useRouter();
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const editing = editId ? getSupplierById(editId) : undefined;
  const isEditing = !!editing;

  const [name, setName] = useState(editing?.name ?? '');
  const [category, setCategory] = useState<SupplierCategory>(editing?.category ?? 'materiaux');
  const [phone, setPhone] = useState(editing?.phone ?? '');
  const [email, setEmail] = useState(editing?.email ?? '');
  const [address, setAddress] = useState(editing?.address ?? '');

  const canSubmit = name.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const input = { name: name.trim(), category, phone: phone.trim(), email: email.trim(), address: address.trim() };
    if (isEditing) {
      updateSupplier(editing!.id, input);
      router.back();
    } else {
      const created = createSupplier(input);
      router.replace(`/plus/fournisseur/${created.id}` as never);
    }
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <PressableScale onPress={() => router.back()} to={0.9} style={styles.iconBtn} accessibilityLabel="Fermer">
            <Feather name="x" size={22} color={Palette.textPrimary} />
          </PressableScale>
          <Text style={styles.headerTitle}>{isEditing ? 'Modifier le fournisseur' : 'Nouveau fournisseur'}</Text>
          <View style={styles.iconBtn} />
        </View>

        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <FormSection title="Fournisseur" icon="package">
              <FormField label="Nom" value={name} onChangeText={setName} placeholder="Ex. CEDEO Lyon" />
              <PickerField label="Catégorie" value={CATEGORY_OPTIONS.find((o) => o.key === category)} options={CATEGORY_OPTIONS} onSelect={(k) => setCategory(k as SupplierCategory)} />
            </FormSection>

            <FormSection title="Contact" icon="phone">
              <FormField label="Téléphone" value={phone} onChangeText={setPhone} placeholder="00 00 00 00 00" keyboardType="phone-pad" />
              <FormField label="Email" value={email} onChangeText={setEmail} placeholder="contact@fournisseur.fr" keyboardType="email-address" />
              <FormField label="Adresse" value={address} onChangeText={setAddress} placeholder="Adresse du fournisseur" multiline />
            </FormSection>

            <View style={{ height: 12 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <StickyFormFooter
        label={isEditing ? 'Enregistrer les modifications' : 'Créer le fournisseur'}
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
