import { Feather } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PressableScale } from '@/components/ui/PressableScale';
import { Palette, Radius, type PaletteShape } from '@/constants/design';
import { actionShadow } from '@/constants/shadow';

type Action = {
  label: string;
  /** Full action name for screen readers — the visible label is compacted. */
  accessibilityLabel: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  color: string;
  background: string;
  /** Omitted only for "Document", which opens the shared creation menu instead of navigating. */
  route?: Href;
};

// Labels are single words so the row stays one line tall on every screen —
// the "+" baked into the first two icons carries the "nouveau" meaning.
function buildActions(palette: PaletteShape): Action[] {
  return [
    { label: 'Document', accessibilityLabel: 'Nouveau document', icon: 'file-plus', color: palette.blue, background: palette.blueSoft },
    { label: 'Client', accessibilityLabel: 'Nouveau client', icon: 'user-plus', color: palette.orange, background: palette.orangeSoft, route: '/client/new' },
    { label: 'Notes', accessibilityLabel: 'Notes', icon: 'message-square', color: palette.purple, background: palette.purpleSoft, route: '/notes' },
    { label: 'Tâches', accessibilityLabel: 'Tâches', icon: 'check-square', color: palette.green, background: palette.greenSoft, route: '/tasks' },
  ];
}

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
  const actions = useMemo(() => buildActions(palette), [palette]);

  return (
    <View style={styles.row}>
      {actions.map((action) => (
        <View key={action.label} style={styles.slot}>
          <PressableScale
            style={styles.card}
            to={0.95}
            onPress={() => (action.route ? router.push(action.route) : onNewDocument())}
            accessibilityLabel={action.accessibilityLabel}>
            <View style={[styles.iconTile, { backgroundColor: action.background }]}>
              <Feather name={action.icon} size={ICON_SIZE} color={action.color} />
            </View>
            <Text style={styles.label} numberOfLines={1}>
              {action.label}
            </Text>
          </PressableScale>
        </View>
      ))}
    </View>
  );
}

const TILE = 34;
const TILE_RADIUS = 11;
const ICON_SIZE = 16;

function createStyles(Palette: PaletteShape) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      gap: 10,
    },
    slot: {
      flex: 1,
    },
    card: {
      backgroundColor: Palette.cardMuted,
      borderRadius: Radius.tile,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Palette.border,
      paddingVertical: 11,
      paddingHorizontal: 4,
      alignItems: 'center',
      gap: 6,
      ...actionShadow,
    },
    iconTile: {
      width: TILE,
      height: TILE,
      borderRadius: TILE_RADIUS,
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: {
      fontSize: 12.5,
      fontWeight: '600',
      color: Palette.textPrimary,
      letterSpacing: -0.1,
    },
  });
}
