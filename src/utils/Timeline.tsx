import { useRef } from "react";
import { useGSAP } from "@gsap/react";

import {timelineAnimation} from "../../animations/timelineAnimation"

import type { TimelineProps } from "./utilsType";

const Timeline = ({ sectionTitle, items }: TimelineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (containerRef.current && titleRef.current) {
        timelineAnimation(containerRef.current, titleRef.current);
      }
    },
    { scope: containerRef } 
  );

  return (
    <div
      ref={containerRef}
      className="p-10 bg-primary/50 rounded-2xl backdrop-blur-lg shadow-xl border border-border-accent"
    >
      <h3
        ref={titleRef}
        className="text-5xl font-bold text-text-primary/80 mb-10"
      >
        {sectionTitle}
      </h3>

      {/* Timeline container */}
      <div className="relative pl-10 space-y-12">
        {/* Vertical line */}
        <div className="timeline-line absolute left-0 top-0 w-1 h-full bg-line rounded-full"></div>

        {items.map((item, index) => (
          <div key={index} className="relative timeline-item">
            {/* Timeline Dot */}
            <span className="timeline-dot absolute -left-[22px] top-3 w-3 h-3 bg-dot/70 rounded-full border-2 border-bg-card" />

            {/* Content */}
            <div>
              <p className="font-bold text-lg text-text-primary">{item.period}</p>
              <p className="text-xl font-medium text-text-secondary">{item.title}</p>
              {item.subtitle && (
                <p className="text-text-muted mb-2">{item.subtitle}</p>
              )}

              <ul className="list-disc text-text-primary space-y-2 pl-6">
                {item.details.map((d, i) => (
                  <li key={i} className="leading-relaxed">
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
