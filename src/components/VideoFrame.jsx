import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../lib/format";
import { Play } from "./Icons";

// Ambient, muted, looping video that only plays while it is on screen.
// Reduced-motion users get the poster and an explicit play button instead of autoplay.
export default function VideoFrame({ src, poster, className = "", label = "Speed Tin demonstration video", segment = null }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => {
      if (reduced && !v.dataset.userPlayed) return;
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.25 });
    io.observe(v);
    const on = () => setPlaying(true), off = () => setPlaying(false);
    v.addEventListener("play", on); v.addEventListener("pause", off);
    return () => { io.disconnect(); v.removeEventListener("play", on); v.removeEventListener("pause", off); };
  }, [reduced]);

  // loop a segment [start, end] of the clip (used by the step-by-step demo)
  useEffect(() => {
    const v = ref.current;
    if (!v || !segment) return;
    const [a, b] = segment;
    const seek = () => { try { v.currentTime = a; } catch { /* metadata not ready */ } };
    const tick = () => { if (v.currentTime >= b || v.currentTime < a - 0.3) v.currentTime = a; };
    if (v.readyState > 0) seek(); else v.addEventListener("loadedmetadata", seek, { once: true });
    v.addEventListener("timeupdate", tick);
    return () => v.removeEventListener("timeupdate", tick);
  }, [segment]);

  const toggle = () => {
    const v = ref.current;
    v.dataset.userPlayed = "1";
    if (v.paused) v.play(); else v.pause();
  };

  return (
    <div className={`vframe ${className}`}>
      <video ref={ref} src={src} poster={poster} muted loop playsInline preload="metadata" autoPlay={!reduced} aria-label={label} />
      <button className={`vframe__btn ${playing ? "is-playing" : ""}`} onClick={toggle} aria-label={playing ? "Pause video" : "Play video"}>
        {playing ? <span className="pause" aria-hidden="true"><i /><i /></span> : <Play />}
      </button>
    </div>
  );
}
