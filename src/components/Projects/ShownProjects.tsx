import { projectsList } from "../../../constants";
import { track } from "@vercel/analytics/react";
import DetailItem from "./DetailItem";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { GithubIcon } from "../../assets/icons/GithubIcon";

import { useTiltEffect } from "../../../animations";

/* ── Inline SVG icons ── */
const ExternalLinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18px"
    height="18px"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6m0 0v6m0-6L10 14"
    />
  </svg>
);

const PlayIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18px"
    height="18px"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M8 5v14l11-7z" />
  </svg>
);

/* ── Component ── */
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
    <div id="shownProject-cards" className="w-full flex flex-col items-center">
      {projectsList.map((project) => {
        const { cardRef, eventHandlers } = useTiltEffect();
        const details = project.projectDetails;

        return (
          <div
            key={project.id}
            id={project.id}
            ref={cardRef}
            {...eventHandlers}
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
              {details && (
                <div className="space-y-4 text-gray-700">
                  <DetailItem
                    icon="⚡"
                    label="Problem"
                    text={details.problem}
                  />
                  <DetailItem
                    icon="🤖"
                    label="Solution"
                    text={details.solution}
                  />
                  <DetailItem
                    icon="🛠"
                    label="Tech Used"
                    text={details.techUsed}
                  />
                  <DetailItem
                    icon="📈"
                    label="Impact"
                    text={details.impact}
                  />
                </div>
              )}

              {/* CTA Buttons — only rendered when a link exists */}
              {details &&
                (details.githubLink || details.liveLink || details.demoLink) && (
                  <div className="mt-8 flex flex-wrap gap-3">
                    {details.githubLink && (
                      <a
                        href={details.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white font-semibold py-3 px-5 rounded-xl shadow-lg transition-all"
                        onClick={() => track("project_opened", { project: project.title, type: "github" })}
                      >
                        <GithubIcon size={18} />
                        GitHub
                      </a>
                    )}

                    {details.liveLink && (
                      <a
                        href={details.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-5 rounded-xl shadow-lg transition-all"
                        onClick={() => track("project_opened", { project: project.title, type: "live" })}
                      >
                        <ExternalLinkIcon />
                        Try
                      </a>
                    )}

                    {details.demoLink && (
                      <a
                        href={details.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-5 rounded-xl shadow-lg transition-all"
                        onClick={() => track("project_opened", { project: project.title, type: "demo" })}
                      >
                        <PlayIcon />
                        Demo
                      </a>
                    )}
                  </div>
                )}
            </div>

            {/* Right Image */}
            <div className="flex-1 bg-gray-200 relative group">
              <img
                src={project.backgroundImg}
                alt={`${project.title} preview`}
                className="w-full h-full object-cover transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50 group-hover:opacity-70 transition" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ShownProjects;
