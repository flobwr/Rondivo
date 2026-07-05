import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, ViewStyle } from 'react-native';

// Soft, premium-feeling gradient pairs — cycled deterministically per seed so
// the same photo always renders the same placeholder, with no network call.
const GRADIENTS: [string, string][] = [
  ['#8EC5FC', '#E0C3FC'],
  ['#F6D365', '#FDA085'],
  ['#A1C4FD', '#C2E9FB'],
  ['#84FAB0', '#8FD3F4'],
  ['#FCCB90', '#D57EEB'],
  ['#D4FC79', '#96E6A1'],
];

function hash(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h;
}

type Props = {
  seed: string;
  style?: ViewStyle;
  iconSize?: number;
};

export function PhotoPlaceholder({ seed, style, iconSize = 16 }: Props) {
  const [start, end] = GRADIENTS[hash(seed) % GRADIENTS.length];
  return (
    <LinearGradient
      colors={[start, end]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.fill, style]}>
      <View style={styles.iconWrap}>
        <Feather name="image" size={iconSize} color="rgba(255,255,255,0.7)" />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    opacity: 0.9,
  },
});
