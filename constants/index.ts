import type { AnimationType } from "../animations/animationTypes";
import type { NavListsType, ResumeListItem } from "./constantTtypes";

import projectsList from "./projects";
import aboutData from "./aboutMe";
import mySkillsList from "./skills";
import educationData from "./education";
import experienceData from "./experience";
import contactDetails from "./contactDetails";
import formFields from "./formFields";

//Slide Animation Change here for different animation
const animateType: AnimationType = "slide-down";
const animateDuration: number = 0.6;

const navLists: NavListsType = [
  { id: "home", href: "#home", title: "Home" },
  { id: "about", href: "#about", title: "About" },
  { id: "experience", href: "#experience", title: "Experience" },
  { id: "projects", href: "#projects", title: "Projects" },
  { id: "skills", href: "#skills", title: "Skills" },
  {
    id: "resume",
    href: "#",
    title: "Resume",
  },
  { id: "contact", href: "#contact", title: "Contact" },
];

const resumeList: ResumeListItem[] = [
  { id: "resume-view", title: "View Resume", href: contactDetails.resumeUrls },
];

export {
  navLists,
  educationData,
  experienceData,
  projectsList,
  mySkillsList,
  aboutData,
  animateType,
  animateDuration,
  contactDetails,
  formFields,
  resumeList,
};
