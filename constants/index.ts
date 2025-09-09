import type { TimelineItem } from "../src/utils/utilsType";
import type {
  AboutProps,
  SkillsListType,
  NavListsType,
  ProjectListType,
} from "./constantTtypes";

const navLists: NavListsType = [
  { id: "home",href:"#home" ,title: "Home" },
  { id: "about",href:"#about", title: "About" },
  { id: "skills",href:"#skills" ,title: "Skills" },
  { id: "projects",href:"#projects" ,title: "Projects" },
  {
    id: "resume",
    href: "https://5d1b98fc-9f35-4fc6-afed-01861f8eace7.filesusr.com/ugd/3048a2_fd50f532cc814bbb932c69ebf4eea7d0.pdf",
    title: "Resume",
  },
  { id: "contact",href:"#contact" ,title: "Contact" },
];

const projectsList: ProjectListType = [
  {
    id: "lung-cancer",
    href: "#lung-cancer-classification",
    title: "Lung Cancer Classification",
    subtitle: "CNN",
    img: "/images/hero-lung-cancer.avif",
  },
  {
    id: "asl-recog",
    href: "#rt-asl-recoginition",
    title: "RT-ASL Recoginition",
    subtitle: "Deep Learning",
    img: "/images/hero-rt-als.avif",
  },
  {
    id: "nanogpt",
    href: "#nanogPT",
    title: "NanoGPT",
    subtitle: "LLM/ NLP",
    img: "/images/hero-nano.avif",
  },
];

export const aboutData: AboutProps = {
  heading: "About Me",
  description:
    "I’m Abhay Singh , an AI/ML Engineer with a strong foundation in mathematics and cybersecurity. Passionate about deep learning, computer vision, and NLP, I’ve worked on projects ranging from real-time sign language recognition to AI-powered SaaS applications.",
  highlights: [
    { text: "Abhay Singh", highlight: true },
    { text: "AI/ML Engineer", highlight: true },
    { text: "mathematics", highlight: true },
    { text: "cybersecurity", highlight: true },
    { text: "deep learning", highlight: true },
    { text: "computer vision", highlight: true },
    { text: "NLP", highlight: true },
    { text: "real-time sign language recognition", highlight: true },
    { text: "SaaS", highlight: true },
  ],
  tagline: "Let’s connect and innovate together!",
};

const educationData: TimelineItem[] = [
  {
    period: "2023 – Current",
    title: "BTech in Mathematics and Computing",
    subtitle: "Central University of Karnataka",
    details: [
      "Relevant Coursework: Computer Architecture, Machine Learning, Artificial Intelligence, Data Structures, Cybersecurity, Software Development.",
      "CGPA: 8.0 (Overall)",
    ],
  },
  {
    period: "2022 – 2023",
    title: "Intermediate",
    subtitle: "Uttrakhand Public School (CBSE)",
    details: ["Qualification: 12th Grade (Science)", "Percentage: 94%"],
  },
  {
    period: "2020 – 2021",
    title: "High School",
    subtitle: "R.K. Modern Sr. Sec. School (CBSE)",
    details: ["Qualification: 10th Grade", "Percentage: 90%"],
  },
];

const mySkillsLists: SkillsListType = [
  {
    title: "Machine Learning & AI",
    features: [
      {
        topic: "Machine Learning (ML)",
        work: "Designing and implementing predictive models.",
      },
      {
        topic: "Deep Learning",
        work: "Working with neural networks for complex data processing.",
      },
      {
        topic: "Convolutional Neural Networks (CNN)",
        work: "Specializing in image recognition tasks.",
      },
      {
        topic: "Natural Language Processing (NLP)",
        work: "Developing AI systems for text and speech processing.",
      },
      {
        topic: "Generative AI",
        work: "Creating models for AI-driven content generation.",
      },
    ],
  },
  {
    title: "Programming & Development",
    features: [
      {
        topic: "Python",
        work: "Writing efficient and scalable programs for AI and automation.",
      },
      {
        topic: "C++",
        work: " High-performance programming for software and hardware applications.",
      },
      {
        topic: "SQL",
        work: "Querying, managing, and optimizing relational databases.",
      },
      {
        topic: "MATLAB",
        work: "Mathematical computing, simulations, and algorithm prototyping.",
      },
      {
        topic: "Web Scraping",
        work: "Extracting structured data from web pages.",
      },
    ],
  },
  {
    title: "Technical & Soft Skills",
    features: [
      {
        topic: "Problem Solving",
        work: "Applying logical reasoning to tackle complex issues.",
      },
      {
        topic: "Critical Thinking",
        work: " Evaluating problems to develop innovative solutions.",
      },
      {
        topic: "Team Coordination",
        work: " Collaborating effectively on technical projects.",
      },
      {
        topic: "Project Management",
        work: "Organizing and executing project timelines efficiently.",
      },
      {
        topic: "Research Skills",
        work: "Investigating new technologies and methodologies.",
      },
    ],
  },
];

export { navLists, projectsList, educationData, mySkillsLists };
