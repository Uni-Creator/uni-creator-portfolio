import gsap from "gsap";

// Hero images (left/right float effect)
// Example usage: animateHeroImage(".hero-image-left", "left")
// Example usage: animateHeroImage(".hero-image-right", "right")
export function animateHeroImage(selector: string, direction: "left" | "right") {
  gsap.to(selector, {
    y: 50,
    ease: "circ.in",
    rotation: direction === "left" ? -10 : 10,
    scrollTrigger: {
      trigger: "#home #hero",
      start: "top top",
      end: "bottom center",
      scrub: true,
    },
  });
}

// Heading pop-in
// Example usage: animateHeading(".my-heading")
export function animateHeading(selector: string) {
  gsap.from(selector, {
    opacity: 0,
    scale: 1.5,
    duration: 1.6,
    ease: "power2.out",
  });
}

// Background scale
// Example usage: animateFeatureBackground(".feature-background")
export function animateFeatureBackground(selector: string) {
  gsap.to(selector, {
    x: 0,
    scale: 1.005,
    ease: "power1.in",
    scrollTrigger: {
      trigger: "#home .feature",
      start: "top center",
      end: "bottom 70%",
      scrub: true,
    },
  });
}

// Project cards slide-in
// Example usage: animateProjectCards(".project-card")
export function animateProjectCards(selector: string) {
  const cards = gsap.utils.toArray<HTMLElement>(selector);
  cards.forEach((card) => {
    gsap.fromTo(
      card,
      { yPercent: 100, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        ease: "none",
        duration: 1,
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
        },
      }
    );
  });
}
