import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ClientAvatar } from '@/components/clients/ClientAvatar';
import { TINT_COLORS, type Client } from '@/components/clients/types';
import { Chip, ChipScroll, Field, PressableScale } from '@/components/appointment/AppointmentUI';
import { ClientPickerSheet } from '@/components/appointment/ClientPickerSheet';
import { TemplatePicker } from '@/components/appointment/TemplatePicker';
import {
  DURATION_OPTIONS,
  PRIORITY_META,
  RECURRENCE_META,
  RECURRENCE_ORDER,
  TIME_SLOTS,
  addMinutesToTime,
  buildDays,
  defaultStart,
  formatDayShort,
  formatDuration,
  type Priority,
  type Recurrence,
} from '@/components/appointment/appointment-utils';
import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { getClientById } from '@/data/clients';
import { type InterventionTemplate } from '@/data/intervention-templates';
import { CURRENT_TECHNICIAN, TECHNICIANS } from '@/data/technicians';

const DAYS = buildDays(14);

function formatEuro(value: number): string {
  return `${value.toLocaleString('fr-FR')} €`;
}

export default function NewAppointmentScreen() {
  const router = useRouter();
  const { clientId } = useLocalSearchParams<{ clientId?: string }>();

  const initial = useMemo(() => defaultStart(), []);
  const [client, setClient] = useState<Client | null>(() => (clientId ? getClientById(clientId) ?? null : null));
  const [clientSheet, setClientSheet] = useState(false);

  const [templateId, setTemplateId] = useState<string | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [price, setPrice] = useState(0);
  const [tva, setTva] = useState(20);

  const [dayKey, setDayKey] = useState(initial.dayKey);
  const [time, setTime] = useState(initial.time);
  const [duration, setDuration] = useState(60);
  const [priority, setPriority] = useState<Priority>('normal');

  const [advanced, setAdvanced] = useState(false);
  const [technicianId, setTechnicianId] = useState(CURRENT_TECHNICIAN.id);
  const [recurrence, setRecurrence] = useState<Recurrence>('none');
  const [notes, setNotes] = useState('');

  const [created, setCreated] = useState(false);

  const endTime = addMinutesToTime(time, duration);
  const isCustom = templateId === 'custom';
  const hasType = (templateId && !isCustom) || (isCustom && customTitle.trim().length > 0);
  const canCreate = !!client && !!hasType && !created;
  const totalTTC = price > 0 ? Math.round(price * (1 + tva / 100)) : 0;

  const applyTemplate = (t: InterventionTemplate) => {
    setTemplateId(t.id);
    setCategory(t.category);
    setPrice(t.price);
    setTva(t.tvaRate);
    setDuration(t.durationMinutes);
  };

  const selectCustom = () => {
    setTemplateId('custom');
    setCategory(null);
    setPrice(0);
    setTva(20);
  };

  const create = () => {
    if (!canCreate) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCreated(true);
    setTimeout(() => router.back(), 750);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <PressableScale onPress={() => router.back()} to={0.9} style={styles.iconBtn} accessibilityLabel="Fermer">
            <Feather name="x" size={22} color={Palette.textPrimary} />
          </PressableScale>
          <Text style={styles.headerTitle}>Nouveau rendez-vous</Text>
          <View style={styles.iconBtn} />
        </View>

        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={styles.content}>
            {/* Client */}
            <Field
              label="Client"
              trailing={
                client ? (
                  <PressableScale onPress={() => setClientSheet(true)} to={0.94} haptic={false} accessibilityLabel="Changer de client">
                    <Text style={styles.changeLink}>Changer</Text>
                  </PressableScale>
                ) : undefined
              }>
              {client ? (
                <View style={styles.clientCard}>
                  <ClientAvatar initials={client.initials} tint={client.avatarTint} size={46} elevated />
                  <View style={styles.clientInfo}>
                    <Text style={styles.clientName} numberOfLines={1}>
                      {client.name}
                    </Text>
                    <View style={styles.addressRow}>
                      <Feather name="map-pin" size={12} color={Palette.textTertiary} />
                      <Text style={styles.clientAddress} numberOfLines={1}>
                        {client.address}
                      </Text>
                    </View>
                  </View>
                </View>
              ) : (
                <PressableScale onPress={() => setClientSheet(true)} to={0.98} style={styles.clientEmpty} accessibilityLabel="Choisir un client">
                  <View style={styles.clientEmptyIcon}>
                    <Feather name="user-plus" size={18} color={Palette.blue} />
                  </View>
                  <Text style={styles.clientEmptyText}>Choisir un client</Text>
                  <Feather name="chevron-right" size={18} color={Palette.textTertiary} />
                </PressableScale>
              )}
            </Field>

            {/* Type */}
            <Field label="Type d'intervention">
              <TemplatePicker selectedId={templateId} onSelect={applyTemplate} onSelectCustom={selectCustom} />
              {isCustom ? (
                <TextInput
                  style={styles.customInput}
                  value={customTitle}
                  onChangeText={setCustomTitle}
                  placeholder="Nom de l'intervention…"
                  placeholderTextColor={Palette.textTertiary}
                  autoFocus
                />
              ) : null}
            </Field>

            {/* Date */}
            <Field label="Date">
              <ChipScroll>
                {DAYS.map((d) => (
                  <Chip
                    key={d.key}
                    label={d.weekdayLabel}
                    sublabel={String(d.dayNum)}
                    active={d.key === dayKey}
                    onPress={() => setDayKey(d.key)}
                    minWidth={54}
                  />
                ))}
              </ChipScroll>
            </Field>

            {/* Time */}
            <Field label="Heure" trailing={<Text style={styles.endLabel}>Fin ~ {endTime}</Text>}>
              <ChipScroll>
                {TIME_SLOTS.map((slot) => (
                  <Chip key={slot} label={slot} active={slot === time} onPress={() => setTime(slot)} minWidth={62} />
                ))}
              </ChipScroll>
            </Field>

            {/* Duration */}
            <Field label="Durée">
              <ChipScroll>
                {DURATION_OPTIONS.map((min) => (
                  <Chip key={min} label={formatDuration(min)} active={min === duration} onPress={() => setDuration(min)} minWidth={62} />
                ))}
              </ChipScroll>
            </Field>

            {/* Priority */}
            <Field label="Priorité">
              <View style={styles.segment}>
                {(Object.keys(PRIORITY_META) as Priority[]).map((p) => {
                  const meta = PRIORITY_META[p];
                  const active = p === priority;
                  const accent = TINT_COLORS[meta.tint].color;
                  return (
                    <Pressable
                      key={p}
                      style={[styles.segmentItem, active && { backgroundColor: accent, borderColor: accent }]}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setPriority(p);
                      }}
                      accessibilityRole="button"
                      accessibilityState={{ selected: active }}>
                      {!active ? <View style={[styles.segmentDot, { backgroundColor: accent }]} /> : null}
                      <Text style={[styles.segmentText, { color: active ? Palette.white : Palette.textPrimary }]}>{meta.label}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </Field>

            {/* Advanced */}
            <PressableScale onPress={() => setAdvanced((v) => !v)} to={0.98} haptic style={styles.advancedToggle} accessibilityLabel="Options avancées">
              <Feather name="sliders" size={16} color={Palette.textSecondary} />
              <Text style={styles.advancedText}>Options avancées</Text>
              <Feather name={advanced ? 'chevron-up' : 'chevron-down'} size={18} color={Palette.textTertiary} />
            </PressableScale>

            {advanced ? (
              <View>
                <Field label="Technicien">
                  <ChipScroll>
                    {TECHNICIANS.map((t) => (
                      <Chip key={t.id} label={t.name} active={t.id === technicianId} onPress={() => setTechnicianId(t.id)} />
                    ))}
                  </ChipScroll>
                </Field>

                <Field label="Récurrence">
                  <ChipScroll>
                    {RECURRENCE_ORDER.map((r) => (
                      <Chip key={r} label={RECURRENCE_META[r]} active={r === recurrence} onPress={() => setRecurrence(r)} />
                    ))}
                  </ChipScroll>
                </Field>

                <Field label="Notes">
                  <TextInput
                    style={styles.notes}
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Précisions pour l'intervention…"
                    placeholderTextColor={Palette.textTertiary}
                    multiline
                  />
                </Field>
              </View>
            ) : null}

            <View style={{ height: 12 }} />
          </ScrollView>

          {/* Sticky footer */}
          <View style={styles.footer}>
            <SafeAreaView edges={['bottom']}>
              <View style={styles.footerInner}>
                <View style={styles.recap}>
                  <Text style={styles.recapMain} numberOfLines={1}>
                    {formatDayShort(dayKey)} · {time}–{endTime}
                  </Text>
                  {totalTTC > 0 ? (
                    <Text style={styles.recapSub}>{formatEuro(totalTTC)} TTC · TVA {tva}%</Text>
                  ) : (
                    <Text style={styles.recapSub}>{formatDuration(duration)}{category ? ` · ${category}` : ''}</Text>
                  )}
                </View>

                <PressableScale onPress={create} to={0.96} disabled={!canCreate} accessibilityLabel="Créer le rendez-vous">
                  <View style={[styles.createBtn, !canCreate && styles.createBtnDisabled, created && styles.createBtnDone]}>
                    <Feather name={created ? 'check' : 'calendar'} size={17} color={Palette.white} />
                    <Text style={styles.createText}>{created ? 'Créé' : 'Créer'}</Text>
                  </View>
                </PressableScale>
              </View>
            </SafeAreaView>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <ClientPickerSheet
        visible={clientSheet}
        onClose={() => setClientSheet(false)}
        onSelect={setClient}
        selectedId={client?.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.screen },
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screen,
    paddingTop: 6,
    paddingBottom: 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  content: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: 20,
  },
  changeLink: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Palette.blue,
  },
  clientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    padding: 14,
    ...cardShadow,
  },
  clientInfo: { flex: 1 },
  clientName: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  clientAddress: {
    flex: 1,
    fontSize: FontSize.small,
    fontWeight: '500',
    color: Palette.textTertiary,
  },
  clientEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    padding: 15,
    borderWidth: 1.5,
    borderColor: Palette.border,
    borderStyle: 'dashed',
  },
  clientEmptyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Palette.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clientEmptyText: {
    flex: 1,
    fontSize: FontSize.label,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  customInput: {
    marginTop: 10,
    backgroundColor: Palette.card,
    borderRadius: Radius.tile,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: FontSize.label,
    fontWeight: '500',
    color: Palette.textPrimary,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  endLabel: {
    fontSize: FontSize.small,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  segment: {
    flexDirection: 'row',
    gap: 8,
  },
  segmentItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: Radius.pill,
    backgroundColor: Palette.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  segmentDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  segmentText: {
    fontSize: FontSize.small,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  advancedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: Spacing.section,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: Palette.card,
    borderRadius: Radius.tile,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  advancedText: {
    flex: 1,
    fontSize: FontSize.label,
    fontWeight: '600',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
  },
  notes: {
    minHeight: 80,
    backgroundColor: Palette.card,
    borderRadius: Radius.tile,
    padding: 14,
    fontSize: FontSize.label,
    fontWeight: '500',
    color: Palette.textPrimary,
    textAlignVertical: 'top',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  footer: {
    backgroundColor: Palette.card,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Palette.border,
    paddingHorizontal: Spacing.screen,
  },
  footerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingTop: 12,
    paddingBottom: 4,
  },
  recap: { flex: 1 },
  recapMain: {
    fontSize: FontSize.label,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  recapSub: {
    fontSize: FontSize.small,
    fontWeight: '500',
    color: Palette.textTertiary,
    marginTop: 2,
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Palette.blue,
    borderRadius: Radius.tile,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  createBtnDisabled: {
    backgroundColor: '#B9C6DE',
  },
  createBtnDone: {
    backgroundColor: Palette.green,
  },
  createText: {
    fontSize: FontSize.label,
    fontWeight: '700',
    color: Palette.white,
    letterSpacing: -0.2,
  },
});
