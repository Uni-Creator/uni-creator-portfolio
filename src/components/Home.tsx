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
    <section ref={scrollRef} id="home" className="relative w-full overflow-hidden">
      <div ref={sectionRef} id="hero">

        {/* Left column: Identity text */}
        <div id="hero-text">

          {/* Accent rule + role label */}
          <div id="hero-eyebrow">
            <span id="hero-accent-line" aria-hidden="true" />
            <span id="hero-role-label">Hello I'm</span>
          </div>

          {/* Primary name heading */}
          <h1 id="hero-name">Abhay Singh</h1>

          {/* Role title */}
          <p id="hero-title">AI/ML Engineer</p>

          {/* Supporting description */}
          <p id="hero-description">
            Building intelligent systems from models to production.
          </p>

          {/* CTA Buttons */}
          <div id="hero-cta">
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

        {/*Right column: Portrait */}
        <div id="hero-portrait-col">

          {/* Decorative shapes — sit behind the portrait */}
          <div id="hero-shapes" aria-hidden="true">
            {/* Large indigo ring */}
            <div id="hero-shape-ring" />
            {/* Filled indigo blob */}
            <div id="hero-shape-blob" />
            {/* Small accent dot top-right */}
            <div id="hero-shape-dot-a" />
            {/* Small accent dot bottom-left */}
            <div id="hero-shape-dot-b" />
            {/* Thin arc / half-circle */}
            <div id="hero-shape-arc" />
          </div>

          <div id="hero-portrait-wrap">
            <img
              id="hero-portrait"
              src="/images/me/body.png"
              alt="Abhay Singh — AI/ML Engineer"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default Home;
