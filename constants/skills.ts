import type { SkillsListType } from "./constantTtypes";

const mySkillsList: SkillsListType = [
  {
    id: "ml-ai",
    title: "Machine Learning & AI",
    summary: "Designing intelligent systems for data-driven decision making.",
    features: [
      {
        id: "ml",
        title: "Machine Learning (ML)",
        description: "Designing and implementing predictive and adaptive models.",
        level: "beginner",
      },
      {
        id: "dl",
        title: "Deep Learning",
        description: "Building neural networks for complex data processing.",
        level: "advanced",
      },
      {
        id: "cnn",
        title: "Convolutional Neural Networks (CNN)",
        description: "Specializing in computer vision and image recognition tasks.",
        level: "intermediate",
      },
      {
        id: "nlp",
        title: "Natural Language Processing (NLP)",
        description: "Developing AI systems for text, sentiment, and speech analysis.",
        level: "advanced",
      },
      {
        id: "genai",
        title: "Generative AI",
        description: "Creating AI-driven content generation models.",
        level: "intermediate",
      },
    ],
  },
  {
    id: "dev",
    title: "Programming & Development",
    summary: "Building scalable, efficient, and maintainable applications.",
    features: [
      {
        id: "python",
        title: "Python",
        description: "Efficient scripting and AI/ML-focused programming.",
        level: "expert",
      },
      {
        id: "cpp",
        title: "C++",
        description: "High-performance programming for systems and applications.",
        level: "intermediate",
      },
      {
        id: "sql",
        title: "SQL",
        description: "Designing, querying, and optimizing relational databases.",
        level: "advanced",
      },
      {
        id: "matlab",
        title: "MATLAB",
        description: "Mathematical computing, prototyping, and simulations.",
        level: "intermediate",
      },
      {
        id: "web-scraping",
        title: "Web Scraping",
        description: "Automating structured data extraction from websites.",
        level: "advanced",
      },
    ],
  },
  {
    id: "soft-skills",
    title: "Technical & Soft Skills",
    summary: "Core skills for effective teamwork, leadership, and innovation.",
    features: [
      {
        id: "problem-solving",
        title: "Problem Solving",
        description: "Applying logical reasoning to tackle complex issues.",
        level: "expert",
      },
      {
        id: "critical-thinking",
        title: "Critical Thinking",
        description: "Analyzing situations to develop innovative solutions.",
        level: "advanced",
      },
      {
        id: "team-coordination",
        title: "Team Coordination",
        description: "Collaborating effectively in technical and cross-functional teams.",
        level: "advanced",
      },
      {
        id: "project-management",
        title: "Project Management",
        description: "Planning and executing projects with clear milestones.",
        level: "intermediate",
      },
      {
        id: "research",
        title: "Research Skills",
        description: "Exploring new technologies and methodologies to innovate.",
        level: "advanced",
      },
    ],
  },
];
export default mySkillsList;