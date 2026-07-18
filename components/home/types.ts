/** A "reste de la journée" entry on the Home screen — the minimal slice of an
 *  intervention the day list needs (full records live in `data/interventions`). */
export type Appointment = {
  id: string;
  time: string;
  client: string;
  type: string;
  address: string;
  status?: string;
};
