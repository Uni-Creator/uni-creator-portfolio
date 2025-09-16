import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import HighlightProjects from "./HighlightProjects";
import { projectsList } from "../../constants";
import { homeAnimations } from "../../animations/homeAnimation";
import { useRefs } from "../../context/RefsContext";

const Home = () => {
  const {homeRef} = useRefs()
  const scrollRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      homeAnimations(scrollRef.current);
    },
    { scope: scrollRef }
  );

  return (
    <section ref={scrollRef} id="home" className="relative mt-10">
      <div ref={homeRef} id="hero" className="relative z-10">
        <div id="hero-image-container" className="">
          <img id="left-img" src="/images/3D_Shape_2.avif" alt="hero-img-left" />
          <img id="right-img" src="/images/3D_Shape_4.avif" alt="hero-img-right" />
        </div>

        <div id="headings">
          <h1>
            By{" "}
            <span className="bg-clip-text text-transparent font-light bg-gradient-to-r from-text-primary from-50% to-cyan-500">
              Uni-Creator
            </span>
            , For the
          </h1>
          <span className="text-white heading-bg">
            Future of Tech.
          </span>
          <p>Engineering the Future of AI and Technology.</p>
        </div>
      </div>

      <HighlightProjects projects={projectsList} />
    </section>
  );
};

export default Home;
