import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius } from '@/constants/design';
import { type Equipment } from '@/data/client-details';
import { PressableScale, SectionCard, TintIcon } from './primitives';

type Props = {
  equipment: Equipment[];
  onOpenEquipment: (equipment: Equipment) => void;
  onSeeAll: () => void;
};

function EquipmentRow({ item, onPress }: { item: Equipment; onPress: () => void }) {
  return (
    <PressableScale onPress={onPress} to={0.98} style={styles.row} accessibilityLabel={item.name}>
      <TintIcon icon={item.icon} tint={item.tint} size={40} iconSize={18} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        {item.installed ? <Text style={styles.installed}>{item.installed}</Text> : null}
        {item.warranty ? (
          <View style={styles.warrantyPill}>
            <Feather name="shield" size={11} color={Palette.green} />
            <Text style={styles.warrantyText}>{item.warranty}</Text>
          </View>
        ) : null}
      </View>
      <Feather name="chevron-right" size={18} color={Palette.textTertiary} />
    </PressableScale>
  );
}

export function EquipmentCard({ equipment, onOpenEquipment, onSeeAll }: Props) {
  if (equipment.length === 0) {
    return (
      <SectionCard icon="tool" iconTint="blue" title="Équipements installés">
        <Text style={styles.empty}>Aucun équipement enregistré pour ce client.</Text>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      icon="tool"
      iconTint="blue"
      title="Équipements installés"
      footerLabel="Voir tous les équipements"
      onFooterPress={onSeeAll}>
      {equipment.slice(0, 3).map((item, index) => (
        <View key={item.id}>
          {index > 0 ? <View style={styles.separator} /> : null}
          <EquipmentRow item={item} onPress={() => onOpenEquipment(item)} />
        </View>
      ))}
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 11,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: FontSize.label,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  installed: {
    fontSize: FontSize.small,
    fontWeight: '500',
    color: Palette.textSecondary,
    marginTop: 3,
  },
  warrantyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: Palette.greenSoft,
    borderRadius: Radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 7,
  },
  warrantyText: {
    fontSize: 11,
    fontWeight: '600',
    color: Palette.green,
    letterSpacing: -0.1,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.border,
    marginVertical: 2,
  },
  empty: {
    fontSize: FontSize.small,
    fontWeight: '500',
    color: Palette.textSecondary,
  },
});
