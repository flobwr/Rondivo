import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text } from 'react-native';

import { actionShadow, FontSize, Palette, Radius, Spacing } from '@/theme';
import { FeatherIconName } from '../types';
import { PressableScale } from './primitives';

// The one prominent "do this next" CTA on a detail screen — distinct from
// QuickActionsRow, which lists every valid action for the current status.
// This banner calls out the single one the module recommends.
export function NextActionBanner({
  label,
  icon = 'arrow-right',
  onPress,
}: {
  label: string;
  icon?: FeatherIconName;
  onPress: () => void;
}) {
  return (
    <PressableScale onPress={onPress} to={0.98} style={styles.button} accessibilityLabel={label}>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <Feather name={icon} size={17} color={Palette.white} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    backgroundColor: Palette.blue,
    borderRadius: Radius.tile,
    paddingVertical: 15,
    paddingHorizontal: Spacing.lg,
    ...actionShadow,
  },
  label: {
    flex: 1,
    fontSize: FontSize.label,
    fontWeight: '700',
    color: Palette.white,
    letterSpacing: -0.1,
  },
});
