import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FeatherIconName } from '@/components/documents/types';
import { BottomDock } from '@/components/ui/BottomDock';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { FormField, FormSection, FormSubmitButton } from '@/components/documents/shared/FormScaffold';
import { Palette, Spacing } from '@/theme';

type FeedbackType = 'contact' | 'bug' | 'suggestion';

const FEEDBACK_META: Record<FeedbackType, { title: string; icon: FeatherIconName; label: string; placeholder: string; successTitle: string; successBody: string }> = {
  contact: {
    title: 'Contacter le support',
    icon: 'message-circle',
    label: 'Votre question',
    placeholder: 'Décrivez votre question…',
    successTitle: 'Message envoyé',
    successBody: 'Notre équipe vous répondra sous 24h.',
  },
  bug: {
    title: 'Signaler un bug',
    icon: 'alert-triangle',
    label: 'Description du problème',
    placeholder: 'Que s’est-il passé ? Sur quel écran ?',
    successTitle: 'Signalement envoyé',
    successBody: 'Merci, notre équipe technique va investiguer.',
  },
  suggestion: {
    title: 'Proposer une fonctionnalité',
    icon: 'star',
    label: 'Votre idée',
    placeholder: 'Quelle fonctionnalité aimeriez-vous voir dans Rondivo ?',
    successTitle: 'Merci pour votre suggestion',
    successBody: 'Vos idées nous aident à améliorer Rondivo.',
  },
};

export default function FeedbackScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams<{ type: string }>();
  const meta = FEEDBACK_META[type as FeedbackType] ?? FEEDBACK_META.contact;

  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim()) return;
    Alert.alert(meta.successTitle, meta.successBody, [{ text: 'OK', onPress: () => router.back() }]);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title={meta.title} onBack={() => router.back()} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <FormSection title={meta.label} icon={meta.icon}>
            <FormField label={meta.label} value={message} onChangeText={setMessage} placeholder={meta.placeholder} multiline />
          </FormSection>

          <FormSubmitButton label="Envoyer" onPress={handleSend} />
        </ScrollView>
      </SafeAreaView>

      <BottomDock activeIndex={4} />
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
});
