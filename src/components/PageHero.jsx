// Dark editorial banner used at the top of every inner page (sits under the transparent header).
export default function PageHero({ eyebrow, title, lede, image, children, align = "left", tall = false }) {
  return (
    <header className={`phero ${tall ? "phero--tall" : ""} ${image ? "has-img" : ""} phero--${align}`}>
      {image && (
        <div className="phero__bg" aria-hidden="true">
          <img src={image} alt="" decoding="async" fetchPriority="high" />
        </div>
      )}
      <div className="wrap phero__in">
        {eyebrow && <p className="eyebrow" data-reveal="up">{eyebrow}</p>}
        <h1 className="display phero__title" data-reveal="up" data-delay="0.06">{title}</h1>
        {lede && <p className="lede" data-reveal="up" data-delay="0.12">{lede}</p>}
        {children && <div className="phero__actions" data-reveal="up" data-delay="0.2">{children}</div>}
      </div>
    </header>
  );
}
