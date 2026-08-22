import type { ProjectListType } from "./constantTtypes";

const projectsList: ProjectListType = [
  {
    id: "sign-language-ai",
    href: "#sign-language-ai",
    title: "Sign Language AI",
    subtitle: "Recognition + Generation",
    description:
      "A collection of related sign-language AI systems spanning real-time recognition and text-conditioned motion generation.",
    img: "/images/projects/asl.avif",
    backgroundImg: "/images/projects/bg-asl.avif",
    category: "Research",
    isFlagship: true,
    components: {
      recognition: {
        title: "signBridge",
        subtitle: "Real-Time ISL Recognition",
        description:
          "Built and trained a real-time Indian Sign Language recognition system using a custom Swin3D + BiLSTM model. The model was exposed through a custom Flask API and integrated into a Flutter application.",
        architecture: [
          "Video",
          "Preprocessing",
          "Swin3D + BiLSTM",
          "Flask API",
          "Flutter Application",
        ],
        techStack: "Python, PyTorch, Swin3D, BiLSTM, Flask, Flutter, OpenCV",
        githubLink: "https://github.com/Uni-Creator/signBridge",
        demoLink:
          "https://github.com/user-attachments/assets/130351a1-b1d9-4432-a4a4-7e64ee8ec296",
        technicalDetails: {
          problem:
            "Real-time Indian Sign Language recognition requires processing video sequences through a deep model and delivering results to a mobile application with minimal latency.",
          solution:
            "Trained Swin3D + BiLSTM spatial-temporal model in PyTorch on custom ISL video dataset, exposed inference via custom Flask REST API, and built Flutter mobile frontend.",
          result:
            "Functional end-to-end pipeline from mobile camera video input to real-time sign label recognition in Flutter application.",
        },
      },
      production: {
        title: "Sign Language Pose Generation",
        subtitle: "SOKE / MotionVQVAE Generation",
        description:
          "Reproduced and extended a SOKE-based Sign Language Production pipeline for Indian Sign Language, using SMPL-X representations and MotionVQVAE-based discrete motion tokenization.",
        architecture: [
          "Text",
          "Motion Token Prediction",
          "MotionVQVAE",
          "Body + Hand Motion",
          "SMPL-X / Pose",
        ],
        techStack:
          "Python, PyTorch, MotionVQVAE, VQ-VAE, SMPL-X, Deep Learning",
        githubLink:
          "https://github.com/Uni-Creator/sign-language-pose-generation",
        technicalDetails: {
          problem:
            "Generating realistic and accurate 3D sign language motion sequences from text requires understanding both body and hand kinematics in a discrete, learnable representation.",
          solution:
            "Built custom SMPL-X fusion pipeline (SMPLest-X body + HaMeR/WiLoR hands via inverse kinematics) converting 6,200+ ISL videos into clean 3D pose sequences. Designed and trained three-branch MotionVQVAE tokenizer and autoregressive SLP transformer.",
          result:
            "Reduced mean MPJPE to 39.80mm (7.04mm body) on held-out sequences across 6 controlled experiments. Established a 17–18% token-accuracy baseline.",
        },
      },
    },
  },
  {
    id: "smart-gallery",
    href: "#smart-gallery",
    title: "SmartGallery",
    subtitle: "Computer Vision · CLIP · Embeddings · Semantic Search",
    description:
      "Developed a desktop application that generates captions, auto-tags and CLIP embeddings for photos and supports natural-language semantic search using vector similarity.",
    img: "/images/projects/gallery.avif",
    backgroundImg: "/images/projects/bg-gallery.avif",
    category: "Computer Vision",
    techStack: "Python, CLIP, OpenCV, FAISS, NLP, Desktop UI",
    architecture: [
      "Images",
      "Captioning / Tagging",
      "CLIP Embeddings",
      "FAISS",
      "Semantic Search",
    ],
    githubLink: "https://github.com/Uni-Creator/SmartGallery",
    demoLink:
      "https://github.com/user-attachments/assets/cd0bea7f-06ff-48d0-9c4f-0b1954e63030",
    technicalDetails: {
      problem:
        "Managing thousands of photos manually makes semantic search and organization impractical without embedding-based retrieval.",
      solution:
        "Developed a desktop application that generates captions, auto-tags, and CLIP embeddings for each photo in a watched folder, supporting natural-language queries and live folder updates.",
      result:
        "Natural-language image search across local photo libraries using vector similarity against precomputed embeddings.",
    },
  },
  {
    id: "rag-multifile-qa",
    href: "#rag-multifile-qa",
    title: "RAG Multi-File QA",
    subtitle: "LLM · RAG · Retrieval",
    description:
      "Built a Retrieval-Augmented Generation system that allows users to upload and query PDFs, DOCX, TXT and CSV documents.",
    img: "/images/projects/rag.avif",
    backgroundImg: "/images/projects/bg-rag.avif",
    category: "LLM",
    techStack: "Python, LangChain, Hugging Face, FAISS, Embeddings, Streamlit",
    architecture: [
      "Documents",
      "Parsing",
      "Chunking",
      "Embeddings",
      "FAISS",
      "Retrieval",
      "LLM",
      "Answer",
    ],
    githubLink: "https://github.com/Uni-Creator/RAG-MultiFile-QA",
    liveLink: "https://rag-multifile.streamlit.app/",
    technicalDetails: {
      problem:
        "Information stored across multiple documents is difficult to search and synthesize efficiently.",
      solution:
        "Built a Retrieval-Augmented Generation pipeline supporting PDF, DOCX, TXT and CSV documents. The system parses documents, chunks content, generates embeddings, stores them in FAISS, retrieves relevant context, and passes the retrieved context to an LLM for answer generation.",
      result:
        "Enables natural-language querying across multiple document types using semantic retrieval and contextual generation.",
    },
  },
  {
    id: "cuk-commit",
    href: "#cuk-commit",
    title: "CUK Commit",
    subtitle: "Backend · Authentication · Full Stack",
    description:
      "Implemented the complete authentication and backend infrastructure for the campus app, including login/signup, password reset, database schema, matching logic, FCM push notifications, and OAuth.",
    img: "/images/projects/cukcommit.avif",
    backgroundImg: "/images/projects/bg-cukcommit.avif",
    category: "Backend",
    techStack: "Flutter, Supabase, PostgreSQL, Edge Functions, FCM, OAuth",
    githubLink: "https://github.com/CUK-COMMIT/cukcommit-downloads",
    liveLink: "https://cuk-commit.vercel.app/",
    demoLink:
      "https://github.com/user-attachments/assets/fc0dc4ab-6eb7-4b5b-af38-8c8a727ea8da",
    technicalDetails: {
      problem:
        "Campus applications require secure verification, reliable authentication, structured relational schemas, and real-time push notification pipelines.",
      solution:
        "Implemented the complete authentication and backend infrastructure for the app, including login/signup, password reset flows, database design, matching logic, FCM push notifications, OAuth, and deep link callbacks.",
      result:
        "Functional authentication system, database architecture, matching logic, and push notification pipeline integrated with the Flutter application.",
    },
  },
  {
    id: "neural-drive",
    href: "#neural-drive",
    title: "NeuralDrive",
    subtitle: "Evolutionary AI · Simulation",
    description:
      "Applied the NEAT (NeuroEvolution of Augmenting Topologies) algorithm to evolve neural networks capable of navigating an autonomous driving simulation.",
    img: "/images/projects/neat.avif",
    backgroundImg: "/images/projects/bg-neat.avif",
    category: "Simulation",
    techStack: "Python, NEAT, Evolutionary Algorithms, Neural Network Evolution, Pygame",
    githubLink: "https://github.com/Uni-Creator/NeuralDrive",
    technicalDetails: {
      problem:
        "Gradient-based training is impractical for autonomous driving simulations where the environment is non-differentiable.",
      solution:
        "Applied the NEAT algorithm to evolve neural networks capable of navigating a driving simulation. Networks are evaluated using a fitness function based on distance travelled and collision avoidance.",
      result:
        "Agents progressively improve driving behavior over generations through fitness-based selection in a simulation environment.",
    },
  },
];

export default projectsList;