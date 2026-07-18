import { Feather } from '@expo/vector-icons';
import { Children, ReactNode, useState } from 'react';
import { StyleSheet, Text, TextInput, View, type KeyboardTypeOptions } from 'react-native';

import { createThemedStyles, cardShadow, FontSize, Palette, Radius, Spacing } from '@/theme';
import { FeatherIconName } from '../types';
import { IconTile, PressableScale } from './primitives';

// Shared chrome for the Documents module's creation screens (Facture, Devis,
// Rapport). Each section can carry a small icon tile next to its title — the
// same "step" beat as SectionCard on detail screens — so a creation form
// reads as a guided sequence rather than a flat list of fields.

export function FormSection({ title, icon, children }: { title: string; icon?: FeatherIconName; children: ReactNode }) {
  const fields = Children.toArray(children);
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        {icon ? <IconTile icon={icon} color={Palette.blue} soft={Palette.blueSoft} size={22} iconSize={12} radius={7} /> : null}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionCard}>
        {fields.map((field, index) => (
          <View key={index}>
            {index > 0 ? <View style={styles.fieldSeparator} /> : null}
            {field}
          </View>
        ))}
      </View>
    </View>
  );
}

export function FormField({
  label,
  value,
  placeholder,
  onPress,
  keyboardType,
  onChangeText,
  multiline,
  subtitle,
}: {
  label: string;
  value?: string;
  placeholder: string;
  onPress?: () => void;
  keyboardType?: KeyboardTypeOptions;
  onChangeText?: (text: string) => void;
  multiline?: boolean;
  /** A short, secondary line shown under the value once it's set — e.g. the
   * selected client's company/phone, or the linked intervention's client + date. */
  subtitle?: string;
}) {
  const [focused, setFocused] = useState(false);

  const content = onChangeText ? (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={Palette.textTertiary}
      style={[styles.input, multiline ? styles.inputMultiline : null]}
      keyboardType={keyboardType}
      multiline={multiline}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  ) : (
    <Text style={value ? styles.valueText : styles.placeholderText} numberOfLines={1}>
      {value || placeholder}
    </Text>
  );

  return (
    <View style={styles.field}>
      <Text style={[styles.label, focused && styles.labelFocused]}>{label}</Text>
      {onPress ? (
        <PressableScale onPress={onPress} to={0.98} accessibilityLabel={label} style={styles.selectorRow}>
          <View style={styles.selectorContent}>{content}</View>
          <Feather name="chevron-right" size={17} color={Palette.textTertiary} />
        </PressableScale>
      ) : (
        content
      )}
      {subtitle ? (
        <Text style={styles.fieldSubtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

export function FormSubmitButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <PressableScale onPress={onPress} to={0.97} style={styles.submitButton} accessibilityLabel={label}>
      <Text style={styles.submitText}>{label}</Text>
    </PressableScale>
  );
}

const styles = createThemedStyles(() => StyleSheet.create({
  section: {
    marginTop: Spacing.section,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
    color: Palette.textTertiary,
    textTransform: 'uppercase',
    marginLeft: 2,
  },
  sectionCard: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.lg,
    ...cardShadow,
  },
  field: {
    paddingVertical: 12,
  },
  selectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  selectorContent: {
    flex: 1,
  },
  fieldSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.border,
  },
  label: {
    fontSize: 12.5,
    fontWeight: '600',
    color: Palette.textTertiary,
    letterSpacing: -0.1,
    marginBottom: 4,
  },
  labelFocused: {
    color: Palette.blue,
  },
  input: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
    padding: 0,
  },
  inputMultiline: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  valueText: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  placeholderText: {
    fontSize: FontSize.body,
    fontWeight: '500',
    color: Palette.textTertiary,
    letterSpacing: -0.2,
  },
  fieldSubtitle: {
    fontSize: 12.5,
    fontWeight: '500',
    color: Palette.textTertiary,
    letterSpacing: -0.1,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: Palette.blue,
    borderRadius: Radius.tile,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: Spacing.section,
  },
  submitText: {
    fontSize: FontSize.label,
    fontWeight: '700',
    color: Palette.white,
    letterSpacing: -0.1,
  },
}));
