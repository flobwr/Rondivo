import { useEffect, useRef, useState } from 'react';
import { Animated, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { createThemedStyles, FontSize, Palette, Radius, Spacing } from '@/theme';
import { PressableScale } from '@/components/documents/shared/primitives';
import { openMailto } from '@/data/documents/messaging';

type Props = {
  visible: boolean;
  title: string;
  recipientName: string;
  recipientEmail?: string;
  subject: string;
  body: string;
  /** Shown under the fields, e.g. hinting that the PDF is shared separately. */
  note?: string;
  onClose: () => void;
  /** Called once the mail app has been opened — never fires automatically. */
  onSent?: () => void;
};

// Composer for "Relancer le client" and "Envoyer le devis/la facture/le
// contrat" — always opens the phone's own mail app with editable, prefilled
// text; nothing is ever sent on the user's behalf.
export function MessageComposerModal({
  visible,
  title,
  recipientName,
  recipientEmail,
  subject,
  body,
  note,
  onClose,
  onSent,
}: Props) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const progress = useRef(new Animated.Value(0)).current;
  const [editedSubject, setEditedSubject] = useState(subject);
  const [editedBody, setEditedBody] = useState(body);

  useEffect(() => {
    if (visible) {
      setEditedSubject(subject);
      setEditedBody(body);
    }
  }, [visible, subject, body]);

  useEffect(() => {
    Animated.spring(progress, { toValue: visible ? 1 : 0, useNativeDriver: true, friction: 11, tension: 90 }).start();
  }, [visible, progress]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [height, 0] });
  const canSend = !!recipientEmail;

  const handleContinue = () => {
    if (!canSend || !recipientEmail) return;
    openMailto({ to: recipientEmail, subject: editedSubject, body: editedBody });
    onSent?.();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, { opacity: progress }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Fermer" />
        </Animated.View>

        <Animated.View
          style={[
            styles.sheet,
            { paddingBottom: Math.max(insets.bottom, 16) + 8, maxHeight: height * 0.86, transform: [{ translateY }] },
          ]}>
          <View style={styles.handle} />
          <Text style={styles.title}>{title}</Text>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text style={styles.label}>Destinataire</Text>
            <View style={styles.recipientRow}>
              <Text style={styles.recipientName} numberOfLines={1}>
                {recipientName}
              </Text>
              {recipientEmail ? (
                <Text style={styles.recipientEmail} numberOfLines={1}>
                  {recipientEmail}
                </Text>
              ) : (
                <Text style={styles.recipientMissing}>Aucune adresse e-mail enregistrée</Text>
              )}
            </View>

            <Text style={[styles.label, styles.labelSpacing]}>Objet</Text>
            <TextInput
              value={editedSubject}
              onChangeText={setEditedSubject}
              style={styles.subjectInput}
              placeholder="Objet du message"
              placeholderTextColor={Palette.textTertiary}
            />

            <Text style={[styles.label, styles.labelSpacing]}>Message</Text>
            <TextInput
              value={editedBody}
              onChangeText={setEditedBody}
              style={styles.bodyInput}
              multiline
              placeholder="Votre message…"
              placeholderTextColor={Palette.textTertiary}
              textAlignVertical="top"
            />

            {note ? <Text style={styles.note}>{note}</Text> : null}
          </ScrollView>

          <PressableScale
            onPress={handleContinue}
            disabled={!canSend}
            to={0.98}
            style={[styles.submitButton, !canSend ? styles.submitButtonDisabled : null]}
            accessibilityLabel="Continuer">
            <Text style={styles.submitText}>Continuer</Text>
          </PressableScale>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = createThemedStyles(() => StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15, 23, 41, 0.38)' },
  sheet: {
    backgroundColor: Palette.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: Spacing.screen,
    paddingTop: 10,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Palette.insetDeep,
    marginBottom: 14,
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.4,
    marginBottom: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
    color: Palette.textTertiary,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  labelSpacing: {
    marginTop: 18,
  },
  recipientRow: {
    backgroundColor: Palette.cardMuted,
    borderRadius: Radius.tile,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
  },
  recipientName: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  recipientEmail: {
    fontSize: FontSize.small,
    fontWeight: '500',
    color: Palette.textTertiary,
    marginTop: 2,
  },
  recipientMissing: {
    fontSize: FontSize.small,
    fontWeight: '600',
    color: Palette.red,
    marginTop: 2,
  },
  subjectInput: {
    backgroundColor: Palette.cardMuted,
    borderRadius: Radius.tile,
    paddingHorizontal: Spacing.lg,
    height: 48,
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Palette.textPrimary,
  },
  bodyInput: {
    backgroundColor: Palette.cardMuted,
    borderRadius: Radius.tile,
    padding: Spacing.lg,
    minHeight: 140,
    fontSize: FontSize.small,
    fontWeight: '400',
    color: Palette.textPrimary,
    lineHeight: 19,
  },
  note: {
    fontSize: 12,
    fontWeight: '500',
    color: Palette.textTertiary,
    marginTop: 14,
    lineHeight: 16,
  },
  submitButton: {
    backgroundColor: Palette.blue,
    borderRadius: Radius.tile,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonDisabled: {
    opacity: 0.4,
  },
  submitText: {
    fontSize: FontSize.label,
    fontWeight: '700',
    color: Palette.white,
    letterSpacing: -0.1,
  },
}));
