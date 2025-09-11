import type { FC } from "react";
import type { SlideProps } from "../utilsType";

const levelColors: Record<string, string> = {
  beginner: "bg-red-500/30 text-red-300",
  intermediate: "bg-yellow-500/30 text-yellow-300",
  advanced: "bg-blue-500/30 text-blue-300",
  expert: "bg-green-500/30 text-green-300",
};

const Slide: FC<SlideProps> = ({
  title,
  summary,
  features,
  active,
  slideRef,
}) => {
  return (
    <div
      ref={slideRef}
      className={`slide-container ${
        active ? "opacity-100 relative block" : "opacity-0 hidden"
      }`}
    >
      <div className="slide">
        {/* Title Block */}
        <div className="title">
          <h2>{title}</h2>
          {summary && <p>{summary}</p>}
        </div>

        {/* Divider */}
        <div className="divider"></div>

        {/* Features / Skills */}
        <div className="content">
          <ul>
            {features.map(({ id, title, description, level }) => (
              <li key={id} className="group">
                <div className="flex items-center justify-between mb-2">
                  <h3 title={title} className="cursor-default">
                    {title}
                  </h3>
                  {level && (
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${
                        levelColors[level] || "bg-gray-500/30 text-gray-300"
                      }`}
                    >
                      {level}
                    </span>
                  )}
                </div>

                {description && <p>{description}</p>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Slide;
