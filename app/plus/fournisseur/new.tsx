import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormField, FormSection } from '@/components/documents/shared/FormScaffold';
import { PressableScale } from '@/components/documents/shared/primitives';
import { FOOTER_SPACE, StickyFormFooter } from '@/components/documents/shared/StickyFormFooter';
import { PickerField, type PickerOption } from '@/components/plus/resource/PickerField';
import { createThemedStyles, Palette, Spacing } from '@/theme';
import { useAsyncItem } from '@/hooks/use-async-item';
import {
  createSupplier,
  getSupplier,
  SUPPLIER_CATEGORY_LABEL,
  SUPPLIER_CATEGORY_ORDER,
  type SupplierCategory,
  updateSupplier,
} from '@/services/plus/suppliers';

const CATEGORY_OPTIONS: PickerOption[] = SUPPLIER_CATEGORY_ORDER.map((category) => ({
  key: category,
  label: SUPPLIER_CATEGORY_LABEL[category],
  icon: 'package',
}));

export default function NewFournisseurScreen() {
  const router = useRouter();
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const isEditing = !!editId;

  const fetchEditing = useCallback(() => (editId ? getSupplier(editId) : Promise.resolve(undefined)), [editId]);
  const { data: editing, status: fetchStatus } = useAsyncItem(fetchEditing);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<SupplierCategory>('materiaux');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (editing && !initialized) {
      setName(editing.name);
      setCategory(editing.category);
      setPhone(editing.phone);
      setEmail(editing.email);
      setAddress(editing.address);
      setInitialized(true);
    }
  }, [editing, initialized]);

  const [submitting, setSubmitting] = useState(false);
  const canSubmit = name.trim().length > 0 && !submitting;
  const isLoadingEdit = isEditing && (fetchStatus === 'loading' || !initialized);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    const input = { name: name.trim(), category, phone: phone.trim(), email: email.trim(), address: address.trim() };
    setSubmitting(true);
    try {
      if (isEditing && editing) {
        await updateSupplier(editing.id, input);
        router.back();
      } else {
        const created = await createSupplier(input);
        router.replace(`/plus/fournisseur/${created.id}` as never);
      }
    } catch {
      Alert.alert('Échec de l’enregistrement', 'Veuillez réessayer.');
    } finally {
      setSubmitting(false);
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

        {isLoadingEdit ? null : (
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
        )}
      </SafeAreaView>

      <StickyFormFooter
        label={isEditing ? 'Enregistrer les modifications' : 'Créer le fournisseur'}
        onPress={handleSubmit}
        disabled={!canSubmit}
        loading={submitting}
      />
    </View>
  );
}

const styles = createThemedStyles(() => StyleSheet.create({
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
}));
