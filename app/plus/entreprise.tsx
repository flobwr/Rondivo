import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { EmptyState } from '@/components/documents/shared/EmptyState';
import { FormSection, FormField, FormSubmitButton } from '@/components/documents/shared/FormScaffold';
import { SkeletonBlock } from '@/components/ui/Shimmer';
import { FontSize, Palette, Spacing } from '@/constants/design';
import { useAsyncItem } from '@/hooks/use-async-item';
import { Company, getCompany, updateCompany } from '@/services/plus/company';
import { listEmployees } from '@/services/plus/employees';

type EntrepriseBundle = { company: Company; employeesCount: number };

async function fetchEntrepriseBundle(): Promise<EntrepriseBundle> {
  const [company, employees] = await Promise.all([getCompany(), listEmployees()]);
  return { company, employeesCount: employees.length };
}

export default function EntrepriseScreen() {
  const router = useRouter();

  const fetchBundle = useCallback(() => fetchEntrepriseBundle(), []);
  const { data: bundle, status, refresh } = useAsyncItem(fetchBundle);

  const [name, setName] = useState('');
  const [legalForm, setLegalForm] = useState('');
  const [siret, setSiret] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (bundle && !initialized) {
      setName(bundle.company.name);
      setLegalForm(bundle.company.legalForm);
      setSiret(bundle.company.siret);
      setVatNumber(bundle.company.vatNumber);
      setAddress(bundle.company.address);
      setPhone(bundle.company.phone);
      setEmail(bundle.company.email);
      setWebsite(bundle.company.website ?? '');
      setInitialized(true);
    }
  }, [bundle, initialized]);

  const handleSave = async () => {
    try {
      await updateCompany({
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
    } catch {
      Alert.alert('Échec de l’enregistrement', 'Veuillez réessayer.');
    }
  };

  const isLoading = status === 'loading' || !initialized;

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Entreprise" onBack={() => router.back()} />

        {isLoading ? (
          status === 'error' ? (
            <EmptyState icon="alert-circle" title="Impossible de charger" subtitle="Une erreur est survenue." actionLabel="Réessayer" onAction={refresh} />
          ) : (
            <View style={styles.content}>
              <SkeletonBlock height={140} radius={24} />
            </View>
          )
        ) : (
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View style={styles.hero}>
              <Text style={styles.heroName}>{bundle!.company.name}</Text>
              <Text style={styles.heroSummary}>
                {`Depuis ${bundle!.company.foundedYear} · ${bundle!.employeesCount} employé${bundle!.employeesCount > 1 ? 's' : ''} · ${
                  bundle!.company.synced ? 'Synchronisé' : 'Non synchronisé'
                } · ${bundle!.company.country}`}
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
        )}
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
