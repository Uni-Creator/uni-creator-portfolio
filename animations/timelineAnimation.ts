import gsap from "gsap";

export const timelineAnimation = (
  container: HTMLDivElement, // The main container of the timeline
  title: HTMLHeadingElement // The heading element of the timeline
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
  const line = container.querySelector(".timeline-line"); //Add this class to the vertical line element
  const items = gsap.utils.toArray<HTMLElement>(".timeline-item"); // Add this class to each timeline item


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
          end: "bottom center",
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
          start: "top 60%",
          end: "bottom 60%",
          scrub: true,
        },
      }
    );
  });

  // Animate dots
  const dots = gsap.utils.toArray<HTMLElement>(".timeline-dot"); // Add this class to each dot element
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
          start: "top 60%",
          end: "top 70%",
          scrub: true,
        },
      }
    );
  });
};
