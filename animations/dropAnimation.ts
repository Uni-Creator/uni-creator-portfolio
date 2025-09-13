import gsap from "gsap";

// Function to animate elements with a drop effect and scroll trigger
// Example usage: animateDrop(".my-element")
export function animateDrop(selector: string) {
  const dropTimeline = gsap.timeline({
    // ease: "bounce.in",
    delay: 0.2,
    duration: 0.6,
    scrollTrigger: {
      trigger: selector,
      start: "top 70%",
    },
  });

  dropTimeline
    .from(selector, { y: -100, opacity: 0 })
    .to(selector, { y: 40, opacity: 0.3 })
    .to(selector, { y: -60, opacity: 0.5 })
    .to(selector, { y: 20, opacity: 0.6 })
    .to(selector, { y: -10, opacity: 0.7 })
    .to(selector, { y: 5, opacity: 0.9 })
    .to(selector, { y: 0, opacity: 1 });

  return dropTimeline;
}
