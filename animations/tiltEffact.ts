// hooks/useTiltEffect.ts
import { useRef } from "react";
import gsap from "gsap";

type TiltOptions = {
  maxTilt?: number;   // max tilt in degrees
  duration?: number;  // gsap animation duration
  ease?: string;      // gsap easing
};

export function useTiltEffect({ maxTilt = 8, duration = 0.3, ease = "easeIn" }: TiltOptions = {}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const midX = rect.width / 2;
    const midY = rect.height / 2;
    const rotateX = ((y - midY) / midY) * maxTilt;
    const rotateY = ((x - midX) / midX) * -maxTilt;

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      duration,
      ease,
      transformPerspective: 1000,
      transformOrigin: "center",
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration,
      ease,
    });
  };

  return {
    cardRef,
    eventHandlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    },
  };
}
