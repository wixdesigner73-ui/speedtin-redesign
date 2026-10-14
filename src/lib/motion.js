import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { prefersReducedMotion } from "./format";

gsap.registerPlugin(ScrollTrigger);

let lenis = null;
export const getLenis = () => lenis;

export function initSmoothScroll() {
  if (lenis || prefersReducedMotion()) return null;
  lenis = new Lenis({ lerp: 0.095, smoothWheel: true, wheelMultiplier: 0.95, touchMultiplier: 1.4 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis && lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function scrollToTop(immediate = true) {
  if (lenis) lenis.scrollTo(0, { immediate });
  else window.scrollTo(0, 0);
}

export function scrollToEl(el, offset = -80) {
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
}

export function lockScroll(lock) {
  if (lenis) (lock ? lenis.stop() : lenis.start());
  document.documentElement.style.overflow = lock ? "hidden" : "";
}

/**
 * Declarative scroll reveals. Elements in `root` marked with:
 *   data-reveal="up|fade|left|right|scale|img"   data-delay="0.1"
 *   data-parallax="0.12"  (img inside moves with scroll)
 * Everything is a one-shot ScrollTrigger, and nothing runs for reduced-motion users.
 */
export function setupReveals(root) {
  if (!root) return () => {};
  const reduce = prefersReducedMotion();
  const ctx = gsap.context(() => {}, root);

  const run = () => ctx.add(() => {
    gsap.utils.toArray("[data-reveal]:not([data-rv])", root).forEach((el) => {
      el.dataset.rv = "1";
      if (reduce) { gsap.set(el, { opacity: 1, clearProps: "transform" }); return; }
      const kind = el.dataset.reveal || "up";
      const delay = parseFloat(el.dataset.delay || "0");
      const base = { opacity: 0 };
      const to = { opacity: 1, duration: 1.15, delay, ease: "power3.out", overwrite: "auto", clearProps: "clipPath" };
      if (kind === "up") base.y = 44;
      if (kind === "left") base.x = -54;
      if (kind === "right") base.x = 54;
      if (kind === "scale") base.scale = 0.94;
      if (kind === "img") {
        base.clipPath = "inset(9% 9% 9% 9% round 30px)";
        base.opacity = 1;
        to.clipPath = "inset(0% 0% 0% 0% round 30px)";
        to.duration = 1.5;
        to.ease = "expo.out";
        const img = el.querySelector("img, video");
        if (img) gsap.fromTo(img, { scale: 1.22 }, { scale: 1, duration: 1.9, delay, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      }
      Object.assign(to, { x: 0, y: 0, scale: 1 });
      gsap.fromTo(el, base, { ...to, scrollTrigger: { trigger: el, start: "top 88%", once: true } });
    });
    if (!reduce) {
      gsap.utils.toArray("[data-parallax]:not([data-rp])", root).forEach((el) => {
        el.dataset.rp = "1";
        const k = parseFloat(el.dataset.parallax || "0.1");
        gsap.fromTo(el, { yPercent: -k * 50 }, { yPercent: k * 50, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
      });
    }
  });

  run();
  // Lazy-loaded routes mount after this runs: pick up their elements as they appear.
  let t = 0;
  const mo = new MutationObserver(() => { clearTimeout(t); t = setTimeout(() => { run(); ScrollTrigger.refresh(); }, 40); });
  mo.observe(root, { childList: true, subtree: true });
  return () => { clearTimeout(t); mo.disconnect(); ctx.revert(); };
}

export { gsap, ScrollTrigger };
