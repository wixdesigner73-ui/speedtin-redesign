import { useState } from "react";
import { Link } from "react-router-dom";
import { story } from "../data/site";
import { Arrow, Close, Play } from "./Icons";
import { lockScroll } from "../lib/motion";
import { useEffect } from "react";

function KickstarterModal({ open, onClose }) {
  useEffect(() => {
    lockScroll(open);
    if (!open) return;
    const k = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => { window.removeEventListener("keydown", k); lockScroll(false); };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Speed Tin Kickstarter video">
      <div className="modal__scrim" onClick={onClose} />
      <div className="modal__box">
        <button className="icon-btn modal__x" onClick={onClose} aria-label="Close video"><Close /></button>
        <video src={story.kickstarterSrc} poster="/media/video/kickstarter-poster.jpg" controls autoPlay playsInline preload="none" />
      </div>
    </div>
  );
}

// `full` renders the whole story (About page); otherwise a condensed editorial version for the home page.
export default function StorySection({ full = false, showTitle = true }) {
  const [open, setOpen] = useState(false);
  return (
    <section className="story on-light" aria-labelledby={showTitle ? "story-h" : undefined} aria-label={showTitle ? undefined : "The story of Speed Tin"}>
      <div className="wrap story__grid">
        <div className="story__media">
          <div className="story__sticky">
            <div className="story__img" data-reveal="img">
              <img data-parallax="0.08" src="/media/bartender-double.webp" width="1800" height="2700" alt="A bartender pouring two cocktails at once with Speed Tins" loading="lazy" decoding="async" />
            </div>
            <p className="story__cap"><span>Speed Tin</span> Shake · Serve · Speed</p>
          </div>
        </div>

        <div className="story__copy">
          {showTitle && (
            <>
              <p className="eyebrow" data-reveal="up">Our Story</p>
              <h2 id="story-h" className="display" data-reveal="up" data-delay="0.06">{story.title}</h2>
            </>
          )}

          <div className="story__block" data-reveal="up">
            <h3 className="h3">{story.purposeTitle}</h3>
            {story.purpose.map((p) => (<p key={p}>{p}</p>))}
            <p className="story__wantLead">I want Speed Tin to genuinely help everyone:</p>
            <dl className="story__wants">
              {story.wants.map(([k, v]) => (<div key={k}><dt>{k}</dt><dd>{v}</dd></div>))}
            </dl>
            <p>{story.gratitude}</p>
          </div>

          {full && (
            <>
              <div className="story__block" data-reveal="up">
                <h3 className="h3">{story.evolutionTitle}</h3>
                <p>{story.evolutionLead}</p>
                <p>{story.evolutionIntro}</p>
                <ol className="story__steps">
                  {story.evolution.map(([k, v], i) => (<li key={k}><span>0{i + 1}</span><div><strong>{k}</strong><p>{v}</p></div></li>))}
                </ol>
                <figure className="story__fig" data-reveal="img"><img src="/media/evolution.webp" width="1024" height="663" alt="Speed Tin evolution: ten prototypes from where it all started to the finished product" loading="lazy" /></figure>
                <figure className="story__fig" data-reveal="img"><img src="/media/timeline.webp" width="1024" height="576" alt="Speed Tin timeline, 2022 to 2025" loading="lazy" /></figure>
              </div>
              <div className="story__block" data-reveal="up">
                <h3 className="h3">{story.dedicationTitle}</h3>
                {story.dedication.map((p) => (<p key={p}>{p}</p>))}
              </div>
            </>
          )}

          <div className="story__cta" data-reveal="up">
            <Link to="/collections/shop" className="btn btn--dark">Shop Speed Tin <Arrow /></Link>
            {full ? (
              <button className="btn btn--ghost-dark" onClick={() => setOpen(true)}><Play /> {story.kickstarterLabel}</button>
            ) : (
              <Link to="/pages/about-us" className="link-u">Read the full story <Arrow /></Link>
            )}
          </div>
        </div>
      </div>
      <KickstarterModal open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
