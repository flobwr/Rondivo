import { Feather } from '@expo/vector-icons';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { IconTile, PressableScale } from '@/components/documents/shared/primitives';
import { FontSize, Palette, Radius, Spacing, type PaletteShape } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { PLUS_ITEMS, PlusItemId } from './registry';

function PlusRow({
  id,
  subtitle,
  onPress,
  styles,
  palette,
}: {
  id: PlusItemId;
  subtitle?: string;
  onPress: () => void;
  styles: ReturnType<typeof createStyles>;
  palette: PaletteShape;
}) {
  const item = PLUS_ITEMS[id];

  return (
    <PressableScale onPress={onPress} to={0.975} style={styles.row} accessibilityLabel={item.title}>
      <IconTile icon={item.icon} color={palette.blue} soft={palette.blueSoft} size={32} iconSize={15} radius={11} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {item.title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1} ellipsizeMode="tail">
            {subtitle}
          </Text>
        ) : null}
      </View>
      <Feather name="chevron-right" size={16} color={palette.textTertiary} style={styles.chevron} />
    </PressableScale>
  );
}

export function PlusSectionCard({
  label,
  items,
  subtitles,
  onItemPress,
  palette = Palette,
}: {
  label: string;
  items: PlusItemId[];
  /** Live data overriding each item's static registry subtitle — e.g. real headcounts. */
  subtitles?: Partial<Record<PlusItemId, string>>;
  onItemPress: (id: PlusItemId) => void;
  /** Defaults to the static light palette — pass `useTheme().palette` from screens that opted into dark mode. */
  palette?: PaletteShape;
}) {
  const styles = useMemo(() => createStyles(palette), [palette]);
  return (
    <View>
      <Text style={styles.sectionLabel}>{label}</Text>
      <View style={styles.card}>
        {items.map((id, index) => (
          <View key={id}>
            {index > 0 ? <View style={styles.separator} /> : null}
            <PlusRow id={id} subtitle={subtitles?.[id] ?? PLUS_ITEMS[id].subtitle} onPress={() => onItemPress(id)} styles={styles} palette={palette} />
          </View>
        ))}
      </View>
    </View>
  );
}

function createStyles(Palette: PaletteShape) {
  return StyleSheet.create({
    sectionLabel: {
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 0.6,
      color: Palette.textTertiary,
      textTransform: 'uppercase',
      marginBottom: 10,
      marginLeft: 3,
    },
    card: {
      backgroundColor: Palette.card,
      borderRadius: Radius.card,
      paddingHorizontal: Spacing.lg,
      ...cardShadow,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      gap: Spacing.sm + 2,
    },
    content: {
      flex: 1,
    },
    title: {
      fontSize: FontSize.label,
      fontWeight: '600',
      color: Palette.textPrimary,
      letterSpacing: -0.2,
    },
    subtitle: {
      fontSize: 12,
      fontWeight: '400',
      color: Palette.textTertiary,
      letterSpacing: -0.1,
      marginTop: 1,
      opacity: 0.82,
    },
    chevron: {
      opacity: 0.7,
    },
    separator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: Palette.separator,
    },
  });
}
