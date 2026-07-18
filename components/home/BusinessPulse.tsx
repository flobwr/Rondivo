import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PressableScale } from '@/components/ui/PressableScale';
import { useTheme } from '@/contexts/theme';
import { formatAmount } from '@/data/documents/date-utils';
import type { DevisSummary } from '@/services/documents/devis';
import type { FactureSummary } from '@/services/documents/factures';
import { getElevation, Numeric, Radius, Type, type PaletteShape } from '@/theme';

/**
 * The business pulse — money, as two quiet tiles instead of a paragraph.
 * Each tile is one figure in large tabular ink over a small-caps label; the
 * status line beneath only takes on colour when something actually needs a
 * relaunch or a reminder. Tap-through to Factures / Devis.
 */
export function BusinessPulse({
  factures,
  devis,
}: {
  factures: FactureSummary;
  devis: DevisSummary;
}) {
  const router = useRouter();
  const { palette, scheme, statusInk } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const elevation = getElevation(scheme);

  const overdue = factures.overdueCount;
  const relaunch = devis.toRelaunchCount;

  return (
    <View style={styles.row}>
      <PressableScale
        to={0.97}
        style={[styles.tile, elevation.card]}
        onPress={() => router.push('/factures')}
        accessibilityLabel={`À encaisser, ${formatAmount(factures.toCollect)}${
          overdue > 0 ? `, ${overdue} facture${overdue > 1 ? 's' : ''} en retard` : ''
        }`}>
        <Text style={styles.eyebrow}>À ENCAISSER</Text>
        <Text style={[styles.figure, Numeric]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
          {formatAmount(factures.toCollect)}
        </Text>
        {overdue > 0 ? (
          <View style={styles.statusRow}>
            <View style={[styles.dot, { backgroundColor: palette.red }]} />
            <Text style={[styles.status, { color: statusInk.red }]} numberOfLines={1}>
              {overdue} en retard
            </Text>
          </View>
        ) : (
          <Text style={styles.statusQuiet} numberOfLines={1}>
            Tout est à jour
          </Text>
        )}
      </PressableScale>

      <PressableScale
        to={0.97}
        style={[styles.tile, elevation.card]}
        onPress={() => router.push('/devis')}
        accessibilityLabel={`Devis en cours, ${formatAmount(devis.potentialAmount)}${
          relaunch > 0 ? `, ${relaunch} à relancer` : ''
        }`}>
        <Text style={styles.eyebrow}>DEVIS EN COURS</Text>
        <Text style={[styles.figure, Numeric]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
          {formatAmount(devis.potentialAmount)}
        </Text>
        {relaunch > 0 ? (
          <View style={styles.statusRow}>
            <View style={[styles.dot, { backgroundColor: palette.orange }]} />
            <Text style={[styles.status, { color: statusInk.orange }]} numberOfLines={1}>
              {relaunch} à relancer
            </Text>
          </View>
        ) : (
          <Text style={styles.statusQuiet} numberOfLines={1}>
            Rien à relancer
          </Text>
        )}
      </PressableScale>
    </View>
  );
}

function createStyles(palette: PaletteShape) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      gap: 10,
    },
    tile: {
      flex: 1,
      backgroundColor: palette.card,
      borderRadius: Radius.card,
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
    eyebrow: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1.1,
      color: palette.textTertiary,
    },
    figure: {
      fontSize: 22,
      lineHeight: 28,
      fontWeight: '800',
      letterSpacing: -0.5,
      color: palette.textPrimary,
      marginTop: 6,
    },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      marginTop: 4,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    status: {
      ...Type.footnote,
      fontWeight: '600',
      flexShrink: 1,
    },
    statusQuiet: {
      ...Type.footnote,
      fontWeight: '500',
      color: palette.textTertiary,
      marginTop: 4,
    },
  });
}
