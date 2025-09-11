import { projectsList } from "../../constants";

import DetailItem from "./DetailItem"
import { GithubIcon } from "../assets/icons/GithubIcon";

const ShownProjects = () => {
  return (
    <div id="shownProject-cards" className="w-full flex flex-col items-center">
         {projectsList.map((project) => (
        <div
          key={project.id}
          id={project.id}
          className="max-w-6xl w-full flex flex-col md:flex-row items-stretch rounded-3xl shadow-2xl overflow-hidden bg-white/50 backdrop-blur-md mb-12 transition transform hover:scale-[1.01] hover:shadow-3xl"
        >
          {/* Left Content */}
          <div className="flex-1 p-8 sm:p-12 flex flex-col justify-center">
            {/* Icon / Thumb */}
            <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center bg-indigo-100 mb-6 p-1">
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
                  target="_blank"
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all"
                >
                 <GithubIcon/>
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
              className="w-full h-full object-cover  transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-50 group-hover:opacity-70 transition"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ShownProjects