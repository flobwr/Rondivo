import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Spacing } from '@/constants/design';
import { SectionCard } from './SectionCard';

type Props = {
  startTime: string;
  endTime: string;
  duration: string;
};

export function TimingCard({ startTime, endTime, duration }: Props) {
  return (
    <SectionCard icon="clock" iconColor={Palette.blue} iconBackground={Palette.blueSoft} title="Timing">
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Début prévu</Text>
          <Text style={styles.value}>{startTime}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.column}>
          <Text style={styles.label}>Fin prévue</Text>
          <Text style={styles.value}>{endTime}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.column}>
          <Text style={styles.label}>Durée estimée</Text>
          <Text style={styles.value}>{duration}</Text>
        </View>
      </View>

      <View style={styles.footnote}>
        <Feather name="info" size={12} color={Palette.textTertiary} />
        <Text style={styles.footnoteText}>Le temps réel s&rsquo;affichera ici une fois l&rsquo;intervention terminée.</Text>
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    flex: 1,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    backgroundColor: Palette.border,
    marginHorizontal: 12,
  },
  label: {
    fontSize: FontSize.tiny,
    fontWeight: '600',
    color: Palette.textTertiary,
    letterSpacing: 0.2,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginTop: 5,
    letterSpacing: -0.4,
  },
  footnote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: Spacing.md,
  },
  footnoteText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '400',
    color: Palette.textTertiary,
    lineHeight: 15,
  },
});
