import { useState } from "react";
import { Play } from "./Icons";

// Click-to-load: no YouTube code or cookies are loaded until the visitor presses play.
export default function YouTubeEmbed({ id, title, className = "" }) {
  const [on, setOn] = useState(false);
  return (
    <div className={`yt ${className}`}>
      {on ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button className="yt__poster" onClick={() => setOn(true)} aria-label={`Play video: ${title}`}>
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" />
          <span className="yt__play"><Play /></span>
          <span className="yt__title">{title}</span>
        </button>
      )}
    </div>
  );
}
