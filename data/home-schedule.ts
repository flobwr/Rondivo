import { Appointment } from '@/components/home/appointment-card';

export const HAS_NEXT_INTERVENTION = true;

/** Matches `INTERVENTIONS['next']` in `data/interventions.ts` — the Hero Card's intervention. */
export const NEXT_INTERVENTION_ID = 'next';
export const NEXT_INTERVENTION_ADDRESS = '24 Av. Félix Faure, 69003 Lyon';

export const REMAINING_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    time: '13:00',
    client: 'Sophie Bernard',
    type: 'Pose de radiateur',
    address: '8 rue Molière, 69003 Lyon',
    status: 'Confirmé',
  },
  {
    id: '2',
    time: '15:30',
    client: 'Marc Petit',
    type: 'Dépannage urgence',
    address: '42 cours Vitton, 69006 Lyon',
    status: 'Confirmé',
  },
];

export const HOME_INTERVENTIONS_TODAY_COUNT = 5;
