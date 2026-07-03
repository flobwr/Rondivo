import { Feather } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';

type Props = {
  icon?: React.ComponentProps<typeof Feather>['name'];
  iconColor?: string;
  iconBackground?: string;
  title?: string;
  right?: ReactNode;
  children: ReactNode;
};

// Local, tighter rhythm than the shared design tokens — scoped to this
// screen only, so Home/Planning/Clients keep their own card language.
const CARD_PADDING = 16;
const CARD_RADIUS = 20;

export function SectionCard({ icon, iconColor, iconBackground, title, right, children }: Props) {
  return (
    <View style={styles.card}>
      {title ? (
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {icon ? (
              <View style={[styles.iconTile, { backgroundColor: iconBackground }]}>
                <Feather name={icon} size={15} color={iconColor} />
              </View>
            ) : null}
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          </View>
          {right}
        </View>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.card,
    borderRadius: CARD_RADIUS,
    padding: CARD_PADDING,
    ...cardShadow,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    flexShrink: 1,
  },
  iconTile: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FontSize.cardLabel,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
});
