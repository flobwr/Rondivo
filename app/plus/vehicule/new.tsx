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
import { EMPLOYEES } from '@/data/plus/employees';
import {
  createVehicle,
  getVehicleById,
  updateVehicle,
  VEHICLE_STATUS_META,
  VEHICLE_STATUS_ORDER,
  VEHICLE_TYPE_LABEL,
  VEHICLE_TYPE_ORDER,
  type VehicleStatus,
  type VehicleType,
} from '@/data/plus/vehicles';

const TYPE_OPTIONS: PickerOption[] = VEHICLE_TYPE_ORDER.map((type) => ({
  key: type,
  label: VEHICLE_TYPE_LABEL[type],
  icon: 'truck',
}));

const STATUS_OPTIONS: PickerOption[] = VEHICLE_STATUS_ORDER.map((status) => ({
  key: status,
  label: VEHICLE_STATUS_META[status].label,
  icon: status === 'disponible' ? 'check-circle' : status === 'en-intervention' ? 'navigation' : 'tool',
}));

const UNASSIGNED = 'none';
const ASSIGNEE_OPTIONS: PickerOption[] = [
  { key: UNASSIGNED, label: 'Non assigné', icon: 'user-x' },
  ...EMPLOYEES.map((e) => ({ key: e.id, label: e.name, icon: 'user' as const })),
];

export default function NewVehiculeScreen() {
  const router = useRouter();
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const editing = editId ? getVehicleById(editId) : undefined;
  const isEditing = !!editing;

  const [name, setName] = useState(editing?.name ?? '');
  const [plate, setPlate] = useState(editing?.plate ?? '');
  const [type, setType] = useState<VehicleType>(editing?.type ?? 'utilitaire');
  const [status, setStatus] = useState<VehicleStatus>(editing?.status ?? 'disponible');
  const [assignedToId, setAssignedToId] = useState(editing?.assignedToId ?? UNASSIGNED);
  const [mileage, setMileage] = useState(editing ? String(editing.mileage) : '');
  const [nextServiceDate, setNextServiceDate] = useState(
    editing?.nextServiceDate ? formatIsoToFr(editing.nextServiceDate) : ''
  );

  const canSubmit = name.trim().length > 0 && plate.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const input = {
      name: name.trim(),
      plate: plate.trim().toUpperCase(),
      type,
      status,
      assignedToId: assignedToId === UNASSIGNED ? undefined : assignedToId,
      mileage: Number(mileage.replace(/\D/g, '')) || 0,
      nextServiceDate: parseFrDateToIso(nextServiceDate) ?? undefined,
    };
    if (isEditing) {
      updateVehicle(editing!.id, input);
      router.back();
    } else {
      const created = createVehicle(input);
      router.replace(`/plus/vehicule/${created.id}` as never);
    }
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <PressableScale onPress={() => router.back()} to={0.9} style={styles.iconBtn} accessibilityLabel="Fermer">
            <Feather name="x" size={22} color={Palette.textPrimary} />
          </PressableScale>
          <Text style={styles.headerTitle}>{isEditing ? 'Modifier le véhicule' : 'Nouveau véhicule'}</Text>
          <View style={styles.iconBtn} />
        </View>

        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <FormSection title="Véhicule" icon="truck">
              <FormField label="Nom / modèle" value={name} onChangeText={setName} placeholder="Ex. Renault Trafic" />
              <FormField label="Immatriculation" value={plate} onChangeText={setPlate} placeholder="AA-123-BB" />
              <PickerField label="Type" value={TYPE_OPTIONS.find((o) => o.key === type)} options={TYPE_OPTIONS} onSelect={(k) => setType(k as VehicleType)} />
              <PickerField label="Statut" value={STATUS_OPTIONS.find((o) => o.key === status)} options={STATUS_OPTIONS} onSelect={(k) => setStatus(k as VehicleStatus)} />
            </FormSection>

            <FormSection title="Suivi" icon="clipboard">
              <PickerField
                label="Assigné à"
                value={ASSIGNEE_OPTIONS.find((o) => o.key === assignedToId)}
                options={ASSIGNEE_OPTIONS}
                onSelect={setAssignedToId}
              />
              <FormField label="Kilométrage" value={mileage} onChangeText={setMileage} placeholder="0" keyboardType="number-pad" />
              <FormField label="Prochain entretien" value={nextServiceDate} onChangeText={setNextServiceDate} placeholder="JJ/MM/AAAA" />
            </FormSection>

            <View style={{ height: 12 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <StickyFormFooter
        label={isEditing ? 'Enregistrer les modifications' : 'Créer le véhicule'}
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
