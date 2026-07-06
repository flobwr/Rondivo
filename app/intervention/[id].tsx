import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { getIntervention } from '@/components/intervention/mock-data';
import { PhotosCard } from '@/components/intervention/PhotosCard';
import { QuickActionsCard } from '@/components/intervention/QuickActionsCard';
import { ReportCard } from '@/components/intervention/ReportCard';
import { TimingCard } from '@/components/intervention/TimingCard';
import { Photo } from '@/components/intervention/types';
import { Palette, Spacing } from '@/constants/design';
import { openMapsTo } from '@/utils/openMaps';

export default function InterventionScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const intervention = useMemo(() => getIntervention(id), [id]);
  const [photos, setPhotos] = useState<Photo[]>(intervention.photos);

  useEffect(() => {
    setPhotos(intervention.photos);
  }, [intervention]);

  const handleAddPhoto = useCallback((uri: string) => {
    setPhotos((prev) => [...prev, { id: `photo-${Date.now()}`, source: { uri } }]);
  }, []);

  const handleCall = () => Linking.openURL(`tel:${intervention.phone}`);
  const handleSms = () => Linking.openURL(`sms:${intervention.phone}`);
  const handleNavigate = () => openMapsTo(intervention.address);

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
              onEdit={() => {}}
              onStart={() => {}}
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

          <AnimatedSection index={2}>
            <DescriptionCard
              description={intervention.description}
              notes={intervention.notes}
              priority={intervention.priority}
            />
          </AnimatedSection>

          <AnimatedSection index={3}>
            <EquipmentCard equipment={intervention.equipment} />
          </AnimatedSection>

          <AnimatedSection index={4}>
            <PhotosCard photos={photos} onAddPhoto={handleAddPhoto} />
          </AnimatedSection>

          <AnimatedSection index={5}>
            <TimingCard
              startTime={intervention.startTime}
              endTime={intervention.endTime}
              duration={intervention.duration}
            />
          </AnimatedSection>

          <AnimatedSection index={6}>
            <MaterialCard material={intervention.material} />
          </AnimatedSection>

          <AnimatedSection index={7}>
            <ReportCard
              reportNote={intervention.reportNote}
              hasVoiceNote={intervention.hasVoiceNote}
              checklist={intervention.checklist}
              hasSignature={intervention.hasSignature}
              reportPdfReady={intervention.reportPdfReady}
            />
          </AnimatedSection>

          <AnimatedSection index={8}>
            <DocumentsCard documents={intervention.documents} />
          </AnimatedSection>

          <AnimatedSection index={9}>
            <HistoryCard history={intervention.history} />
          </AnimatedSection>
        </ScrollView>

        <InterventionFooter onStart={() => {}} onEdit={() => {}} />
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
});
