import type { AnimationType } from "../animations/animationTypes";
import type { NavListsType } from "./constantTtypes";

import projectsList  from "./projects";
import aboutData from "./aboutMe";
import mySkillsList from "./skills";
import educationData from "./education";
import contactDetails from "./contactDetails";
import formFields from "./formFields"

//Slide Animation Change here for different animation
const animateType:AnimationType = "slide-down";
const animateDuration: number = 0.8;

const navLists: NavListsType = [
  { id: "home",href:"#home" ,title: "Home" },
  { id: "about",href:"#about", title: "About" },
  { id: "skills",href:"#skills" ,title: "Skills" },
  { id: "projects",href:"#projects" ,title: "Projects" },
  {
    id: "resume",
    href: contactDetails.resumeUrl,
    title: "Resume",
  },
  { id: "contact",href:"#contact" ,title: "Contact" },
];



export { navLists, educationData,projectsList ,mySkillsList, aboutData, animateType, animateDuration,contactDetails,formFields };
