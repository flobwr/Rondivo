import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { formatEuro } from '@/constants/format';
import { cardShadow } from '@/constants/shadow';
import { SectionLabel } from './SectionLabel';

export type LineItem = {
  id: string;
  description: string;
  qty: string;
  unitPrice: string;
};

export function computeLineTotal(line: LineItem): number {
  const qty = parseFloat(line.qty.replace(',', '.')) || 0;
  const price = parseFloat(line.unitPrice.replace(',', '.')) || 0;
  return qty * price;
}

export function computeLinesTotal(lines: LineItem[]): number {
  return lines.reduce((sum, line) => sum + computeLineTotal(line), 0);
}

export function makeEmptyLine(): LineItem {
  return { id: `line-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, description: '', qty: '1', unitPrice: '' };
}

type Props = {
  label: string;
  lines: LineItem[];
  onChange: (lines: LineItem[]) => void;
};

export function LineItemsEditor({ label, lines, onChange }: Props) {
  const updateLine = (id: string, patch: Partial<LineItem>) => {
    onChange(lines.map((line) => (line.id === id ? { ...line, ...patch } : line)));
  };

  const removeLine = (id: string) => {
    if (lines.length <= 1) return;
    onChange(lines.filter((line) => line.id !== id));
  };

  const addLine = () => onChange([...lines, makeEmptyLine()]);

  return (
    <View>
      <SectionLabel>{label}</SectionLabel>

      <View style={styles.card}>
        {lines.map((line, index) => (
          <View key={line.id}>
            {index > 0 ? <View style={styles.separator} /> : null}
            <View style={styles.lineBlock}>
              <View style={styles.descRow}>
                <TextInput
                  value={line.description}
                  onChangeText={(t) => updateLine(line.id, { description: t })}
                  placeholder={`Description de la ligne ${index + 1}`}
                  placeholderTextColor={Palette.textTertiary}
                  style={styles.descInput}
                />
                <Pressable
                  onPress={() => removeLine(line.id)}
                  hitSlop={8}
                  disabled={lines.length <= 1}>
                  <Feather
                    name="trash-2"
                    size={17}
                    color={lines.length <= 1 ? '#D5D9E0' : Palette.textTertiary}
                  />
                </Pressable>
              </View>

              <View style={styles.numbersRow}>
                <View style={styles.qtyField}>
                  <Text style={styles.fieldLabel}>Qté</Text>
                  <TextInput
                    value={line.qty}
                    onChangeText={(t) => updateLine(line.id, { qty: t })}
                    keyboardType="numeric"
                    style={styles.numInput}
                  />
                </View>
                <View style={styles.priceField}>
                  <Text style={styles.fieldLabel}>Prix unitaire</Text>
                  <TextInput
                    value={line.unitPrice}
                    onChangeText={(t) => updateLine(line.id, { unitPrice: t })}
                    keyboardType="decimal-pad"
                    placeholder="0"
                    placeholderTextColor={Palette.textTertiary}
                    style={styles.numInput}
                  />
                </View>
                <View style={styles.totalField}>
                  <Text style={styles.fieldLabel}>Total</Text>
                  <Text style={styles.totalValue} numberOfLines={1} adjustsFontSizeToFit>
                    {formatEuro(computeLineTotal(line))}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>

      <Pressable style={styles.addButton} onPress={addLine}>
        <Feather name="plus" size={16} color={Palette.blue} />
        <Text style={styles.addLabel}>Ajouter une ligne</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.lg,
    ...cardShadow,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.border,
  },
  lineBlock: {
    paddingVertical: Spacing.md,
    gap: 10,
  },
  descRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  descInput: {
    flex: 1,
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
    padding: 0,
  },
  numbersRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  qtyField: {
    width: 56,
  },
  priceField: {
    flex: 1,
  },
  totalField: {
    flex: 1,
    alignItems: 'flex-end',
  },
  fieldLabel: {
    fontSize: FontSize.tiny,
    color: Palette.textTertiary,
    marginBottom: 3,
  },
  numInput: {
    fontSize: FontSize.label,
    fontWeight: '600',
    color: Palette.textPrimary,
    padding: 0,
  },
  totalValue: {
    fontSize: FontSize.label,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: Radius.tile,
    borderWidth: 1.5,
    borderColor: Palette.blueSoft,
    paddingVertical: 13,
    marginTop: Spacing.sm,
  },
  addLabel: {
    fontSize: FontSize.label,
    fontWeight: '700',
    color: Palette.blue,
  },
});
