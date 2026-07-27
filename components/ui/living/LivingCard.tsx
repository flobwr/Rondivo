import { useCallback, useRef, useState, type ReactNode } from 'react';
import { View } from 'react-native';

import { Radius } from '@/theme';
import { useLiving } from './LivingLayer';
import type { LivingHandle } from './types';

type Props = {
  /**
   * The detail this card grows into. Receives a handle so the detail can
   * close itself (a header button, a primary action, anything).
   */
  detail: (handle: LivingHandle) => ReactNode;
  /**
   * The card at rest.
   *
   * `open` lets the call site decide what triggers the expansion — its own
   * `Pressable`, a long-press, a chevron. `LivingCard` never wraps the card in
   * a pressable of its own, so press feedback, accessibility and hit slop stay
   * where they belong: in the card.
   *
   * `atRest` is true for the ONE copy the transition layer redraws as frame 0
   * of the expansion. A card with an entrance animation must forward it, or
   * the copy will fade in from nothing and break the illusion that the card
   * and the surface are the same object.
   */
  children: (open: () => void, atRest: boolean) => ReactNode;
  /** The card's own corner radius — where the morph starts. Defaults to a sheet. */
  radius?: number;
  /**
   * The radius the surface reaches when open. Smaller than `radius` on
   * purpose: corners relax as a card becomes a page, which is what tells the
   * eye it has grown rather than moved.
   */
  expandedRadius?: number;
  /** Points left between the open surface and the window edges. 0 = full page. */
  expandedInset?: number;
  /** Skip the expansion entirely (a disabled or empty card). */
  disabled?: boolean;
};

/**
 * Wraps any card so it can grow into its own detail and shrink back onto its
 * exact place in the list.
 *
 * The contract is deliberately small — hand it what the card looks like and
 * what it becomes:
 *
 * ```tsx
 * <LivingCard detail={({ close }) => <ClientDetail id={id} onClose={close} />}>
 *   {(open) => <ClientCard client={client} onPress={open} />}
 * </LivingCard>
 * ```
 *
 * Nothing about this is specific to the Planning: any card in the app —
 * intervention, client, document, invoice, photo, vehicle — becomes living by
 * being wrapped in it, and inherits the same physics for free.
 *
 * While the card is open it is hidden here and drawn by the layer instead, so
 * there is only ever ONE of it on screen. It keeps its space in the list
 * (`opacity`, never `display`), which is what lets the surface come home to a
 * rectangle that has not moved.
 */
export function LivingCard({
  detail,
  children,
  radius = Radius.card,
  expandedRadius = Radius.tile,
  expandedInset = 0,
  disabled = false,
}: Props) {
  const anchor = useRef<View>(null);
  const [open, setOpen] = useState(false);
  const living = useLiving();

  const present = useCallback(() => {
    if (disabled) return;
    const node = anchor.current;
    if (!node) return;

    node.measureInWindow((x, y, width, height) => {
      if (!width || !height) return;
      setOpen(true);
      living.present({
        rect: { x, y, width, height },
        radius,
        expandedRadius,
        expandedInset,
        // The card is redrawn by the layer from the SAME element the list
        // renders, so the first frame of the expansion is not a look-alike —
        // it is the card. `open` is inert in that copy: the surface is
        // already open.
        renderSummary: () => children(() => {}, true),
        renderDetail: detail,
        onSettled: () => setOpen(false),
      });
    });
  }, [disabled, living, radius, expandedRadius, expandedInset, children, detail]);

  return (
    <View
      ref={anchor}
      collapsable={false}
      // Hidden, not unmounted: the row keeps its height and its position, so
      // the collapse lands on the exact rectangle it started from.
      style={open ? styles.handedOver : undefined}
      pointerEvents={open ? 'none' : 'auto'}>
      {children(present, false)}
    </View>
  );
}

const styles = {
  handedOver: { opacity: 0 },
} as const;
