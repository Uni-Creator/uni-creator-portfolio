import { useInView } from "react-intersection-observer";
import type { IntersectionOptions } from "react-intersection-observer";

/**
 * A custom hook to observe if a component is in the viewport.
 * @param {IntersectionOptions} options - Configuration for the Intersection Observer.
 * @returns The ref to attach to the element and a boolean indicating if it's in view.
 */
export const useSectionObserver = (options?: IntersectionOptions) => {
  const { ref, inView } = useInView({
    threshold: 0.3, // Default threshold
    ...options, // Allow overriding defaults
  });

  return { ref, inView };
};