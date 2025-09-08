import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const homeAnimations = (scope: HTMLElement | null) => {
  if (!scope) return;
  const tl = gsap.timeline({ delay: 0.5 });

  tl.from("#left-img", {
    opacity: 0,
    y: 10,
  })
    .from("#right-img", {
      opacity: 0,
      y: 10,
    })
    gsap.from("#headings", {
      opacity: 0,
      scale: 1.5,
      duration:1
    });

  gsap.to("#f-bg", {
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

  gsap.to("#left-img", {
    y: 50,
    rotation: -10,
    scrollTrigger: {
      trigger: "#home #hero",
      start: "top top",
      end: "bottom center",
      scrub: true,
    },
  });

  gsap.to("#right-img", {
    y: 50,
    rotation: 10,
    scrollTrigger: {
      trigger: "#home #hero",
      start: "top top",
      end: "bottom center",
      scrub: true,
    },
  });
};
