import { Feather } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Spacing } from '@/constants/design';
import { SectionCard } from './SectionCard';
import { Equipment } from './types';

type Props = {
  equipment: Equipment[];
};

export function EquipmentCard({ equipment }: Props) {
  return (
    <SectionCard icon="tool" iconColor={Palette.orange} iconBackground={Palette.orangeSoft} title="Équipements">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}>
        {equipment.map((item) => (
          <View key={item.id} style={styles.tile}>
            <View style={styles.iconTile}>
              <Feather name={item.icon} size={20} color={Palette.orange} />
            </View>
            <Text style={styles.name} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.detail} numberOfLines={2}>
              {item.detail}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SectionCard>
  );
}

const TILE_WIDTH = 156;

const styles = StyleSheet.create({
  row: {
    gap: 10,
  },
  tile: {
    width: TILE_WIDTH,
    backgroundColor: Palette.cardMuted,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
    padding: Spacing.md,
  },
  iconTile: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: Palette.orangeSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginTop: 10,
    letterSpacing: -0.1,
    lineHeight: 17,
  },
  detail: {
    fontSize: 11,
    fontWeight: '400',
    color: Palette.textTertiary,
    marginTop: 4,
    letterSpacing: 0,
    lineHeight: 14,
  },
});
