import { useEffect, useState } from 'react';

/** '10:30' → 630 (minutes since midnight). */
export function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/** 630 → '10:30' — wraps around midnight. */
export function formatMinutes(min: number): string {
  const wrapped = ((min % 1440) + 1440) % 1440;
  return `${String(Math.floor(wrapped / 60)).padStart(2, '0')}:${String(wrapped % 60).padStart(2, '0')}`;
}

/** '10:30' − 18 → '10:12'. */
export function subtractMinutes(time: string, minutes: number): string {
  return formatMinutes(parseTimeToMinutes(time) - minutes);
}

/**
 * Current time as minutes since midnight, re-evaluated every `intervalMs` so
 * the hero card's departure countdown stays honest while the screen is open.
 */
export function useNowMinutes(intervalMs = 30000): number {
  const [now, setNow] = useState(() => minutesNow());

  useEffect(() => {
    const id = setInterval(() => setNow(minutesNow()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}

function minutesNow(): number {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

export type DepartureState = {
  /** 'dans 25 min', 'Partez maintenant', 'Départ dépassé'… */
  label: string;
  /** true once it's time to leave (or later) — the countdown pill turns solid. */
  urgent: boolean;
  /** Which state colour the departure board should wear:
   *  countdown = blue (actif), leave = orange (attention), late = red (erreur). */
  phase: 'countdown' | 'leave' | 'late';
};

/**
 * The live "when do I leave" read-out. Before the advised departure it counts
 * down; between departure and the appointment it pushes; after the start time
 * it flags the miss without drama.
 */
export function getDepartureState(departureMin: number, startMin: number, nowMin: number): DepartureState {
  const diff = departureMin - nowMin;
  if (diff > 60) {
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return { label: m > 0 ? `dans ${h} h ${String(m).padStart(2, '0')}` : `dans ${h} h`, urgent: false, phase: 'countdown' };
  }
  if (diff > 0) return { label: `dans ${diff} min`, urgent: false, phase: 'countdown' };
  if (nowMin < startMin) return { label: 'Partez maintenant', urgent: true, phase: 'leave' };
  return { label: 'Départ dépassé', urgent: true, phase: 'late' };
}
