import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { TINT_COLORS, type Tint } from '@/components/clients/types';
import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { type AlertSeverity, type ClientAlert } from '@/data/client-details';
import { PressableScale } from './primitives';

type Props = {
  alerts: ClientAlert[];
  onPressAlert?: (alert: ClientAlert) => void;
};

const SEVERITY_TINT: Record<AlertSeverity, Tint> = {
  critical: 'red',
  warning: 'orange',
  info: 'blue',
};

export function AlertsCard({ alerts, onPressAlert }: Props) {
  if (alerts.length === 0) {
    return (
      <View style={[styles.card, { backgroundColor: TINT_COLORS.green.soft }]}>
        <View style={styles.row}>
          <View style={[styles.iconTile, { backgroundColor: Palette.card }]}>
            <Feather name="check-circle" size={18} color={Palette.green} />
          </View>
          <View style={styles.texts}>
            <Text style={styles.title}>Tout est à jour</Text>
            <Text style={styles.subtitle}>Aucune action requise sur ce client.</Text>
          </View>
        </View>
      </View>
    );
  }

  const topTint = SEVERITY_TINT[alerts[0].severity];

  return (
    <View style={[styles.card, { backgroundColor: TINT_COLORS[topTint].soft }]}>
      {alerts.map((alert, index) => {
        const tint = SEVERITY_TINT[alert.severity];
        const color = TINT_COLORS[tint].color;
        return (
          <PressableScale
            key={alert.id}
            onPress={onPressAlert ? () => onPressAlert(alert) : undefined}
            to={0.98}
            style={StyleSheet.flatten([styles.row, index > 0 && styles.rowGap])}
            accessibilityLabel={alert.title}>
            <View style={[styles.iconTile, { backgroundColor: Palette.card }]}>
              <Feather name={alert.icon} size={18} color={color} />
            </View>
            <View style={styles.texts}>
              <Text style={[styles.title, { color: Palette.textPrimary }]}>{alert.title}</Text>
              {alert.subtitle ? <Text style={styles.subtitle}>{alert.subtitle}</Text> : null}
            </View>
            <Feather name="chevron-right" size={18} color={color} />
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.card,
    padding: Spacing.lg,
    ...cardShadow,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  rowGap: {
    marginTop: 14,
  },
  iconTile: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  texts: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: FontSize.small,
    fontWeight: '500',
    color: Palette.textSecondary,
    marginTop: 2,
    letterSpacing: -0.1,
  },
});
