import { contactDetails } from "../../../constants";
import { GithubIcon } from "../../assets/icons/GithubIcon";

const MORE_PROJECTS = [
  {
    id: "nanogpt",
    title: "NanoGPT",
    subtitle: "Language Model · Transformer from Scratch",
    github: "https://github.com/Uni-Creator/NanoGPT",
  },
  {
    id: "hand-gesture-automation",
    title: "Hand Gesture Automation",
    subtitle: "Computer Vision · Real-Time Gesture Control",
    github: "https://github.com/Uni-Creator/HandGestureAutomation",
  },
  {
    id: "face-recognition",
    title: "Face Recognition",
    subtitle: "Computer Vision · OpenCV Pipeline",
    github: "https://github.com/Uni-Creator/face_recognition",
  },
  {
    id: "chat-llm",
    title: "Chat-with-LLM",
    subtitle: "LLM · Streamlit Chat Interface",
    github: "https://github.com/Uni-Creator/Chat-with-LLM",
  },
  {
    id: "crowd-detection",
    title: "Crowd Detection",
    subtitle: "Computer Vision · Real-Time Crowd Detection",
    github: "https://github.com/Uni-Creator/Crowd-Detection",
  },
  { 
    id: "wikiword",
    title: "WikiWord",
    subtitle: "Wikipedia crawler with similaity search",
    github: "https://github.com/Uni-Creator/WikiWord",
  },
];

const ExternalIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
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

export default function MoreProjects() {
  return (
    <div className="more-projects-section">
      <div className="more-projects-header">
        <h3 className="more-projects-title">More Projects</h3>
        <a
          href={contactDetails.socialLinks["github" as keyof typeof contactDetails.socialLinks] as string}
          target="_blank"
          rel="noopener noreferrer"
          className="more-projects-github-link"
          aria-label="View all projects on GitHub"
        >
          <GithubIcon size={16} />
          View all on GitHub
        </a>
      </div>

      <div className="more-projects-grid">
        {MORE_PROJECTS.map((p) => (
          <a
            key={p.id}
            href={p.github}
            target="_blank"
            rel="noopener noreferrer"
            className="more-project-chip"
            aria-label={`${p.title} on GitHub`}
          >
            <div>
              <p className="more-project-chip-title">{p.title}</p>
              <p className="more-project-chip-subtitle">{p.subtitle}</p>
            </div>
            <ExternalIcon />
          </a>
        ))}
      </div>
    </div>
  );
}
