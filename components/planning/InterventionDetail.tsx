import { Feather } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { PressableScale } from '@/components/ui/PressableScale';
import { useTheme } from '@/contexts/theme';
import {
  getElevation,
  Numeric,
  PressScale,
  Radius,
  Size,
  Spacing,
  Type,
  type PaletteShape,
} from '@/theme';
import { getStatusMeta } from './status';
import type { Intervention } from './types';

type Props = {
  intervention: Intervention;
  /** Collapse the surface back onto the card in the list. */
  onClose: () => void;
  /** Hand off to the full record — the living surface closes first. */
  onOpenRecord: () => void;
};

type Line = {
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  value: string;
};

/**
 * What a Planning card becomes once it has grown.
 *
 * It is deliberately NOT the full intervention record: the record is a screen
 * you navigate to and come back from, this is the same card with room to
 * breathe. Everything in it continues something already on the card — the
 * time, the client, the job, the address — plus the actions the card could
 * not hold. Growing into an unrelated screen would be a page change wearing
 * an animation.
 *
 * Laid out at its final size from the first frame (the layer never resizes
 * it), so no word moves during the expansion: the surface uncovers this, it
 * does not reflow it.
 */
export function InterventionDetail({ intervention, onClose, onOpenRecord }: Props) {
  const { palette, resolvedTheme } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const elevation = getElevation(resolvedTheme);
  const insets = useSafeAreaInsets();
  const meta = getStatusMeta(palette)[intervention.status];

  const lines: Line[] = [
    { icon: 'clock', label: 'Créneau', value: `${intervention.start} – ${intervention.end}` },
    {
      icon: 'activity',
      label: 'Durée',
      value:
        intervention.durationMin >= 60
          ? `${Math.floor(intervention.durationMin / 60)} h${
              intervention.durationMin % 60 ? ` ${intervention.durationMin % 60}` : ''
            }`
          : `${intervention.durationMin} min`,
    },
    { icon: 'map-pin', label: 'Adresse', value: intervention.address },
  ];

  return (
    <View style={[styles.root, { paddingTop: insets.top + Spacing.md }]}>
      {/* The grab handle says "pull me" before the finger tries. */}
      <View style={styles.handle} />

      <View style={styles.bar}>
        <View style={[styles.status, { backgroundColor: meta.soft }]}>
          <Text style={[styles.statusLabel, { color: meta.color }]}>{meta.label}</Text>
        </View>
        <PressableScale
          onPress={onClose}
          to={PressScale.icon}
          accessibilityLabel="Fermer"
          style={[styles.close, elevation.whisper]}>
          <Feather name="x" size={18} color={palette.textSecondary} />
        </PressableScale>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + Spacing.section }]}>
        <Text style={[styles.time, Numeric]}>{intervention.start}</Text>
        <Text style={styles.client}>{intervention.client}</Text>
        <Text style={styles.type}>{intervention.type}</Text>

        <View style={styles.lines}>
          {lines.map((line) => (
            <View key={line.label} style={styles.line}>
              <View style={styles.lineIcon}>
                <Feather name={line.icon} size={15} color={palette.textTertiary} />
              </View>
              <View style={styles.lineText}>
                <Text style={styles.lineLabel}>{line.label}</Text>
                <Text style={styles.lineValue}>{line.value}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <Button label="Ouvrir la fiche" onPress={onOpenRecord} />
          <Pressable onPress={onClose} accessibilityRole="button" style={styles.secondary}>
            <Text style={styles.secondaryLabel}>Fermer</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function createStyles(palette: PaletteShape) {
  return StyleSheet.create({
    root: {
      flex: 1,
      paddingHorizontal: Spacing.screen,
    },
    handle: {
      alignSelf: 'center',
      width: 36,
      height: 4,
      borderRadius: Radius.pill,
      backgroundColor: palette.insetDeep,
    },
    bar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: Spacing.lg,
    },
    status: {
      borderRadius: Radius.pill,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    statusLabel: {
      fontSize: 11,
      lineHeight: 13,
      fontWeight: '600',
      letterSpacing: 0.2,
    },
    close: {
      width: Size.iconWell,
      height: Size.iconWell,
      borderRadius: Radius.pill,
      backgroundColor: palette.iconButtonBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    body: {
      paddingTop: Spacing.section,
    },
    time: {
      ...Type.footnote,
      fontWeight: '600',
      color: palette.blue,
      letterSpacing: 0.4,
    },
    client: {
      ...Type.masthead,
      color: palette.textPrimary,
      marginTop: 4,
    },
    type: {
      ...Type.body,
      color: palette.textSecondary,
      marginTop: 6,
    },
    lines: {
      marginTop: Spacing.section,
      gap: Spacing.lg,
    },
    line: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
    },
    lineIcon: {
      width: Size.well,
      height: Size.well,
      borderRadius: Radius.pill,
      backgroundColor: palette.inset,
      alignItems: 'center',
      justifyContent: 'center',
    },
    lineText: {
      flex: 1,
    },
    lineLabel: {
      ...Type.caption,
      color: palette.textTertiary,
    },
    lineValue: {
      ...Type.bodyStrong,
      color: palette.textPrimary,
      marginTop: 1,
    },
    actions: {
      marginTop: Spacing.section,
      gap: Spacing.md,
    },
    secondary: {
      alignSelf: 'center',
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
    },
    secondaryLabel: {
      ...Type.subhead,
      fontWeight: '600',
      color: palette.textSecondary,
    },
  });
}
