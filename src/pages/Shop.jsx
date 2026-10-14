import { difference } from "../data/site";
import PageHero from "../components/PageHero";
import Collection from "../components/Collection";

export default function Shop() {
  return (
    <>
      <PageHero eyebrow="Shop" title={difference.banner} lede="Ships within 24 hours!" />
      <Collection heading={false} />
    </>
  );
}
