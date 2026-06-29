import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { TravelLeg } from './types';

type Props = {
  travel: TravelLeg;
};

export function TravelCard({ travel }: Props) {
  const kmLabel = travel.km.toFixed(1).replace('.', ',');

  return (
    <View style={styles.row}>
      {/* left spacer to align with timeline */}
      <View style={styles.timespacer} />

      <View style={styles.capsule}>
        <View style={styles.carBubble}>
          <Feather name="truck" size={13} color={Palette.textSecondary} />
        </View>
        <Text style={styles.label}>
          {travel.minutes} min • {kmLabel} km
        </Text>
      </View>

      <View style={styles.navBtn}>
        <Feather name="navigation" size={14} color={Palette.blue} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Spacing.screen,
    paddingRight: Spacing.screen,
    marginVertical: 8,
  },
  timespacer: {
    width: 54, // aligns with time column width in Timeline
  },
  capsule: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.card,
    borderRadius: Radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  carBubble: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Palette.screen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: FontSize.small,
    fontWeight: '500',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
  },
  navBtn: {
    marginLeft: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Palette.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
