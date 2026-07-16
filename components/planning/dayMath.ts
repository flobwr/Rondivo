import { parseTime } from './status';
import { DayItem, Intervention, InterventionStatus, TravelLeg } from './types';

const ACTIVE_STATUSES: InterventionStatus[] = ['enRoute', 'arrived', 'inProgress'];
const ACTIONABLE_STATUSES: InterventionStatus[] = [
  'planned',
  'enRoute',
  'arrived',
  'inProgress',
  'done',
];

export type DayAnalysis = {
  /** index in items of the intervention the hero spotlights, -1 if none */
  heroIndex: number;
  /** index of the travel leg feeding the hero (absorbed into the hero card), -1 if none */
  heroTravelIndex: number;
  /** actionable interventions in chronological order — drives the progress segments */
  segments: InterventionStatus[];
  doneCount: number;
  actionableTotal: number;
  workMin: number;
  travelMin: number;
  travelKm: number;
  /** km still to drive today */
  remainingKm: number;
  /** planned end of the day (end of the last actionable intervention) */
  endMin: number | null;
  /** minutes of lateness vs the required departure, 0 when on time */
  lateMin: number;
  live: boolean;
};

/**
 * Single source of truth for everything the screen derives from a day:
 * who's next, how the day is progressing, when it ends, whether we're late.
 */
export function analyzeDay(items: DayItem[], nowMin?: number): DayAnalysis {
  const live = nowMin != null;

  const segments: InterventionStatus[] = [];
  let doneCount = 0;
  let workMin = 0;
  let travelMin = 0;
  let travelKm = 0;
  let endMin: number | null = null;

  items.forEach((item) => {
    if (item.kind === 'intervention') {
      const apt = item.data;
      if (ACTIONABLE_STATUSES.includes(apt.status)) {
        segments.push(apt.status);
        workMin += apt.durationMin;
        const end = parseTime(apt.end);
        if (endMin == null || end > endMin) endMin = end;
        if (apt.status === 'done') doneCount += 1;
      }
    } else if (item.kind === 'travel') {
      travelMin += item.data.minutes;
      travelKm += item.data.km;
    }
  });

  // A travel leg still has to be driven if the intervention it leads to hasn't
  // been reached yet (planned) or is being driven right now (enRoute).
  let remainingKm = 0;
  items.forEach((item, index) => {
    if (item.kind !== 'travel') return;
    const next = items
      .slice(index + 1)
      .find((i): i is Extract<DayItem, { kind: 'intervention' }> => i.kind === 'intervention');
    if (next && (next.data.status === 'planned' || next.data.status === 'enRoute')) {
      remainingKm += item.data.km;
    }
  });

  // Hero: the intervention that owns the screen right now — an active one if
  // any, otherwise the next planned one. Only meaningful on a live day.
  let heroIndex = -1;
  if (live) {
    heroIndex = items.findIndex(
      (i) => i.kind === 'intervention' && ACTIVE_STATUSES.includes(i.data.status)
    );
    if (heroIndex === -1) {
      heroIndex = items.findIndex(
        (i) => i.kind === 'intervention' && i.data.status === 'planned'
      );
    }
  }

  // The travel leg immediately before the hero (breaks may sit in between) is
  // rendered inside the hero card, not as its own row.
  let heroTravelIndex = -1;
  for (let i = heroIndex - 1; i >= 0; i--) {
    const item = items[i];
    if (item.kind === 'travel') {
      heroTravelIndex = i;
      break;
    }
    if (item.kind === 'intervention') break;
  }

  // Punctuality: only a waiting (planned) hero can be late — active statuses
  // mean we already left.
  let lateMin = 0;
  if (live && heroIndex >= 0) {
    const hero = items[heroIndex] as Extract<DayItem, { kind: 'intervention' }>;
    if (hero.data.status === 'planned') {
      const travel =
        heroTravelIndex >= 0 ? (items[heroTravelIndex] as Extract<DayItem, { kind: 'travel' }>).data : null;
      const departure = parseTime(hero.data.start) - (travel?.minutes ?? 0);
      lateMin = Math.max(0, (nowMin as number) - departure);
    }
  }

  return {
    heroIndex,
    heroTravelIndex,
    segments,
    doneCount,
    actionableTotal: segments.length,
    workMin,
    travelMin,
    travelKm,
    remainingKm,
    endMin,
    lateMin,
    live,
  };
}

export function getHeroTravel(items: DayItem[], analysis: DayAnalysis): TravelLeg | null {
  if (analysis.heroTravelIndex < 0) return null;
  const item = items[analysis.heroTravelIndex];
  return item.kind === 'travel' ? item.data : null;
}

export function getHero(items: DayItem[], analysis: DayAnalysis): Intervention | null {
  if (analysis.heroIndex < 0) return null;
  const item = items[analysis.heroIndex];
  return item.kind === 'intervention' ? item.data : null;
}
