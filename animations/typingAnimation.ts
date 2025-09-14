import gsap from "gsap";

export const TypingAnimation = (selector:string) => {
  const title = document.querySelector(selector);
  if (title) {
    const letters = title.textContent?.split("") || [];
    title.innerHTML = letters
      .map((l) => `<span class="letter">${l}</span>`)
      .join("");

    gsap.fromTo(
      `${selector} .letter`,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.05,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: title,
          start: "top 85%",
        },
      }
    );
  }
};
