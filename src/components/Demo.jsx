import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { method, videos } from "../data/site";
import VideoFrame from "./VideoFrame";
import { Arrow } from "./Icons";

// Each step loops the matching moment of the site's own 31-second demo film.
// Build with ice -> Shake -> Strain and pour (the three steps are the live product-page copy).
const SEGMENTS = [
  [4.2, 9.4], // ice and ingredients going into the base tin
  [9.9, 12.6], // shaking
  [12.8, 22.4], // straining and pouring through the built-in strainer
];

export default function Demo() {
  const [active, setActive] = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    const els = refs.current.filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(Number(e.target.dataset.i)); });
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="demo on-light" aria-labelledby="demo-h">
      <div className="wrap demo__head">
        <p className="eyebrow" data-reveal="up">How it works</p>
        <h2 id="demo-h" className="h2" data-reveal="up" data-delay="0.08">From shaking to pouring, <span className="serif">without breaking the tins apart.</span></h2>
      </div>

      <div className="wrap demo__grid">
        <div className="demo__sticky">
          <div className="demo__frame">
            <VideoFrame src={videos.demo.src} poster={videos.demo.poster} segment={SEGMENTS[active]} label={`Step ${active + 1}: ${method[active].title}`} />
            <div className="demo__badge" aria-hidden="true">
              <span key={active}>{method[active].n}</span>
              <em>{method[active].title}</em>
            </div>
          </div>
          <div className="demo__bar" aria-hidden="true">
            {method.map((m, i) => <i key={m.n} className={i <= active ? "on" : ""} />)}
          </div>
        </div>

        <ol className="demo__steps">
          {method.map((m, i) => (
            <li key={m.n} ref={(el) => (refs.current[i] = el)} data-i={i} className={i === active ? "is-active" : ""}>
              <span className="n">{m.n}</span>
              <h3 className="h2">{m.title}</h3>
              <p>{m.copy}</p>
            </li>
          ))}
          <li className="demo__more">
            <p className="lede">See how Speed Tin works: a closer look at the finger grip, quick-pour mechanism and built-in strainer.</p>
            <Link to="/pages/learn-more" className="btn btn--dark">Watch the tutorials <Arrow /></Link>
          </li>
        </ol>
      </div>
    </section>
  );
}
