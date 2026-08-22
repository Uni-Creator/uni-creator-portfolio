import type { ExperienceItem } from "./constantTtypes";

const experienceData: ExperienceItem[] = [
  {
    period: "May 2026 – Jul 2026",
    title: "Deep Learning Intern",
    subtitle: "Indian Institute of Technology (BHU), Varanasi",
    location: "On-site",
    details: [
      "Reproduced and extended the SOKE sign-language generation framework for Indian Sign Language, building a <strong>custom SMPL-X fusion pipeline</strong> (SMPLest-X body + HaMeR/WiLoR hand estimators via inverse kinematics) converting <strong>6,200+ raw ISL videos</strong> into clean 3D pose sequences.",
      "Designed and trained a three-branch <strong>MotionVQVAE motion tokenizer</strong> (independent body/hand codebooks, feature-wise normalization) across <strong>6 controlled experiments</strong>, reducing mean MPJPE to <strong>39.80mm</strong> (<strong>7.04mm body</strong>) on held-out sequences.",
      "Reproduced the autoregressive SLP transformer — training a text-to-motion-token generation pipeline with teacher forcing and three independent prediction heads, establishing a <strong>17–18% token-accuracy baseline</strong>, backed by a custom experiment-management framework for versioning and reproducibility.",
    ],
  },
  {
    period: "Jun 2024 – Aug 2024",
    title: "Machine Learning Intern",
    subtitle: "YBI Foundation",
    location: "Remote",
    details: [
      "Designed and deployed ML classification models across tabular datasets, improving accuracy by <strong>15%</strong> through systematic feature engineering, hyperparameter tuning (grid/random search), and stratified cross-validation.",
      "Implemented a <strong>Redis caching layer</strong> for model inference results, reducing database load by <strong>75%</strong> and cutting average response time for <strong>5,000+ daily users</strong> from <strong>340ms to under 90ms</strong>.",
      "Integrated trained model endpoints into a <strong>FastAPI production service</strong> with input validation, structured error handling, and logging for live performance monitoring.",
      "Collaborated with backend engineers to containerize the service with <strong>Docker</strong> and set up basic CI checks, streamlining the deployment workflow.",
    ],
  },
];

export default experienceData;
