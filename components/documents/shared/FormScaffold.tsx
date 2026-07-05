import { Feather } from '@expo/vector-icons';
import { Children, ReactNode } from 'react';
import { StyleSheet, Text, TextInput, View, type KeyboardTypeOptions } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { PressableScale } from './primitives';

// Shared chrome for the Documents module's creation screens (Facture, Devis,
// Rapport). These are architecture-first skeletons — real line items, VAT
// math, etc. come later — so the scaffold favours a few very clear sections
// over a dense form.

export function FormSection({ title, children }: { title: string; children: ReactNode }) {
  const fields = Children.toArray(children);
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
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
}: {
  label: string;
  value?: string;
  placeholder: string;
  onPress?: () => void;
  keyboardType?: KeyboardTypeOptions;
  onChangeText?: (text: string) => void;
  multiline?: boolean;
}) {
  const content = onChangeText ? (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={Palette.textTertiary}
      style={[styles.input, multiline ? styles.inputMultiline : null]}
      keyboardType={keyboardType}
      multiline={multiline}
    />
  ) : (
    <Text style={value ? styles.valueText : styles.placeholderText} numberOfLines={1}>
      {value || placeholder}
    </Text>
  );

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {onPress ? (
        <PressableScale onPress={onPress} to={0.98} accessibilityLabel={label} style={styles.selectorRow}>
          <View style={styles.selectorContent}>{content}</View>
          <Feather name="chevron-right" size={17} color={Palette.textTertiary} />
        </PressableScale>
      ) : (
        content
      )}
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

const styles = StyleSheet.create({
  section: {
    marginTop: Spacing.section,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
    color: Palette.textTertiary,
    textTransform: 'uppercase',
    marginBottom: 10,
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
});
