import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Palette } from '@/theme';
import { PressableScale, SectionCard } from '@/components/documents/shared/primitives';
import { ChecklistItem } from '@/data/documents/rapports';

export function ChecklistCard({
  items,
  onToggle,
}: {
  items: ChecklistItem[];
  onToggle: (id: string) => void;
}) {
  const done = items.filter((i) => i.done).length;

  return (
    <SectionCard icon="check-square" title={`Checklist (${done}/${items.length})`}>
      <View>
        {items.map((item, index) => (
          <PressableScale
            key={item.id}
            onPress={() => onToggle(item.id)}
            to={0.99}
            style={[styles.row, index > 0 ? styles.rowBorder : null]}
            accessibilityLabel={item.label}>
            <View style={[styles.checkbox, item.done ? styles.checkboxDone : null]}>
              {item.done ? <Feather name="check" size={13} color={Palette.white} /> : null}
            </View>
            <Text style={[styles.label, item.done ? styles.labelDone : null]}>{item.label}</Text>
          </PressableScale>
        ))}
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
  },
  rowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Palette.border,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkboxDone: {
    backgroundColor: Palette.green,
    borderColor: Palette.green,
  },
  label: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '500',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
  },
  labelDone: {
    color: Palette.textTertiary,
    textDecorationLine: 'line-through',
  },
});
