import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import HighlightProjects from "../utils/HighlightProjects";
import { projectsList } from "../../constants";
import { homeAnimations } from "../../animations/homeAnimation";

const Home = ({
  sectionRef,
}: {
  sectionRef: (node?: Element | null) => void;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      homeAnimations(scrollRef.current);
    },
    { scope: scrollRef }
  );

  return (
    <section ref={scrollRef} id="home" className="relative mt-10">
      <div ref={sectionRef} id="hero" className="relative z-10">
        <div id="hero-image-container" className="">
          <img id="left-img" src="/images/3D_Shape_2.avif" alt="hero-img-left" />
          <img id="right-img" src="/images/3D_Shape_4.avif" alt="hero-img-right" />
        </div>

        <div id="headings">
          <h1>
            By{" "}
            <span>
              Uni-Creator
              <span className="text-text-primary p-0 bg-transparent">,</span>
            </span>
          </h1>
          <h2 className="text-white">
            <span className="text-text-primary">For the</span> Future of Tech.
          </h2>
          <p>Engineering the Future of AI and Technology.</p>
        </div>
      </div>

      <HighlightProjects projects={projectsList} />
    </section>
  );
};

export default Home;
