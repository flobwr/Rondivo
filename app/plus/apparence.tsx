import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { SelectableList, type SelectableOption } from '@/components/plus/resource/SelectableList';
import { BottomDock } from '@/components/ui/BottomDock';
import { PressableScale } from '@/components/ui/PressableScale';
import { useTheme } from '@/contexts/theme';
import { Appearance } from '@/services/plus/settings';
import {
  Radius,
  Spacing,
  THEMES,
  THEME_ORDER,
  getElevation,
  type PaletteShape,
  type ThemeName,
} from '@/theme';

const LUMINOSITY_OPTIONS: SelectableOption<Appearance>[] = [
  { key: 'clair', label: 'Clair' },
  { key: 'sombre', label: 'Sombre' },
  { key: 'auto', label: 'Automatique', description: 'Suit les réglages de votre téléphone' },
];

/**
 * A theme rendered as its own paper: the tile is painted with the CANDIDATE
 * palette (screen, card, inks) while the ring and check follow the ACTIVE
 * one — a true miniature of the app, not a colour chip.
 */
function ThemePaperTile({
  name,
  selected,
  wide,
  onSelect,
}: {
  name: ThemeName;
  selected: boolean;
  wide?: boolean;
  onSelect: (name: ThemeName) => void;
}) {
  const meta = THEMES[name];
  const paper = meta.palette;
  const { palette, scheme } = useTheme();
  const elevation = getElevation(scheme);

  return (
    <PressableScale
      to={0.97}
      onPress={() => onSelect(name)}
      accessibilityLabel={`Thème ${meta.label}, ${meta.tagline}${selected ? ', sélectionné' : ''}`}
      style={[
        tileStyles.tile,
        wide && tileStyles.tileWide,
        // Constant 2 px frame — only the colour changes on selection, so the
        // tile never shifts under the finger.
        { backgroundColor: paper.screen, borderColor: selected ? palette.blue : paper.border },
        elevation.whisper,
      ]}>
      {/* Miniature sheet resting on the candidate paper */}
      <View style={[tileStyles.sheet, { backgroundColor: paper.card }, elevation.card]}>
        <View style={[tileStyles.inkLine, { backgroundColor: paper.textPrimary }]} />
        <View style={[tileStyles.inkLineSoft, { backgroundColor: paper.insetDeep }]} />
        <View style={tileStyles.sheetFooter}>
          <View style={[tileStyles.accentDot, { backgroundColor: paper.blue }]} />
          <View style={[tileStyles.inkLineTiny, { backgroundColor: paper.inset }]} />
        </View>
      </View>

      <View style={tileStyles.meta}>
        <View style={tileStyles.labels}>
          <Text style={[tileStyles.label, { color: paper.textPrimary }]} numberOfLines={1}>
            {meta.label}
          </Text>
          <Text style={[tileStyles.tagline, { color: paper.textTertiary }]} numberOfLines={1}>
            {meta.tagline}
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
  const { appearance, setAppearance, theme, setTheme, resolvedTheme, palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  const handleAppearance = (value: Appearance) => {
    setAppearance(value);
    // "Clair" must actually mean clair — leaving Nuit selected as the paper
    // would silently override the explicit choice.
    if (value !== 'sombre' && theme === 'nuit') setTheme('atelier');
  };

  const handleTheme = (name: ThemeName) => {
    setTheme(name);
    // Picking a light paper while the app is dark switches the luminosity
    // too, so the choice is visible immediately.
    if (name !== 'nuit' && resolvedTheme === 'nuit') setAppearance('clair');
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Apparence" onBack={() => router.back()} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.intro}>Choisissez l’apparence de Rondivo sur cet appareil.</Text>

          <SelectableList
            options={LUMINOSITY_OPTIONS}
            selected={appearance}
            onSelect={handleAppearance}
          />

          <Text style={styles.sectionLabel}>THÈME</Text>
          <View style={styles.grid}>
            {THEME_ORDER.filter((name) => name !== 'nuit').map((name) => (
              <ThemePaperTile
                key={name}
                name={name}
                selected={resolvedTheme === name}
                onSelect={handleTheme}
              />
            ))}
          </View>
          <ThemePaperTile
            name="nuit"
            wide
            selected={resolvedTheme === 'nuit'}
            onSelect={handleTheme}
          />

          <Text style={styles.note}>
            Le thème change le papier de toute l’application — la structure, elle, ne bouge pas.
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
  tileWide: {
    flexBasis: 'auto',
    alignSelf: 'stretch',
    marginTop: Spacing.cardGap,
  },
  sheet: {
    borderRadius: Radius.tile,
    padding: 10,
    gap: 5,
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
      paddingBottom: Spacing.section,
    },
    intro: {
      fontSize: 13,
      fontWeight: '400',
      color: palette.textSecondary,
      letterSpacing: -0.1,
      marginBottom: Spacing.lg,
      lineHeight: 18,
    },
    sectionLabel: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1.2,
      color: palette.textTertiary,
      marginTop: Spacing.section,
      marginBottom: Spacing.md,
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
