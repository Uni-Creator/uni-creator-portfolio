import gsap from "gsap";

export const timelineAnimation = (
  container: HTMLDivElement,
  title: HTMLHeadingElement
) => {
  // Animate heading
  gsap.fromTo(
    title,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      ease: "power3.out",
      scrollTrigger: {
        trigger: title,
        start: "top 80%",
        end: "bottom 60%",
        scrub: true,
      },
    }
  );

  // Animate vertical line grow
  const line = container.querySelector(".timeline-line");
  const items = gsap.utils.toArray<HTMLElement>(".timeline-item");


  if (line) {
    gsap.fromTo(
      line,
      { scaleY: 0, transformOrigin: "top" },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top center",
          end: "bottom bottom",
          scrub: true,
        },
      }
    );
  }

  // Animate timeline items
  items.forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          end: "top 60%",
          scrub: true,
        },
      }
    );
  });

  // Animate dots
  const dots = gsap.utils.toArray<HTMLElement>(".timeline-dot");
  dots.forEach((dot) => {
    gsap.fromTo(
      dot,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: dot,
          start: "top 90%",
          end: "top 70%",
          scrub: true,
        },
      }
    );
  });
};
