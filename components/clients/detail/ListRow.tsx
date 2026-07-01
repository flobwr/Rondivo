import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { TINT_COLORS, type FeatherIconName, type Tint } from '@/components/clients/types';
import { FontSize, Palette, Radius } from '@/constants/design';
import { formatEuroShort } from '@/data/client-details';
import { PressableScale, TintIcon } from './primitives';

type Props = {
  icon: FeatherIconName;
  iconTint?: Tint;
  title: string;
  subtitle?: string;
  amount?: number;
  status?: string;
  statusTint?: Tint;
  onPress?: () => void;
};

// Shared row for interventions, quotes, invoices and payments — one visual
// grammar so no list feels heavier than another.
export function ListRow({ icon, iconTint = 'blue', title, subtitle, amount, status, statusTint = 'blue', onPress }: Props) {
  return (
    <PressableScale onPress={onPress} to={0.98} style={styles.row} accessibilityLabel={title}>
      <TintIcon icon={icon} tint={iconTint} size={40} iconSize={17} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
      </View>
      <View style={styles.right}>
        {amount != null ? <Text style={styles.amount}>{formatEuroShort(amount)}</Text> : null}
        {status ? (
          <View style={[styles.pill, { backgroundColor: TINT_COLORS[statusTint].soft }]}>
            <Text style={[styles.pillText, { color: TINT_COLORS[statusTint].color }]}>{status}</Text>
          </View>
        ) : null}
      </View>
      {onPress ? <Feather name="chevron-right" size={16} color={Palette.textTertiary} style={styles.chevron} /> : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.label,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: FontSize.small,
    fontWeight: '500',
    color: Palette.textTertiary,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
    gap: 5,
  },
  amount: {
    fontSize: FontSize.label,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  pill: {
    borderRadius: Radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  pillText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  chevron: {
    marginLeft: 2,
  },
});
