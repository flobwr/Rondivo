import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { ClientAvatar } from '@/components/clients/ClientAvatar';
import { FontSize, Palette, Radius } from '@/constants/design';
import { type ContactPerson } from '@/data/client-details';
import { PressableScale, SectionCard } from './primitives';

type Props = {
  contacts: ContactPerson[];
  onAddContact: () => void;
  onCallContact: (contact: ContactPerson) => void;
};

function ContactRow({ contact, onCall }: { contact: ContactPerson; onCall: () => void }) {
  return (
    <View style={styles.row}>
      <ClientAvatar initials={contact.initials} tint={contact.tint} size={40} />
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {contact.name}
          </Text>
          {contact.primary ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Principal</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.role} numberOfLines={1}>
          {contact.role}
        </Text>
        <Text style={styles.phone}>{contact.phone}</Text>
      </View>
      <PressableScale onPress={onCall} to={0.9} style={styles.callBtn} accessibilityLabel={`Appeler ${contact.name}`}>
        <Feather name="phone" size={16} color={Palette.blue} />
      </PressableScale>
    </View>
  );
}

export function ContactsCard({ contacts, onAddContact, onCallContact }: Props) {
  return (
    <SectionCard icon="users" iconTint="blue" title="Contacts">
      {contacts.map((contact, index) => (
        <View key={contact.id}>
          {index > 0 ? <View style={styles.separator} /> : null}
          <ContactRow contact={contact} onCall={() => onCallContact(contact)} />
        </View>
      ))}

      <View style={styles.separator} />
      <PressableScale onPress={onAddContact} to={0.97} style={styles.addRow} accessibilityLabel="Ajouter un contact">
        <View style={styles.addIcon}>
          <Feather name="plus" size={16} color={Palette.blue} />
        </View>
        <Text style={styles.addText}>Ajouter un contact</Text>
      </PressableScale>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  name: {
    fontSize: FontSize.label,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  badge: {
    backgroundColor: Palette.blueSoft,
    borderRadius: Radius.pill,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.blue,
  },
  role: {
    fontSize: FontSize.small,
    fontWeight: '500',
    color: Palette.textSecondary,
    marginTop: 2,
  },
  phone: {
    fontSize: FontSize.small,
    fontWeight: '500',
    color: Palette.textTertiary,
    marginTop: 1,
  },
  callBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Palette.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.border,
    marginVertical: 2,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 12,
    paddingBottom: 2,
  },
  addIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.4,
    borderColor: Palette.blueSoft,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    fontSize: FontSize.label,
    fontWeight: '700',
    color: Palette.blue,
    letterSpacing: -0.1,
  },
});
