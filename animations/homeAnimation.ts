import { gsap } from "gsap";
import { animateProjectCards } from "./utils";

export const homeAnimations = (scope: HTMLElement | null) => {
  if (!scope) return;

  // Hero entrance timeline
  const tl = gsap.timeline({ delay: 0.3 });

  // Eyebrow line + label
  tl.from("#hero-eyebrow", {
    opacity: 0,
    x: -24,
    duration: 0.55,
    ease: "power2.out",
  });

  // Name heading
  tl.from(
    "#hero-name",
    { opacity: 0, y: 32, duration: 0.65, ease: "power3.out" },
    "-=0.25"
  );

  // Role title
  tl.from(
    "#hero-title",
    { opacity: 0, y: 20, duration: 0.5, ease: "power2.out" },
    "-=0.3"
  );

  // Description
  tl.from(
    "#hero-description",
    { opacity: 0, y: 16, duration: 0.5, ease: "power2.out" },
    "-=0.25"
  );

  // CTA buttons
  tl.from(
    "#hero-cta",
    { opacity: 0, y: 14, duration: 0.45, ease: "power2.out" },
    "-=0.2"
  );

  // Portrait entrance; slides up from below, overlapping with text
  tl.from(
    "#hero-portrait-wrap",
    { opacity: 0, y: 48, duration: 0.85, ease: "power3.out" },
    "-=0.9"
  );

  // Shapes entrance, fade in gently
  tl.from(
    "#hero-shapes",
    { opacity: 0, duration: 0.9, ease: "power2.out" },
    "-=0.7"
  );

  // Continuous shape animations (run after page load)

  // Large ring: slow clockwise rotation
  gsap.to("#hero-shape-ring", {
    rotation: 360,
    duration: 12,
    ease: "none",
    repeat: -1,
    transformOrigin: "50% 50%",
  });

  // Blob: gentle vertical float
  gsap.to("#hero-shape-blob", {
    y: -10,
    duration: 3,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });

  // Dot A: small float up
  gsap.to("#hero-shape-dot-a", {
    y: -10,
    duration: 0.5,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
    delay: 0.5,
  });

  // Dot B: small float down (offset phase)
  gsap.to("#hero-shape-dot-b", {
    y: 10,
    duration: 3.5,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
    delay: 1.2,
  });

  // Arc: counter-clockwise slow rotation
  gsap.to("#hero-shape-arc", {
    rotation: -360,
    duration: 18,
    ease: "none",
    repeat: -1,
    transformOrigin: "50% 50%",
  });

  // Project cards animation (other section — untouched)
  animateProjectCards(
    "#highlight-projects #projectCard-container .project-card"
  );
};
