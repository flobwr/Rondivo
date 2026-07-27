import type { ReactNode } from 'react';

/** A rectangle in WINDOW coordinates — what `measureInWindow` returns. */
export type LivingRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/** What the expanded content is handed so it can drive its own dismissal. */
export type LivingHandle = {
  /** Collapse back onto the source card. */
  close: () => void;
};

export type LivingSource = {
  /** Where the card is on screen at the moment it was opened. */
  rect: LivingRect;
  /** The collapsed card's corner radius — the value the expansion starts from. */
  radius: number;
  /** The corner radius the surface reaches when fully open. */
  expandedRadius: number;
  /** Points of inset between the fully open surface and the window edges. */
  expandedInset: number;
  /** The card, redrawn inside the surface so frame 0 is pixel-identical. */
  renderSummary: () => ReactNode;
  /** The detail that grows out of it. */
  renderDetail: (handle: LivingHandle) => ReactNode;
  /** Called once the surface has landed back on the card. */
  onSettled: () => void;
};

export type LivingContextValue = {
  /** Hand a card over to the layer. Only one card lives at a time. */
  present: (source: LivingSource) => void;
  /** Collapse whatever is open. */
  dismiss: () => void;
};
