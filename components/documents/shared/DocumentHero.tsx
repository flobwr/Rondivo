import { StyleSheet, Text, View } from 'react-native';

import { createThemedStyles, cardShadow, Palette, Radius, Spacing } from '@/theme';
import { PressableScale, StatusPill } from './primitives';

export type HeroDateBlock = { label: string; value: string };

// The shared hero card for a "document" detail screen (Devis, Contrat…):
// client name + status, a big headline amount, and up to two date blocks.
// Facture has its own richer variant (FactureHero) since it also carries a
// payment-method line, but the shape is intentionally identical so every
// document type opens on the same visual beat.
export function DocumentHero({
  clientName,
  onOpenClient,
  title,
  amount,
  statusLabel,
  statusColor,
  statusSoft,
  dates,
}: {
  clientName: string;
  onOpenClient: () => void;
  /** Shown instead of `amount` for documents with no monetary value (e.g. a contract). */
  title?: string;
  amount?: string;
  statusLabel: string;
  statusColor: string;
  statusSoft: string;
  dates: HeroDateBlock[];
}) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <PressableScale onPress={onOpenClient} to={0.98} accessibilityLabel={`Ouvrir la fiche de ${clientName}`}>
          <Text style={styles.client} numberOfLines={1}>
            {clientName}
          </Text>
        </PressableScale>
        <StatusPill label={statusLabel} color={statusColor} soft={statusSoft} />
      </View>

      {amount ? (
        <Text style={styles.amount}>{amount}</Text>
      ) : title ? (
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
      ) : null}

      {dates.length > 0 ? (
        <View style={styles.datesRow}>
          {dates.map((block, index) => (
            <View key={block.label} style={styles.dateBlockWrap}>
              {index > 0 ? <View style={styles.dateDivider} /> : null}
              <View style={styles.dateBlock}>
                <Text style={styles.dateLabel}>{block.label}</Text>
                <Text style={styles.dateValue}>{block.value}</Text>
              </View>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = createThemedStyles(() => StyleSheet.create({
  card: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    padding: Spacing.lg + 2,
    ...cardShadow,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  client: {
    fontSize: 17,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
    maxWidth: 200,
  },
  amount: {
    fontSize: 36,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -1,
    marginTop: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.4,
    marginTop: 12,
  },
  datesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Palette.border,
  },
  dateBlockWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dateBlock: {
    flex: 1,
  },
  dateDivider: {
    width: StyleSheet.hairlineWidth,
    height: 28,
    backgroundColor: Palette.border,
    marginHorizontal: Spacing.md,
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Palette.textTertiary,
    letterSpacing: -0.1,
  },
  dateValue: {
    fontSize: 13.5,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
    marginTop: 2,
  },
}));
