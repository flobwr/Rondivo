/**
 * Lazy, theme-following stylesheets.
 *
 * `StyleSheet.create` at module scope bakes colour values at import time —
 * which froze most screens on the launch palette. `createThemedStyles`
 * keeps the exact same call-site shape but defers evaluation: the factory
 * runs on first access and re-runs after every theme change, so a style
 * that reads the live `Palette` always resolves against the active paper.
 *
 *   const styles = createThemedStyles(() =>
 *     StyleSheet.create({ root: { backgroundColor: Palette.screen } })
 *   );
 *
 * Screens re-render on navigation (tabs `replace`, stacks remount), which
 * is when the fresh values are picked up — no per-screen wiring needed.
 */

let generation = 0;

/** Invalidate every themed stylesheet. Called by `setActivePalette`'s owner. */
export function bumpThemeGeneration() {
  generation += 1;
}

export function createThemedStyles<T extends object>(factory: () => T): T {
  let cache: T | undefined;
  let cachedGeneration = -1;

  const resolve = (): T => {
    if (cache === undefined || cachedGeneration !== generation) {
      cache = factory();
      cachedGeneration = generation;
    }
    return cache;
  };

  return new Proxy({} as T, {
    get: (_target, prop) => Reflect.get(resolve(), prop),
    has: (_target, prop) => Reflect.has(resolve(), prop),
    ownKeys: () => Reflect.ownKeys(resolve()),
    getOwnPropertyDescriptor: (_target, prop) =>
      Reflect.getOwnPropertyDescriptor(resolve(), prop),
  });
}
