import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { type FeatherIconName } from '@/components/clients/types';
import { Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { PressableScale } from './primitives';

type Action = {
  key: string;
  icon: FeatherIconName;
  label: string;
  onPress: () => void;
};

type Props = {
  onCall: () => void;
  onSms: () => void;
  onNewIntervention: () => void;
  onNewQuote: () => void;
  onNewInvoice: () => void;
};

export function QuickActionsBar({ onCall, onSms, onNewIntervention, onNewQuote, onNewInvoice }: Props) {
  const actions: Action[] = [
    { key: 'call', icon: 'phone', label: 'Appeler', onPress: onCall },
    { key: 'sms', icon: 'message-square', label: 'SMS', onPress: onSms },
    { key: 'inter', icon: 'calendar', label: 'Nouvelle intervention', onPress: onNewIntervention },
    { key: 'quote', icon: 'file-text', label: 'Nouveau devis', onPress: onNewQuote },
    { key: 'invoice', icon: 'file', label: 'Nouvelle facture', onPress: onNewInvoice },
  ];

  return (
    <View style={styles.card}>
      {actions.map((action, index) => (
        <View key={action.key} style={styles.cell}>
          {index > 0 ? <View style={styles.divider} /> : null}
          <PressableScale onPress={action.onPress} to={0.9} style={styles.button} accessibilityLabel={action.label}>
            <View style={styles.iconWrap}>
              <Feather name={action.icon} size={20} color={Palette.blue} />
            </View>
            <Text style={styles.label} numberOfLines={2}>
              {action.label}
            </Text>
          </PressableScale>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingVertical: Spacing.lg,
    paddingHorizontal: 6,
    ...cardShadow,
  },
  cell: {
    flex: 1,
    position: 'relative',
  },
  divider: {
    position: 'absolute',
    left: 0,
    top: 6,
    bottom: 6,
    width: StyleSheet.hairlineWidth,
    backgroundColor: Palette.border,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 4,
    minHeight: 74,
  },
  iconWrap: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11.5,
    fontWeight: '600',
    color: Palette.textSecondary,
    textAlign: 'center',
    letterSpacing: -0.1,
    lineHeight: 14,
  },
});
