import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';

type Item = {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  tint: string;
  background: string;
};

type Section = {
  title: string;
  items: Item[];
};

const SECTIONS: Section[] = [
  {
    title: 'Tâches & rappels',
    items: [
      {
        title: 'Appeler M. Dupont à 14:00',
        subtitle: 'Confirmer le rendez-vous',
        icon: <Ionicons name="notifications" size={20} color={Palette.purple} />,
        tint: Palette.purple,
        background: Palette.purpleSoft,
      },
      {
        title: 'Commander la pièce pour demain',
        subtitle: 'Chaudière — M. Dupont',
        icon: <Feather name="package" size={18} color={Palette.purple} />,
        tint: Palette.purple,
        background: Palette.purpleSoft,
      },
    ],
  },
  {
    title: 'Devis à traiter',
    items: [
      {
        title: 'Devis #1042 — Mme Bernard',
        subtitle: 'En attente depuis 2 jours',
        icon: <Feather name="file-text" size={18} color={Palette.blue} />,
        tint: Palette.blue,
        background: Palette.blueSoft,
      },
    ],
  },
  {
    title: 'Factures à envoyer',
    items: [
      {
        title: 'Facture #2087 — M. Leroy',
        subtitle: 'Intervention du 22 juin',
        icon: <Feather name="file-text" size={18} color={Palette.orange} />,
        tint: Palette.orange,
        background: Palette.orangeSoft,
      },
    ],
  },
  {
    title: 'Paiements à relancer',
    items: [
      {
        title: 'Relancer M. Petit',
        subtitle: '320 € — échéance dépassée',
        icon: <MaterialCommunityIcons name="cash-multiple" size={18} color={Palette.green} />,
        tint: Palette.green,
        background: Palette.greenSoft,
      },
    ],
  },
  {
    title: 'Administratif',
    items: [
      {
        title: 'Mettre à jour l’attestation d’assurance',
        subtitle: 'Expire le 30 juin',
        icon: <Feather name="shield" size={18} color={Palette.blue} />,
        tint: Palette.blue,
        background: Palette.blueSoft,
      },
    ],
  },
  {
    title: 'Messages',
    items: [
      {
        title: 'Nouveau message de Mme Garnier',
        subtitle: 'Demande de devis climatisation',
        icon: <Feather name="message-square" size={18} color={Palette.purple} />,
        tint: Palette.purple,
        background: Palette.purpleSoft,
      },
    ],
  },
];

function ActionRow({ item }: { item: Item }) {
  return (
    <Pressable style={styles.row}>
      <View style={[styles.rowIcon, { backgroundColor: item.background }]}>{item.icon}</View>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle} numberOfLines={2} ellipsizeMode="tail">
          {item.title}
        </Text>
        <Text style={styles.rowSubtitle} numberOfLines={1} ellipsizeMode="tail">
          {item.subtitle}
        </Text>
      </View>
      <Feather name="chevron-right" size={20} color={Palette.textTertiary} />
    </Pressable>
  );
}

export default function RappelsScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} hitSlop={8} onPress={() => router.back()}>
            <Feather name="chevron-left" size={24} color={Palette.textPrimary} />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Rappels</Text>
            <Text style={styles.headerSubtitle}>Tout ce qui nécessite votre attention</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}>
          {SECTIONS.map((section) => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.card}>
                {section.items.map((item, index) => (
                  <View key={item.title}>
                    {index > 0 ? <View style={styles.separator} /> : null}
                    <ActionRow item={item} />
                  </View>
                ))}
              </View>
            </View>
          ))}
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
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSize.title,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  headerSubtitle: {
    fontSize: FontSize.small,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  content: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.section,
  },
  section: {
    marginTop: Spacing.lg,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  rowTitle: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Palette.textPrimary,
  },
  rowSubtitle: {
    fontSize: FontSize.small,
    color: Palette.textTertiary,
    marginTop: 2,
  },
});
