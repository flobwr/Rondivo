/**
 * Rondivo Design System — component layer.
 *
 * Tokens live in `@/theme`; the shared components that turn those tokens
 * into an interface live here. Screens compose ONLY these primitives for
 * chrome (bars, docks, buttons, badges, cards, rows, states) — a screen
 * defining its own button or shadow is a design-system bug.
 */

export { AppBar } from './AppBar';
export { Badge, type BadgeTone } from './Badge';
export { BottomDock } from './BottomDock';
export { Button } from './Button';
export { Card } from './Card';
export { EmptyState } from './EmptyState';
export { FormInput } from './FormInput';
export { IconWell, type IconName } from './IconWell';
export { ListRow, RowSeparator } from './ListRow';
export { PressableScale } from './PressableScale';
export { SearchField } from './SearchField';
export { SegmentedTabs } from './SegmentedTabs';
export { SkeletonBlock } from './Shimmer';
export { LargeTitleBar } from './LargeTitleBar';
export { ChipRow, type ChipItem } from './ChipRow';
