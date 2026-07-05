import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormField, FormSection } from '@/components/documents/shared/FormScaffold';
import { PressableScale } from '@/components/documents/shared/primitives';
import { FOOTER_SPACE, StickyFormFooter } from '@/components/documents/shared/StickyFormFooter';
import { FontSize, Palette, Spacing } from '@/constants/design';
import { createProduit, deleteProduit, getProduitById, updateProduit } from '@/data/plus/produits';

export default function NewProduitScreen() {
  const router = useRouter();
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const editing = editId ? getProduitById(editId) : undefined;
  const isEditing = !!editing;

  const [name, setName] = useState(editing?.name ?? '');
  const [reference, setReference] = useState(editing?.reference ?? '');
  const [unitPrice, setUnitPrice] = useState(editing ? String(editing.unitPrice) : '');
  const [stock, setStock] = useState(editing ? String(editing.stock) : '');

  const canSubmit = name.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const input = {
      name: name.trim(),
      reference: reference.trim(),
      unitPrice: Number(unitPrice.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0,
      stock: Number(stock.replace(/\D/g, '')) || 0,
    };
    if (isEditing) {
      updateProduit(editing!.id, input);
    } else {
      createProduit(input);
    }
    router.back();
  };

  const handleDelete = () => {
    if (!editing) return;
    Alert.alert('Supprimer ce produit', `Supprimer définitivement ${editing.name} ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => { deleteProduit(editing.id); router.back(); } },
    ]);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <PressableScale onPress={() => router.back()} to={0.9} style={styles.iconBtn} accessibilityLabel="Fermer">
            <Feather name="x" size={22} color={Palette.textPrimary} />
          </PressableScale>
          <Text style={styles.headerTitle}>{isEditing ? 'Modifier le produit' : 'Nouveau produit'}</Text>
          <View style={styles.iconBtn} />
        </View>

        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <FormSection title="Produit" icon="box">
              <FormField label="Nom" value={name} onChangeText={setName} placeholder="Ex. Chaudière Frisquet" />
              <FormField label="Référence" value={reference} onChangeText={setReference} placeholder="Ex. FRQ-HM-24" />
              <FormField label="Prix unitaire (€)" value={unitPrice} onChangeText={setUnitPrice} placeholder="0" keyboardType="decimal-pad" />
              <FormField label="Stock" value={stock} onChangeText={setStock} placeholder="0" keyboardType="number-pad" />
            </FormSection>

            {isEditing ? (
              <PressableScale onPress={handleDelete} to={0.97} style={styles.deleteButton} accessibilityLabel="Supprimer ce produit">
                <Text style={styles.deleteText}>Supprimer ce produit</Text>
              </PressableScale>
            ) : null}

            <View style={{ height: 12 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <StickyFormFooter
        label={isEditing ? 'Enregistrer les modifications' : 'Créer le produit'}
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
  deleteButton: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: Spacing.section,
  },
  deleteText: {
    fontSize: FontSize.small,
    fontWeight: '600',
    color: Palette.danger,
    letterSpacing: -0.1,
  },
});
