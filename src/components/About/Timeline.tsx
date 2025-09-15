import { useRef } from "react";
import { useGSAP } from "@gsap/react";

import { timelineAnimation } from "../../../animations/timelineAnimation";
import type { TimelineProps } from "../../utils/utilsType";

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
      className="p-10 bg-slate-800/70 rounded-2xl backdrop-blur-sm shadow-2xl border border-slate-700"
    >
      <h3
        ref={titleRef}
        className="text-4xl md:text-5xl font-extrabold text-indigo-400 mb-10 tracking-tight"
      >
        {sectionTitle}
      </h3>

      {/* Timeline container */}
      <div className="relative pl-10 space-y-12">
        {/* Vertical line */}
        <div className="timeline-line absolute left-0 top-0 w-1 h-full bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.6)]"></div>

        {items.map((item, index) => (
          <div key={index} className="relative">
            {/* Timeline Dot */}
            <span className="timeline-dot absolute -left-[22px] top-2 w-2 h-2 bg-indigo-500  rounded-full border-2 border-slate-900 shadow-[0_0_12px_rgba(99,102,241,0.8)]" />

            {/* Content */}
            <div className="space-y-1 timeline-item">
              <p className="font-semibold text-sm text-indigo-300 uppercase tracking-wide">
                {item.period}
              </p>
              <p className="text-xl font-semibold text-slate-100">
                {item.title}
              </p>
              {item.subtitle && (
                <p className="text-slate-400 mb-2">{item.subtitle}</p>
              )}

              <ul className="list-disc text-slate-200 space-y-2 pl-6">
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
