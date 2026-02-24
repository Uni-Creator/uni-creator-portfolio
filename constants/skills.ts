import type { SkillsListType } from "./constantTtypes";

const mySkillsList: SkillsListType = [
  {
    id: "ai-ml",
    title: "AI / Machine Learning",
    summary: "Building practical AI systems using modern ML and deep learning tools.",
    features: [
      {
        id: "machine-learning",
        title: "Machine Learning",
        description: "Building supervised and unsupervised models for prediction and analysis.",
        level: "intermediate",
      },
      {
        id: "deep-learning",
        title: "Deep Learning",
        description: "Designing neural networks using PyTorch and modern DL techniques.",
        level: "intermediate",
      },
      {
        id: "computer-vision",
        title: "Computer Vision",
        description: "Real-time vision systems using OpenCV, MediaPipe and CNNs.",
        level: "advanced",
      },
      {
        id: "reinforcement-learning",
        title: "Reinforcement Learning",
        description: "Experimenting with learning agents, neuroevolution and game AI.",
        level: "beginner"
      },
      {
        id: "nlp",
        title: "Natural Language Processing",
        description: "LLMs, embeddings, semantic search and RAG pipelines.",
        level: "intermediate",
      },
      {
        id: "generative-ai",
        title: "Generative AI",
        description: "Working with transformers, HuggingFace models and LLM applications.",
        level: "intermediate",
      },
    ],
  },

  {
    id: "programming",
    title: "Programming",
    summary: "Developing software systems, AI pipelines and automation tools.",
    features: [
      {
        id: "python",
        title: "Python",
        description: "Primary language for AI, automation, and backend systems.",
        level: "advanced",
      },
      {
        id: "cpp",
        title: "C++",
        description: "Algorithmic programming and performance-focused applications.",
        level: "intermediate",
      },
      {
        id: "sql",
        title: "SQL / Databases",
        description: "Database schema design, queries and backend data management.",
        level: "intermediate",
      },
      {
        id: "api",
        title: "Backend APIs",
        description: "Designing APIs and backend logic using modern services.",
        level: "intermediate",
      },
      {
        id: "web-scraping",
        title: "Data Collection / Web Scraping",
        description: "Automating data extraction pipelines.",
        level: "advanced",
      },
    ],
  },

  {
    id: "tools",
    title: "Frameworks & Tools",
    summary: "Libraries and platforms used across AI and product development.",
    features: [
      {
        id: "pytorch",
        title: "PyTorch",
        description: "Model development, training and experimentation.",
        level: "intermediate",
      },
      {
        id: "opencv",
        title: "OpenCV",
        description: "Image processing and real-time computer vision systems.",
        level: "advanced",
      },
      {
        id: "langchain",
        title: "LangChain",
        description: "Building RAG pipelines and LLM-powered applications.",
        level: "intermediate",
      },
      {
        id: "supabase",
        title: "Supabase",
        description: "Authentication, database, storage and backend infrastructure.",
        level: "advanced",
      },
      {
        id: "git",
        title: "Git / GitHub",
        description: "Version control, collaboration and project management.",
        level: "advanced",
      },
    ],
  },

  {
    id: "engineering",
    title: "Engineering Skills",
    summary: "Core abilities required to design and ship real systems.",
    features: [
      {
        id: "system-design",
        title: "System Design",
        description: "Designing scalable application architectures.",
        level: "intermediate",
      },
      {
        id: "problem-solving",
        title: "Problem Solving",
        description: "Breaking down complex technical challenges logically.",
        level: "advanced",
      },
      {
        id: "research",
        title: "Technical Research",
        description: "Exploring new models, papers and technologies.",
        level: "advanced",
      },
      {
        id: "project-building",
        title: "Project Development",
        description: "Turning ideas into working software products.",
        level: "advanced",
      },
    ],
  },
];

export default mySkillsList;  