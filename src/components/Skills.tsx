import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { mySkillsList } from "../../constants";
import type { Skill } from "../../constants/constantTtypes";

const Skills = ({
  sectionRef,
}: {
  sectionRef: (node?: Element | null) => void;
}) => {
  useGSAP(() => {
    // Header animation
    gsap.fromTo(
      ".skills-header",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#skills",
          start: "top 85%",
        },
      }
    );

    // Staggered category list items animation
    gsap.fromTo(
      ".skill-category-item",
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#skills",
          start: "top 75%",
        },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="w-full bg-white text-slate-900 py-20 px-6 sm:px-12 md:px-20 border-t border-slate-200 flex flex-col items-center select-none"
    >
      <div className="w-full max-w-6xl mx-auto">
        {/* Section Heading */}
        <div className="skills-header text-center sm:text-left mb-16 max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-widest text-indigo-600 mb-2">
            Expertise & Stack
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
            Skills & Core Technologies
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Specialized toolkits and frameworks across AI, Machine Learning, Computer Vision, and Backend Systems.
          </p>
        </div>

        {/* Categories Grid (2 Columns on Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-start">
          {mySkillsList.map((category: Skill) => (
            <div
              key={category.id}
              className="skill-category-item flex flex-col text-left pt-6 border-t border-slate-200/80"
            >
              <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">
                {category.title}
              </h3>

              <p className="text-sm text-slate-500 mb-4 leading-relaxed font-normal">
                {category.summary}
              </p>

              {/* Technologies list separated by subtle dots */}
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2 text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                {category.features.map((feature, idx) => (
                  <span key={feature.id} className="inline-flex items-center gap-2.5">
                    <span className="inline-block transform hover:-translate-y-0.5 hover:text-indigo-600 transition-all duration-200 cursor-pointer">
                      {feature.title}
                    </span>
                    {idx < category.features.length - 1 && (
                      <span className="text-slate-300 font-normal select-none">·</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;




