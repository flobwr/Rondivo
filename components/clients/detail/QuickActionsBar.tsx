import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

import { type FeatherIconName } from '@/components/clients/types';
import { Palette } from '@/constants/design';
import { iconButtonShadow } from '@/constants/shadow';

type Action = {
  key: string;
  icon: FeatherIconName;
  label: string;
  onPress: () => void;
};

type Props = {
  onCall: () => void;
  onMessage: () => void;
  onNewIntervention: () => void;
  onNewQuote: () => void;
  onNewInvoice: () => void;
};

const CIRCLE = 54;
const ICON_SIZE = 22;

// iOS-Contacts-style round buttons: same size, same soft-blue fill, blue icon,
// no label. Immediately recognisable, and far lighter than the old cards.
function RoundAction({ icon, label, onPress }: Omit<Action, 'key'>) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, { toValue: 0.9, useNativeDriver: true, friction: 5, tension: 300 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut} accessibilityRole="button" accessibilityLabel={label}>
      <Animated.View style={[styles.circle, { transform: [{ scale }] }]}>
        <Feather name={icon} size={ICON_SIZE} color={Palette.blue} />
      </Animated.View>
    </Pressable>
  );
}

export function QuickActionsBar({ onCall, onMessage, onNewIntervention, onNewQuote, onNewInvoice }: Props) {
  const actions: Action[] = [
    { key: 'call', icon: 'phone', label: 'Appeler', onPress: onCall },
    { key: 'msg', icon: 'message-square', label: 'Envoyer un SMS', onPress: onMessage },
    { key: 'inter', icon: 'calendar', label: 'Créer une intervention', onPress: onNewIntervention },
    { key: 'quote', icon: 'file-text', label: 'Créer un devis', onPress: onNewQuote },
    { key: 'invoice', icon: 'credit-card', label: 'Créer une facture', onPress: onNewInvoice },
  ];

  return (
    <View style={styles.row}>
      {actions.map(({ key, ...action }) => (
        <RoundAction key={key} {...action} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  circle: {
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    backgroundColor: Palette.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
    ...iconButtonShadow,
  },
});
