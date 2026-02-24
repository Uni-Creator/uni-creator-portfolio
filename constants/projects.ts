import type { ProjectListType } from "./constantTtypes";

const projectsList: ProjectListType = [
  {
    id: "cuk-commit",
    href: "#cuk-commit",
    title: "CUK Commit",
    subtitle: "Authentication & Backend",
    img: "/images/projects/cukcommit.avif",
    backgroundImg: "/images/projects/bg-cukcommit.avif",
    projectDetails: {
      problem:
        "Campus dating apps often lack verification, secure authentication, and structured matching systems.",
      solution:
        "Implemented the complete authentication and backend infrastructure for the app, including login/signup, password reset flows, database design, matching logic, and push notification system.",
      techUsed:
        "Flutter, Supabase, PostgreSQL, Edge Functions, FCM, OAuth",
      impact:
        "Built and integrated the backend with Flutter, handled authentication flows, Supabase database architecture, matching system, push notifications, deep link callbacks, and core app routing.",
      githubLink: "https://github.com/CUK-COMMIT/cukcommit-downloads",
      liveLink: "https://cuk-commit.vercel.app/",
      demoLink: "https://github.com/user-attachments/assets/fc0dc4ab-6eb7-4b5b-af38-8c8a727ea8da"
    }
  },
  {
    id: "rag-multifile-qa",
    href: "#rag-multifile-qa",
    title: "RAG Multi-File QA",
    subtitle: "LLM + Retrieval",
    img: "/images/projects/rag.avif",
    backgroundImg: "/images/projects/bg-rag.avif",
    projectDetails: {
      problem:
        "Information stored across multiple documents is difficult to search and synthesize.",
      solution:
        "Built a Retrieval Augmented Generation chatbot capable of indexing and answering questions from PDFs, DOCX, TXT and CSV.",
      techUsed:
        "Python, LangChain, HuggingFace, FAISS, Streamlit",
      impact:
        "Enabled semantic document search and contextual answers using embeddings and vector databases.",
      githubLink: "https://github.com/Uni-Creator/RAG-MultiFile-QA",
      liveLink: "https://rag-multifile.streamlit.app/"
    } 
  },
  {
    id: "hand-gesture-automation",
    href: "#hand-gesture-automation",
    title: "Hand Gesture Automation",
    subtitle: "Computer Vision",
    img: "/images/projects/gesture.avif",
    backgroundImg: "/images/projects/bg-gesture.avif",
    projectDetails: {
      problem:
        "Standard mouse and keyboard input require physical contact, making interaction difficult in situations where touchless control, accessibility, or hands-free operation is needed.",
      solution:
        "Created a real-time hand tracking system that converts webcam gestures into cursor movement and clicks.",
      techUsed:
        "Python, OpenCV, MediaPipe",
      impact:
        "Achieved smooth real-time control enabling hands-free computer interaction.",
      githubLink: "https://github.com/Uni-Creator/HandGestureAutomation",
      demoLink: "https://github.com/user-attachments/assets/e914f0d4-db16-4bc7-b61d-b92f7e13c1c5"
    }
  },
  {
    id: "smart-gallery",
    href: "#smart-gallery",
    title: "SmartGallery",
    subtitle: "AI Image Search",
    img: "/images/projects/gallery.avif",
    backgroundImg: "/images/projects/bg-gallery.avif",
    projectDetails: {
      problem:
        "Managing thousands of photos manually makes searching extremely inefficient.",
      solution:
        "Developed a desktop app that generates captions, tags and CLIP embeddings for semantic photo search.",
      techUsed:
        "Python, CLIP, NLP, Computer Vision",
      impact:
        "Allows users to search images using natural language queries.",
      githubLink: "https://github.com/Uni-Creator/SmartGallery",
      demoLink: "https://github.com/user-attachments/assets/cd0bea7f-06ff-48d0-9c4f-0b1954e63030"
    }
  },
  {
    id: "rt-asl-recognition",
    href: "#rt-asl-recognition",
    title: "Sign Language Recognition",
    subtitle: "Deep Learning",
    img: "/images/projects/asl.avif",
    backgroundImg: "/images/projects/bg-asl.avif",
    projectDetails: {
      problem:
        "Communication barriers exist between deaf individuals and people unfamiliar with sign language.",
      solution:
        "Implemented an LSTM-based model to recognize sign language gestures in real time from webcam input.",
      techUsed:
        "PyTorch, OpenCV, MediaPipe",
      impact:
        "Demonstrates temporal gesture recognition using sequential deep learning models.",
      githubLink:
        "https://github.com/Uni-Creator/Real-Time-Sign-Language-Recognition",
    }
  },
  {
    id: "flappy-bird-neat",
    href: "#flappy-bird-neat",
    title: "Flappy Bird Genetic AI",
    subtitle: "Neuroevolution",
    img: "/images/projects/neat.avif",
    backgroundImg: "/images/projects/bg-neat.avif",
    projectDetails: {
      problem:
        "Gradient-based learning is not always suitable for game simulations.",
      solution:
        "Used the NEAT algorithm to evolve neural networks capable of playing Flappy Bird autonomously.",
      techUsed:
        "Python, NEAT, Evolutionary Algorithms",
      impact:
        "Agents progressively improved over generations demonstrating effective neuroevolution.",
      githubLink:
        "https://github.com/Uni-Creator/FlappyBird_GeneticAI_NEAT",
      // liveLink: "https://flappy-bird-neat.vercel.app/",
      demoLink: "https://github.com/user-attachments/assets/56b17a39-52e2-45a5-afd4-c24c7ee50357"
    }
  }
];

export default projectsList;