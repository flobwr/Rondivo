import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef } from 'react';
import { Animated, Linking, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AddressCard } from '@/components/intervention/AddressCard';
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
import { Palette, Spacing } from '@/constants/design';

export default function InterventionScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const intervention = useMemo(() => getIntervention(id), [id]);
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeIn, { toValue: 1, duration: 260, useNativeDriver: true }).start();
  }, [fadeIn]);

  const handleCall = () => Linking.openURL(`tel:${intervention.phone}`);
  const handleSms = () => Linking.openURL(`sms:${intervention.phone}`);
  const handleNavigate = () => {
    const query = encodeURIComponent(intervention.address);
    const url = Platform.select({
      ios: `maps://?daddr=${query}`,
      android: `geo:0,0?q=${query}`,
      default: `https://maps.google.com/?q=${query}`,
    });
    Linking.openURL(url);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <Animated.View style={[styles.flex, { opacity: fadeIn }]}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            <InterventionHeader intervention={intervention} onBack={() => router.back()} />

            <View style={styles.section}>
              <QuickActionsCard
                onCall={handleCall}
                onSms={handleSms}
                onNavigate={handleNavigate}
                onEdit={() => {}}
                onStart={() => {}}
              />
            </View>

            <View style={styles.section}>
              <AddressCard
                address={intervention.address}
                travelMinutes={intervention.travelMinutes}
                travelKm={intervention.travelKm}
                onNavigate={handleNavigate}
              />
            </View>

            <View style={styles.section}>
              <DescriptionCard
                description={intervention.description}
                notes={intervention.notes}
                priority={intervention.priority}
              />
            </View>

            <View style={styles.section}>
              <EquipmentCard equipment={intervention.equipment} />
            </View>

            <View style={styles.section}>
              <PhotosCard photos={intervention.photos} />
            </View>

            <View style={styles.section}>
              <TimingCard
                startTime={intervention.startTime}
                endTime={intervention.endTime}
                duration={intervention.duration}
              />
            </View>

            <View style={styles.section}>
              <MaterialCard material={intervention.material} />
            </View>

            <View style={styles.section}>
              <ReportCard
                reportNote={intervention.reportNote}
                hasVoiceNote={intervention.hasVoiceNote}
                checklist={intervention.checklist}
              />
            </View>

            <View style={styles.section}>
              <DocumentsCard documents={intervention.documents} />
            </View>

            <View style={styles.section}>
              <HistoryCard history={intervention.history} />
            </View>
          </ScrollView>

          <InterventionFooter onStart={() => {}} onEdit={() => {}} />
        </Animated.View>
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
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.section,
  },
  section: {
    marginTop: Spacing.section,
  },
});
