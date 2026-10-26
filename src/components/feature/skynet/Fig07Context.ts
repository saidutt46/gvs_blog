/**
 * Fig07Context.ts: the fig-07 script. Slider, Play (only when motion is
 * allowed), role switch and build-day switch. All state is drawn from the
 * slider value, so every position is an instant, complete state.
 */
import { announce, getFigure, showControls } from '../figure';
import { prefersReducedMotion } from '../motion';
import { F7_NAMES, f7Level, f7Marks, type F7Era, type F7Level, type F7Role } from './Fig07Data';

const LEVEL_TEXT: Record<F7Level, string> = {
  ok: 'Below the checkpoint level: no instruction yet.',
  checkpoint: 'Checkpoint level: write a checkpoint handoff now, then continue.',
  soon: 'Relay soon level: finish only the current step, then write a relay handoff.',
  now: 'Relay now level: stop, write the relay handoff and request a relay. Generation 2 starts under the same name.',
  compacted: 'After compaction: rebuild a handoff from files, not from the summary, then relay.',
};
const CUE: Record<F7Level, string> = {
  ok: 'working',
  checkpoint: 'checkpoint',
  soon: 'relay soon',
  now: 'relay now',
  compacted: 'compacted',
};

export function initFig07(): void {
  const fig = getFigure('fig-07');
  if (!fig) return;
  const root = fig.root.querySelector<HTMLElement>('[data-f7]');
  const range = fig.root.querySelector<HTMLInputElement>('[data-f7-range]');
  const play = fig.root.querySelector<HTMLButtonElement>('[data-f7-play]');
  if (!root || !range || !play) return;

  const fill = root.querySelector<SVGRectElement>('[data-f7-fill]');
  const marks = [0, 1, 2].map((i) => root.querySelector<SVGGElement>(`[data-f7-mark="${i}"]`));
  const cue = root.querySelector<HTMLElement>('[data-f7-cue]');
  const relay = root.querySelector<HTMLElement>('[data-f7-relay]');
  const oldStatus = root.querySelector<HTMLElement>('[data-f7-old]');
  const build = root.querySelector<HTMLElement>('[data-f7-build]');
  const names = root.querySelectorAll<HTMLElement>('[data-f7-name]');
  const levels = root.querySelectorAll<HTMLElement>('[data-f7-level]');

  let role: F7Role = 'conductor';
  let era: F7Era = 'today';
  let last: F7Level | '' = '';
  let raf = 0;

  function draw(say: boolean): void {
    const f = Number(range!.value) / 100;
    const m = f7Marks(era, role);
    const level = f7Level(f, m);
    fill?.setAttribute('width', `${f * 100}%`);
    m.forEach((v, i) => {
      marks[i]?.querySelectorAll('line, text').forEach((el) => {
        const x = `${v * 100}%`;
        if (el.tagName === 'line') {
          el.setAttribute('x1', x);
          el.setAttribute('x2', x);
        } else el.setAttribute('x', x);
      });
    });
    root!.dataset.level = level;
    root!.dataset.era = era;
    root!.dataset.role = role;
    if (cue) cue.textContent = CUE[level];
    levels.forEach((el) => {
      if (el.dataset.f7Level === level) el.dataset.active = 'true';
      else delete el.dataset.active;
    });
    const relayed = level === 'now' || level === 'compacted';
    if (relay) relay.dataset.on = String(relayed);
    if (oldStatus)
      oldStatus.textContent =
        level === 'compacted'
          ? 'compacted: rebuilds a handoff from files'
          : relayed
            ? 'writes a relay handoff, then "handoff ready"'
            : 'working';
    if (build) build.hidden = era !== 'build';
    names.forEach((n) => (n.textContent = F7_NAMES[role]));
    range!.setAttribute('aria-valuetext', level === 'ok' ? 'below the checkpoint level' : `${CUE[level]} level`);
    if (say && level !== last) announce(fig!, LEVEL_TEXT[level]);
    last = level;
  }

  function stop(): void {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    play!.setAttribute('aria-pressed', 'false');
  }

  function start(): void {
    if (prefersReducedMotion()) return;
    stop();
    const end = Math.min(100, Math.round(f7Marks(era, role)[2] * 100) + 4);
    const t0 = performance.now();
    const ms = 4000;
    play!.setAttribute('aria-pressed', 'true');
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / ms);
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
  fig.root.querySelectorAll<HTMLInputElement>('input[name="f7-role"]').forEach((r) =>
    r.addEventListener('change', () => {
      role = r.value as F7Role;
      last = '';
      draw(true);
    }),
  );
  fig.root.querySelectorAll<HTMLInputElement>('input[name="f7-era"]').forEach((r) =>
    r.addEventListener('change', () => {
      era = r.value as F7Era;
      last = '';
      draw(true);
    }),
  );
  if (!prefersReducedMotion()) {
    play.hidden = false;
    play.setAttribute('aria-pressed', 'false');
    play.addEventListener('click', () => (raf ? stop() : start()));
  }

  draw(false);
  showControls(fig);
}
