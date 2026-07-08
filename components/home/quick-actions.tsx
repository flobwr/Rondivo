import { Feather } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useMemo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette, Radius, type PaletteShape } from '@/constants/design';
import { actionShadow } from '@/constants/shadow';

type Action = {
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  color: string;
  background: string;
  /** Omitted only for "Nouveau document", which opens the shared creation menu instead of navigating. */
  route?: Href;
};

function buildActions(palette: PaletteShape): Action[] {
  return [
    { label: 'Nouveau document', icon: 'file-plus', color: palette.blue, background: palette.blueSoft },
    { label: 'Nouveau client', icon: 'user-plus', color: palette.orange, background: palette.orangeSoft, route: '/client/new' },
    { label: 'Notes', icon: 'message-square', color: palette.purple, background: palette.purpleSoft, route: '/notes' },
    { label: 'Tâches', icon: 'check-square', color: palette.green, background: palette.greenSoft, route: '/tasks' },
  ];
}

type ActionCardProps = Action & { onNewDocument: () => void; styles: ReturnType<typeof createStyles> };

function ActionCard({ label, icon, color, background, route, onNewDocument, styles }: ActionCardProps) {
  const router = useRouter();
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      friction: 5,
      tension: 300,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
      tension: 100,
    }).start();
  };

  return (
    <Pressable
      style={styles.wrapper}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={() => (route ? router.push(route) : onNewDocument())}>
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <View style={[styles.iconTile, { backgroundColor: background }]}>
          <Feather name={icon} size={ICON_SIZE} color={color} />
        </View>
        <Text style={styles.label} numberOfLines={2}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export function QuickActions({
  onNewDocument,
  palette = Palette,
}: {
  onNewDocument: () => void;
  /** Defaults to the static light palette — pass `useTheme().palette` from screens that opted into dark mode. */
  palette?: PaletteShape;
}) {
  const styles = useMemo(() => createStyles(palette), [palette]);
  const actions = useMemo(() => buildActions(palette), [palette]);

  return (
    <View style={styles.row}>
      {actions.map((action) => (
        <ActionCard key={action.label} {...action} onNewDocument={onNewDocument} styles={styles} />
      ))}
    </View>
  );
}

const TILE = 36;
const TILE_RADIUS = 12;
const ICON_SIZE = 17;

function createStyles(Palette: PaletteShape) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      gap: 10,
    },
    wrapper: {
      flex: 1,
    },
    card: {
      backgroundColor: Palette.cardMuted,
      borderRadius: Radius.tile,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Palette.border,
      paddingVertical: 12,
      paddingHorizontal: 4,
      alignItems: 'center',
      gap: 7,
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
      fontSize: 13,
      fontWeight: '500',
      color: Palette.textPrimary,
      letterSpacing: -0.1,
      lineHeight: 17,
      textAlign: 'center',
    },
  });
}
