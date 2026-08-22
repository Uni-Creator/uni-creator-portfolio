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
      className="p-6 sm:p-10 bg-slate-800/70 rounded-2xl backdrop-blur-sm shadow-2xl border border-slate-700"
    >
      {sectionTitle && (
        <h3
          ref={titleRef}
          className="text-3xl md:text-4xl font-extrabold text-indigo-400 mb-8 tracking-tight"
        >
          {sectionTitle}
        </h3>
      )}

      {/* Timeline container */}
      <div className="relative pl-6 sm:pl-8 space-y-10">
        {/* Vertical line */}
        <div className="timeline-line absolute left-0 top-0 w-1 h-full bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.6)]"></div>

        {items.map((item, index) => (
          <div key={index} className="relative">
            {/* Timeline Dot */}
            <span className="timeline-dot absolute -left-[20px] sm:-left-[22px] top-2 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-slate-900 shadow-[0_0_12px_rgba(99,102,241,0.8)]" />

            {/* Content */}
            <div className="space-y-1.5 timeline-item">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-xs sm:text-sm text-indigo-300 uppercase tracking-wide">
                  {item.period}
                </p>
                {item.location && (
                  <span className="text-xs text-indigo-200/80 bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-500/20">
                    {item.location}
                  </span>
                )}
              </div>

              <p className="text-lg sm:text-xl font-bold text-slate-100">
                {item.title}
              </p>
              {item.subtitle && (
                <p className="text-sm sm:text-base text-slate-300 font-medium mb-3">
                  {item.subtitle}
                </p>
              )}

              <ul className="list-disc text-slate-200 text-sm sm:text-base space-y-2 pl-5">
                {item.details.map((d, i) => (
                  <li
                    key={i}
                    className="leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: d }}
                  />
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
