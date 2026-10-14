import { useRef, useState } from "react";
import { videos, social, closing } from "../data/site";
import { Play } from "./Icons";

// The live site's three vertical social clips. They load on demand and play with sound on tap.
function Clip({ clip, i }) {
  const v = useRef(null);
  const [on, setOn] = useState(false);
  const toggle = () => {
    const el = v.current;
    if (!on) {
      document.querySelectorAll(".clip video").forEach((o) => o !== el && o.pause());
      el.muted = false;
      el.play().then(() => setOn(true)).catch(() => {});
    } else { el.pause(); setOn(false); }
  };
  return (
    <button className={`clip ${on ? "is-on" : ""}`} onClick={toggle} aria-label={on ? `Pause clip ${i + 1}` : `Play clip ${i + 1} with sound`} data-reveal="up" data-delay={i * 0.1}>
      <video ref={v} src={clip.src} poster={clip.poster} playsInline preload="none" loop onEnded={() => setOn(false)} />
      <span className="clip__play"><Play /></span>
    </button>
  );
}

export default function Social() {
  return (
    <section className="soc" aria-labelledby="soc-h">
      <div className="wrap soc__head">
        <div>
          <p className="eyebrow" data-reveal="up">On the bar</p>
          <h2 id="soc-h" className="h2" data-reveal="up" data-delay="0.08">{closing.newsletterNote}</h2>
        </div>
        <div className="soc__links" data-reveal="up" data-delay="0.12">
          {social.map((s) => (<a key={s.label} className="btn btn--ghost btn--sm" href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>))}
        </div>
      </div>
      <div className="wrap soc__row">
        {videos.social.map((c, i) => (<Clip key={c.src} clip={c} i={i} />))}
      </div>
    </section>
  );
}
