import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette } from '@/constants/design';
import { SectionCard } from './SectionCard';
import { Equipment } from './types';

type Props = {
  equipment: Equipment[];
};

export function EquipmentCard({ equipment }: Props) {
  return (
    <SectionCard icon="tool" iconColor={Palette.blue} iconBackground={Palette.blueSoft} title="Équipements">
      <View>
        {equipment.map((item, index) => (
          <View key={item.id}>
            {index > 0 ? <View style={styles.separator} /> : null}
            <View style={styles.row}>
              <View style={styles.iconTile}>
                <Feather name={item.icon} size={16} color={Palette.textSecondary} />
              </View>
              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.detail} numberOfLines={2}>
                  {item.detail}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  iconTile: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: Palette.cardMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: FontSize.label,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
  },
  detail: {
    fontSize: 12,
    fontWeight: '400',
    color: Palette.textTertiary,
    marginTop: 2,
  },
});
