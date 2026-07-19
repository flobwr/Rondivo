import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { BottomDock, useBottomDockClearance } from '@/components/ui/BottomDock';
import { PressableScale } from '@/components/ui/PressableScale';
import { useTheme } from '@/contexts/theme';
import type { ThemeChoice } from '@/services/plus/settings';
import {
  Radius,
  Spacing,
  THEMES,
  THEME_ORDER,
  getElevation,
  type PaletteShape,
} from '@/theme';

/**
 * A theme tile IS its paper — painted with the CANDIDATE palette (screen,
 * card, ink, accent) rather than described by a colour chip, so choosing a
 * theme feels like previewing a real screen. The ring and check follow the
 * ACTIVE palette so the selected tile always reads correctly regardless of
 * which paper is currently applied.
 */
function ThemeTile({
  choice,
  selected,
  onSelect,
}: {
  choice: ThemeChoice;
  selected: boolean;
  onSelect: (choice: ThemeChoice) => void;
}) {
  const { palette, resolvedTheme } = useTheme();
  const elevation = getElevation(resolvedTheme);
  const isAuto = choice === 'auto';

  const label = isAuto ? 'Auto' : THEMES[choice].label;
  const tagline = isAuto ? 'Suit votre téléphone' : THEMES[choice].tagline;
  const light = THEMES.atelier.palette;
  const dark = THEMES.midnight.palette;
  const paper = isAuto ? light : THEMES[choice].palette;

  return (
    <PressableScale
      to={0.97}
      onPress={() => onSelect(choice)}
      accessibilityLabel={`Thème ${label}, ${tagline}${selected ? ', sélectionné' : ''}`}
      style={[
        tileStyles.tile,
        { backgroundColor: paper.screen, borderColor: selected ? palette.blue : paper.border },
        elevation.whisper,
      ]}>
      {isAuto ? (
        <View style={[tileStyles.sheet, tileStyles.splitSheet, elevation.card]}>
          <View style={[tileStyles.splitHalf, { backgroundColor: light.card }]}>
            <Feather name="sun" size={13} color={light.textTertiary} />
          </View>
          <View style={[tileStyles.splitHalf, { backgroundColor: dark.card }]}>
            <Feather name="moon" size={13} color={dark.textTertiary} />
          </View>
        </View>
      ) : (
        <View style={[tileStyles.sheet, { backgroundColor: paper.card }, elevation.card]}>
          <View style={[tileStyles.inkLine, { backgroundColor: paper.textPrimary }]} />
          <View style={[tileStyles.inkLineSoft, { backgroundColor: paper.insetDeep }]} />
          <View style={tileStyles.sheetFooter}>
            <View style={[tileStyles.accentDot, { backgroundColor: paper.blue }]} />
            <View style={[tileStyles.inkLineTiny, { backgroundColor: paper.inset }]} />
          </View>
        </View>
      )}

      <View style={tileStyles.meta}>
        <View style={tileStyles.labels}>
          <Text style={[tileStyles.label, { color: paper.textPrimary }]} numberOfLines={1}>
            {label}
          </Text>
          <Text style={[tileStyles.tagline, { color: paper.textTertiary }]} numberOfLines={1}>
            {tagline}
          </Text>
        </View>
        {selected ? (
          <View style={[tileStyles.check, { backgroundColor: palette.blue }]}>
            <Feather name="check" size={12} color={palette.onAccent} />
          </View>
        ) : null}
      </View>
    </PressableScale>
  );
}

export default function ApparenceScreen() {
  const router = useRouter();
  const dockClearance = useBottomDockClearance();
  const { theme, setTheme, palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  const choices: ThemeChoice[] = [...THEME_ORDER, 'auto'];

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Apparence" onBack={() => router.back()} />

        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: dockClearance }]} showsVerticalScrollIndicator={false}>
          <Text style={styles.intro}>
            Choisissez le papier de Rondivo — la même application, une autre ambiance.
          </Text>

          <View style={styles.grid}>
            {choices.map((choice) => (
              <ThemeTile key={choice} choice={choice} selected={theme === choice} onSelect={setTheme} />
            ))}
          </View>

          <Text style={styles.note}>
            Le thème change le papier de toute l’application — la structure, elle, ne bouge pas.
            « Auto » suit le réglage clair/sombre de votre téléphone.
          </Text>
        </ScrollView>
      </SafeAreaView>

      <BottomDock activeIndex={4} />
    </View>
  );
}

const tileStyles = StyleSheet.create({
  tile: {
    flexBasis: '47%',
    flexGrow: 1,
    borderRadius: Radius.card,
    borderWidth: 2,
    padding: 14,
    gap: 12,
  },
  sheet: {
    borderRadius: Radius.tile,
    padding: 10,
    gap: 5,
    minHeight: 52,
  },
  splitSheet: {
    flexDirection: 'row',
    padding: 0,
    overflow: 'hidden',
  },
  splitHalf: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inkLine: {
    height: 6,
    width: '58%',
    borderRadius: 3,
  },
  inkLineSoft: {
    height: 5,
    width: '38%',
    borderRadius: 3,
  },
  sheetFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  accentDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  inkLineTiny: {
    height: 5,
    width: 34,
    borderRadius: 3,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  labels: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  tagline: {
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: -0.1,
    marginTop: 1,
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function createStyles(palette: PaletteShape) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: palette.screen },
    safeArea: { flex: 1 },
    content: {
      paddingHorizontal: Spacing.screen,
    },
    intro: {
      fontSize: 13,
      fontWeight: '400',
      color: palette.textSecondary,
      letterSpacing: -0.1,
      marginBottom: Spacing.lg,
      lineHeight: 18,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.cardGap,
    },
    note: {
      fontSize: 12.5,
      lineHeight: 17,
      fontWeight: '400',
      color: palette.textTertiary,
      marginTop: Spacing.lg,
    },
  });
}
