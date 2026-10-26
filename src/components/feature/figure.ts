/**
 * figure.ts: find a Figure's parts from a figure script.
 *
 * Contract:
 * - `getFigure(id)` returns `{ root, svg, controls, live }` for the
 *   `<figure data-fig="<id>">` that Figure.astro renders, or `null` when
 *   the figure is not on the page.
 * - `showControls(fig)` removes `hidden` from the controls region. Call it
 *   only after the script has wired its handlers, so no-JS readers never
 *   see dead buttons.
 * - `announce(fig, text)` writes text to the figure's aria-live region.
 *   Use it for state changes a reader cannot see (step text, toggles).
 */
export interface FigureParts {
  root: HTMLElement;
  svg: HTMLElement;
  controls: HTMLElement;
  live: HTMLElement;
}

export function getFigure(id: string): FigureParts | null {
  const root = document.querySelector<HTMLElement>(`[data-fig="${id}"]`);
  if (!root) return null;
  const svg = root.querySelector<HTMLElement>('.fig-svg');
  const controls = root.querySelector<HTMLElement>('[data-fig-controls]');
  const live = root.querySelector<HTMLElement>('[data-fig-live]');
  if (!svg || !controls || !live) return null;
  return { root, svg, controls, live };
}

export function showControls(fig: FigureParts): void {
  fig.controls.hidden = false;
}

export function announce(fig: FigureParts, text: string): void {
  fig.live.textContent = text;
}
