import { useEffect, useRef, useState } from "react";
import { mySkillsLists } from "../../../constants";
import { useGSAP } from "@gsap/react";
import { animateSlide } from "../../../animations/slideAnimation";

import Slide from "./Slide";
import Indicators from "./Indicators";
import Navigation from "./Navigation";
import type { CarouselProps } from "../utilsType";

const DEBOUNCE_DELAY = 2000;

const Carousel = ({
  animationType = "slide-up",
  animationDuration = 0.6,
}: CarouselProps) => {
  const [current, setCurrent] = useState<number>(0);
  const [paused, setPaused] = useState<boolean>(false);
  const [animating, setAnimating] = useState<boolean>(false);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prev = useRef<number>(0);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const listLenght = mySkillsLists.length;

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
    const newIndex = (index + listLenght) % listLenght;
    setCurrent(newIndex);
  };

  const pauseWithDebounce = () => {
    setPaused(true);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setPaused(false), DEBOUNCE_DELAY);
  };

  return (
    <div
      className="relative w-full sm:w-[80%] carousel"
      onMouseOver={() => setPaused(true)}
      onMouseLeave={pauseWithDebounce}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={pauseWithDebounce}
    >
      {/* Slides */}
      <div className="relative">
        {mySkillsLists.map(({ title, features }, index) => (
          <Slide
            key={index}
            title={title}
            skills={features}
            active={index === current}
            slideRef={(el) => (slideRefs.current[index] = el)}
          />
        ))}
      </div>

      {/* Indicators + Navigation */}
      <Indicators
        count={listLenght}
        current={current}
        goToSlide={goToSlide}
        pauseWithDebounce={pauseWithDebounce}
      />
      <Navigation
        current={current}
        goToSlide={goToSlide}
        pauseWithDebounce={pauseWithDebounce}
      />
    </div>
  );
};

export default Carousel;
