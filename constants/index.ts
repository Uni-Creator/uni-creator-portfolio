import type { AnimationType } from "../animations/animationTypes";
import type { TimelineItem } from "../src/utils/utilsType";
import type {
  AboutProps,
  SkillsListType,
  NavListsType,
  ProjectListType,
} from "./constantTtypes";


const animateType:AnimationType = "slide-right";
const animateDuration: number = 0.4;

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
    id: "lung-cancer-classification",
    href: "#lung-cancer-classification",
    title: "Lung Cancer Classification",
    subtitle: "CNN",
    img: "/images/hero-lung-cancer.avif",
    backgroundImg:
      "https://static.wixstatic.com/media/11062b_347949d9b58c411b8da6c6fd304a02b4~mv2_d_4102_5700_s_4_2.jpg/v1/fill/w_1225,h_876,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/11062b_347949d9b58c411b8da6c6fd304a02b4~mv2_d_4102_5700_s_4_2.jpg",
    projectDetails: {
      problem: "Difficulty in early detection of lung cancer leads to late diagnoses and poor survival rates.",
      solution: "Developed a CNN model trained on chest CT scans to classify lung cancer stages with high accuracy.",
      techUsed: "TensorFlow, Keras, OpenCV, Scikit-learn.",
      impact: "Achieved 85% accuracy on test data; enables faster, more reliable screening support for radiologists.",
      githubLink: "https://github.com/Uni-Creator/LungCancerClassification"
    }
  },
  {
    id: "rt-asl-recoginition",
    href: "#rt-asl-recoginition",
    title: "RT-ASL Recognition",
    subtitle: "Deep Learning",
    img: "/images/hero-rt-als.avif",
    backgroundImg:
      "https://static.wixstatic.com/media/11062b_97f7c08edb324dde87851b51aea42cb7~mv2.jpeg/v1/fill/w_1225,h_850,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/11062b_97f7c08edb324dde87851b51aea42cb7~mv2.jpeg",
    projectDetails: {
      problem: "Communication gap between deaf/mute individuals and the general population.",
      solution: "Built an LSTM-based model to recognize American Sign Language (ASL) gestures in real-time.",
      techUsed: "PyTorch, OpenCV, Mediapipe.",
      impact: "Improved recognition speed by 30% with 15% fewer false positives compared to baseline models.",
      githubLink: "https://github.com/Uni-Creator/Real-Time-Sign-Language-Recognition"
    }
  },
  {
    id: "nanogPT",
    href: "#nanogPT",
    title: "NanoGPT",
    subtitle: "LLM / NLP",
    img: "/images/hero-nano.avif",
    backgroundImg:
      "https://static.wixstatic.com/media/11062b_68684546683843bc9dd026c63768d725~mv2.jpg/v1/fill/w_1225,h_850,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/11062b_68684546683843bc9dd026c63768d725~mv2.jpg",
    projectDetails: {
      problem: "Training large language models requires enormous compute resources, limiting accessibility.",
      solution: "Implemented a lightweight GPT architecture (NanoGPT) optimized for smaller datasets and faster training.",
      techUsed: "PyTorch, Transformers, CUDA.",
      impact: "Reduced training time by 40% while maintaining competitive perplexity on benchmark datasets.",
      githubLink: "https://github.com/Uni-Creator/NanoGPT"
    }
  }
];


const aboutData: AboutProps = {
  heading: "About Me",
  description:
    "Hi! I’m Abhay Singh 👩‍💻, an AI/ML Engineer with a strong foundation in mathematics and cybersecurity. Passionate about deep learning, computer vision, and NLP, I’ve worked on projects ranging from real-time sign language recognition to AI-powered SaaS applications.",
  highlights: [
    { text: "Abhay Singh"},
    { text: "AI/ML Engineer"},
    { text: "mathematics"},
    { text: "cybersecurity"},
    { text: "deep learning"},
    { text: "computer vision"},
    { text: "NLP"},
    { text: "real-time sign language recognition"},
    { text: "SaaS"},
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
        level: "advanced",
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


export { navLists, projectsList, educationData, mySkillsList, aboutData, animateType, animateDuration };
