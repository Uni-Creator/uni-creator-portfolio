import { useState, useEffect, useRef } from "react";
import { experienceData } from "../../../constants";
import ExperienceSlide from "./ExperienceSlide";

const ExperienceSlider = () => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const total = experienceData.length;

  // Auto-play
  useEffect(() => {
    if (paused || total <= 1) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 7000);

    return () => clearInterval(timer);
  }, [paused, total]);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + total) % total);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % total);
  };

  // -----------------------------
  // Touch / Swipe
  // -----------------------------

  const handleTouchStart = (e: React.TouchEvent) => {
    setPaused(true);

    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (
      touchStartX.current === null ||
      touchEndX.current === null
    ) {
      setPaused(false);
      return;
    }

    const distance =
      touchStartX.current - touchEndX.current;

    const SWIPE_THRESHOLD = 50;

    if (distance > SWIPE_THRESHOLD) {
      nextSlide();
    } else if (distance < -SWIPE_THRESHOLD) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;

    setPaused(false);
  };

  return (
    <div
      className="relative w-full max-w-4xl mx-auto px-2 sm:px-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Fixed viewport */}
      <div
        className="
          relative
          w-full
          min-h-[520px]
          sm:min-h-[420px]
          md:min-h-[380px]
        "
      >
        {experienceData.map((item, index) => (
          <ExperienceSlide
            key={index}
            item={item}
            active={index === current}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6 px-2">
        {/* Previous */}
        <button
          onClick={prevSlide}
          className="
            p-2.5
            rounded-full
            bg-white
            border
            border-slate-200
            text-slate-700
            hover:text-slate-900
            hover:border-slate-400
            shadow-sm
            transition
            cursor-pointer
            flex
            items-center
            justify-center
          "
          aria-label="Previous experience slide"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Indicators */}
        <div className="flex items-center gap-2">
          {experienceData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`
                h-2.5
                rounded-full
                transition-all
                duration-300
                cursor-pointer
                ${
                  index === current
                    ? "w-8 bg-slate-900"
                    : "w-2.5 bg-slate-300 hover:bg-slate-400"
                }
              `}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={
                index === current ? "true" : undefined
              }
            />
          ))}
        </div>

        {/* Next */}
        <button
          onClick={nextSlide}
          className="
            p-2.5
            rounded-full
            bg-white
            border
            border-slate-200
            text-slate-700
            hover:text-slate-900
            hover:border-slate-400
            shadow-sm
            transition
            cursor-pointer
            flex
            items-center
            justify-center
          "
          aria-label="Next experience slide"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ExperienceSlider;