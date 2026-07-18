import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { EmptyState } from '@/components/documents/shared/EmptyState';
import { FormSection, FormField, FormSubmitButton } from '@/components/documents/shared/FormScaffold';
import { KeyValueRow, PressableScale, SectionCard, StatusPill } from '@/components/documents/shared/primitives';
import { SkeletonBlock } from '@/components/ui/Shimmer';
import { FontSize, Palette, Radius, Spacing } from '@/theme';
import { useAsyncItem } from '@/hooks/use-async-item';
import { Account, Company, getAccount, getCompany, updateAccount } from '@/services/plus/company';

const AVATAR = 76;

type CompteBundle = { account: Account; company: Company };

async function fetchCompteBundle(): Promise<CompteBundle> {
  const [account, company] = await Promise.all([getAccount(), getCompany()]);
  return { account, company };
}

export default function CompteScreen() {
  const router = useRouter();

  const fetchBundle = useCallback(() => fetchCompteBundle(), []);
  const { data: bundle, status, refresh } = useAsyncItem(fetchBundle);

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (bundle && !initialized) {
      setName(bundle.account.name);
      setRole(bundle.account.role);
      setEmail(bundle.account.email);
      setPhone(bundle.account.phone);
      setInitialized(true);
    }
  }, [bundle, initialized]);

  const handleSave = async () => {
    try {
      await updateAccount({ name: name.trim(), role: role.trim(), email: email.trim(), phone: phone.trim() });
      Alert.alert('Profil mis à jour', 'Vos informations ont bien été enregistrées.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('Échec de l’enregistrement', 'Veuillez réessayer.');
    }
  };

  const handleManageSubscription = () => {
    Alert.alert('Gérer l’abonnement', 'Cette action sera bientôt disponible.', [{ text: 'OK' }]);
  };

  const isLoading = status === 'loading' || !initialized;

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Mon compte" onBack={() => router.back()} />

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
              <LinearGradient
                colors={[Palette.gradientStart, Palette.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatar}>
                <Text style={styles.avatarText}>{bundle!.account.initials}</Text>
              </LinearGradient>
              <Text style={styles.name}>{bundle!.account.name}</Text>
              <View style={styles.roleWrap}>
                <StatusPill label={bundle!.account.roleBadge} color={Palette.blue} soft={Palette.blueSoft} />
              </View>
            </View>

            <FormSection title="Profil" icon="user">
              <FormField label="Nom" value={name} onChangeText={setName} placeholder="Votre nom" />
              <FormField label="Rôle" value={role} onChangeText={setRole} placeholder="Ex. Chauffagiste" />
              <FormField label="Email" value={email} onChangeText={setEmail} placeholder="vous@email.com" keyboardType="email-address" />
              <FormField label="Téléphone" value={phone} onChangeText={setPhone} placeholder="06 00 00 00 00" keyboardType="phone-pad" />
            </FormSection>

            <SectionCard icon="credit-card" title="Abonnement" style={styles.subscriptionCard}>
              <View style={styles.planRow}>
                <KeyValueRow label="Formule" value={bundle!.company.plan} />
                <StatusPill label="Actif" color={Palette.green} soft={Palette.greenSoft} />
              </View>
              <KeyValueRow label="Renouvellement" value={bundle!.company.planRenewalLabel} />
              <PressableScale onPress={handleManageSubscription} to={0.97} style={styles.manageButton} accessibilityLabel="Gérer l’abonnement">
                <Text style={styles.manageButtonText}>Gérer l’abonnement</Text>
                <Feather name="arrow-right" size={14} color={Palette.blue} />
              </PressableScale>
            </SectionCard>

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
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Palette.white,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  name: {
    fontSize: FontSize.title,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.4,
    marginTop: 12,
  },
  roleWrap: {
    marginTop: 8,
  },
  subscriptionCard: {
    marginTop: Spacing.section,
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  manageButton: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: Palette.blueSoft,
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  manageButtonText: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Palette.blue,
    letterSpacing: -0.1,
  },
});
