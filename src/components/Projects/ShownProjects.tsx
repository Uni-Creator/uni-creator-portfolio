import { projectsList } from "../../../constants";
import DetailItem from "./DetailItem";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { GithubIcon } from "../../assets/icons/GithubIcon";

import { useTiltEffect } from "../../../animations";

const ShownProjects = () => {
  
  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLDivElement>(
      "#shownProject-cards > div"
    );

    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.6,
          ease: "power3.out",
          delay: i * 0.15,
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            end: "top 10%",
          },
        }
      );
    });
  }, []);

  return (
    <div  id="shownProject-cards" className="w-full flex flex-col items-center">
      {projectsList.map((project) => {
      const {cardRef,eventHandlers}= useTiltEffect()
      return (
        <div
          key={project.id}
          id={project.id}
          ref={cardRef} {...eventHandlers}
          className="card"
        >
          {/* Left Content */}
          <div className="flex-1 p-8 sm:p-12 flex flex-col justify-center">
            {/* Icon / Thumb */}
            <div className="iconThumb">
              <img
                src={project.img}
                alt={project.title}
                className="w-auto object-cover rounded-2xl"
              />
            </div>

            {/* Title & Subtitle */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
              {project.title}
            </h2>
            <p className="text-lg text-indigo-600 font-medium mb-6">
              {project.subtitle}
            </p>

            {/* Project Details */}
            {project.projectDetails && (
              <div className="space-y-4 text-gray-700">
                <DetailItem
                  icon="⚡"
                  label="Problem"
                  text={project.projectDetails.problem}
                />
                <DetailItem
                  icon="🤖"
                  label="Solution"
                  text={project.projectDetails.solution}
                />
                <DetailItem
                  icon="🛠"
                  label="Tech Used"
                  text={project.projectDetails.techUsed}
                />
                <DetailItem
                  icon="📈"
                  label="Impact"
                  text={project.projectDetails.impact}
                />
              </div>
            )}

            {/* CTA */}
            {project.projectDetails?.githubLink && (
              <div className="mt-8">
                <a
                  href={project.projectDetails.githubLink}
                  target="_blank">
                  <GithubIcon />
                  View on GitHub
                </a>
              </div>
            )}
          </div>

          {/* Right Image */}
          <div className="flex-1 bg-gray-200 relative group">
            <img
              src={project.backgroundImg}
              alt={`${project.title} preview`}
              className="w-full h-full object-cover  transition-transform duration-500 "
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50 group-hover:opacity-70 transition"></div>
          </div>
        </div>
      )})}
    </div>
  );
};

export default ShownProjects;
