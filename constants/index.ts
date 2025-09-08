import type { TimelineItem } from "../src/utils/utilsType";
import type { AboutProps, FeaturesProjectsListType, NavListsType, ProjectListType } from "./constantTtypes";

const navLists: NavListsType = [
  { id: "home", title: "Home" },
  { id: "about", title: "About" },
  { id: "skills", title: "Skills" },
  { id: "projects", title: "Projects" },
  { id: "resume", title: "Resume" },
  { id: "contact", title: "Contact" },
];

const projectsList: ProjectListType = [
  {
    id: "lung-cancer",
    href: "lung-cancer-classification",
    title: "Lung Cancer Classification",
    subtitle: "CNN",
    img: "/images/hero-lung-cancer.avif",
  },
  {
    id: "asl-recog",
    href: "rt-asl-recoginition",
    title: "RT-ASL Recoginition",
    subtitle: "Deep Learning",
    img: "/images/hero-rt-als.avif",
  },
  {
    id: "nanogpt",
    href: "nanogPT",
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
];





const featuresProjects:FeaturesProjectsListType = [
  {
    title: "Machine Learning & AI",
    features: [
      {topic:"Machine Learning (ML)", work:"Designing and implementing predictive models."},
      {topic:"Deep Learning",work: "Working with neural networks for complex data processing."},
      {topic:"Convolutional Neural Networks (CNN)", work:"Specializing in image recognition tasks."},
      {topic:"Natural Language Processing (NLP)", work:"Developing AI systems for text and speech processing."},
      {topic:"Generative AI", work:"Creating models for AI-driven content generation."}
    ]
  },
  {
    title: "Web Development",
    features: [
      {topic:"Frontend Development", work:"React, Vue, HTML, CSS, TailwindCSS."},
      {topic:"Backend Development", work:"Node.js, Express, Django."},
      {topic:"Database Management", work:"SQL, MongoDB, Firebase."},
      {topic:"API Integration", work:"RESTful APIs and GraphQL."},
      {topic:"Responsive Design", work:"Mobile-first development and cross-browser support."}
    ]
  },
  {
    title: "Data Science",
    features: [
      {topic:"Data Analysis",work: "Using Pandas, NumPy, and Excel for insights."},
      {topic:"Data Visualization", work:"Matplotlib, Seaborn, and Plotly."},
      {topic:"Statistical Modeling", work:"Hypothesis testing, regression analysis."},
      {topic:"Big Data Processing", work:"Spark and Hadoop."},
      {topic:"Reporting", work:"Generating dashboards and automated reports."}
    ]
  }
];




export { navLists, projectsList,educationData,featuresProjects };
