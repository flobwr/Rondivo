import { useEffect, useMemo, useRef } from 'react';
import { Alert, Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { CompanyCard } from '@/components/plus/CompanyCard';
import { LogoutButton } from '@/components/plus/LogoutButton';
import { PLUS_ABOUT_ITEMS, PLUS_ITEMS, PLUS_SECTIONS, PlusItemId } from '@/components/plus/registry';
import { PlusSectionCard } from '@/components/plus/PlusSectionCard';
import { ScreenFadeInDuration } from '@/constants/animation';
import { FontSize, Spacing, type PaletteShape } from '@/constants/design';
import { useTheme } from '@/contexts/theme';
import { ACCOUNT, COMPANY } from '@/data/plus/company';
import { activeEmployeesCount, EMPLOYEES } from '@/data/plus/employees';
import { MATERIEL } from '@/data/plus/materiel';
import { PRESTATIONS } from '@/data/plus/prestations';
import { PRODUITS } from '@/data/plus/produits';
import { SETTINGS } from '@/data/plus/settings';
import { SUPPLIERS } from '@/data/plus/suppliers';
import { VEHICLES } from '@/data/plus/vehicles';

const APPEARANCE_LABEL = { clair: 'Clair', sombre: 'Sombre', auto: 'Automatique' } as const;

// Denser rhythm than the shared Spacing tokens — matches the Documents screen
// this menu takes its visual cues from.
const HEADER_GAP = 14;
const SECTION_GAP = 22;

const APP_VERSION = '1.0.0';

// ── Screen ────────────────────────────────────────────────────────────────────

export default function PlusScreen() {
  const router = useRouter();
  const fadeIn = useRef(new Animated.Value(0)).current;
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  // All the data below is synchronous mock data (no network round-trip), so
  // there's nothing to actually wait for — just a fade-in on mount, no
  // artificial delay or skeleton pretending otherwise.
  useEffect(() => {
    Animated.timing(fadeIn, { toValue: 1, duration: ScreenFadeInDuration, useNativeDriver: true }).start();
  }, [fadeIn]);

  // Live counts from the same mock data the sub-screens read — never a
  // separately-invented number.
  const subtitles = useMemo<Partial<Record<PlusItemId, string>>>(
    () => ({
      employes: `${activeEmployeesCount()} actif${activeEmployeesCount() > 1 ? 's' : ''} sur ${EMPLOYEES.length}`,
      equipe: `${EMPLOYEES.length} membre${EMPLOYEES.length > 1 ? 's' : ''}`,
      vehicules: `${VEHICLES.length} véhicule${VEHICLES.length > 1 ? 's' : ''}`,
      materiel: `${MATERIEL.length} élément${MATERIEL.length > 1 ? 's' : ''}`,
      fournisseurs: `${SUPPLIERS.length} fournisseur${SUPPLIERS.length > 1 ? 's' : ''}`,
      prestations: `${PRESTATIONS.length} prestation${PRESTATIONS.length > 1 ? 's' : ''}`,
      produits: `${PRODUITS.length} produit${PRODUITS.length > 1 ? 's' : ''}`,
      coordonnees: COMPANY.phone,
      sauvegarde: `Dernière sauvegarde : ${COMPANY.lastSyncLabel.toLowerCase()}`,
      notifications:
        SETTINGS.notifyReminders && SETTINGS.notifyUnpaidInvoices && SETTINGS.notifyNewMessages
          ? 'Activées'
          : !SETTINGS.notifyReminders && !SETTINGS.notifyUnpaidInvoices && !SETTINGS.notifyNewMessages
            ? 'Désactivées'
            : 'Personnalisées',
      tva: `${SETTINGS.defaultVatRate} %`,
      paiements: SETTINGS.paymentMethods.length > 0 ? `${SETTINGS.paymentMethods.length} moyens configurés` : 'Aucun moyen configuré',
      signature: SETTINGS.hasSignature ? SETTINGS.signatureName : 'Non configurée',
      apparence: APPEARANCE_LABEL[SETTINGS.appearance],
      langue: SETTINGS.language === 'fr' ? 'Français' : 'English',
    }),
    []
  );

  const infoLine = `${VEHICLES.length} véhicule${VEHICLES.length > 1 ? 's' : ''} · Synchronisé ${COMPANY.lastSyncLabel.toLowerCase()}`;

  const handleItemPress = (id: PlusItemId) => {
    const item = PLUS_ITEMS[id];
    router.push((item.route ?? `/plus/${id}`) as never);
  };

  const handleLogout = () => {
    Alert.alert('Se déconnecter', 'Vous devrez vous reconnecter pour accéder à votre compte.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Se déconnecter', style: 'destructive' },
    ]);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Plus</Text>
          <Text style={styles.headerSubtitle}>Gérez votre entreprise</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <Animated.View style={{ opacity: fadeIn }}>
            <View style={{ marginTop: HEADER_GAP }}>
              <CompanyCard
                company={{
                  name: COMPANY.name,
                  ownerName: ACCOUNT.name,
                  initials: COMPANY.initials,
                  plan: COMPANY.plan,
                  employeesCount: EMPLOYEES.length,
                  synced: COMPANY.synced,
                }}
                infoLine={infoLine}
                onPress={() => router.push('/plus/compte')}
                palette={palette}
              />
            </View>

            <View style={{ marginTop: SECTION_GAP, gap: SECTION_GAP }}>
              {PLUS_SECTIONS.map((section) => (
                <PlusSectionCard
                  key={section.label}
                  label={section.label}
                  items={section.items}
                  subtitles={subtitles}
                  onItemPress={handleItemPress}
                  palette={palette}
                />
              ))}
            </View>

            <View style={{ marginTop: SECTION_GAP }}>
              <PlusSectionCard label="À propos" items={PLUS_ABOUT_ITEMS} onItemPress={handleItemPress} palette={palette} />
              <Text style={styles.version}>Version {APP_VERSION}</Text>
            </View>

            <View style={styles.logoutWrapper}>
              <LogoutButton onPress={handleLogout} palette={palette} />
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>

      <BottomNav activeIndex={4} palette={palette} />
    </View>
  );
}

function createStyles(Palette: PaletteShape) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: Palette.screen,
    },
    safeArea: {
      flex: 1,
    },
    header: {
      paddingHorizontal: Spacing.screen,
      paddingTop: 14,
      paddingBottom: 2,
    },
    headerTitle: {
      fontSize: 30,
      fontWeight: '700',
      color: Palette.textPrimary,
      letterSpacing: -0.8,
    },
    headerSubtitle: {
      fontSize: FontSize.small,
      fontWeight: '400',
      color: Palette.textSecondary,
      letterSpacing: -0.1,
      marginTop: 3,
    },
    content: {
      paddingHorizontal: Spacing.screen,
      paddingBottom: Spacing.section,
    },
    version: {
      textAlign: 'center',
      fontSize: 11.5,
      fontWeight: '400',
      color: Palette.textTertiary,
      letterSpacing: -0.1,
      marginTop: 14,
      opacity: 0.8,
    },
    logoutWrapper: {
      marginTop: SECTION_GAP + 20,
    },
  });
}
