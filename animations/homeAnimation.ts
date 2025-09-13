import { gsap } from "gsap";
import {
  animateHeroImage,
  animateHeading,
  animateFeatureBackground,
  animateProjectCards,
} from "./utils";

export const homeAnimations = (scope: HTMLElement | null) => {
  if (!scope) return;

  // Hero timeline for entry
  const tl = gsap.timeline({ delay: 0.5 });
  tl.from("#left-img", { opacity: 0, y: 10 })
    .from("#right-img", { opacity: 0, y: 10 });

  // Heading effect
  animateHeading("#headings");

  // Background effect
  animateFeatureBackground("#f-bg");

  // Hero floating images
  animateHeroImage("#left-img", "left");
  animateHeroImage("#right-img", "right");

  // Project cards animation
  animateProjectCards("#highlight-projects #projectCard-container .project-card");
};
