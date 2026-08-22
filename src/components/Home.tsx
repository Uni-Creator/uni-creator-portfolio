import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { homeAnimations } from "../../animations/homeAnimation";

const Home = ({
  sectionRef,
}: {
  sectionRef: (node?: Element | null) => void;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      homeAnimations(scrollRef.current);
    },
    { scope: scrollRef }
  );

  return (
    <section ref={scrollRef} id="home" className="relative pt-24 pb-12 md:pt-28 md:pb-16 w-full">
      <div ref={sectionRef} id="hero" className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center">
        {/* Floating 3D Decoration — restrained, absolute background placement */}
        <div id="hero-image-container" className="absolute inset-0 pointer-events-none flex items-center justify-between px-2 sm:px-8 opacity-30 sm:opacity-50 -z-10 overflow-hidden">
          <img
            id="left-img"
            src="/images/3D_Shape_2.avif"
            alt=""
            aria-hidden="true"
            className="w-16 h-16 sm:w-28 sm:h-28 md:w-36 md:h-36 object-contain transform -translate-x-4 sm:translate-x-0"
          />
          <img
            id="right-img"
            src="/images/3D_Shape_4.avif"
            alt=""
            aria-hidden="true"
            className="w-16 h-16 sm:w-28 sm:h-28 md:w-36 md:h-36 object-contain transform translate-x-4 sm:translate-x-0"
          />
        </div>

        {/* Heading & Subtext */}
        <div id="headings" className="w-full flex flex-col items-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-text-primary leading-[1.15] tracking-tight max-w-4xl">
            AI/ML Engineer building{" "}
            <span className="text-indigo-600 font-extrabold">
              intelligent systems
            </span>{" "}
            from models to production.
          </h1>
          
          <p className="mt-4 md:mt-5 text-base sm:text-lg md:text-xl text-text-primary/75 max-w-2xl leading-relaxed font-medium">
            I build AI systems across deep learning, computer vision, LLM/RAG applications, and real-time inference.
          </p>

          {/* CTA Buttons */}
          <div id="hero-cta" className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 md:mt-8">
            <a
              href="#projects"
              className="hero-btn hero-btn-primary"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("projects")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              View Projects
            </a>
            <a
              href="https://github.com/Uni-Creator"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-btn hero-btn-secondary"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
