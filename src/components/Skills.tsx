import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { mySkillsList } from "../../constants";
import type { Skill } from "../../constants/constantTtypes";
import { useTiltEffect } from "../../animations";

/* Category Icons */
const BrainIcon = () => (
  <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const CpuIcon = () => (
  <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
  </svg>
);

const TerminalIcon = () => (
  <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ServerIcon = () => (
  <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
  </svg>
);

const getCategoryIcon = (id: string) => {
  switch (id) {
    case "ai-ml":
      return <BrainIcon />;
    case "computer-vision":
      return <EyeIcon />;
    case "ai-systems":
      return <CpuIcon />;
    case "software":
      return <TerminalIcon />;
    case "backend":
      return <ServerIcon />;
    default:
      return <CpuIcon />;
  }
};

const SkillCategoryCard = ({ category }: { category: Skill }) => {
  const { cardRef, eventHandlers } = useTiltEffect({ maxTilt: 6 });

  return (
    <div
      ref={cardRef}
      {...eventHandlers}
      className="skill-category-card bg-slate-900/90 border border-slate-800/90 hover:border-indigo-500/40 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-xl transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-indigo-950/80 border border-indigo-500/30 shrink-0">
            {getCategoryIcon(category.id)}
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {category.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-relaxed">
              {category.summary}
            </p>
          </div>
        </div>

        {/* Features / Skill Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
          {category.features.map((feature) => (
            <div
              key={feature.id}
              className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 hover:border-indigo-500/30 transition duration-200"
            >
              <div className="font-semibold text-sm text-indigo-300 mb-1">
                {feature.title}
              </div>
              <p className="text-xs text-slate-300/80 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Skills = ({
  sectionRef,
}: {
  sectionRef: (node?: Element | null) => void;
}) => {
  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLDivElement>(".skill-category-card");
    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: i * 0.1,
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
          },
        }
      );
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="w-full flex flex-col items-center justify-center px-4 sm:px-10 md:px-20 py-16"
    >
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center sm:text-left mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
            Skills & Core Technologies
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl">
            Specialized toolkits and frameworks across AI, Machine Learning, Computer Vision, and Backend Systems.
          </p>
        </div>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {mySkillsList.map((category) => (
            <SkillCategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
