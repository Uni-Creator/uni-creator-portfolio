import gsap from "gsap";
import type { AnimationType } from "../animations/animationTypes";

// Slide animation between two slides
// Example usage: animateSlide(oldSlide, newSlide, "slide-left", 1, () => console.log("Animation complete"))
// oldSlide can be null for the initial slide
// onComplete is called after the animation finishes
export const animateSlide = (
  oldSlide: HTMLDivElement | null,
  newSlide: HTMLDivElement | null,
  type: AnimationType,
  duration: number,
  onComplete: () => void
) => {
  const tl = gsap.timeline({
    onComplete: () => {
      if (oldSlide) gsap.set(oldSlide, { autoAlpha: 0, visibility: "hidden" });
      if (newSlide) gsap.set(newSlide, { autoAlpha: 1, visibility: "visible" });
      onComplete();
    },
  });

  if (oldSlide && oldSlide !== newSlide) {
    gsap.killTweensOf(oldSlide);
    tl.to(oldSlide, {
      autoAlpha: 0,
      duration: duration * 0.6,
      ease: "power1.inOut",
    });
  }

  if (!newSlide) return;

  gsap.killTweensOf(newSlide);
  gsap.set(newSlide, { visibility: "visible" });

  const overlap = oldSlide ? `-=${duration * 0.65}` : "0";

  switch (type) {
    case "fade":
      tl.fromTo(
        newSlide,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration, ease: "power1.inOut" },
        overlap
      );
      break;

    case "slide-up":
      tl.fromTo(
        newSlide,
        { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, duration, ease: "power2.out" },
        overlap
      );
      break;

    case "slide-down":
      tl.fromTo(
        newSlide,
        { autoAlpha: 0, y: -40 },
        { autoAlpha: 1, y: 0, duration, ease: "power2.out" },
        overlap
      );
      break;

    case "slide-left":
      tl.fromTo(
        newSlide,
        { autoAlpha: 0, x: 40 },
        { autoAlpha: 1, x: 0, duration, ease: "power2.out" },
        overlap
      );
      break;

    case "slide-right":
      tl.fromTo(
        newSlide,
        { autoAlpha: 0, x: -40 },
        { autoAlpha: 1, x: 0, duration, ease: "power2.out" },
        overlap
      );
      break;

    case "zoom":
      tl.fromTo(
        newSlide,
        { autoAlpha: 0, scale: 0.9 },
        { autoAlpha: 1, scale: 1, duration, ease: "power2.out" },
        overlap
      );
      break;

    case "vertical-flip":
      tl.fromTo(
        newSlide,
        { autoAlpha: 0, rotationX: -90, transformOrigin: "50% 50%" },
        { autoAlpha: 1, rotationX: 0, duration, ease: "power2.out" },
        overlap
      );
      break;

    case "horizontal-flip":
      tl.fromTo(
        newSlide,
        { autoAlpha: 0, rotationY: -90, transformOrigin: "50% 50%" },
        { autoAlpha: 1, rotationY: 0, duration, ease: "power2.out" },
        overlap
      );
      break;

    default:
      tl.fromTo(
        newSlide,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration, ease: "power1.inOut" },
        overlap
      );
  }
};
