type TechnicalDetails = {
  problem: string;
  solution: string;
  result: string;
  techStack?: string;
  githubLink?: string;
  liveLink?: string;
  demoLink?: string;
};

type ProjectSubComponent = {
  title: string;
  subtitle: string;
  description: string;
  architecture?: string[];
  techStack: string;
  githubLink?: string;
  demoLink?: string;
  liveLink?: string;
  technicalDetails?: TechnicalDetails;
  details?: TechnicalDetails;
};

type ProjectType = {
    id: string;
    href: string;
    title: string;
    subtitle: string;
    description?: string;
    img: string;
    backgroundImg?: string;
    category?: string;
    isFlagship?: boolean;
    components?: {
      recognition?: ProjectSubComponent;
      production?: ProjectSubComponent;
    };
    architecture?: string[];
    techStack?: string;
    githubLink?: string;
    liveLink?: string;
    demoLink?: string;
    technicalDetails?: TechnicalDetails;
    projectDetails?: TechnicalDetails & {
      techStack?: string;
      githubLink?: string;
      liveLink?: string;
      demoLink?: string;
    };
};

type ProjectListType = ProjectType[];

// A single feature inside a skill
type Feature = {
  id: string;              // unique identifier (useful for rendering)
  title: string;           // short label e.g. "React"
  description?: string;    // optional explanation of the feature/work
  iconUrl?: string;        // optional icon for UI
};

// A broader skill category
type Skill = {
  id: string;              // unique identifier
  title: string;           // e.g. "Frontend Development"
  summary?: string;        // short description about the category
  features: Feature[];     // the list of individual features/tools
};

// The full skill list
type SkillsListType = Skill[];

type NavList = {
    id: string;
    title: string;
    href:string
};

type NavListsType = NavList[];


type AboutProps = {
  heading: string;
  paragraphs: string[];
  highlights: { text: string; highlight?: boolean }[];
};


interface ContactTtypes {
  id: string;
  location: string;
  email: string;
  resumeUrls: string; 
  socialLinks: {};
}

type ResumeListItem = {
  id: string;
  title: string;
  href: string;
};

// Define field configuration
type Field = {
  id: string;
  label: string;
  type: "text" | "email" | "textarea";
  placeholder: string;
  rows?: number; // for textarea
  colSpan?: number; // for grid layout
};

// Experience / Work timeline item
type ExperienceItem = {
  period: string;
  title: string;
  subtitle: string;
  location?: string;
  details: string[];
};

// Generic timeline item (education + experience share this shape)
type TimelineItem = {
  period: string;
  title: string;
  subtitle?: string;
  location?: string;
  details: string[];
};

export type { NavListsType, ProjectListType, ProjectType, ProjectSubComponent, TechnicalDetails, AboutProps, SkillsListType, Skill, ContactTtypes, Field, ResumeListItem, ExperienceItem, TimelineItem };