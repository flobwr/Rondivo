import { Feather } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PressableScale } from '@/components/ui/PressableScale';
import { Palette, type PaletteShape } from '@/constants/design';
import { actionShadow } from '@/constants/shadow';

type Action = {
  label: string;
  /** Full action name for screen readers — the visible label is compacted. */
  accessibilityLabel: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  /** Omitted only for "Document", which opens the shared creation menu instead of navigating. */
  route?: Href;
};

// Labels are single words so the row stays one line tall on every screen —
// the "+" baked into the first two icons carries the "nouveau" meaning.
const ACTIONS: Action[] = [
  { label: 'Document', accessibilityLabel: 'Nouveau document', icon: 'file-plus' },
  { label: 'Client', accessibilityLabel: 'Nouveau client', icon: 'user-plus', route: '/client/new' },
  { label: 'Notes', accessibilityLabel: 'Notes', icon: 'message-square', route: '/notes' },
  { label: 'Tâches', accessibilityLabel: 'Tâches', icon: 'check-square', route: '/tasks' },
];

/**
 * Same round, label-under, iOS-Contacts-style action row as the Clients detail
 * and Documents modules — the one shape for "primary, one-tap" actions
 * everywhere in Rondivo. Single accent color: these are all just "actions",
 * they don't need four hues to tell apart.
 */
export function QuickActions({
  onNewDocument,
  palette = Palette,
}: {
  onNewDocument: () => void;
  /** Defaults to the static light palette — pass `useTheme().palette` from screens that opted into dark mode. */
  palette?: PaletteShape;
}) {
  const router = useRouter();
  const styles = useMemo(() => createStyles(palette), [palette]);

  return (
    <View style={styles.row}>
      {ACTIONS.map((action) => (
        <PressableScale
          key={action.label}
          to={0.9}
          onPress={() => (action.route ? router.push(action.route) : onNewDocument())}
          accessibilityLabel={action.accessibilityLabel}>
          <View style={styles.column}>
            <View style={styles.circle}>
              <Feather name={action.icon} size={ICON_SIZE} color={palette.blue} />
            </View>
            <Text style={styles.label} numberOfLines={1}>
              {action.label}
            </Text>
          </View>
        </PressableScale>
      ))}
    </View>
  );
}

const CIRCLE = 54;
const ICON_SIZE = 20;

function createStyles(Palette: PaletteShape) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingHorizontal: 4,
    },
    column: {
      alignItems: 'center',
      gap: 6,
      width: 72,
    },
    // White discs floating on the paper — the blue lives only in the glyph,
    // so four actions don't read as four blue tiles.
    circle: {
      width: CIRCLE,
      height: CIRCLE,
      borderRadius: CIRCLE / 2,
      backgroundColor: Palette.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Palette.border,
      alignItems: 'center',
      justifyContent: 'center',
      ...actionShadow,
    },
    label: {
      fontSize: 12,
      fontWeight: '600',
      color: Palette.textSecondary,
      letterSpacing: -0.1,
      textAlign: 'center',
    },
  });
}
