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

// Compact horizontal row: icon left, name + duration/price right. Roughly 40%
// shorter than a stacked card, so far more templates fit without scrolling.
function TemplateCard({ template, active, onPress }: { template: InterventionTemplate; active: boolean; onPress: () => void }) {
  const { color, soft } = TINT_COLORS[template.tint];
  return (
    <PressableScale onPress={onPress} to={0.96} style={StyleSheet.flatten([styles.card, active && styles.cardActive])} accessibilityLabel={template.name}>
      <View style={[styles.iconTile, { backgroundColor: soft }]}>
        <Feather name={template.icon} size={16} color={color} />
      </View>
      <View style={styles.texts}>
        <Text style={styles.name} numberOfLines={1}>
          {template.name}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {formatDuration(template.durationMinutes)} · {formatEuro(template.price)}
        </Text>
      </View>
      {active ? (
        // Overlaid, not inline — so the checkmark never squeezes the price text.
        <View style={styles.check}>
          <Feather name="check" size={11} color={Palette.white} />
        </View>
      ) : null}
    </PressableScale>
  );
}

export function TemplatePicker({ selectedId, onSelect, onSelectCustom }: Props) {
  const customActive = selectedId === 'custom';
  return (
    <View>
      <View style={styles.grid}>
        {INTERVENTION_TEMPLATES.map((template) => (
          <View key={template.id} style={styles.cell}>
            <TemplateCard template={template} active={selectedId === template.id} onPress={() => onSelect(template)} />
          </View>
        ))}
      </View>

      {/* A real secondary action, not another grid tile — clearly opt-in. */}
      <PressableScale
        onPress={onSelectCustom}
        to={0.98}
        style={StyleSheet.flatten([styles.customRow, customActive && styles.customRowActive])}
        accessibilityLabel="Intervention personnalisée">
        <View style={[styles.iconTile, { backgroundColor: Palette.cardMuted }]}>
          <Feather name="edit-3" size={15} color={Palette.textSecondary} />
        </View>
        <View style={styles.texts}>
          <Text style={styles.customTitle}>Personnalisé</Text>
          <Text style={styles.meta} numberOfLines={1}>
            Créer une intervention sans modèle
          </Text>
        </View>
        <Feather name="chevron-right" size={17} color={Palette.textTertiary} />
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cell: {
    width: '48.4%',
    flexGrow: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Palette.card,
    borderRadius: Radius.tile,
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderWidth: 1.5,
    borderColor: Palette.border,
    position: 'relative',
  },
  cardActive: {
    borderColor: Palette.blue,
    backgroundColor: Palette.blueSoft,
  },
  iconTile: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  texts: {
    flex: 1,
    paddingRight: 16,
  },
  name: {
    fontSize: 12.5,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  meta: {
    fontSize: 11,
    fontWeight: '500',
    color: Palette.textTertiary,
    marginTop: 1,
  },
  check: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Palette.blue,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  customRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
    backgroundColor: Palette.card,
    borderRadius: Radius.tile,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  customRowActive: {
    borderColor: Palette.blue,
    borderWidth: 1.5,
    backgroundColor: Palette.blueSoft,
  },
  customTitle: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
});
