/**
 * Fig07Data: shared data for fig-07 (and fig-08's band colours).
 * Illustrative positions only. They show order and spacing, not the real
 * levels, which the post does not publish.
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
  worker: [0.38, 0.48, 0.56],
  conductor: [0.46, 0.58, 0.66],
  cos: [0.54, 0.68, 0.78],
};
const BUILD: [number, number, number] = [0.12, 0.17, 0.22];

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
