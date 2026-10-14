import { Link } from "react-router-dom";
import { performance as perf, videos } from "../data/site";
import VideoFrame from "./VideoFrame";
import { Arrow } from "./Icons";

const stills = [
  { src: "/media/bar-pour-trio.webp", w: 2200, h: 1467 },
  { src: "/media/bartender-pour.webp", w: 1800, h: 1979 },
  { src: "/media/bar-duo.webp", w: 2200, h: 1467 },
];

export default function Performance() {
  return (
    <section className="perf" aria-labelledby="perf-h">
      <div className="wrap perf__grid">
        <div className="perf__video" data-reveal="img">
          <VideoFrame src={videos.demo.src} poster={videos.demo.poster} label="Speed Tin in use behind the bar" />
          <span className="perf__tag">Real footage · Speed Tin</span>
        </div>

        <div className="perf__copy">
          <p className="eyebrow" data-reveal="up">Performance</p>
          <h2 id="perf-h" className="display perf__title" data-reveal="up" data-delay="0.06">
            Built for <span className="serif">Speed</span> &amp; Performance
          </h2>
          <p className="lede" data-reveal="up" data-delay="0.12">{perf.copy}</p>
          <ul className="perf__points">
            {perf.points.map((p, i) => (
              <li key={p} data-reveal="up" data-delay={0.16 + i * 0.08}>
                <span className="n">0{i + 1}</span>
                <span className="t">{p}</span>
              </li>
            ))}
          </ul>
          <div data-reveal="up" data-delay="0.4"><Link to="/collections/shop" className="btn">Shop Speed Tin <Arrow /></Link></div>
        </div>
      </div>

      <div className="wrap perf__tiles">
        {perf.tabs.map((t, i) => (
          <figure key={t} className={`tile tile--${i}`} data-reveal="up" data-delay={i * 0.1}>
            <div className="tile__img" data-reveal="img">
              <img src={stills[i].src} width={stills[i].w} height={stills[i].h} alt="" loading="lazy" decoding="async" />
            </div>
            <figcaption><span>0{i + 1}</span>{t}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
