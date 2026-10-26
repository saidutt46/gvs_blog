/**
 * Fig06Flow: move a small dot (or card) along SVG paths. Used by F6 and F6x.
 *
 * - `flow(svg, paths, ms)` sends one dot along each path at the same time
 *   and resolves when they arrive. The dots are created here and removed at
 *   the end, so the static drawing (no JS, reduced motion) has none.
 * - `visible(el)` is true when the drawing is laid out (the narrow and the
 *   broad variants are both in the page; only one is shown).
 * Callers check `prefersReducedMotion()` first and skip `flow` when it is set.
 */
const NS = 'http://www.w3.org/2000/svg';

export function visible(el: Element): boolean {
  return el.getBoundingClientRect().width > 0;
}

export function flow(
  svg: SVGSVGElement,
  paths: SVGPathElement[],
  ms = 700,
  cls = 'flow-dot',
  r = 5,
): Promise<void> {
  if (!paths.length) return Promise.resolve();
  const dots = paths.map(() => {
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('r', String(r));
    c.setAttribute('class', cls);
    svg.appendChild(c);
    return c;
  });
  const lens = paths.map((p) => p.getTotalLength());
  return new Promise((done) => {
    const t0 = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / ms);
      const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
      paths.forEach((p, i) => {
        const pt = p.getPointAtLength(lens[i] * e);
        dots[i].setAttribute('cx', String(pt.x));
        dots[i].setAttribute('cy', String(pt.y));
      });
      if (k < 1) requestAnimationFrame(tick);
      else {
        dots.forEach((d) => d.remove());
        done();
      }
    };
    requestAnimationFrame(tick);
  });
}
