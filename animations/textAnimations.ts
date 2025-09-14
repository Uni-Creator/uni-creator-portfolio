import gsap from "gsap";
import { SplitText } from "gsap/all";

// Function to animate headings with a split text effect and scroll trigger 
// provide selector, type of split (chars, words, lines), and additional options
// Example usage: animateHeading(".my-heading", "chars", {linesClass: "my-line"})
export function animateHeading(selector: string, type?: string, options?: any) {
  const headingText = new SplitText(selector, {
    type: type ? type : "chars",
    ...options,
  });

  gsap.from(headingText.chars, {
    y: "100%",
    opacity: 0,
    duration: 0.6,
    ease: "power2.out",
    stagger: 0.06,
    scrollTrigger: {
      trigger: headingText.elements,
      start: "top 70%",
    },
  });

  return headingText;
}

// Function to animate subheadings with a split text effect and scroll trigger
// provide selector, type of split (chars, words, lines), and additional options
// Example usage: animateSubHeading(".my-subheading", "words", {wordsClass: "my-word"})
export function animateSubHeading(
  selector: string,
  type?: string,
  options?: any
) {
  const subHeadingText = new SplitText(selector, {
    type: type ? type : "words",
    ...options,
  });

  gsap.from(subHeadingText.words, {
    y: "100%",
    opacity: 0,
    duration: 0.6,
    ease: "power2.out",
    stagger: 0.08,
    scrollTrigger: {
      trigger: subHeadingText.elements,
      start: "top 70%",
    },
  });

  return subHeadingText;
}

// Function to animate background highlight on text elements
// Example usage: animateBackgroundHighlight(".highlight-text")
export function animateBackgroundHighlight(selector: string) {
  const el = gsap.utils.toArray<HTMLElement>(selector);
  gsap.from(el, {
    duration: 1,
    ease: "power2.in",
    scrollTrigger: {
      trigger: selector,
      start: "top 70%",
    },
    onComplete: () => {
      el.forEach((span) => span.classList.add("heading-bg"));
    },
  });
}
