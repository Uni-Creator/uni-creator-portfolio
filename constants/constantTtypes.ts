type ProjectType = {
    id: string;
    href: string;
    title: string;
    subtitle:string;
    img:string;
    backgroundImg?:string,
    projectDetails ?:{
      problem:string,
      solution:string,
      techUsed:string,
      impact:string,
      githubLink:string,
      liveLink?:string,
      demoLink?:string
    }
};

type ProjectListType = ProjectType[];
// A single feature inside a skill
type Feature = {
  id: string;              // unique identifier (useful for rendering)
  title: string;           // short label e.g. "React"
  description?: string;    // optional explanation of the feature/work
  level?: "beginner" | "intermediate" | "advanced" | "expert"; // optional proficiency
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
  description: string;
  highlights: { text: string; highlight?: boolean }[];
  tagline: string;
};


interface ContactTtypes {
  id: string;
  location: string;
  phone: string;
  email: string;
  resumeUrl: string;
  socialLinks: {};
}

// Define field configuration
type Field = {
  id: string;
  label: string;
  type: "text" | "email" | "textarea";
  placeholder: string;
  rows?: number; // for textarea
  colSpan?: number; // for grid layout
};

export type { NavListsType, ProjectListType,AboutProps,SkillsListType,Skill,ContactTtypes,Field };