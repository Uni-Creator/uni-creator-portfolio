import type { SkillsListType } from "./constantTtypes";

const mySkillsList: SkillsListType = [
  {
    id: "ai-ml",
    title: "AI / Machine Learning",
    summary: "Building and training models for deep learning, NLP, and generative AI tasks.",
    features: [
      {
        id: "pytorch",
        title: "PyTorch",
        description: "Model development, training loops, custom datasets, and experimentation.",
      },
      {
        id: "tensorflow",
        title: "TensorFlow / Keras",
        description: "Building and fine-tuning models for classification and sequence tasks.",
      },
      {
        id: "scikit-learn",
        title: "Scikit-learn",
        description: "Classical ML pipelines, feature engineering, cross-validation.",
      },
      {
        id: "huggingface",
        title: "Hugging Face",
        description: "Pretrained transformers, tokenizers, and model hub integration.",
      },
      {
        id: "langchain",
        title: "LangChain",
        description: "Building RAG pipelines and LLM-powered applications.",
      },
    ],
  },

  {
    id: "computer-vision",
    title: "Computer Vision",
    summary: "Real-time vision systems, image understanding, and semantic retrieval.",
    features: [
      {
        id: "opencv",
        title: "OpenCV",
        description: "Image processing, video capture, and real-time computer vision.",
      },
      {
        id: "mediapipe",
        title: "MediaPipe",
        description: "Hand, pose, and face landmark estimation for real-time applications.",
      },
      {
        id: "clip",
        title: "CLIP",
        description: "Vision-language embeddings for semantic image search and retrieval.",
      },
      {
        id: "yolo",
        title: "YOLO",
        description: "Object detection for real-time video and image analysis.",
      },
    ],
  },

  {
    id: "ai-systems",
    title: "AI Systems",
    summary: "Designing retrieval pipelines, deploying models, and integrating AI into applications.",
    features: [
      {
        id: "rag",
        title: "RAG Pipelines",
        description: "Retrieval-Augmented Generation with chunking, embeddings, and vector search.",
      },
      {
        id: "embeddings",
        title: "Embeddings & Vector Search",
        description: "Semantic similarity, FAISS indexing, and retrieval systems.",
      },
      {
        id: "model-deployment",
        title: "Model Deployment",
        description: "Exporting models and serving inference through REST APIs.",
      },
      {
        id: "llm-apis",
        title: "LLM APIs",
        description: "Integrating language model endpoints into application pipelines.",
      },
      {
        id: "rest-apis",
        title: "REST APIs",
        description: "Designing and consuming API endpoints for AI system integration.",
      },
    ],
  },

  {
    id: "software",
    title: "Software",
    summary: "Core programming, version control, and system tooling.",
    features: [
      {
        id: "python",
        title: "Python",
        description: "Primary language for AI, automation, data pipelines, and backends.",
      },
      {
        id: "cpp",
        title: "C++",
        description: "Algorithmic and performance-focused programming.",
      },
      {
        id: "sql",
        title: "SQL",
        description: "Database schema design, queries, and relational data management.",
      },
      {
        id: "git",
        title: "Git / GitHub",
        description: "Version control, branching, and collaborative development.",
      },
      {
        id: "linux",
        title: "Linux",
        description: "Command-line tooling, scripting, and server-side workflows.",
      },
      {
        id: "docker",
        title: "Docker",
        description: "Containerizing services and managing deployment environments.",
      },
    ],
  },

  {
    id: "backend",
    title: "Backend & Infrastructure",
    summary: "Building API services, managing databases, and deploying backend systems.",
    features: [
      {
        id: "flask",
        title: "Flask / FastAPI",
        description: "Python web frameworks for building and serving API endpoints.",
      },
      {
        id: "postgresql",
        title: "PostgreSQL",
        description: "Relational database design, queries, and schema management.",
      },
      {
        id: "supabase",
        title: "Supabase",
        description: "Authentication, database, storage, and edge functions.",
      },
      {
        id: "redis",
        title: "Redis",
        description: "Caching model inference results and reducing backend load.",
      },
      {
        id: "streamlit",
        title: "Streamlit",
        description: "Building and deploying AI-focused web interfaces quickly.",
      },
    ],
  },
];

export default mySkillsList;