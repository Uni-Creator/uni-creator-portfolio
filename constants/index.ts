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


export const aboutData: AboutProps = {
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
