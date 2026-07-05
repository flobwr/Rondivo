import { StyleSheet, Switch, Text, View } from 'react-native';

import { FontSize, Palette } from '@/constants/design';

/** One labelled on/off row — Notifications, Relances automatiques, Sauvegarde, Signature. */
export function SwitchRow({
  label,
  description,
  value,
  onValueChange,
}: {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: Palette.border, true: Palette.blue }}
        thumbColor={Palette.white}
        ios_backgroundColor={Palette.border}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: FontSize.label,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 12.5,
    fontWeight: '400',
    color: Palette.textTertiary,
    letterSpacing: -0.1,
    marginTop: 2,
    opacity: 0.82,
  },
});
