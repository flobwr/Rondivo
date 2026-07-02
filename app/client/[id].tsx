import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Animated, Linking, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActivityCard } from '@/components/clients/detail/ActivityCard';
import { AlertsBanner } from '@/components/clients/detail/AlertsBanner';
import { ContactsCard } from '@/components/clients/detail/ContactsCard';
import { DetailHeader } from '@/components/clients/detail/DetailHeader';
import { DetailTabs, type DetailTab } from '@/components/clients/detail/DetailTabs';
import { EquipmentCard } from '@/components/clients/detail/EquipmentCard';
import { IdentityCard } from '@/components/clients/detail/IdentityCard';
import { InformationsCard } from '@/components/clients/detail/InformationsCard';
import { NextAppointmentCard } from '@/components/clients/detail/NextAppointmentCard';
import { NotesPreviewCard } from '@/components/clients/detail/NotesPreviewCard';
import { QuickActionsBar } from '@/components/clients/detail/QuickActionsBar';
import { QuickStatsCard } from '@/components/clients/detail/QuickStatsCard';
import {
  DocumentsSection,
  FinancesSection,
  InterventionsSection,
  NotesSection,
} from '@/components/clients/detail/TabSections';
import { BottomNav } from '@/components/home/bottom-nav';
import { FontSize, Palette, Spacing } from '@/constants/design';
import { getClientAlerts, getClientDetail, type ClientAlert } from '@/data/client-details';
import { getClientById } from '@/data/clients';

const light = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

export default function ClientDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const client = getClientById(id);

  const detail = useMemo(() => (client ? getClientDetail(client) : null), [client]);
  const [notes, setNotes] = useState<string[]>(detail?.importantNotes ?? []);
  const [activeTab, setActiveTab] = useState<DetailTab>('resume');

  // Gentle fade + rise on mount — matches the app's calm, premium motion.
  const enter = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(enter, { toValue: 1, duration: 320, useNativeDriver: true }).start();
  }, [enter]);

  if (!client || !detail) {
    return (
      <View style={styles.root}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <DetailHeader onBack={() => router.back()} onEdit={() => {}} onMenu={() => {}} />
          <Text style={styles.notFound}>Client introuvable.</Text>
        </SafeAreaView>
      </View>
    );
  }

  const soon = (feature: string) =>
    Alert.alert(feature, 'Cette action sera bientôt disponible.', [{ text: 'OK' }]);

  const call = (phone = client.phone) => {
    light();
    Linking.openURL(`tel:${phone.replace(/\s+/g, '')}`);
  };
  const message = () => {
    light();
    Linking.openURL(`sms:${client.phone.replace(/\s+/g, '')}`);
  };
  const email = () => {
    light();
    Linking.openURL(`mailto:${client.email}`);
  };
  const openMaps = () => {
    light();
    const q = encodeURIComponent(client.address);
    const url = Platform.select({
      ios: `maps://?daddr=${q}`,
      android: `geo:0,0?q=${q}`,
      default: `https://www.google.com/maps/search/?api=1&query=${q}`,
    });
    Linking.openURL(url!);
  };

  const alerts: ClientAlert[] = getClientAlerts(client, detail);
  const stats = detail.stats['12m'];

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader
          onBack={() => router.back()}
          onEdit={() => soon('Modifier le client')}
          onMenu={() => soon('Options')}
        />

        <Animated.View
          style={[
            styles.flex,
            { opacity: enter, transform: [{ translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] },
          ]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.content}>
            {/* Top zone — the "at a glance" essentials, kept tight. */}
            <IdentityCard client={client} onAddress={openMaps} />

            <View style={styles.gap} />
            <QuickActionsBar
              onCall={() => call()}
              onMessage={message}
              onNewIntervention={() => router.push({ pathname: '/appointment/new', params: { clientId: client.id } })}
              onNewQuote={() => soon('Nouveau devis')}
              onNewInvoice={() => soon('Nouvelle facture')}
            />

            {alerts.length > 0 ? (
              <>
                <View style={styles.gap} />
                <AlertsBanner alerts={alerts} onPressAlert={(a) => soon(a.title)} />
              </>
            ) : null}

            {detail.nextAppointment ? (
              <>
                <View style={styles.gap} />
                <NextAppointmentCard appointment={detail.nextAppointment} onOpen={() => router.push('/planning')} />
              </>
            ) : null}

            <View style={styles.tabsWrap}>
              <DetailTabs active={activeTab} onChange={setActiveTab} />
            </View>

            {activeTab === 'resume' ? (
              <View style={styles.stack}>
                <InformationsCard client={client} detail={detail} onCall={() => call()} onEmail={email} />
                <ContactsCard
                  contacts={detail.contacts}
                  onAddContact={() => soon('Ajouter un contact')}
                  onCallContact={(c) => call(c.phone)}
                />
                <EquipmentCard
                  equipment={detail.equipment}
                  onOpenEquipment={(e) => soon(e.name)}
                  onSeeAll={() => soon('Tous les équipements')}
                />
                <QuickStatsCard detail={detail} onSeeAll={() => soon('Toutes les statistiques')} />
                <ActivityCard activity={detail.activity} limit={3} onSeeAll={() => soon("Toute l'activité")} />
                <NotesPreviewCard notes={notes} onSeeMore={() => setActiveTab('notes')} />
              </View>
            ) : null}

            {activeTab === 'interventions' ? (
              <InterventionsSection
                interventions={detail.interventions}
                onOpen={(i) => soon(i.title)}
                onNew={() => router.push({ pathname: '/appointment/new', params: { clientId: client.id } })}
              />
            ) : null}

            {activeTab === 'documents' ? (
              <DocumentsSection
                documents={detail.documents}
                onOpen={(d) => soon(d.name)}
                onAdd={() => soon('Ajouter un document')}
              />
            ) : null}

            {activeTab === 'finances' ? (
              <FinancesSection
                finances={detail.finances}
                revenue={stats.revenue}
                paid={stats.totalPaid}
                unpaid={stats.totalUnpaid}
                onOpenItem={(item) => item && soon(item.reference)}
                onNewQuote={() => soon('Nouveau devis')}
                onNewInvoice={() => soon('Nouvelle facture')}
              />
            ) : null}

            {activeTab === 'notes' ? <NotesSection notes={notes} onChangeNotes={setNotes} /> : null}

            <View style={styles.bottomSpacer} />
          </ScrollView>
        </Animated.View>

        <BottomNav activeIndex={2} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Palette.screen,
  },
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.xs,
  },
  gap: {
    height: 12,
  },
  tabsWrap: {
    marginTop: 14,
    marginBottom: 12,
  },
  stack: {
    gap: 12,
  },
  bottomSpacer: {
    height: Spacing.section,
  },
  notFound: {
    fontSize: FontSize.body,
    color: Palette.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.section,
  },
});
