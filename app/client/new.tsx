import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Chip, ChipScroll, Field, PressableScale } from '@/components/appointment/AppointmentUI';
import { ClientAvatar } from '@/components/clients/ClientAvatar';
import { AddressField } from '@/components/clients/new/AddressField';
import { easeLayout, formatPhoneFr, PAYMENT_METHODS } from '@/components/clients/new/client-form-utils';
import { FormInput } from '@/components/ui/FormInput';
import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { computeInitials, createClient, tintForName } from '@/data/clients';

type EquipmentDraft = { id: string; name: string };

export default function NewClientScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isCompany, setIsCompany] = useState(false);

  const [advanced, setAdvanced] = useState(false);
  const [email, setEmail] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [secondaryName, setSecondaryName] = useState('');
  const [secondaryPhone, setSecondaryPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const [equipment, setEquipment] = useState<EquipmentDraft[]>([]);
  const [addingEquipment, setAddingEquipment] = useState(false);
  const [equipmentDraft, setEquipmentDraft] = useState('');

  const [created, setCreated] = useState(false);

  const nameRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const addressRef = useRef<TextInput>(null);
  const equipmentInputRef = useRef<TextInput>(null);

  const trimmedName = name.trim();
  const phoneDigits = phone.replace(/\D/g, '');
  const trimmedAddress = address.trim();

  const hasName = trimmedName.length > 0;
  const hasPhone = phoneDigits.length === 10;
  const hasAddress = trimmedAddress.length > 0;

  // Guides straight to the missing step — never a dead end.
  const missingStep = !hasName
    ? 'Saisissez un nom'
    : !hasPhone
    ? 'Ajoutez un téléphone'
    : !hasAddress
    ? 'Choisissez une adresse'
    : null;

  const previewInitials = hasName ? computeInitials(trimmedName) : '?';
  const previewTint = hasName ? tintForName(trimmedName) : 'blue';

  const toggleType = (company: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsCompany(company);
  };

  const togglePayment = (method: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPaymentMethod((prev) => (prev === method ? null : method));
  };

  const startAddEquipment = () => {
    easeLayout();
    setAddingEquipment(true);
  };

  const cancelAddEquipment = () => {
    easeLayout();
    setAddingEquipment(false);
    setEquipmentDraft('');
  };

  const confirmAddEquipment = () => {
    const trimmed = equipmentDraft.trim();
    if (!trimmed) {
      cancelAddEquipment();
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    easeLayout();
    setEquipment((prev) => [...prev, { id: `${Date.now()}`, name: trimmed }]);
    setEquipmentDraft('');
    setAddingEquipment(false);
  };

  const removeEquipment = (id: string) => {
    easeLayout();
    setEquipment((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCreatePress = () => {
    if (created) return;
    if (missingStep) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      if (!hasName) nameRef.current?.focus();
      else if (!hasPhone) phoneRef.current?.focus();
      else addressRef.current?.focus();
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const client = createClient({
      name: trimmedName,
      phone: phone.trim(),
      address: trimmedAddress,
      isCompany,
      email: email.trim() || undefined,
      vatNumber: isCompany ? vatNumber.trim() || undefined : undefined,
      secondaryContact: secondaryName.trim() ? { name: secondaryName.trim(), phone: secondaryPhone.trim() } : undefined,
      paymentMethod: paymentMethod ?? undefined,
      notes: notes.trim() || undefined,
      equipment: equipment.length ? equipment : undefined,
    });
    setCreated(true);
    setTimeout(() => router.replace(`/client/${client.id}`), 650);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <PressableScale onPress={() => router.back()} to={0.9} style={styles.iconBtn} accessibilityLabel="Fermer">
            <Feather name="x" size={22} color={Palette.textPrimary} />
          </PressableScale>
          <Text style={styles.headerTitle}>Nouveau client</Text>
          <View style={styles.iconBtn} />
        </View>

        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={styles.content}>
            {/* Essentials — always visible, nothing else competes for attention. */}
            <Field label="Nom ou entreprise">
              <View style={styles.nameRow}>
                <ClientAvatar initials={previewInitials} tint={previewTint} size={40} elevated />
                <View style={styles.flex}>
                  <FormInput
                    ref={nameRef}
                    value={name}
                    onChangeText={setName}
                    placeholder={isCompany ? "Nom de l'entreprise" : 'Nom du client'}
                    autoCapitalize="words"
                    returnKeyType="next"
                    onSubmitEditing={() => phoneRef.current?.focus()}
                    autoFocus
                  />
                </View>
              </View>
            </Field>

            <Field label="Téléphone">
              <FormInput
                ref={phoneRef}
                icon="phone"
                value={phone}
                onChangeText={(v) => setPhone(formatPhoneFr(v))}
                placeholder="06 12 34 56 78"
                keyboardType="phone-pad"
                returnKeyType="next"
                onSubmitEditing={() => addressRef.current?.focus()}
              />
            </Field>

            <Field label="Adresse">
              <AddressField ref={addressRef} value={address} onChangeText={setAddress} />
            </Field>

            <Field label="Type de client">
              <View style={styles.segment}>
                <Pressable
                  style={[styles.segmentItem, !isCompany && styles.segmentItemActive]}
                  onPress={() => toggleType(false)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: !isCompany }}>
                  <Feather name="user" size={14} color={!isCompany ? Palette.white : Palette.textSecondary} />
                  <Text style={[styles.segmentText, { color: !isCompany ? Palette.white : Palette.textPrimary }]}>Particulier</Text>
                </Pressable>
                <Pressable
                  style={[styles.segmentItem, isCompany && styles.segmentItemActive]}
                  onPress={() => toggleType(true)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isCompany }}>
                  <Feather name="briefcase" size={14} color={isCompany ? Palette.white : Palette.textSecondary} />
                  <Text style={[styles.segmentText, { color: isCompany ? Palette.white : Palette.textPrimary }]}>Entreprise</Text>
                </Pressable>
              </View>
            </Field>

            {/* Complementary — closed by default, nothing here blocks creation. */}
            <PressableScale
              onPress={() => {
                easeLayout();
                setAdvanced((v) => !v);
              }}
              to={0.98}
              style={styles.advancedToggle}
              accessibilityLabel="Informations complémentaires">
              <Feather name="sliders" size={16} color={Palette.textSecondary} />
              <Text style={styles.advancedText}>Informations complémentaires</Text>
              <Feather name={advanced ? 'chevron-up' : 'chevron-down'} size={18} color={Palette.textTertiary} />
            </PressableScale>

            {advanced ? (
              <View>
                <Field label="Email">
                  <FormInput
                    icon="mail"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="client@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </Field>

                {isCompany ? (
                  <Field label="Numéro de TVA">
                    <FormInput icon="hash" value={vatNumber} onChangeText={setVatNumber} placeholder="FR 32 123 456 789" autoCapitalize="characters" />
                  </Field>
                ) : null}

                <Field label="Contact secondaire">
                  <View style={styles.stackGap}>
                    <FormInput icon="user" value={secondaryName} onChangeText={setSecondaryName} placeholder="Nom du contact" autoCapitalize="words" />
                    <FormInput
                      icon="phone"
                      value={secondaryPhone}
                      onChangeText={(v) => setSecondaryPhone(formatPhoneFr(v))}
                      placeholder="06 12 34 56 78"
                      keyboardType="phone-pad"
                    />
                  </View>
                </Field>

                <Field label="Mode de paiement préféré">
                  <ChipScroll>
                    {PAYMENT_METHODS.map((method) => (
                      <Chip key={method} label={method} active={paymentMethod === method} onPress={() => togglePayment(method)} />
                    ))}
                  </ChipScroll>
                </Field>

                <Field label="Notes internes">
                  <FormInput value={notes} onChangeText={setNotes} placeholder="Précisions utiles sur ce client…" multiline />
                </Field>
              </View>
            ) : null}

            {/* Equipment — its own light card, never mandatory. */}
            <View style={styles.equipmentCard}>
              <View style={styles.equipmentHeader}>
                <View style={styles.equipmentIconTile}>
                  <Feather name="tool" size={15} color={Palette.blue} />
                </View>
                <Text style={styles.equipmentTitle}>Équipements</Text>
              </View>

              {equipment.length > 0 ? (
                <View style={styles.equipmentChips}>
                  {equipment.map((item) => (
                    <View key={item.id} style={styles.equipmentChip}>
                      <Text style={styles.equipmentChipText} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <PressableScale onPress={() => removeEquipment(item.id)} to={0.85} haptic={false} accessibilityLabel={`Retirer ${item.name}`}>
                        <Feather name="x" size={13} color={Palette.textTertiary} />
                      </PressableScale>
                    </View>
                  ))}
                </View>
              ) : !addingEquipment ? (
                <Text style={styles.equipmentHint}>Ajoutez-les maintenant, ou plus tard depuis la fiche.</Text>
              ) : null}

              {addingEquipment ? (
                <View style={styles.equipmentAddRow}>
                  <View style={styles.flex}>
                    <FormInput
                      ref={equipmentInputRef}
                      value={equipmentDraft}
                      onChangeText={setEquipmentDraft}
                      placeholder="Ex. Chaudière Frisquet"
                      autoCapitalize="sentences"
                      returnKeyType="done"
                      onSubmitEditing={confirmAddEquipment}
                      autoFocus
                    />
                  </View>
                  <PressableScale onPress={confirmAddEquipment} to={0.9} style={styles.equipmentConfirm} accessibilityLabel="Ajouter l'équipement">
                    <Feather name="check" size={16} color={Palette.white} />
                  </PressableScale>
                  <PressableScale onPress={cancelAddEquipment} to={0.9} style={styles.equipmentCancel} haptic={false} accessibilityLabel="Annuler">
                    <Feather name="x" size={16} color={Palette.textTertiary} />
                  </PressableScale>
                </View>
              ) : (
                <PressableScale onPress={startAddEquipment} to={0.97} style={styles.equipmentAddBtn} accessibilityLabel="Ajouter un équipement">
                  <Feather name="plus" size={14} color={Palette.blue} />
                  <Text style={styles.equipmentAddText}>Ajouter un équipement</Text>
                </PressableScale>
              )}
            </View>

            <View style={{ height: 12 }} />
          </ScrollView>

          {/* Sticky footer — the same compact recap pattern as the appointment form. */}
          <View style={styles.footer}>
            <SafeAreaView edges={['bottom']}>
              <View style={styles.footerInner}>
                <View style={styles.recap}>
                  <Text style={[styles.recapClient, !hasName && styles.recapPlaceholder]} numberOfLines={1}>
                    {hasName ? trimmedName : 'Choisir un nom'}
                  </Text>
                  <Text style={[styles.recapMeta, !hasPhone && styles.recapMetaPlaceholder]} numberOfLines={1}>
                    {phone || 'Ajouter un téléphone'}
                  </Text>
                  <Text style={[styles.recapMeta, !hasAddress && styles.recapMetaPlaceholder]} numberOfLines={1}>
                    {hasAddress ? trimmedAddress : 'Choisir une adresse'}
                  </Text>
                </View>

                <PressableScale onPress={handleCreatePress} to={0.96} disabled={created} accessibilityLabel={missingStep ?? 'Créer le client'}>
                  <View style={[styles.createBtn, !!missingStep && styles.createBtnDisabled, created && styles.createBtnDone]}>
                    <Feather name={created ? 'check' : 'user-plus'} size={16} color={missingStep ? Palette.blue : Palette.white} />
                    <Text style={[styles.createText, !!missingStep && styles.createTextMuted]} numberOfLines={1}>
                      {created ? 'Créé' : missingStep ?? 'Créer le client'}
                    </Text>
                  </View>
                </PressableScale>
              </View>
            </SafeAreaView>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
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
    paddingBottom: 20,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stackGap: {
    gap: 8,
  },
  segment: {
    flexDirection: 'row',
    gap: 8,
  },
  segmentItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 11,
    borderRadius: Radius.pill,
    backgroundColor: Palette.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  segmentItemActive: {
    backgroundColor: Palette.blue,
    borderColor: Palette.blue,
  },
  segmentText: {
    fontSize: FontSize.small,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  advancedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    paddingVertical: 11,
    paddingHorizontal: 14,
    backgroundColor: Palette.card,
    borderRadius: Radius.tile,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  advancedText: {
    flex: 1,
    fontSize: FontSize.label,
    fontWeight: '600',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
  },
  equipmentCard: {
    marginTop: 17,
    backgroundColor: Palette.card,
    borderRadius: Radius.tile,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  equipmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  equipmentIconTile: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: Palette.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  equipmentTitle: {
    fontSize: FontSize.label,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  equipmentHint: {
    marginTop: 9,
    fontSize: FontSize.small,
    fontWeight: '500',
    color: Palette.textTertiary,
  },
  equipmentChips: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  equipmentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Palette.cardMuted,
    borderRadius: Radius.pill,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
    maxWidth: '100%',
  },
  equipmentChipText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
    flexShrink: 1,
  },
  equipmentAddRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  equipmentConfirm: {
    width: 42,
    height: 42,
    borderRadius: Radius.tile,
    backgroundColor: Palette.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  equipmentCancel: {
    width: 42,
    height: 42,
    borderRadius: Radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
  },
  equipmentAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
    backgroundColor: Palette.blueSoft,
    borderRadius: Radius.pill,
    paddingVertical: 10,
  },
  equipmentAddText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: Palette.blue,
  },
  footer: {
    backgroundColor: Palette.card,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Palette.border,
    paddingHorizontal: Spacing.screen,
  },
  footerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 11,
    paddingBottom: 4,
  },
  recap: { flex: 1 },
  recapClient: {
    fontSize: 14,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  recapMeta: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textSecondary,
    marginTop: 2,
  },
  recapMetaPlaceholder: {
    color: Palette.textTertiary,
    fontWeight: '500',
  },
  recapPlaceholder: {
    color: Palette.textTertiary,
    fontWeight: '600',
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Palette.blue,
    borderRadius: Radius.tile,
    paddingVertical: 13,
    paddingHorizontal: 12,
  },
  createBtnDisabled: {
    backgroundColor: Palette.blueSoft,
  },
  createBtnDone: {
    backgroundColor: Palette.green,
  },
  createText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.white,
    letterSpacing: -0.2,
  },
  createTextMuted: {
    color: Palette.blue,
  },
});
