import type { ProjectListType } from "./constantTtypes";

const projectsList: ProjectListType = [
  {
    id: "nanogpt",
    href: "#nanogpt",
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
  },
  {
    id: "rag-multifile-qa",
    href: "#rag-multifile-qa",
    title: "RAG Multi-File QA",
    subtitle: "LLM + Retrieval",
    img: "/images/hero-rag.avif",
    backgroundImg:
      "https://blogs.nvidia.com/wp-content/uploads/2023/11/Retrieval-Augmented-Generation-RAG-KV-1-1680x897.jpg",
    projectDetails: {
      problem: "Users struggle to query and synthesize information across multiple document formats.",
      solution: "Built a Retrieval-Augmented Generation (RAG) chatbot that processes PDFs, DOCX, TXT, and CSV files.",
      techUsed: "LangChain, Hugging Face Transformers, FAISS, Streamlit.",
      impact: "Enabled accurate Q&A across diverse documents with 90%+ retrieval precision and real-time responses.",
      githubLink: "https://github.com/Uni-Creator/RAG-MultiFile-QA"
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
  }
];

export default projectsList;
