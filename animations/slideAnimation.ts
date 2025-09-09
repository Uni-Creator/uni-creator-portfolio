import gsap from "gsap";
import type {AnimationType} from "../animations/animationTypes"

export const animateSlide = (
  oldSlide: HTMLDivElement | null,
  newSlide: HTMLDivElement | null,
  type: AnimationType,
  duration: number,
  onComplete: () => void
) => {
  if (oldSlide && oldSlide !== newSlide) {
    gsap.killTweensOf(oldSlide);
    gsap.to(oldSlide, { autoAlpha: 0, duration: 0.4 });
  }

  if (!newSlide) return;

  gsap.killTweensOf(newSlide);

  switch (type) {
    case "fade":
      gsap.fromTo(
        newSlide,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration, ease: "power2.out", onComplete }
      );
      break;

    case "slide-up":
      gsap.fromTo(
        newSlide,
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration, ease: "power2.out", onComplete }
      );
      break;

    case "zoom":
      gsap.fromTo(
        newSlide,
        { autoAlpha: 0, scale: 0.9 },
        { autoAlpha: 1, scale: 1, duration, ease: "power2.out", onComplete }
      );
      break;

    default:
      gsap.fromTo(
        newSlide,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration, ease: "power2.out", onComplete }
      );
  }
};
