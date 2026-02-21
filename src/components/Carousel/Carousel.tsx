import { useEffect, useRef, useState } from "react";
import { mySkillsList } from "../../../constants";
import { useGSAP } from "@gsap/react";
import { animateSlide } from "../../../animations/slideAnimation";

import Slide from "./Slide";
import Indicators from "./Indicators";
import Navigation from "./Navigation";
import type { CarouselProps } from "../../utils/utilsType";
import { debounce, throttle } from "../../utils/timing";

const DEBOUNCE_DELAY = 300;
const THROTTLE_DELAY = 200; // prevent double animations

const Carousel = ({
  animationType = "slide-up",
  animationDuration = 0.1,
}: CarouselProps) => {
  const [current, setCurrent] = useState<number>(0);
  const [paused, setPaused] = useState<boolean>(false);
  const [animating, setAnimating] = useState<boolean>(false);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prev = useRef<number>(0);

  const listLength = mySkillsList.length;

  // Auto slide
  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % listLength);
    }, 6000);

    return () => clearInterval(interval);
  }, [paused, listLength]);

  // Animate first slide
  useGSAP(() => {
    const firstSlide = slideRefs.current[0];
    if (firstSlide) {
      animateSlide(null, firstSlide, animationType, animationDuration, () =>
        setAnimating(false)
      );
    }
  }, []);

  // Animate on slide change
  useGSAP(() => {
    const oldSlide = slideRefs.current[prev.current];
    const newSlide = slideRefs.current[current];

    setAnimating(true);
    animateSlide(oldSlide, newSlide, animationType, animationDuration, () =>
      setAnimating(false)
    );

    prev.current = current;
  }, [current]);

  // Throttled navigation
  const goToSlide = throttle((index: number) => {
    if (animating) return;
    const newIndex = (index + listLength) % listLength;
    setCurrent(newIndex);
  }, THROTTLE_DELAY);

  // Debounced pause/resume
  const resume = () => setPaused(false);
  const debouncedResume = debounce(resume, DEBOUNCE_DELAY);

  const pauseWithDebounce = () => {
    setPaused(true);
    debouncedResume();
  };

  return (
    <div
      className="relative w-full sm:w-[80%] sm:p-10 carousel overflow-hidden"
      onMouseOver={() => setPaused(true)}
      onMouseLeave={pauseWithDebounce}
      onTouchStart={() => setPaused(true)}
    >
      {/* Slides */}
      <div className="relative w-full h-full">
        {mySkillsList.map(({ id, title, summary, features }, index) => (
          <Slide
            key={id}
            title={title}
            summary={summary}
            features={features}
            active={index === current}
            slideRef={(el) => (slideRefs.current[index] = el)}
          />
        ))}
      </div>

      {/* Indicators + Navigation */}
      <Indicators
        count={listLength}
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
