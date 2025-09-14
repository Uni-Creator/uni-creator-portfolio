// src/components/ResponsiveSlider.jsx
import React, { useEffect, useRef, useState } from "react";

/**
 * ResponsiveSlider
 * - Tailwind-only styling (uses arbitrary values like text-[3.2vw], ensure Tailwind JIT / v3+)
 * - Props: slides (array), autoPlay (bool), interval (ms)
 *
 * Slide object shape:
 * { id: 1, title: "Title", desc: "Description", image: "/images/slide1.avif", alt: "..." }
 */

const DEFAULT_SLIDES = [
  {
    id: 1,
    title: "Frontend Development",
    desc: "Building responsive and interactive UIs with React and Tailwind.",
    image: "/images/slide1.avif",
    alt: "Frontend development illustration",
  },
  {
    id: 2,
    title: "Backend & APIs",
    desc: "Designing robust APIs and scalable systems with Node.js.",
    image: "/images/slide2.avif",
    alt: "Backend development illustration",
  },
  {
    id: 3,
    title: "UI / UX Design",
    desc: "Crafting thoughtful experiences and prototypes with Figma.",
    image: "/images/slide3.avif",
    alt: "UI/UX design illustration",
  },
];

export default function ResponsiveSlider({
  slides = DEFAULT_SLIDES,
  autoPlay = true,
  interval = 4000,
}) {
  const [current, setCurrent] = useState(0);
  const [isHover, setIsHover] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const touchStartX = useRef(null);
  const touchDeltaX = useRef(0);
  const pausedUntil = useRef(0);
  const prefersReducedMotion = useRef(false);
  const autoplayTimer = useRef(null);
  const containerRef = useRef(null);

  // Respect reduced motion preferences
  useEffect(() => {
    const mq = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion.current = !!(mq && mq.matches);
    const handler = (e) => { prefersReducedMotion.current = !!e.matches; };
    if (mq && mq.addEventListener) mq.addEventListener("change", handler);
    return () => { if (mq && mq.removeEventListener) mq.removeEventListener("change", handler); };
  }, []);

  // Autoplay: advanced but robust (pause on hover/focus, user interaction, tab hidden, reduced-motion)
  useEffect(() => {
    if (!autoPlay || prefersReducedMotion.current) return;

    const tick = () => {
      // do not advance if hovered, focused, or recently interacted, or tab not visible
      if (isHover || isFocused || pausedUntil.current > Date.now() || document.visibilityState !== "visible") {
        scheduleNext();
        return;
      }
      setCurrent((s) => (s + 1) % slides.length);
      scheduleNext();
    };

    function scheduleNext() {
      clearTimeout(autoplayTimer.current);
      autoplayTimer.current = setTimeout(tick, interval);
    }

    scheduleNext();

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        scheduleNext();
      } else {
        clearTimeout(autoplayTimer.current);
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearTimeout(autoplayTimer.current);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [autoPlay, interval, isHover, isFocused, slides.length]);

  // helpers
  const goTo = (index, userInteracted = true) => {
    const idx = ((index % slides.length) + slides.length) % slides.length;
    setCurrent(idx);
    if (userInteracted) pausedUntil.current = Date.now() + 5000; // short pause after user interaction
  };
  const next = (userInteracted = true) => goTo(current + 1, userInteracted);
  const prev = (userInteracted = true) => goTo(current - 1, userInteracted);

  // keyboard navigation when container is focused
  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      prev(true);
    } else if (e.key === "ArrowRight") {
      next(true);
    }
  };

  // touch / swipe handlers
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    pausedUntil.current = Date.now() + 5000;
  };

  const onTouchMove = (e) => {
    if (touchStartX.current == null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const onTouchEnd = () => {
    const dx = touchDeltaX.current || 0;
    const threshold = Math.max(40, Math.min(120, window.innerWidth * 0.06)); // adaptive threshold
    if (dx > threshold) prev(true);
    else if (dx < -threshold) next(true);
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  // small helper for ARIA announcement (screen readers)
  const srText = `Slide ${current + 1} of ${slides.length}: ${slides[current]?.title || ""}`;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[70vh] md:h-[65vh] lg:h-[60vh] overflow-hidden rounded-xl"
      role="region"
      aria-label="Featured content slider"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Slides wrapper */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${current * 100}%)`,
        }}
        aria-live={prefersReducedMotion.current ? undefined : "polite"}
      >
        {slides.map((slide, idx) => (
          <figure
            key={slide.id ?? idx}
            className="flex-shrink-0 w-full h-full relative"
            aria-hidden={idx !== current}
          >
            {/* image */}
            <img
              src={slide.image}
              alt={slide.alt || slide.title || `Slide ${idx + 1}`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center"
            />

            {/* dark overlay for contrast */}
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />

            {/* content */}
            <figcaption className="absolute left-1/2 -translate-x-1/2 bottom-[12%] max-w-[86%] text-center z-10">
              <h2
                className="font-extrabold text-white"
                style={{ fontSize: "3.6vw" }} /* vw-based heading */
              >
                {slide.title}
              </h2>
              <p
                className="mt-3 text-white/85"
                style={{ fontSize: "1.6vw", lineHeight: 1.35 }} /* vw-based paragraph */
              >
                {slide.desc}
              </p>
              {/* optional CTA area can go here */}
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Prev / Next buttons */}
      <button
        onClick={() => prev(true)}
        aria-label="Previous slide"
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-3 md:p-4 z-20 focus:outline-none focus:ring-4 focus:ring-white/30"
        style={{ fontSize: "3.2vw" }}
      >
        ❮
      </button>

      <button
        onClick={() => next(true)}
        aria-label="Next slide"
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-3 md:p-4 z-20 focus:outline-none focus:ring-4 focus:ring-white/30"
        style={{ fontSize: "3.2vw" }}
      >
        ❯
      </button>

      {/* Indicators (dots) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx, true)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`w-3.5 h-3.5 md:w-4 md:h-4 rounded-full transition-transform focus:outline-none ${
              idx === current ? "bg-white scale-110" : "bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      {/* aria-live sr-only announcement */}
      <p className="sr-only" aria-live="polite">
        {srText}
      </p>
    </div>
  );
}
