import { useGSAP } from "@gsap/react";
import ShownProjects from "./ShownProjects";

import {
  animateBackgroundHighlight,
  animateDrop,
  animateHeading,
  animateSubHeading,
} from "../../../animations";
import { useRefs } from "../../../context/RefsContext";

const Projects = () => {
    const {projectsRef} = useRefs()
  

  useGSAP(() => {
    animateDrop("#spinning-top");
    animateBackgroundHighlight("#project-heading span");
    animateHeading("#project-heading");
    animateSubHeading("#project-sub-heading");
  }, []);

  return (
    <section id="projects">
      <div className="container w-full flex-center flex sm:flex-nowrap gap-10  mb-10">
        <div className=" flex-center max-sm:flex-wrap-reverse gap-5 w-full sm:w-fit">
          <div
            ref={projectsRef}
            className=" flex-center w-full flex-col space-y-5"
          >
            <h1 id="project-heading">
              <span className="">Explore</span>
              <p className="sm:inline">My Projects</p>
            </h1>
            <p
              id="project-sub-heading"
              className="text-xl text-text-primary/70"
            >
              Discover My Work: Where AI Meets Innovation.
            </p>
          </div>

          <div className="img-container">
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
