import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { TINT_COLORS } from '@/components/clients/types';
import { FontSize, Palette, Radius } from '@/constants/design';
import { INTERVENTION_TEMPLATES, type InterventionTemplate } from '@/data/intervention-templates';
import { formatDuration } from './appointment-utils';
import { PressableScale } from './AppointmentUI';

type Props = {
  selectedId: string | null; // template id or 'custom'
  onSelect: (template: InterventionTemplate) => void;
  onSelectCustom: () => void;
};

function formatEuro(value: number): string {
  return `${value.toLocaleString('fr-FR')} €`;
}

function TemplateCard({ template, active, onPress }: { template: InterventionTemplate; active: boolean; onPress: () => void }) {
  const { color, soft } = TINT_COLORS[template.tint];
  return (
    <PressableScale onPress={onPress} to={0.96} style={StyleSheet.flatten([styles.card, active && styles.cardActive])} accessibilityLabel={template.name}>
      <View style={styles.cardTop}>
        <View style={[styles.iconTile, { backgroundColor: soft }]}>
          <Feather name={template.icon} size={17} color={color} />
        </View>
        {active ? (
          <View style={styles.check}>
            <Feather name="check" size={13} color={Palette.white} />
          </View>
        ) : null}
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {template.name}
      </Text>
      <Text style={styles.meta}>
        {formatDuration(template.durationMinutes)} · {formatEuro(template.price)}
      </Text>
    </PressableScale>
  );
}

export function TemplatePicker({ selectedId, onSelect, onSelectCustom }: Props) {
  const customActive = selectedId === 'custom';
  return (
    <View style={styles.grid}>
      {INTERVENTION_TEMPLATES.map((template) => (
        <View key={template.id} style={styles.cell}>
          <TemplateCard template={template} active={selectedId === template.id} onPress={() => onSelect(template)} />
        </View>
      ))}
      <View style={styles.cell}>
        <PressableScale onPress={onSelectCustom} to={0.96} style={StyleSheet.flatten([styles.custom, customActive && styles.cardActive])} accessibilityLabel="Intervention personnalisée">
          <View style={[styles.iconTile, { backgroundColor: Palette.cardMuted }]}>
            <Feather name="plus" size={17} color={Palette.textSecondary} />
          </View>
          <Text style={styles.name} numberOfLines={1}>
            Personnalisé
          </Text>
          <Text style={styles.meta}>Sur mesure</Text>
        </PressableScale>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  cell: {
    width: '47.8%',
    flexGrow: 1,
  },
  card: {
    backgroundColor: Palette.card,
    borderRadius: Radius.tile,
    padding: 13,
    borderWidth: 1.5,
    borderColor: Palette.border,
    minHeight: 104,
  },
  custom: {
    backgroundColor: Palette.card,
    borderRadius: Radius.tile,
    padding: 13,
    borderWidth: 1.5,
    borderColor: Palette.border,
    borderStyle: 'dashed',
    minHeight: 104,
  },
  cardActive: {
    borderColor: Palette.blue,
    backgroundColor: Palette.blueSoft,
    borderStyle: 'solid',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconTile: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Palette.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
    marginTop: 10,
  },
  meta: {
    fontSize: 11.5,
    fontWeight: '500',
    color: Palette.textTertiary,
    marginTop: 3,
  },
});
