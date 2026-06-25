import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';

export function HeroCard() {
  return (
    <LinearGradient
      colors={[Palette.gradientStart, Palette.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}>
      <Text style={styles.eyebrow}>PROCHAINE INTERVENTION</Text>
      <Text style={styles.client}>Martin Dupont</Text>

      <View style={styles.metaRow}>
        <Ionicons name="time-outline" size={18} color={Palette.white} />
        <Text style={styles.metaText}>10:30 {'•'} Entretien chaudière</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <View style={styles.footerColumn}>
            <Text style={styles.footerLabel}>DÉPART CONSEILLÉ</Text>
            <Text
              style={styles.footerValueLarge}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.9}>
              10:12
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.footerColumnGrow}>
            <Text style={styles.footerLabel}>TRAJET</Text>
            <Text
              style={styles.footerValue}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.85}>
              18 min • 7,4 km
            </Text>
            <Text
              style={styles.footerSub}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.85}>
              via Av. Félix Faure
            </Text>
          </View>
        </View>

        <Pressable style={styles.gpsButton} hitSlop={8}>
          <Feather name="navigation" size={24} color={Palette.blue} />
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const GPS = 54;

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.hero,
    padding: Spacing.cardPadding,
  },
  eyebrow: {
    color: Palette.white,
    opacity: 0.85,
    fontSize: FontSize.small,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  client: {
    color: Palette.white,
    fontSize: FontSize.hero,
    fontWeight: '800',
    marginTop: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  metaText: {
    color: Palette.white,
    fontSize: FontSize.body,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 28,
  },
  footerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  footerColumn: {
    flexShrink: 1,
    minWidth: 72,
  },
  footerColumnGrow: {
    flexShrink: 0,
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: 'rgba(255,255,255,0.35)',
    marginHorizontal: 9,
  },
  footerLabel: {
    color: Palette.white,
    opacity: 0.85,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  footerValueLarge: {
    color: Palette.white,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 6,
  },
  footerValue: {
    color: Palette.white,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 6,
  },
  footerSub: {
    color: Palette.white,
    opacity: 0.85,
    fontSize: FontSize.tiny,
    marginTop: 4,
  },
  gpsButton: {
    width: GPS,
    height: GPS,
    borderRadius: GPS / 2,
    backgroundColor: Palette.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.md,
  },
});
