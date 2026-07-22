/**
 * Rondivo Design System — public entry point.
 *
 * Import primitives from here, not from individual files:
 *
 *   import { AppCard, CardHeader, AppText, AppButton } from '@/components/ui';
 *
 * Every primitive consumes design tokens exclusively (constants/design.ts,
 * constants/shadow.ts, constants/motion.ts). See:
 *   - components/ui/README.md         — catalogue + usage
 *   - ARCHITECTURE_RULES.md           — how screens/features are structured
 *   - COMPONENT_GUIDELINES.md         — when to make a primitive/variant/etc.
 */

// Foundations
export { AppText } from './app-text';
export type { AppTextProps } from './app-text';
export { PressableScale } from './pressable-scale';
export type { PressableScaleProps } from './pressable-scale';

// Surfaces & layout
export { AppSurface } from './app-surface';
export type { AppSurfaceProps } from './app-surface';
export { AppCard, CardHeader, CardContent, CardFooter, CardActions } from './app-card';
export type { AppCardProps } from './app-card';
export { AppSection } from './app-section';
export type { AppSectionProps } from './app-section';
export { AppScreen } from './app-screen';
export type { AppScreenProps } from './app-screen';
export { AppHeader } from './app-header';
export type { AppHeaderProps } from './app-header';
export { AppToolbar } from './app-toolbar';
export type { AppToolbarProps } from './app-toolbar';
export { AppDivider } from './app-divider';
export type { AppDividerProps } from './app-divider';

// Controls
export { AppButton } from './app-button';
export type { AppButtonProps } from './app-button';
export { AppIconButton } from './app-icon-button';
export type { AppIconButtonProps } from './app-icon-button';
export { AppChip } from './app-chip';
export type { AppChipProps } from './app-chip';

// Content bits
export { AppIconTile } from './app-icon-tile';
export type { AppIconTileProps } from './app-icon-tile';
export { AppBadge } from './app-badge';
export type { AppBadgeProps } from './app-badge';
export { AppStatus } from './app-status';
export type { AppStatusProps } from './app-status';
export { AppAvatar } from './app-avatar';
export type { AppAvatarProps } from './app-avatar';
export { AppMetric } from './app-metric';
export type { AppMetricProps } from './app-metric';
export { AppListItem } from './app-list-item';
export type { AppListItemProps } from './app-list-item';

// Feedback & states
export { AppEmptyState } from './app-empty-state';
export type { AppEmptyStateProps } from './app-empty-state';
export { AppSkeleton } from './app-skeleton';
export type { AppSkeletonProps } from './app-skeleton';

// Forms
export { AppInput } from './app-input';
export type { AppInputProps } from './app-input';
export { AppFormField } from './app-form-field';
export type { AppFormFieldProps } from './app-form-field';
export { AppSelect } from './app-select';
export type { AppSelectProps, SelectOption } from './app-select';

// Overlays
export { AppModal } from './app-modal';
export type { AppModalProps } from './app-modal';
export { AppBottomSheet } from './app-bottom-sheet';
export type { AppBottomSheetProps } from './app-bottom-sheet';
