import { useEffect, useRef, useState } from "react";
import { featuresProjects } from "../../../constants";
import { useGSAP } from "@gsap/react";
import { animateSlide } from "../../../animations/slideAnimation";

import Slide from "./Slide";
import Indicators from "./Indicators";
import Navigation from "./Navigation";
import type { AnimationType } from "../utilsType";

const DEBOUNCE_DELAY = 2000;

interface CarouselProps {
  animationType?: AnimationType; // choose fade, slide-up, zoom
  animationDuration?: number;
}

const Carousel = ({ animationType = "slide-up", animationDuration = 0.6 }: CarouselProps) => {
  const [current, setCurrent] = useState<number>(0);
  const [paused, setPaused] = useState<boolean>(false);
  const [animating, setAnimating] = useState<boolean>(false);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prev = useRef<number>(0);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto slide
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      goToSlide(current + 1);
    }, 6000);
    return () => clearInterval(interval);
  }, [current, paused]);

  // Animate in/out
  useGSAP(() => {
    const oldSlide = slideRefs.current[prev.current];
    const newSlide = slideRefs.current[current];

    setAnimating(true);
    animateSlide(oldSlide, newSlide, animationType, animationDuration, () =>
      setAnimating(false)
    );

    prev.current = current;
  }, [current]);

  const goToSlide = (index: number) => {
    if (animating) return;
    const newIndex = (index + featuresProjects.length) % featuresProjects.length;
    setCurrent(newIndex);
  };

  const pauseWithDebounce = () => {
    setPaused(true);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setPaused(false), DEBOUNCE_DELAY);
  };

  return (
    <div
      className="relative sm:w-[80%] w-full  bg-[#282626] backdrop-blur-sm border border-gray-700 text-white rounded-2xl p-8 md:p-12 shadow-lg"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={pauseWithDebounce}
    >
      {/* Slides */}
      <div className="relative min-h-[400px] md:min-h-[350px]">
        {featuresProjects.map((project, index) => (
          <Slide
            key={index}
            title={project.title}
            features={project.features}
            active={index === current}
            slideRef={(el) => (slideRefs.current[index] = el)}
          />
        ))}
      </div>

      {/* Indicators */}
      <Indicators
        count={featuresProjects.length}
        current={current}
        goToSlide={goToSlide}
        pauseWithDebounce={pauseWithDebounce}
      />

      {/* Navigation */}
      <Navigation
        current={current}
        goToSlide={goToSlide}
        pauseWithDebounce={pauseWithDebounce}
      />
    </div>
  );
};

export default Carousel;
