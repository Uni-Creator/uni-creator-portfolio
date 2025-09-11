import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import ShownProjects from "../utils/ShownProjects";

const Projects = ({
  sectionRef,
}: {
  sectionRef: (node?: Element | null) => void;
}) => {
  useGSAP(() => {
    const headingText = new SplitText("#project-heading", { type: "chars" });
    const subHeadingText = new SplitText("#project-sub-heading", {
      type: "words",
    });

    const spinningToTimeline = gsap.timeline({
      ease: "bounce.in",
      duration: 0.6,
      scrollTrigger: {
        trigger: "#spinning-top",
        start: "top 70%",
      },
    });
    spinningToTimeline
      .from("#spinning-top", {
        y: -100,
        opacity: 0,
      })
      .to("#spinning-top", {
        y: 40,
        opacity: 0.3,
      })
      .to("#spinning-top", { y: -60, opacity: 0.5 })
      .to("#spinning-top", { y: 20, opacity: 0.6 })
      .to("#spinning-top", { y: -10, opacity: 0.7 })
      .to("#spinning-top", { y: 5, opacity: 0.9 })
      .to("#spinning-top", { y: 0, opacity: 1 });

    gsap.from(headingText.chars, {
      y: "100%",
      opacity: 0,
      duration: 0.5,
      ease: "Second.out",
      stagger: 0.1,

      scrollTrigger: {
        trigger: headingText.elements,
        start: "top center",
      },
    });
    gsap.from(subHeadingText.words, {
      y: "100%",
      opacity: 0,
      duration: 0.5,
      ease: "Second.out",
      stagger: 0.1,

      scrollTrigger: {
        trigger: subHeadingText.elements,
        start: "top center",
      },
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="w-full flex-center flex-col py-12 px-6 "
    >
      <div className="w-full flex-center flex sm:flex-nowrap gap-10 flex-wrap-reverse mb-10">
        <div className="flex-center w-full sm:w-fit ">
          <div className=" flex-center w-full flex-col space-y-5">
            <h1
              id="project-heading"
              className="text-6xl w-full text-center  text-[clamp(3rem,4vw,1rem)] leading-15 break-words"
            >
              <span className="heading-bg">Explore</span>{" "}
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

     <ShownProjects/>
    </section>
  );
};


export default Projects;
