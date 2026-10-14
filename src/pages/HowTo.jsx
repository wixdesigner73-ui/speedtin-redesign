import { useState } from "react";
import { Link } from "react-router-dom";
import { howTo, method } from "../data/site";
import PageHero from "../components/PageHero";
import YouTubeEmbed from "../components/YouTubeEmbed";
import { Arrow } from "../components/Icons";
import { useMeta } from "../hooks/useMeta";

export default function HowTo() {
  useMeta("How To", "Shake and serve with only one hand. Watch the Speed Tin tutorials: usage, separation and cleaning.");
  const [tab, setTab] = useState(0);
  const q = howTo.quick[tab];
  return (
    <>
      <PageHero eyebrow="How To" title={<>{howTo.title} <span className="serif">{howTo.sub}</span></>} lede="How to use your Speed Tin." image="/media/bar-pour-trio.webp" />

      <section className="how on-light">
        <div className="wrap how__full">
          <div className="how__intro">
            <p className="eyebrow">Watch the full tutorial</p>
            <h2 className="h2">{howTo.fullTutorial.title}</h2>
          </div>
          <YouTubeEmbed id={howTo.fullTutorial.id} title={howTo.fullTutorial.title} />
        </div>

        <div className="wrap how__quick">
          <div className="how__intro">
            <p className="eyebrow">{howTo.quickTitle}</p>
            <h2 className="h2">{q.title}</h2>
            <div className="how__tabs" role="tablist" aria-label="Quick tutorials">
              {howTo.quick.map((t, i) => (
                <button key={t.id} role="tab" aria-selected={i === tab} className={i === tab ? "on" : ""} onClick={() => setTab(i)}>
                  <span>0{i + 1}</span>{t.title}
                </button>
              ))}
            </div>
          </div>
          <YouTubeEmbed key={q.id} id={q.id} title={q.title} />
        </div>

        <div className="wrap how__method">
          <h2 className="h2">From shaking to pouring, <span className="serif">without breaking the tins apart.</span></h2>
          <ol>
            {method.map((m) => (<li key={m.n}><span>{m.n}</span><h3 className="h3">{m.title}</h3><p>{m.copy}</p></li>))}
          </ol>
        </div>

        <div className="wrap how__models">
          {howTo.models.map((m) => (
            <article key={m.key} className="how__model">
              <div className="img"><img src={`/media/${m.img}.webp`} alt="" loading="lazy" /></div>
              <div>
                <h3 className="h2">{m.name}</h3>
                <p className="lede">{m.copy}</p>
                <Link to={m.to} className="btn btn--dark">Shop <Arrow /></Link>
              </div>
            </article>
          ))}
        </div>

        <div className="wrap how__disc">
          <p className="eyebrow">Disclaimer</p>
          <p>{howTo.disclaimer}</p>
        </div>
      </section>
    </>
  );
}
