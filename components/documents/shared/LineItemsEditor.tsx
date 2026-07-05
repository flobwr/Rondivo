import { Feather } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { formatAmount } from '@/data/documents/date-utils';
import { PressableScale } from './primitives';

export type DraftLine = { id: string; label: string; quantity: string; unitPrice: string };

export const VAT_PRESETS = [0, 5.5, 10, 20];

let draftLineSeq = 0;

export function createDraftLine(): DraftLine {
  draftLineSeq += 1;
  return { id: `line-${Date.now()}-${draftLineSeq}`, label: '', quantity: '1', unitPrice: '' };
}

function parseNumber(value: string): number {
  const n = parseFloat(value.replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

export function computeLineAmount(line: DraftLine): number {
  return parseNumber(line.quantity) * parseNumber(line.unitPrice);
}

export function computeTotals(lines: DraftLine[], vatRate: number): { subtotal: number; vat: number; total: number } {
  const subtotal = lines.reduce((sum, l) => sum + computeLineAmount(l), 0);
  const vat = subtotal * (vatRate / 100);
  return { subtotal, vat, total: subtotal + vat };
}

function LineRow({
  line,
  onChange,
  onRemove,
  removable,
}: {
  line: DraftLine;
  onChange: (patch: Partial<DraftLine>) => void;
  onRemove: () => void;
  removable: boolean;
}) {
  const amount = computeLineAmount(line);

  return (
    <View style={styles.lineCard}>
      <View style={styles.lineTopRow}>
        <TextInput
          value={line.label}
          onChangeText={(label) => onChange({ label })}
          placeholder="Description (ex. Main d’œuvre)"
          placeholderTextColor={Palette.textTertiary}
          style={styles.labelInput}
        />
        {removable ? (
          <Pressable onPress={onRemove} hitSlop={8} accessibilityLabel="Supprimer la ligne">
            <Feather name="trash-2" size={16} color={Palette.textTertiary} />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.lineBottomRow}>
        <View style={styles.qtyField}>
          <TextInput
            value={line.quantity}
            onChangeText={(quantity) => onChange({ quantity })}
            keyboardType="decimal-pad"
            placeholder="1"
            placeholderTextColor={Palette.textTertiary}
            style={styles.smallInput}
          />
        </View>
        <Text style={styles.operator}>×</Text>
        <View style={styles.priceField}>
          <TextInput
            value={line.unitPrice}
            onChangeText={(unitPrice) => onChange({ unitPrice })}
            keyboardType="decimal-pad"
            placeholder="0 €/u"
            placeholderTextColor={Palette.textTertiary}
            style={styles.smallInput}
          />
        </View>
        <Text style={styles.operator}>=</Text>
        <Text style={styles.lineAmount} numberOfLines={1}>
          {formatAmount(amount)}
        </Text>
      </View>
    </View>
  );
}

export function LineItemsEditor({
  lines,
  onChange,
  vatRate,
  onVatRateChange,
}: {
  lines: DraftLine[];
  onChange: (lines: DraftLine[]) => void;
  vatRate: number;
  onVatRateChange: (rate: number) => void;
}) {
  const { subtotal, vat, total } = computeTotals(lines, vatRate);
  const pulse = useRef(new Animated.Value(1)).current;
  const previousTotal = useRef(total);

  useEffect(() => {
    if (previousTotal.current !== total) {
      previousTotal.current = total;
      pulse.setValue(1.04);
      Animated.spring(pulse, { toValue: 1, useNativeDriver: true, friction: 5, tension: 200 }).start();
    }
  }, [total, pulse]);

  const updateLine = (id: string, patch: Partial<DraftLine>) => {
    onChange(lines.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };

  const removeLine = (id: string) => onChange(lines.filter((l) => l.id !== id));

  const addLine = () => onChange([...lines, createDraftLine()]);

  return (
    <View>
      <View style={{ gap: Spacing.sm }}>
        {lines.map((line) => (
          <LineRow
            key={line.id}
            line={line}
            onChange={(patch) => updateLine(line.id, patch)}
            onRemove={() => removeLine(line.id)}
            removable={lines.length > 1}
          />
        ))}
      </View>

      <PressableScale onPress={addLine} to={0.98} style={styles.addRow} accessibilityLabel="Ajouter une ligne">
        <Feather name="plus" size={16} color={Palette.blue} />
        <Text style={styles.addRowText}>Ajouter une ligne</Text>
      </PressableScale>

      <View style={styles.vatRow}>
        <Text style={styles.vatLabel}>TVA</Text>
        <View style={styles.vatPills}>
          {VAT_PRESETS.map((rate) => {
            const active = rate === vatRate;
            return (
              <Pressable
                key={rate}
                onPress={() => onVatRateChange(rate)}
                style={[styles.vatPill, active ? styles.vatPillActive : null]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}>
                <Text style={[styles.vatPillText, active ? styles.vatPillTextActive : null]}>{rate}%</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Sous-total</Text>
          <Text style={styles.summaryValue}>{formatAmount(subtotal)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>TVA ({vatRate}%)</Text>
          <Text style={styles.summaryValue}>{formatAmount(vat)}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryTotalLabel}>Total</Text>
          <Animated.Text style={[styles.summaryTotalValue, { transform: [{ scale: pulse }] }]}>
            {formatAmount(total)}
          </Animated.Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  lineCard: {
    backgroundColor: Palette.card,
    borderRadius: Radius.tile,
    padding: Spacing.md,
    ...cardShadow,
  },
  lineTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  labelInput: {
    flex: 1,
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
    padding: 0,
  },
  lineBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Palette.border,
  },
  qtyField: {
    width: 44,
    backgroundColor: Palette.cardMuted,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  priceField: {
    flex: 1,
    backgroundColor: Palette.cardMuted,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  smallInput: {
    fontSize: FontSize.small,
    fontWeight: '600',
    color: Palette.textPrimary,
    padding: 0,
    textAlign: 'center',
  },
  operator: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.textTertiary,
  },
  lineAmount: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
    minWidth: 64,
    textAlign: 'right',
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: Spacing.sm,
    paddingVertical: 13,
    borderRadius: Radius.tile,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.blue,
    borderStyle: 'dashed',
  },
  addRowText: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Palette.blue,
    letterSpacing: -0.1,
  },
  vatRow: {
    marginTop: Spacing.section,
  },
  vatLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
    color: Palette.textTertiary,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginLeft: 2,
  },
  vatPills: {
    flexDirection: 'row',
    gap: 8,
  },
  vatPill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 11,
    borderRadius: Radius.tile,
    backgroundColor: Palette.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  vatPillActive: {
    backgroundColor: Palette.blueSoft,
    borderColor: Palette.blue,
  },
  vatPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
  },
  vatPillTextActive: {
    color: Palette.blue,
  },
  summaryCard: {
    marginTop: Spacing.md,
    backgroundColor: Palette.cardMuted,
    borderRadius: Radius.card,
    padding: Spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: FontSize.small,
    fontWeight: '500',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
  },
  summaryValue: {
    fontSize: FontSize.small,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
  },
  summaryDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.border,
    marginVertical: 6,
  },
  summaryTotalLabel: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  summaryTotalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: Palette.blue,
    letterSpacing: -0.4,
  },
});
