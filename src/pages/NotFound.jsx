import { Link } from "react-router-dom";
import { pour } from "../data/heroArt";
import PageHero from "../components/PageHero";
import { Arrow } from "../components/Icons";
import { useMeta } from "../hooks/useMeta";

export default function NotFound() {
  useMeta("Page not found", "This page could not be found.");
  return (
    <PageHero eyebrow="404" title={<>That one slipped <span className="serif">through the strainer.</span></>} lede="We couldn’t find that page. Head back to the bar." art={pour}>
      <Link to="/" className="btn">Back to home <Arrow /></Link>
      <Link to="/collections/shop" className="btn btn--ghost">Shop Speed Tin</Link>
    </PageHero>
  );
}
