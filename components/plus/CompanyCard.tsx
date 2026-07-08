import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PressableScale, StatusPill } from '@/components/documents/shared/primitives';
import { FontSize, Palette, Radius, Spacing, type PaletteShape } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';

export type Company = {
  name: string;
  ownerName: string;
  initials: string;
  plan: string;
  employeesCount: number;
  synced: boolean;
};

const LOGO = 64;

export function CompanyCard({
  company,
  infoLine,
  onPress,
  palette = Palette,
}: {
  company: Company;
  /** One extra, discreet fact not already covered by the badges above — e.g. fleet size + last sync time. */
  infoLine?: string;
  onPress: () => void;
  /** Defaults to the static light palette — pass `useTheme().palette` from screens that opted into dark mode. */
  palette?: PaletteShape;
}) {
  const styles = useMemo(() => createStyles(palette), [palette]);
  return (
    <PressableScale onPress={onPress} to={0.985} style={styles.card} accessibilityLabel="Mon compte">
      <View style={styles.topRow}>
        <LinearGradient
          colors={[palette.gradientStart, palette.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logo}>
          <Text style={styles.logoText}>{company.initials}</Text>
        </LinearGradient>

        <View style={styles.identity}>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
            {company.name}
          </Text>
          <Text style={styles.owner} numberOfLines={1} ellipsizeMode="tail">
            {company.ownerName}
          </Text>
        </View>

        <Feather name="chevron-right" size={18} color={palette.textTertiary} />
      </View>

      <View style={styles.badges}>
        <StatusPill label={company.plan} color={palette.blue} soft={palette.blueSoft} />
        {company.synced ? <StatusPill label="Synchronisé" color={palette.green} soft={palette.greenSoft} /> : null}
        <StatusPill
          label={`${company.employeesCount} employé${company.employeesCount > 1 ? 's' : ''}`}
          color={palette.textSecondary}
          soft={palette.border}
        />
      </View>

      {infoLine ? (
        <Text style={styles.infoLine} numberOfLines={1} ellipsizeMode="tail">
          {infoLine}
        </Text>
      ) : null}
    </PressableScale>
  );
}

function createStyles(Palette: PaletteShape) {
  return StyleSheet.create({
    card: {
      backgroundColor: Palette.card,
      borderRadius: Radius.card,
      padding: Spacing.cardPadding,
      ...cardShadow,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    logo: {
      width: LOGO,
      height: LOGO,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Spacing.md,
    },
    logoText: {
      color: Palette.white,
      fontSize: 21,
      fontWeight: '700',
      letterSpacing: 0.3,
    },
    identity: {
      flex: 1,
      paddingRight: Spacing.sm,
    },
    name: {
      fontSize: 23,
      fontWeight: '800',
      color: Palette.textPrimary,
      letterSpacing: -0.5,
    },
    owner: {
      fontSize: FontSize.label,
      fontWeight: '400',
      color: Palette.textSecondary,
      marginTop: 3,
      letterSpacing: -0.1,
    },
    badges: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginTop: 13,
    },
    infoLine: {
      fontSize: 12.5,
      fontWeight: '400',
      color: Palette.textTertiary,
      letterSpacing: -0.1,
      marginTop: 10,
      opacity: 0.82,
    },
  });
}
