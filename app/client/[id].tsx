import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ClientAvatar } from '@/components/clients/ClientAvatar';
import { ClientStatusBadge } from '@/components/clients/ClientStatusBadge';
import { STATUS_META, TINT_COLORS } from '@/components/clients/types';
import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { getClientById } from '@/data/clients';

function InfoRow({
  icon,
  label,
  value,
  onPress,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  value: string;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.infoRow} onPress={onPress} disabled={!onPress}>
      <View style={styles.infoIcon}>
        <Feather name={icon} size={16} color={Palette.blue} />
      </View>
      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue} numberOfLines={1} ellipsizeMode="tail">
          {value}
        </Text>
      </View>
      {onPress ? <Feather name="chevron-right" size={18} color={Palette.textTertiary} /> : null}
    </Pressable>
  );
}

export default function ClientDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const client = getClientById(id);

  if (!client) {
    return (
      <View style={styles.root}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <View style={styles.header}>
            <Pressable style={styles.backButton} hitSlop={8} onPress={() => router.back()}>
              <Feather name="chevron-left" size={24} color={Palette.textPrimary} />
            </Pressable>
          </View>
          <Text style={styles.notFound}>Client introuvable.</Text>
        </SafeAreaView>
      </View>
    );
  }

  const accentColor = STATUS_META[client.status].color;
  const footerColor = TINT_COLORS[client.footerTint].color;
  const footerSoft = TINT_COLORS[client.footerTint].soft;

  const handleCall = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(`tel:${client.phone.replace(/\s+/g, '')}`);
  };

  const handleNavigate = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const query = encodeURIComponent(client.address);
    const url = Platform.select({
      ios: `maps://?daddr=${query}`,
      android: `geo:0,0?q=${query}`,
      default: `https://www.google.com/maps/search/?api=1&query=${query}`,
    });
    Linking.openURL(url!);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} hitSlop={8} onPress={() => router.back()}>
            <Feather name="chevron-left" size={24} color={Palette.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Fiche client</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={styles.identityCard}>
            <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
            <ClientAvatar initials={client.initials} tint={client.avatarTint} size={64} />
            <Text style={styles.name}>{client.name}</Text>
            <View style={styles.badgeRow}>
              <ClientStatusBadge status={client.status} />
            </View>
            <Text style={styles.since}>Client depuis {client.clientSince}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Coordonnées</Text>
            <View style={styles.card}>
              <InfoRow icon="phone" label="Téléphone" value={client.phone} onPress={handleCall} />
              <View style={styles.separator} />
              <InfoRow icon="map-pin" label="Adresse" value={client.address} onPress={handleNavigate} />
              <View style={styles.separator} />
              <InfoRow icon="mail" label="Email" value={client.email} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Activité</Text>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{client.interventionsCount}</Text>
                <Text style={styles.statLabel}>interventions</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{client.quotesPending}</Text>
                <Text style={styles.statLabel}>devis en attente</Text>
              </View>
              <View style={styles.statCard}>
                <Text
                  style={[styles.statValue, styles.statValueCompact]}
                  numberOfLines={2}
                  adjustsFontSizeToFit>
                  {client.lastInterventionLabel}
                </Text>
                <Text style={styles.statLabel}>dernière intervention</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Statut</Text>
            <View style={styles.statusCard}>
              <View style={[styles.statusIcon, { backgroundColor: footerSoft }]}>
                <Feather name={client.footerIcon} size={18} color={footerColor} />
              </View>
              <View style={styles.statusText}>
                <Text style={styles.statusTitle}>{client.footerText}</Text>
                <Text style={styles.statusSubtitle}>{client.highlightText}</Text>
              </View>
            </View>
          </View>

          <View style={styles.actionsRow}>
            <Pressable style={styles.primaryAction} onPress={handleCall}>
              <Feather name="phone" size={18} color={Palette.white} />
              <Text style={styles.primaryActionText}>Appeler</Text>
            </Pressable>
            <Pressable style={styles.secondaryAction} onPress={handleNavigate}>
              <Feather name="navigation" size={18} color={Palette.blue} />
              <Text style={styles.secondaryActionText}>Itinéraire</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Palette.screen,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF1F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSize.title,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  content: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.section,
  },
  notFound: {
    fontSize: FontSize.body,
    color: Palette.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.section,
  },
  identityCard: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingVertical: 28,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    overflow: 'hidden',
    ...cardShadow,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.4,
    marginTop: 14,
  },
  badgeRow: {
    marginTop: 8,
  },
  since: {
    fontSize: 13,
    fontWeight: '400',
    color: Palette.textTertiary,
    marginTop: 8,
  },
  section: {
    marginTop: Spacing.section,
  },
  sectionTitle: {
    fontSize: FontSize.label,
    fontWeight: '700',
    color: Palette.textSecondary,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  card: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.lg,
    ...cardShadow,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.border,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.tile,
    backgroundColor: Palette.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  infoLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: Palette.textTertiary,
  },
  infoValue: {
    fontSize: FontSize.body,
    fontWeight: '500',
    color: Palette.textPrimary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: Palette.card,
    borderRadius: Radius.tile,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    ...cardShadow,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  statValueCompact: {
    fontSize: 14,
    lineHeight: 17,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: Palette.textTertiary,
    marginTop: 4,
    textAlign: 'center',
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    ...cardShadow,
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  statusTitle: {
    fontSize: FontSize.label,
    fontWeight: '600',
    color: Palette.textPrimary,
  },
  statusSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: Palette.textTertiary,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: Spacing.section,
  },
  primaryAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Palette.blue,
    borderRadius: Radius.tile,
    paddingVertical: 15,
  },
  primaryActionText: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.white,
    letterSpacing: -0.2,
  },
  secondaryAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Palette.blueSoft,
    borderRadius: Radius.tile,
    paddingVertical: 15,
  },
  secondaryActionText: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.blue,
    letterSpacing: -0.2,
  },
});
