import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { PressableScale } from '@/components/ui/PressableScale';
import { createThemedStyles, actionShadow, heroShadow, Palette, PressScale, Radius, Spacing } from '@/theme';
import { usePressScale } from '@/hooks/use-press-scale';
import { SectionCard } from './SectionCard';

type MiniAction = {
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  onPress?: () => void;
};

function MiniActionButton({ label, icon, onPress }: MiniAction) {
  const { scale, onPressIn, onPressOut } = usePressScale({ to: PressScale.icon });

  return (
    <Pressable style={styles.miniWrapper} onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
      <Animated.View style={[styles.miniInner, { transform: [{ scale }] }]}>
        <View style={styles.miniTile}>
          <Feather name={icon} size={19} color={Palette.blue} />
        </View>
        <Text style={styles.miniLabel} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

type Props = {
  onCall?: () => void;
  onSms?: () => void;
  onNavigate?: () => void;
  onCreateQuote?: () => void;
  onStart?: () => void;
  onComplete?: () => void;
  onCreateReport?: () => void;
  onCreateInvoice?: () => void;
  started?: boolean;
  completed?: boolean;
};

export function QuickActionsCard({
  onCall,
  onSms,
  onNavigate,
  onCreateQuote,
  onStart,
  onComplete,
  onCreateReport,
  onCreateInvoice,
  started,
  completed,
}: Props) {
  const {
    scale: ctaScale,
    onPressIn: onCtaPressIn,
    onPressOut: onCtaPressOut,
  } = usePressScale({ to: PressScale.control, haptic: Haptics.ImpactFeedbackStyle.Medium });

  // "Modifier" already lives in InterventionFooter — a mini-action here would
  // just duplicate it, so this slot goes to the one closing action that has
  // no other entry point: quoting straight from the intervention.
  const actions: MiniAction[] = [
    { label: 'Appeler', icon: 'phone', onPress: onCall },
    { label: 'SMS', icon: 'message-circle', onPress: onSms },
    { label: 'Itinéraire', icon: 'navigation', onPress: onNavigate },
    { label: 'Devis', icon: 'file-text', onPress: onCreateQuote },
  ];

  const ctaLabel = completed ? 'Intervention terminée' : started ? 'Terminer l’intervention' : 'Commencer l’intervention';
  const ctaIcon = completed ? 'check-circle' : started ? 'check' : 'play';
  const ctaOnPress = completed ? undefined : started ? onComplete : onStart;

  return (
    <SectionCard>
      <View style={styles.row}>
        {actions.map((action) => (
          <MiniActionButton key={action.label} {...action} />
        ))}
      </View>

      <Pressable
        onPressIn={completed ? undefined : onCtaPressIn}
        onPressOut={completed ? undefined : onCtaPressOut}
        onPress={ctaOnPress}
        disabled={completed}
        style={styles.ctaWrapper}>
        <Animated.View style={{ transform: [{ scale: ctaScale }] }}>
          <LinearGradient
            colors={completed ? [Palette.textTertiary, Palette.textTertiary] : [Palette.gradientStart, Palette.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cta}>
            <Feather name={ctaIcon} size={16} color={Palette.white} />
            <Text style={styles.ctaText}>{ctaLabel}</Text>
          </LinearGradient>
        </Animated.View>
      </Pressable>

      {completed ? (
        <View style={styles.closingRow}>
          <PressableScale style={styles.closingButton} to={0.96} onPress={onCreateReport} accessibilityLabel="Créer un rapport">
            <Feather name="clipboard" size={15} color={Palette.blue} />
            <Text style={styles.closingText}>Rapport</Text>
          </PressableScale>
          <PressableScale style={styles.closingButton} to={0.96} onPress={onCreateInvoice} accessibilityLabel="Facturer l’intervention">
            <Feather name="credit-card" size={15} color={Palette.blue} />
            <Text style={styles.closingText}>Facturer</Text>
          </PressableScale>
        </View>
      ) : null}
    </SectionCard>
  );
}

const styles = createThemedStyles(() => StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  miniWrapper: {
    flex: 1,
  },
  miniInner: {
    alignItems: 'center',
  },
  miniTile: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Palette.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
    ...actionShadow,
  },
  miniLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textPrimary,
    marginTop: 7,
    letterSpacing: -0.1,
    textAlign: 'center',
  },
  ctaWrapper: {
    marginTop: Spacing.md,
  },
  closingRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  closingButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: Radius.tile,
    backgroundColor: Palette.blueSoft,
  },
  closingText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.blue,
    letterSpacing: -0.1,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    height: 52,
    borderRadius: Radius.pill,
    ...heroShadow,
  },
  ctaText: {
    color: Palette.white,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
}));
