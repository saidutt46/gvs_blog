/**
 * Fig07Data: shared data for fig-07 (and fig-08's band colours).
 * Marker positions are relative shares of the context window, taken from
 * the per-role levels in the brief (07 §1). The figure never prints them.
 */
export type F7Role = 'worker' | 'conductor' | 'cos';
export type F7Era = 'today' | 'build';

export const F7_ROLES: F7Role[] = ['worker', 'conductor', 'cos'];

/** Agent names as they appear in the post's ledger excerpt. */
export const F7_NAMES: Record<F7Role, string> = {
  worker: 'contextsmith-recon-diff-flow',
  conductor: 'cond-contextsmith',
  cos: 'cos',
};

const TODAY: Record<F7Role, [number, number, number]> = {
  worker: [0.2, 0.3, 0.35],
  conductor: [0.3, 0.45, 0.5],
  cos: [0.4, 0.6, 0.7],
};
const BUILD: [number, number, number] = [0.15, 0.2, 0.25];

/** Checkpoint, relay soon and relay now, as shares of the window. */
export function f7Marks(era: F7Era, role: F7Role): [number, number, number] {
  return era === 'build' ? BUILD : TODAY[role];
}

export type F7Level = 'ok' | 'checkpoint' | 'soon' | 'now' | 'compacted';

/** The level a session is at, for a share `f` of the window. */
export function f7Level(f: number, marks: [number, number, number]): F7Level {
  if (f >= 0.99) return 'compacted';
  if (f >= marks[2]) return 'now';
  if (f >= marks[1]) return 'soon';
  if (f >= marks[0]) return 'checkpoint';
  return 'ok';
}
