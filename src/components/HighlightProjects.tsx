import type { ProjectListType } from "../../constants/constantTtypes";

const alignments = [
  "md:self-end md:text-end",
  "md:self-center md:text-center",
  "md:self-start md:text-start",
];

export default function HighlightProjects({
  projects,
}: {
  projects: ProjectListType;
}) {
  return (
    <div className="feature relative z-0 mt-20">
      {/* Background */}
      <div id="f-bg"></div>

      {/* Projects */}
      <div id="highlight-projects" className="absolute w-full top-0">
        <div id="projectCard-container" className="w-full flex flex-col justify-start items-center md:items-end gap-20 p-10">
          {projects.map((project, index) => {
            const alignment = alignments[index % alignments.length]; // cycle through
            return (
              <div
                key={project.id + index}
                className={`project-card ${alignment}`}
              >
                <div className="bg-gradient-to-tl from-slate-300 to-white  w-30 p-2 rounded-2xl">
                  <img
                    src={project.img}
                    alt={project.title}
                    className="w-full h-full rounded-2xl"
                  />
                </div>
                <div className="w-full overflow-hidden mx-2">
                  <h3 className="text-start self-start font-bold text-xl line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="truncate text-start">{project.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
