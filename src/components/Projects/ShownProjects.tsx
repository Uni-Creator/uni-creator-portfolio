import { useState } from "react";
import { projectsList } from "../../../constants";
import type { ProjectType, ProjectSubComponent } from "../../../constants/constantTtypes";
import { track } from "@vercel/analytics/react";
import DetailItem from "./DetailItem";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { GithubIcon } from "../../assets/icons/GithubIcon";
import { useTiltEffect } from "../../../animations";

/* ── Filter categories ── */
const FILTERS = [
  { id: "all", label: "All" },
  { id: "Research", label: "Research" },
  { id: "Computer Vision", label: "Computer Vision" },
  { id: "LLM", label: "LLM" },
  { id: "Backend", label: "Backend" },
  { id: "Simulation", label: "Simulation" },
];

/* ── Inline SVG icons ── */
const ExternalLinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="15px"
    height="15px"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
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
    width="15px"
    height="15px"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M8 5v14l11-7z" />
  </svg>
);

/* ── Flowchart component for system architectures (matching website light theme) ── */
const ArchitectureFlow = ({ steps }: { steps: string[] }) => (
  <div className="my-3 p-3 bg-slate-50/90 rounded-lg border border-slate-200/80 text-xs">
    <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block mb-2">
      System Architecture
    </span>
    <div className="flex flex-wrap items-center gap-1.5 leading-normal">
      {steps.map((step, idx) => (
        <span key={idx} className="flex items-center gap-1.5">
          <span className="bg-white text-slate-800 border border-slate-200/90 px-2.5 py-1 rounded-md text-xs font-semibold shadow-2xs">
            {step}
          </span>
          {idx < steps.length - 1 && (
            <span className="text-indigo-500 font-bold text-xs select-none">→</span>
          )}
        </span>
      ))}
    </div>
  </div>
);

/* ── Sub-component box inside Flagship combined project card ── */
const FlagshipSubCard = ({
  component,
  typeLabel,
}: {
  component: ProjectSubComponent;
  typeLabel: string;
}) => {
  const [expanded, setExpanded] = useState(false);
  const details = component.technicalDetails || component.details;

  return (
    <div className="flex-1 bg-slate-50/70 rounded-lg p-4 border border-slate-200 flex flex-col justify-between">
      <div>
        <div className="mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
            {typeLabel}
          </span>
          <h3 className="font-extrabold text-slate-900 text-lg">
            {component.title}
          </h3>
        </div>

        <p className="text-xs text-slate-600 mb-3 leading-relaxed">
          {component.description}
        </p>

        {component.architecture && (
          <ArchitectureFlow steps={component.architecture} />
        )}

        {/* Tech Stack */}
        <div className="my-2 text-xs text-slate-700">
          <strong className="text-slate-900 font-bold">Tech:</strong>{" "}
          <span className="text-slate-700">{component.techStack}</span>
        </div>

        {/* Technical Details Accordion */}
        {details && (
          <div className="mt-3 pt-2 border-t border-slate-200/60">
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
            >
              <span>{expanded ? "Technical Details ↑" : "Technical Details →"}</span>
            </button>

            {expanded && (
              <div className="mt-3 p-3 bg-white rounded border border-slate-200 space-y-2.5 text-xs">
                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block mb-1">
                  TECHNICAL DETAILS
                </span>
                {details.problem && (
                  <DetailItem label="Problem" text={details.problem} />
                )}
                {details.solution && (
                  <DetailItem label="Solution" text={details.solution} />
                )}
                {details.result && (
                  <DetailItem label="Result" text={details.result} />
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-200/60">
        {component.githubLink && (
          <a
            href={component.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-github text-xs py-1.5 px-3"
            onClick={() =>
              track("project_opened", {
                project: component.title,
                type: "github",
              })
            }
          >
            <GithubIcon size={14} />
            GitHub
          </a>
        )}
        {component.demoLink && (
          <a
            href={component.demoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-demo text-xs py-1.5 px-3"
            onClick={() =>
              track("project_opened", {
                project: component.title,
                type: "demo",
              })
            }
          >
            <PlayIcon />
            Demo
          </a>
        )}
      </div>
    </div>
  );
};

/* ── Flagship Combined Project Card (Sign Language AI) ── */
const FlagshipCard = ({ project }: { project: ProjectType }) => {
  const { cardRef, eventHandlers } = useTiltEffect();

  return (
    <div
      ref={cardRef}
      {...eventHandlers}
      id={project.id}
      className="project-card-item col-span-1 md:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm md:hover:shadow-md"
    >
      {/* Top Banner Image Container */}
      <div className="project-card-image max-h-56" aria-hidden="true">
        <img
          src={project.backgroundImg || project.img}
          alt={`${project.title} project preview`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="project-card-image-overlay" />
        <span className="project-card-badge bg-slate-900 text-slate-100 border border-slate-700">
          Flagship Project
        </span>
      </div>

      {/* Main Content Area */}
      <div className="project-card-content p-5 sm:p-6">
        <div className="mb-4">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            {project.subtitle}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
            {project.title}
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed max-w-3xl">
            {project.description}
          </p>
        </div>

        <div className="my-4 border-t border-slate-100" />

        {/* Sub-components Grid (Recognition + Production) */}
        {project.components && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.components.recognition && (
              <FlagshipSubCard
                component={project.components.recognition}
                typeLabel="RECOGNITION"
              />
            )}
            {project.components.production && (
              <FlagshipSubCard
                component={project.components.production}
                typeLabel="PRODUCTION"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Standard Project Card with Expandable Technical Details ── */
const StandardProjectCard = ({ project }: { project: ProjectType }) => {
  const { cardRef, eventHandlers } = useTiltEffect();
  const [showDetails, setShowDetails] = useState(false);
  const details = project.technicalDetails || project.projectDetails;

  return (
    <div
      ref={cardRef}
      {...eventHandlers}
      id={project.id}
      className="project-card-item bg-white border border-slate-200 rounded-xl shadow-sm md:hover:shadow-md"
    >
      {/* Image container — fixed 16/9 aspect ratio */}
      <div className="project-card-image" aria-hidden="true">
        <img
          src={project.backgroundImg || project.img}
          alt={`${project.title} project preview`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="project-card-image-overlay" />
        {project.subtitle && (
          <span className="project-card-badge">{project.subtitle}</span>
        )}
      </div>

      {/* Content area — grows to fill, pushes buttons to bottom */}
      <div className="project-card-content">
        {/* Category */}
        {project.category && (
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">
            {project.category}
          </span>
        )}

        {/* Header: Title */}
        <div className="mb-2">
          <h2 className="project-card-title">{project.title}</h2>
        </div>

        {/* Short description (2-3 lines desktop) */}
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-3">
          {project.description || details?.solution}
        </p>

        {/* Architecture Diagram if available */}
        {project.architecture && (
          <ArchitectureFlow steps={project.architecture} />
        )}

        {/* Tech Stack */}
        <div className="text-xs text-slate-700 mb-3">
          <strong className="text-slate-900 font-bold">Tech:</strong>{" "}
          {project.techStack || details?.techStack}
        </div>

        {/* Expandable Technical Details Accordion */}
        {details && (
          <div className="mb-4 pt-2 border-t border-slate-100">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
            >
              <span>{showDetails ? "Technical Details ↑" : "Technical Details →"}</span>
            </button>

            {showDetails && (
              <div className="mt-2.5 p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2.5">
                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block mb-1">
                  TECHNICAL DETAILS
                </span>
                {details.problem && (
                  <DetailItem label="Problem" text={details.problem} />
                )}
                {details.solution && (
                  <DetailItem label="Solution" text={details.solution} />
                )}
                {details.result && (
                  <DetailItem label="Result" text={details.result} />
                )}
              </div>
            )}
          </div>
        )}

        {/* CTA Buttons — margin-top: auto pins to bottom */}
        <div className="project-card-actions">
          {(project.githubLink || details?.githubLink) && (
            <a
              href={project.githubLink || details?.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-github"
              aria-label={`View ${project.title} on GitHub`}
              onClick={() =>
                track("project_opened", {
                  project: project.title,
                  type: "github",
                })
              }
            >
              <GithubIcon size={15} />
              GitHub
            </a>
          )}

          {(project.liveLink || details?.liveLink) && (
            <a
              href={project.liveLink || details?.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-live"
              aria-label={`Open live ${project.title}`}
              onClick={() =>
                track("project_opened", {
                  project: project.title,
                  type: "live",
                })
              }
            >
              <ExternalLinkIcon />
              Try
            </a>
          )}

          {(project.demoLink || details?.demoLink) && (
            <a
              href={project.demoLink || details?.demoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-demo"
              aria-label={`Watch ${project.title} demo`}
              onClick={() =>
                track("project_opened", {
                  project: project.title,
                  type: "demo",
                })
              }
            >
              <PlayIcon />
              Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Main Grid Container ── */
const ShownProjects = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLDivElement>(".project-card-item");
    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          delay: i * 0.08,
          scrollTrigger: {
            trigger: card,
            start: "top 92%",
          },
        }
      );
    });
  }, []);

  const filtered =
    activeFilter === "all"
      ? projectsList
      : projectsList.filter((p) => p.category === activeFilter);

  return (
    <div id="shownProject-cards" className="w-full max-w-7xl mx-auto">
      {/* Category Filter bar */}
      <div
        className="project-filters mb-8 flex flex-wrap gap-2 justify-center"
        role="group"
        aria-label="Filter projects by category"
      >
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`filter-btn ${activeFilter === f.id ? "filter-btn-active" : ""}`}
            aria-pressed={activeFilter === f.id}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid: Flagship card spans full width (2 columns on md), standard cards are 2-col grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {filtered.map((project) =>
          project.isFlagship ? (
            <FlagshipCard key={project.id} project={project} />
          ) : (
            <StandardProjectCard key={project.id} project={project} />
          )
        )}
      </div>
    </div>
  );
};

export default ShownProjects;
