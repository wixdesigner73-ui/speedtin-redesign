import { story } from "../data/site";
import PageHero from "../components/PageHero";
import StorySection from "../components/StorySection";
import FinalCTA from "../components/FinalCTA";
import { useMeta } from "../hooks/useMeta";

export default function Story() {
  useMeta("Our Story", "The story of Speed Tin: from the first sketches in 2022 to the finished one-handed cocktail shaker.");
  return (
    <>
      <PageHero eyebrow="Our Story" title={story.title} lede={story.purposeTitle} image="/media/bar-team.webp" />
      <StorySection full showTitle={false} />
      <FinalCTA />
    </>
  );
}
