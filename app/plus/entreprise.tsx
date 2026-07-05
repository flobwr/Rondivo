import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { FormSection, FormField, FormSubmitButton } from '@/components/documents/shared/FormScaffold';
import { FontSize, Palette, Spacing } from '@/constants/design';
import { COMPANY, updateCompany } from '@/data/plus/company';
import { EMPLOYEES } from '@/data/plus/employees';

export default function EntrepriseScreen() {
  const router = useRouter();

  const [name, setName] = useState(COMPANY.name);
  const [legalForm, setLegalForm] = useState(COMPANY.legalForm);
  const [siret, setSiret] = useState(COMPANY.siret);
  const [vatNumber, setVatNumber] = useState(COMPANY.vatNumber);
  const [address, setAddress] = useState(COMPANY.address);
  const [phone, setPhone] = useState(COMPANY.phone);
  const [email, setEmail] = useState(COMPANY.email);
  const [website, setWebsite] = useState(COMPANY.website ?? '');

  const handleSave = () => {
    updateCompany({
      name: name.trim(),
      legalForm: legalForm.trim(),
      siret: siret.trim(),
      vatNumber: vatNumber.trim(),
      address: address.trim(),
      phone: phone.trim(),
      email: email.trim(),
      website: website.trim() || undefined,
    });
    Alert.alert('Entreprise mise à jour', 'Les informations de votre entreprise ont bien été enregistrées.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Entreprise" onBack={() => router.back()} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.hero}>
            <Text style={styles.heroName}>{COMPANY.name}</Text>
            <Text style={styles.heroSummary}>
              {`Depuis ${COMPANY.foundedYear} · ${EMPLOYEES.length} employé${EMPLOYEES.length > 1 ? 's' : ''} · ${
                COMPANY.synced ? 'Synchronisé' : 'Non synchronisé'
              } · ${COMPANY.country}`}
            </Text>
          </View>

          <FormSection title="Identité" icon="briefcase">
            <FormField label="Nom de l’entreprise" value={name} onChangeText={setName} placeholder="Nom de l’entreprise" />
            <FormField label="Forme juridique" value={legalForm} onChangeText={setLegalForm} placeholder="Ex. EURL, SASU" />
            <FormField label="SIRET" value={siret} onChangeText={setSiret} placeholder="000 000 000 00000" keyboardType="number-pad" />
            <FormField label="N° TVA intracommunautaire" value={vatNumber} onChangeText={setVatNumber} placeholder="FR00 000000000" />
          </FormSection>

          <FormSection title="Coordonnées" icon="map-pin">
            <FormField label="Adresse" value={address} onChangeText={setAddress} placeholder="Adresse de l’entreprise" multiline />
            <FormField label="Téléphone" value={phone} onChangeText={setPhone} placeholder="00 00 00 00 00" keyboardType="phone-pad" />
            <FormField label="Email" value={email} onChangeText={setEmail} placeholder="contact@entreprise.fr" keyboardType="email-address" />
            <FormField label="Site web" value={website} onChangeText={setWebsite} placeholder="monentreprise.fr" />
          </FormSection>

          <FormSubmitButton label="Enregistrer les modifications" onPress={handleSave} />
        </ScrollView>
      </SafeAreaView>

      <BottomNav activeIndex={4} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.screen },
  safeArea: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.section,
  },
  hero: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  heroName: {
    fontSize: FontSize.title,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.4,
  },
  heroSummary: {
    fontSize: 12.5,
    fontWeight: '400',
    color: Palette.textTertiary,
    letterSpacing: -0.1,
    marginTop: 4,
    opacity: 0.82,
  },
});
