import { Feather } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated as RNAnimated, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Reanimated, { LinearTransition, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { formatAmount } from '@/data/documents/date-utils';
import { FeatherIconName } from '../types';
import { PressableScale } from './primitives';

export type DraftLine = { id: string; label: string; quantity: string; unitPrice: string };

export const VAT_PRESETS = [0, 5.5, 10, 20];

const QUICK_ADD: { label: string; icon: FeatherIconName }[] = [
  { label: 'Main d’œuvre', icon: 'tool' },
  { label: 'Fournitures', icon: 'package' },
  { label: 'Déplacement', icon: 'truck' },
  { label: 'Autre', icon: 'plus-circle' },
];

// Only used to translate a vertical drag distance into "how many rows did
// this move" — doesn't need to match the real rendered height pixel-perfect.
const ROW_HEIGHT = 100;

// Kept deliberately understated — a native-iOS/Notion-style lift, not a
// showy pop: a few px of lift, a hair of extra scale, quick to engage and
// quick to settle back down.
const LIFT_PX = -6;
const ACTIVE_SCALE = 1.02;
const ENGAGE_DURATION = 100;
const SETTLE_DURATION = 180;

let draftLineSeq = 0;

export function createDraftLine(label = ''): DraftLine {
  draftLineSeq += 1;
  return { id: `line-${Date.now()}-${draftLineSeq}`, label, quantity: '1', unitPrice: '' };
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
  index,
  onChange,
  onRemove,
  onDuplicate,
  removable,
  onReorder,
  isFirst,
  isLast,
}: {
  line: DraftLine;
  index: number;
  onChange: (patch: Partial<DraftLine>) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  removable: boolean;
  onReorder: (fromIndex: number, offsetRows: number) => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const amount = computeLineAmount(line);
  const translateY = useSharedValue(0);
  const lift = useSharedValue(0);
  const scale = useSharedValue(1);
  const isActive = useSharedValue(false);

  // The handle is both the only hit target and the only element this
  // gesture is attached to — what's drawn (a 32×32 rounded tile) is exactly
  // what responds to touch, on both platforms, with no hitSlop-based
  // expansion that could make the tappable area drift from the visible one.
  const panGesture = Gesture.Pan()
    .onStart(() => {
      isActive.value = true;
      lift.value = withTiming(LIFT_PX, { duration: ENGAGE_DURATION });
      scale.value = withTiming(ACTIVE_SCALE, { duration: ENGAGE_DURATION });
    })
    .onUpdate((event) => {
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      const offsetRows = Math.round(event.translationY / ROW_HEIGHT);
      runOnJS(onReorder)(index, offsetRows);
    })
    .onFinalize(() => {
      isActive.value = false;
      lift.value = withTiming(0, { duration: SETTLE_DURATION });
      scale.value = withTiming(1, { duration: SETTLE_DURATION });
      translateY.value = withTiming(0, { duration: SETTLE_DURATION });
    });

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value + lift.value }, { scale: scale.value }],
    zIndex: isActive.value ? 10 : 0,
    elevation: isActive.value ? 5 : 3,
    shadowOpacity: isActive.value ? 0.14 : 0.07,
  }));

  return (
    <Reanimated.View style={[styles.lineCard, cardAnimatedStyle]} layout={LinearTransition.duration(220)}>
      <View style={styles.lineTopRow}>
        <GestureDetector gesture={panGesture}>
          <Reanimated.View style={styles.dragHandle} accessibilityLabel="Réordonner la ligne (glisser)">
            <Feather name="menu" size={16} color={Palette.textTertiary} />
          </Reanimated.View>
        </GestureDetector>
        {/* Drag needs a precise pan gesture — hard with gloves. These give the
            same reorder a plain tap, at a real 44px target each. */}
        <View style={styles.reorderButtons}>
          <Pressable
            onPress={() => onReorder(index, -1)}
            disabled={isFirst}
            hitSlop={{ top: 6, bottom: 2, left: 10, right: 10 }}
            style={[styles.reorderButton, isFirst && styles.reorderButtonDisabled]}
            accessibilityRole="button"
            accessibilityLabel="Monter la ligne">
            <Feather name="chevron-up" size={16} color={isFirst ? Palette.border : Palette.textSecondary} />
          </Pressable>
          <Pressable
            onPress={() => onReorder(index, 1)}
            disabled={isLast}
            hitSlop={{ top: 2, bottom: 6, left: 10, right: 10 }}
            style={[styles.reorderButton, isLast && styles.reorderButtonDisabled]}
            accessibilityRole="button"
            accessibilityLabel="Descendre la ligne">
            <Feather name="chevron-down" size={16} color={isLast ? Palette.border : Palette.textSecondary} />
          </Pressable>
        </View>
        <TextInput
          value={line.label}
          onChangeText={(label) => onChange({ label })}
          placeholder="Description (ex. Main d’œuvre)"
          placeholderTextColor={Palette.textTertiary}
          style={styles.labelInput}
        />
        <Pressable onPress={onDuplicate} hitSlop={8} accessibilityLabel="Dupliquer la ligne">
          <Feather name="copy" size={15} color={Palette.textTertiary} />
        </Pressable>
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
    </Reanimated.View>
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
  const pulse = useRef(new RNAnimated.Value(1)).current;
  const previousTotal = useRef(total);

  useEffect(() => {
    if (previousTotal.current !== total) {
      previousTotal.current = total;
      pulse.setValue(1.05);
      RNAnimated.spring(pulse, { toValue: 1, useNativeDriver: true, friction: 5, tension: 200 }).start();
    }
  }, [total, pulse]);

  const updateLine = (id: string, patch: Partial<DraftLine>) => {
    onChange(lines.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };

  const removeLine = (id: string) => onChange(lines.filter((l) => l.id !== id));

  const duplicateLine = (id: string) => {
    const index = lines.findIndex((l) => l.id === id);
    if (index === -1) return;
    const copy = { ...lines[index], id: createDraftLine().id };
    onChange([...lines.slice(0, index + 1), copy, ...lines.slice(index + 1)]);
  };

  const addQuickLine = (label: string) => onChange([...lines, createDraftLine(label)]);

  const handleReorder = (fromIndex: number, offsetRows: number) => {
    const toIndex = Math.min(Math.max(fromIndex + offsetRows, 0), lines.length - 1);
    if (toIndex === fromIndex) return;
    const next = [...lines];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    onChange(next);
  };

  return (
    <View>
      <View style={{ gap: Spacing.sm }}>
        {lines.map((line, index) => (
          <LineRow
            key={line.id}
            line={line}
            index={index}
            onChange={(patch) => updateLine(line.id, patch)}
            onRemove={() => removeLine(line.id)}
            onDuplicate={() => duplicateLine(line.id)}
            removable={lines.length > 1}
            onReorder={handleReorder}
            isFirst={index === 0}
            isLast={index === lines.length - 1}
          />
        ))}
      </View>

      <View style={styles.quickAddRow}>
        {QUICK_ADD.map((item) => (
          <PressableScale
            key={item.label}
            onPress={() => addQuickLine(item.label)}
            to={0.96}
            style={styles.quickAddPill}
            accessibilityLabel={`Ajouter une ligne ${item.label}`}>
            <Feather name={item.icon} size={13} color={Palette.blue} />
            <Text style={styles.quickAddText}>{item.label}</Text>
          </PressableScale>
        ))}
      </View>

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
          <RNAnimated.Text style={[styles.summaryTotalValue, { transform: [{ scale: pulse }] }]}>
            {formatAmount(total)}
          </RNAnimated.Text>
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
  dragHandle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.cardMuted,
  },
  reorderButtons: {
    gap: 1,
  },
  reorderButton: {
    width: 24,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reorderButtonDisabled: {
    opacity: 0.5,
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
    width: 38,
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
    minWidth: 56,
    textAlign: 'right',
  },
  quickAddRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: Spacing.sm,
  },
  quickAddPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: Radius.pill,
    backgroundColor: Palette.blueSoft,
  },
  quickAddText: {
    fontSize: 12.5,
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
