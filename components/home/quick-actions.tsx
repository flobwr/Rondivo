import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';

type Action = {
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  color: string;
  background: string;
};

const ACTIONS: Action[] = [
  { label: 'Devis', icon: 'file-text', color: Palette.blue, background: Palette.blueSoft },
  { label: 'Factures', icon: 'file-text', color: Palette.orange, background: Palette.orangeSoft },
  { label: 'Notes', icon: 'message-square', color: Palette.purple, background: Palette.purpleSoft },
  { label: 'Tâches', icon: 'check', color: Palette.green, background: Palette.greenSoft },
];

function ActionCard({ label, icon, color, background }: Action) {
  return (
    <Pressable style={styles.card}>
      <View style={[styles.iconTile, { backgroundColor: background }]}>
        <Feather name={icon} size={20} color={color} />
      </View>
      <Text
        style={styles.label}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}>
        {label}
      </Text>
    </Pressable>
  );
}

export function QuickActions() {
  return (
    <View style={styles.row}>
      {ACTIONS.map((action) => (
        <ActionCard key={action.label} {...action} />
      ))}
    </View>
  );
}

const TILE = 42;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  card: {
    flex: 1,
    backgroundColor: Palette.cardMuted,
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: Palette.border,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 98,
  },
  iconTile: {
    width: TILE,
    height: TILE,
    borderRadius: Radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: FontSize.cardLabel,
    fontWeight: '600',
    color: Palette.textPrimary,
    marginTop: Spacing.sm,
    textAlign: 'center',
    alignSelf: 'stretch',
  },
});
