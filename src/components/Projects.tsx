import { useGSAP } from "@gsap/react";
import ShownProjects from "../utils/ShownProjects";

import {
  animateBackgroundHighlight,
  animateDrop,
  animateHeading,
  animateSubHeading,
} from "../../animations";

const Projects = ({
  sectionRef,
}: {
  sectionRef: (node?: Element | null) => void;
}) => {
  useGSAP(() => {
    animateDrop("#spinning-top");
    animateBackgroundHighlight("#project-heading span");
    animateHeading("#project-heading");
    animateSubHeading("#project-sub-heading");
  }, []);

  return (
    <section id="projects" className="w-full flex-center flex-col py-12 px-6 ">
      <div className="w-full flex-center flex sm:flex-nowrap gap-10  mb-10">
        <div className="flex-center max-sm:flex-wrap-reverse gap-5 w-full sm:w-fit ">
          <div
            ref={sectionRef}
            className=" flex-center w-full flex-col space-y-5"
          >
            <h1
              id="project-heading"
              className="text-6xl w-full text-center  text-[clamp(3rem,4vw,1rem)] space-x-3 leading-15 break-words"
            >
              <span className="heading-bg">Explore</span>
              <p className="sm:inline">My Projects</p>
            </h1>
            <p
              id="project-sub-heading"
              className="text-xl text-text-primary/70"
            >
              Discover My Work: Where AI Meets Innovation.
            </p>
          </div>

          <div className="flex-center sm:w-[12vw] sm:h-[12vw] w-[100px]">
            <img
              id="spinning-top"
              src="/images/projectSec-1.avif"
              alt="not-found"
              className="object-cover opacity-20"
            />
          </div>
        </div>
      </div>
      <ShownProjects />
    </section>
  );
};

export default Projects;
