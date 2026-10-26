/**
 * Fig08ModBand.ts: the fig-08 script. A slider (touch and keyboard) and a
 * Play button (only when motion is allowed) grow the band's context bar.
 */
import { announce, getFigure, showControls } from '../figure';
import { prefersReducedMotion } from '../motion';
import { f7Level, f7Marks } from './Fig07Data';

const MARKS = f7Marks('today', 'conductor');
const STATE: Record<string, string> = {
  ok: 'below the checkpoint',
  checkpoint: 'checkpoint level',
  soon: 'relay level',
  now: 'relay level',
  compacted: 'relay level',
};

export function initFig08(): void {
  const fig = getFigure('fig-08');
  if (!fig) return;
  const root = fig.root.querySelector<HTMLElement>('[data-f8]');
  const range = fig.root.querySelector<HTMLInputElement>('[data-f8-range]');
  const play = fig.root.querySelector<HTMLButtonElement>('[data-f8-play]');
  if (!root || !range || !play) return;
  const cells = root.querySelectorAll<SVGRectElement>('[data-f8-cell]');
  const pct = root.querySelector<HTMLElement>('[data-f8-pct]');
  const next = root.querySelector<HTMLElement>('[data-f8-next]');
  let last = '';
  let raf = 0;

  function draw(say: boolean): void {
    const v = Number(range!.value);
    const level = f7Level(v / 100, MARKS);
    const red = level === 'soon' || level === 'now' || level === 'compacted';
    root!.dataset.level = level;
    cells.forEach((c, i) => {
      if (i < Math.round(v / 10)) c.dataset.on = 'true';
      else delete c.dataset.on;
    });
    if (pct) pct.textContent = `${v}%`;
    if (next) next.textContent = red ? '⚠ relay' : 'next: relay';
    const text = `ctx ${v}%, ${STATE[level]}`;
    range!.setAttribute('aria-valuetext', text);
    if (say && STATE[level] !== last) announce(fig!, text);
    last = STATE[level];
  }

  function stop(): void {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    play!.setAttribute('aria-pressed', 'false');
  }

  function start(): void {
    if (prefersReducedMotion()) return;
    stop();
    const end = Math.round(MARKS[2] * 100) + 4;
    const t0 = performance.now();
    play!.setAttribute('aria-pressed', 'true');
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / 3000);
      range!.value = String(Math.round(end * k));
      draw(true);
      if (k < 1) raf = requestAnimationFrame(tick);
      else stop();
    };
    raf = requestAnimationFrame(tick);
  }

  range.addEventListener('input', () => {
    stop();
    draw(true);
  });
  if (!prefersReducedMotion()) {
    play.hidden = false;
    play.addEventListener('click', () => (raf ? stop() : start()));
  }
  draw(false);
  showControls(fig);
}
