import { useRef } from "react";
import { useGSAP } from "@gsap/react";

import { timelineAnimation } from "../../../animations/timelineAnimation";
import type { TimelineProps } from "../../utils/utilsType";

const Timeline = ({
  sectionTitle,
  items,
  variant = "dark",
}: TimelineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (containerRef.current) {
        if (titleRef.current) {
          timelineAnimation(containerRef.current, titleRef.current);
        } else {
          const dummyTitle = document.createElement("div");
          timelineAnimation(containerRef.current, dummyTitle as any);
        }
      }
    },
    { scope: containerRef }
  );

  const isLight = variant === "light";

  return (
    <div
      ref={containerRef}
      className={`p-6 sm:p-10 rounded-2xl ${
        isLight
          ? "bg-white shadow-xl border border-slate-200/80"
          : "bg-slate-800/70 backdrop-blur-sm shadow-2xl border border-slate-700"
      }`}
    >
      {sectionTitle && (
        <h3
          ref={titleRef}
          className={`text-3xl md:text-4xl font-extrabold mb-8 tracking-tight ${
            isLight ? "text-indigo-600" : "text-indigo-400"
          }`}
        >
          {sectionTitle}
        </h3>
      )}

      {/* Timeline container */}
      <div className="relative pl-6 sm:pl-8 space-y-10">
        {/* Vertical line */}
        <div
          className={`timeline-line absolute left-0 top-0 w-1 h-full rounded-full ${
            isLight
              ? "bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.3)]"
              : "bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.6)]"
          }`}
        />

        {items.map((item, index) => (
          <div key={index} className="relative">
            {/* Timeline Dot */}
            <span
              className={`timeline-dot absolute -left-[20px] sm:-left-[22px] top-2 w-2.5 h-2.5 rounded-full border-2 ${
                isLight
                  ? "bg-indigo-600 border-white shadow-[0_0_10px_rgba(79,70,229,0.4)]"
                  : "bg-indigo-500 border-slate-900 shadow-[0_0_12px_rgba(99,102,241,0.8)]"
              }`}
            />

            {/* Content */}
            <div className="space-y-1.5 timeline-item">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p
                  className={`font-semibold text-xs sm:text-sm uppercase tracking-wide ${
                    isLight ? "text-indigo-600" : "text-indigo-300"
                  }`}
                >
                  {item.period}
                </p>
                {item.location && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md border ${
                      isLight
                        ? "text-indigo-700 bg-indigo-50 border-indigo-200"
                        : "text-indigo-200/80 bg-indigo-950/60 border-indigo-500/20"
                    }`}
                  >
                    {item.location}
                  </span>
                )}
              </div>

              <p
                className={`text-lg sm:text-xl font-bold ${
                  isLight ? "text-slate-900" : "text-slate-100"
                }`}
              >
                {item.title}
              </p>
              {item.subtitle && (
                <p
                  className={`text-sm sm:text-base font-medium mb-3 ${
                    isLight ? "text-slate-700" : "text-slate-300"
                  }`}
                >
                  {item.subtitle}
                </p>
              )}

              <ul
                className={`list-disc text-sm sm:text-base space-y-2 pl-5 ${
                  isLight ? "text-slate-700" : "text-slate-200"
                }`}
              >
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
