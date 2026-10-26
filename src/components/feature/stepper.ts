/**
 * stepper.ts: a step player for figures that show a sequence (F3, F4, F7).
 *
 * Contract:
 * - `createStepper(fig, options)` takes the parts from `getFigure(id)` and
 *   builds, inside the figure's controls region: a "Prev" button, one dot
 *   button per step (44px hit area, `aria-current="step"` on the active
 *   one), a "Next" button and, when `playLabel` is set and the reader does
 *   not prefer reduced motion, a play button. It then shows the controls.
 * - Options:
 *   - `steps`: one short text per step. Its length is the step count. The
 *     text is announced in the aria-live region as "Step 2 of 5: <text>".
 *   - `onStep(index)`: draw step `index` (0-based). Called on every change,
 *     and once at start with `start` (default 0).
 *   - `playLabel` (optional): label of a play button that advances one
 *     step every `playDelayMs` (default 1500) and stops on the last step.
 *     It never loops. It is not shown under reduced motion.
 * - Returns `{ go(i), next(), prev(), play(), stop(), index() }`.
 * - Prev is disabled on the first step and Next on the last.
 * - Mobile: every button and dot is a 44px tap target. Under 600px Prev,
 *   a "Step n of N" text and Next share one row and the dots are hidden;
 *   Play wraps to its own row. Nothing uses hover.
 * - Before JS runs, the controls stay hidden and the SVG shows its static
 *   final state, so `onStep` must fully set each step's visual state.
 */
import type { FigureParts } from './figure';
import { announce, showControls } from './figure';
import { prefersReducedMotion } from './motion';

export interface StepperOptions {
  steps: string[];
  onStep: (index: number) => void;
  start?: number;
  playLabel?: string;
  playDelayMs?: number;
}

export interface Stepper {
  go: (index: number) => void;
  next: () => void;
  prev: () => void;
  play: () => void;
  stop: () => void;
  index: () => number;
}

function button(label: string, className: string): HTMLButtonElement {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = className;
  b.textContent = label;
  return b;
}

export function createStepper(fig: FigureParts, options: StepperOptions): Stepper {
  const { steps, onStep, playLabel, playDelayMs = 1500 } = options;
  const count = steps.length;
  let current = Math.min(Math.max(options.start ?? 0, 0), count - 1);
  let timer: number | undefined;

  const prevBtn = button('‹ Prev', 'fig-btn');
  const nextBtn = button('Next ›', 'fig-btn');
  const dots = document.createElement('div');
  dots.className = 'fig-dots';
  dots.setAttribute('role', 'group');
  dots.setAttribute('aria-label', 'Steps');
  const dotBtns = steps.map((text, i) => {
    const d = button('', 'fig-dot');
    d.setAttribute('aria-label', `Step ${i + 1} of ${count}: ${text}`);
    d.addEventListener('click', () => {
      stop();
      go(i);
    });
    dots.appendChild(d);
    return d;
  });

  const stepText = document.createElement('span');
  stepText.className = 'fig-step-text';
  stepText.setAttribute('aria-hidden', 'true');

  let playBtn: HTMLButtonElement | undefined;
  if (playLabel && !prefersReducedMotion()) {
    playBtn = button(playLabel, 'fig-btn');
    playBtn.setAttribute('aria-pressed', 'false');
    playBtn.addEventListener('click', () => (timer === undefined ? play() : stop()));
  }

  function render(): void {
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === count - 1;
    dotBtns.forEach((d, i) => {
      if (i === current) d.setAttribute('aria-current', 'step');
      else d.removeAttribute('aria-current');
    });
    stepText.textContent = `Step ${current + 1} of ${count}`;
    onStep(current);
    announce(fig, `Step ${current + 1} of ${count}: ${steps[current]}`);
  }

  function go(index: number): void {
    const next = Math.min(Math.max(index, 0), count - 1);
    if (next === current && fig.live.textContent) return;
    current = next;
    render();
  }

  function stop(): void {
    if (timer !== undefined) window.clearInterval(timer);
    timer = undefined;
    playBtn?.setAttribute('aria-pressed', 'false');
  }

  function play(): void {
    if (prefersReducedMotion()) return;
    stop();
    if (current === count - 1) go(0);
    playBtn?.setAttribute('aria-pressed', 'true');
    timer = window.setInterval(() => {
      if (current >= count - 1) stop();
      else go(current + 1);
    }, playDelayMs);
  }

  prevBtn.addEventListener('click', () => {
    stop();
    go(current - 1);
  });
  nextBtn.addEventListener('click', () => {
    stop();
    go(current + 1);
  });

  fig.controls.append(prevBtn, stepText, dots, nextBtn);
  if (playBtn) fig.controls.append(playBtn);
  showControls(fig);
  render();

  return { go, next: () => go(current + 1), prev: () => go(current - 1), play, stop, index: () => current };
}
