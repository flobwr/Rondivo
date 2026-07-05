import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormField, FormSection } from '@/components/documents/shared/FormScaffold';
import { PressableScale } from '@/components/documents/shared/primitives';
import { FOOTER_SPACE, StickyFormFooter } from '@/components/documents/shared/StickyFormFooter';
import { formatIsoToFr, parseFrDateToIso, todayIso } from '@/components/plus/resource/date-input';
import { PickerField, type PickerOption } from '@/components/plus/resource/PickerField';
import { Palette, Spacing } from '@/constants/design';
import {
  createEmployee,
  EMPLOYEE_ROLE_META,
  EMPLOYEE_ROLE_ORDER,
  type EmployeeRole,
  type EmployeeStatus,
  getEmployeeById,
  updateEmployee,
} from '@/data/plus/employees';

const ROLE_ICON: Record<EmployeeRole, PickerOption['icon']> = {
  administrateur: 'shield',
  manager: 'briefcase',
  technicien: 'tool',
};

const ROLE_OPTIONS: PickerOption[] = EMPLOYEE_ROLE_ORDER.map((role) => ({
  key: role,
  label: EMPLOYEE_ROLE_META[role].label,
  icon: ROLE_ICON[role],
  description: EMPLOYEE_ROLE_META[role].description,
}));

const STATUS_OPTIONS: PickerOption[] = [
  { key: 'actif', label: 'Actif', icon: 'check-circle' },
  { key: 'inactif', label: 'Inactif', icon: 'slash' },
];

export default function NewEmployeScreen() {
  const router = useRouter();
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const editing = editId ? getEmployeeById(editId) : undefined;
  const isEditing = !!editing;

  const [name, setName] = useState(editing?.name ?? '');
  const [poste, setPoste] = useState(editing?.poste ?? '');
  const [role, setRole] = useState<EmployeeRole>(editing?.role ?? 'technicien');
  const [status, setStatus] = useState<EmployeeStatus>(editing?.status ?? 'actif');
  const [phone, setPhone] = useState(editing?.phone ?? '');
  const [email, setEmail] = useState(editing?.email ?? '');
  const [hireDate, setHireDate] = useState(editing ? formatIsoToFr(editing.hireDate) : '');

  const canSubmit = name.trim().length > 0 && poste.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const input = {
      name: name.trim(),
      poste: poste.trim(),
      role,
      status,
      phone: phone.trim(),
      email: email.trim(),
      hireDate: parseFrDateToIso(hireDate) ?? editing?.hireDate ?? todayIso(),
    };
    if (isEditing) {
      updateEmployee(editing!.id, input);
      router.back();
    } else {
      const created = createEmployee(input);
      router.replace(`/plus/employe/${created.id}` as never);
    }
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <PressableScale onPress={() => router.back()} to={0.9} style={styles.iconBtn} accessibilityLabel="Fermer">
            <Feather name="x" size={22} color={Palette.textPrimary} />
          </PressableScale>
          <Text style={styles.headerTitle}>{isEditing ? 'Modifier l’employé' : 'Nouvel employé'}</Text>
          <View style={styles.iconBtn} />
        </View>

        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <FormSection title="Identité" icon="user">
              <FormField label="Nom" value={name} onChangeText={setName} placeholder="Nom de l’employé" />
              <FormField label="Poste" value={poste} onChangeText={setPoste} placeholder="Ex. Plombier" />
              <PickerField
                label="Rôle"
                value={ROLE_OPTIONS.find((o) => o.key === role)}
                options={ROLE_OPTIONS}
                onSelect={(key) => setRole(key as EmployeeRole)}
              />
              <PickerField
                label="Statut"
                value={STATUS_OPTIONS.find((o) => o.key === status)}
                options={STATUS_OPTIONS}
                onSelect={(key) => setStatus(key as EmployeeStatus)}
              />
            </FormSection>

            <FormSection title="Contact" icon="phone">
              <FormField label="Téléphone" value={phone} onChangeText={setPhone} placeholder="06 00 00 00 00" keyboardType="phone-pad" />
              <FormField label="Email" value={email} onChangeText={setEmail} placeholder="employe@email.fr" keyboardType="email-address" />
              <FormField label="Date d’embauche" value={hireDate} onChangeText={setHireDate} placeholder="JJ/MM/AAAA" />
            </FormSection>

            <View style={{ height: 12 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <StickyFormFooter
        label={isEditing ? 'Enregistrer les modifications' : 'Créer l’employé'}
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
