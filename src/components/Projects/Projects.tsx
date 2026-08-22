import { useGSAP } from "@gsap/react";
import ShownProjects from "./ShownProjects";
import MoreProjects from "./MoreProjects";

import {
  animateBackgroundHighlight,
  animateHeading,
  animateSubHeading,
} from "../../../animations";

const Projects = ({
  sectionRef,
}: {
  sectionRef: (node?: Element | null) => void;
}) => {
  useGSAP(() => {
    animateBackgroundHighlight("#project-heading span");
    animateHeading("#project-heading");
    animateSubHeading("#project-sub-heading");
  }, []);

  return (
    <section id="projects" className="w-full flex flex-col items-center py-16 px-4 sm:px-6">
      <div ref={sectionRef} className="w-full max-w-7xl flex flex-col items-center space-y-4 mb-12">
        <h1 id="project-heading" className="text-4xl md:text-5xl font-extrabold text-text-primary text-center">
          <span>Featured</span>{" "}
          <p className="inline">Projects</p>
        </h1>
        <p
          id="project-sub-heading"
          className="text-lg text-text-primary/60 text-center max-w-2xl"
        >
          End-to-end AI systems -  from model training and research to APIs and deployed applications.
        </p>
      </div>

      <ShownProjects />
      <MoreProjects />
    </section>
  );
};

export default Projects;
