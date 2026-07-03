import { useEffect, useRef, useState } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { PressableScale } from '@/components/documents/shared/primitives';
import { PAYMENT_METHOD_LABEL, PaymentMethod } from '@/data/documents/factures';

const METHODS: PaymentMethod[] = ['virement', 'carte', 'especes', 'cheque', 'prelevement'];

type Props = {
  visible: boolean;
  remaining: number;
  onClose: () => void;
  onSubmit: (amount: number, method: PaymentMethod) => void;
};

export function RecordPaymentSheet({ visible, remaining, onClose, onSubmit }: Props) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const progress = useRef(new Animated.Value(0)).current;
  const [amount, setAmount] = useState(String(remaining));
  const [method, setMethod] = useState<PaymentMethod>('virement');

  useEffect(() => {
    if (visible) setAmount(String(remaining));
  }, [visible, remaining]);

  useEffect(() => {
    Animated.spring(progress, { toValue: visible ? 1 : 0, useNativeDriver: true, friction: 11, tension: 90 }).start();
  }, [visible, progress]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [height, 0] });
  const parsedAmount = Number(amount.replace(',', '.'));
  const canSubmit = parsedAmount > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit(parsedAmount, method);
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, { opacity: progress }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Fermer" />
        </Animated.View>

        <Animated.View
          style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) + 8, transform: [{ translateY }] }]}>
          <View style={styles.handle} />
          <Text style={styles.title}>Enregistrer un paiement</Text>

          <Text style={styles.label}>Montant</Text>
          <View style={styles.amountRow}>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              style={styles.amountInput}
              placeholder="0"
              placeholderTextColor={Palette.textTertiary}
            />
            <Text style={styles.currency}>€</Text>
          </View>

          <Text style={[styles.label, styles.labelSpacing]}>Méthode</Text>
          <View style={styles.methodRow}>
            {METHODS.map((m) => {
              const active = m === method;
              return (
                <Pressable
                  key={m}
                  onPress={() => setMethod(m)}
                  style={[styles.methodChip, active ? styles.methodChipActive : null]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}>
                  <Text style={[styles.methodText, active ? styles.methodTextActive : null]}>
                    {PAYMENT_METHOD_LABEL[m]}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <PressableScale
            onPress={handleSubmit}
            disabled={!canSubmit}
            to={0.98}
            style={[styles.submitButton, !canSubmit ? styles.submitButtonDisabled : null]}
            accessibilityLabel="Enregistrer le paiement">
            <Text style={styles.submitText}>Enregistrer le paiement</Text>
          </PressableScale>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: '#D7DCE4',
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
    marginTop: 20,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.cardMuted,
    borderRadius: Radius.tile,
    paddingHorizontal: Spacing.lg,
    height: 56,
    gap: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
    padding: 0,
  },
  currency: {
    fontSize: 18,
    fontWeight: '700',
    color: Palette.textTertiary,
  },
  methodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  methodChip: {
    borderRadius: Radius.pill,
    paddingHorizontal: 13,
    paddingVertical: 9,
    backgroundColor: Palette.cardMuted,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E4E8EF',
  },
  methodChipActive: {
    backgroundColor: Palette.blueSoft,
    borderColor: Palette.blue,
  },
  methodText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
  },
  methodTextActive: {
    color: Palette.blue,
  },
  submitButton: {
    backgroundColor: Palette.blue,
    borderRadius: Radius.tile,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
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
});
