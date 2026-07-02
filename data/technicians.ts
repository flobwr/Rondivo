import { type Tint } from '@/components/clients/types';

export type Technician = {
  id: string;
  name: string;
  initials: string;
  tint: Tint;
  isCurrentUser?: boolean;
};

// The current user is first + default-selected, so a solo artisan never touches
// this field.
export const TECHNICIANS: Technician[] = [
  { id: 'me', name: 'Moi', initials: 'MO', tint: 'blue', isCurrentUser: true },
  { id: 'lucas', name: 'Lucas Bernard', initials: 'LB', tint: 'orange' },
  { id: 'sarah', name: 'Sarah Petit', initials: 'SP', tint: 'purple' },
];

export const CURRENT_TECHNICIAN = TECHNICIANS[0];
