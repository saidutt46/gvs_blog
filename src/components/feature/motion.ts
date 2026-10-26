/**
 * motion.ts: the two motion rules every feature figure follows.
 *
 * Contract:
 * - `prefersReducedMotion()` is true when the reader asked for reduced
 *   motion. Then: no animation; show the final state, or a step-through
 *   with buttons. Check it at the moment you would animate.
 * - `onceInView(el, fn, threshold?)` calls `fn` once, the first time `el`
 *   is at least `threshold` (default 0.3) visible, then stops watching.
 *   Use it for "runs once when the figure scrolls into view". With no
 *   IntersectionObserver it calls `fn` at once. Returns a cancel function.
 * - Nothing loops without a control, and autoplay is off by default
 *   (DESIGN.md "Feature posts").
 */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function onceInView(el: Element, fn: () => void, threshold = 0.3): () => void {
  if (typeof IntersectionObserver === 'undefined') {
    fn();
    return () => {};
  }
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        fn();
      }
    },
    { threshold },
  );
  observer.observe(el);
  return () => observer.disconnect();
}
