import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Palette } from '@/constants/design';
import { iconButtonShadow } from '@/constants/shadow';
import { FeatherIconName } from '../types';
import { PressableScale } from './primitives';

export type QuickAction = {
  key: string;
  icon: FeatherIconName;
  label: string;
  onPress: () => void;
};

const CIRCLE = 54;

// Same round, label-under, iOS-Contacts-style action row used on the client
// detail screen — the one shape for "primary, one-tap" actions everywhere in
// the Documents module.
function RoundAction({ icon, label, onPress }: Omit<QuickAction, 'key'>) {
  return (
    <PressableScale onPress={onPress} to={0.9} accessibilityLabel={label}>
      <View style={styles.column}>
        <View style={styles.circle}>
          <Feather name={icon} size={20} color={Palette.blue} />
        </View>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </PressableScale>
  );
}

export function QuickActionsRow({ actions }: { actions: QuickAction[] }) {
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
    alignItems: 'flex-start',
    paddingHorizontal: 4,
  },
  column: {
    alignItems: 'center',
    gap: 6,
    width: 68,
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
  label: {
    fontSize: 11.5,
    fontWeight: '600',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
    textAlign: 'center',
  },
});
