import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AddressCard } from '@/components/intervention/AddressCard';
import { AnimatedSection } from '@/components/intervention/AnimatedSection';
import { DescriptionCard } from '@/components/intervention/DescriptionCard';
import { DocumentsCard } from '@/components/intervention/DocumentsCard';
import { EquipmentCard } from '@/components/intervention/EquipmentCard';
import { HistoryCard } from '@/components/intervention/HistoryCard';
import { InterventionFooter } from '@/components/intervention/InterventionFooter';
import { InterventionHeader } from '@/components/intervention/InterventionHeader';
import { MaterialCard } from '@/components/intervention/MaterialCard';
import { PhotosCard } from '@/components/intervention/PhotosCard';
import { QuickActionsCard } from '@/components/intervention/QuickActionsCard';
import { ReportCard } from '@/components/intervention/ReportCard';
import { TimingCard } from '@/components/intervention/TimingCard';
import { EmptyState } from '@/components/documents/shared/EmptyState';
import { Palette, Spacing } from '@/theme';
import { SkeletonBlock } from '@/components/ui/Shimmer';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { useAsyncItem } from '@/hooks/use-async-item';
import { getIntervention } from '@/services/interventions';
import { InterventionPhoto, addInterventionPhoto, getOrCreatePhotoIntervention } from '@/services/documents/photos';
import { openMapsTo } from '@/utils/openMaps';

// QuickActionsCard + AddressCard stay above the tabs — they're the "what do
// I do right now" pieces, not reference info to browse. Everything else was
// 8 more sections stacked with no anchors; grouped into 3 tabs instead so
// finding e.g. the report doesn't mean scrolling past everything else.
type InterventionTab = 'details' | 'photos' | 'historique';
const INTERVENTION_TABS: { key: InterventionTab; label: string }[] = [
  { key: 'details', label: 'Détails' },
  { key: 'photos', label: 'Photos & rapport' },
  { key: 'historique', label: 'Historique' },
];

function InterventionSkeleton() {
  return (
    <View style={{ gap: Spacing.lg, paddingTop: Spacing.section }}>
      <SkeletonBlock height={120} radius={24} />
      <SkeletonBlock height={90} radius={24} />
      <SkeletonBlock height={140} radius={24} />
      <SkeletonBlock height={140} radius={24} />
    </View>
  );
}

export default function InterventionScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();

  const fetchIntervention = useCallback(() => getIntervention(id), [id]);
  const { data: intervention, status, refresh } = useAsyncItem(fetchIntervention);
  const [photos, setPhotos] = useState<InterventionPhoto[]>([]);

  // Photos live in the shared photo store (data/documents/photos.ts), keyed
  // by intervention id — not on the Intervention record itself — so a photo
  // taken here also shows up in the Photos module and in report generation.
  useEffect(() => {
    if (!intervention) return;
    let cancelled = false;
    getOrCreatePhotoIntervention(intervention.id, {
      label: intervention.type,
      clientId: '',
      clientName: intervention.client,
      date: new Date().toISOString(),
    }).then((linked) => {
      if (!cancelled) setPhotos(linked.photos);
    });
    return () => {
      cancelled = true;
    };
  }, [intervention]);

  const handleAddPhoto = useCallback(
    async (uri: string) => {
      if (!intervention) return;
      const photo = await addInterventionPhoto(intervention.id, { uri, category: 'pendant' });
      if (photo) setPhotos((prev) => [...prev, photo]);
    },
    [intervention]
  );

  // No backend status tracking exists yet for interventions (same mock-data
  // ceiling as the rest of this screen) — this is a real, visible state
  // change instead of the previous no-op, not a persisted workflow.
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const handleStart = useCallback(() => setStarted(true), []);
  const handleCompleteVisit = useCallback(() => setCompleted(true), []);
  const [activeTab, setActiveTab] = useState<InterventionTab>('details');

  if (status === 'error') {
    return (
      <View style={styles.root}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <EmptyState
            icon="alert-circle"
            title="Impossible de charger l’intervention"
            subtitle="Vérifiez votre connexion et réessayez."
            actionLabel="Réessayer"
            onAction={refresh}
          />
        </SafeAreaView>
      </View>
    );
  }

  if (!intervention || status === 'loading') {
    return (
      <View style={styles.root}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            <InterventionSkeleton />
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  const handleCall = () => Linking.openURL(`tel:${intervention.phone}`);
  const handleSms = () => Linking.openURL(`sms:${intervention.phone}`);
  const handleNavigate = () => openMapsTo(intervention.address);
  const handleEdit = () => router.push(`/intervention/new?editId=${intervention.id}` as never);
  const handleCompleteReport = () => router.push(`/rapport/new?interventionId=${intervention.id}` as never);
  const handleCreateQuote = () => router.push(`/devis/new?interventionId=${intervention.id}` as never);
  const handleCreateInvoice = () => router.push(`/facture/new?interventionId=${intervention.id}` as never);

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <InterventionHeader intervention={intervention} onBack={() => router.back()} />

          <AnimatedSection index={0}>
            <QuickActionsCard
              onCall={handleCall}
              onSms={handleSms}
              onNavigate={handleNavigate}
              onCreateQuote={handleCreateQuote}
              onStart={handleStart}
              onComplete={handleCompleteVisit}
              onCreateReport={handleCompleteReport}
              onCreateInvoice={handleCreateInvoice}
              started={started}
              completed={completed}
            />
          </AnimatedSection>

          <AnimatedSection index={1}>
            <AddressCard
              address={intervention.address}
              travelMinutes={intervention.travelMinutes}
              travelKm={intervention.travelKm}
              onNavigate={handleNavigate}
            />
          </AnimatedSection>

          <View style={styles.tabsWrap}>
            <SegmentedTabs tabs={INTERVENTION_TABS} active={activeTab} onChange={setActiveTab} />
          </View>

          {activeTab === 'details' ? (
            <>
              <AnimatedSection index={0}>
                <DescriptionCard
                  description={intervention.description}
                  notes={intervention.notes}
                  priority={intervention.priority}
                />
              </AnimatedSection>

              <AnimatedSection index={1}>
                <TimingCard
                  startTime={intervention.startTime}
                  endTime={intervention.endTime}
                  duration={intervention.duration}
                />
              </AnimatedSection>

              <AnimatedSection index={2}>
                <EquipmentCard equipment={intervention.equipment} />
              </AnimatedSection>

              <AnimatedSection index={3}>
                <MaterialCard material={intervention.material} />
              </AnimatedSection>
            </>
          ) : null}

          {activeTab === 'photos' ? (
            <>
              <AnimatedSection index={0}>
                <PhotosCard photos={photos} onAddPhoto={handleAddPhoto} />
              </AnimatedSection>

              <AnimatedSection index={1}>
                <ReportCard
                  reportNote={intervention.reportNote}
                  hasVoiceNote={intervention.hasVoiceNote}
                  checklist={intervention.checklist}
                  hasSignature={intervention.hasSignature}
                  reportPdfReady={intervention.reportPdfReady}
                  onComplete={handleCompleteReport}
                />
              </AnimatedSection>

              <AnimatedSection index={2}>
                <DocumentsCard documents={intervention.documents} />
              </AnimatedSection>
            </>
          ) : null}

          {activeTab === 'historique' ? (
            <AnimatedSection index={0}>
              <HistoryCard history={intervention.history} />
            </AnimatedSection>
          ) : null}
        </ScrollView>

        <InterventionFooter
          onStart={handleStart}
          onComplete={handleCompleteVisit}
          onEdit={handleEdit}
          started={started}
          completed={completed}
        />
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
  content: {
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.section,
  },
  tabsWrap: {
    marginTop: Spacing.section,
  },
});
