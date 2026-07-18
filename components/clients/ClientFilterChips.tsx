import { memo } from 'react';

import { ChipRow } from '@/components/ui/ChipRow';
import { STATUS_META, STATUS_ORDER, type ClientStatus } from '@/components/clients/types';
import { type PaletteShape } from '@/theme';

type ClientFilterChipsProps = {
  counts: Record<ClientStatus, number>;
  total: number;
  activeStatus: ClientStatus | null;
  onSelect: (status: ClientStatus | null) => void;
  /** Accepted for compatibility — the DS row reads the theme itself. */
  palette?: PaletteShape;
};

/**
 * Compatibility shim — the Clients status strip is the DS `ChipRow`.
 */
function ClientFilterChipsComponent({ counts, total, activeStatus, onSelect }: ClientFilterChipsProps) {
  return (
    <ChipRow
      items={[
        { key: 'all', label: 'Tous', count: total },
        ...STATUS_ORDER.map((status) => ({
          key: status,
          label: STATUS_META[status].label,
          count: counts[status],
          dotColor: STATUS_META[status].color,
        })),
      ]}
      activeKey={activeStatus}
      onSelect={(key) => onSelect(key as ClientStatus | null)}
    />
  );
}

export const ClientFilterChips = memo(ClientFilterChipsComponent);
