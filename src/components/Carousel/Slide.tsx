import type { FC } from "react";
import type { SlideProps } from "../../utils/utilsType";

const levelColors: Record<string, string> = {
  beginner: "bg-red-500/30 text-red-300",
  intermediate: "bg-yellow-500/30 text-yellow-300",
  advanced: "bg-blue-500/30 text-blue-300",
  expert: "bg-green-500/30 text-green-300",
};

const Slide: FC<SlideProps> = ({ title, summary, features, active, slideRef }) => {
  return (
    <div
      ref={slideRef}
      className={`slide-container w-full h-full transition-opacity duration-700 ease-in-out ${active ? "active opacity-100" : "opacity-0"
        }`}
      style={{
        visibility: active ? "visible" : "hidden", // GSAP overrides anyway
        pointerEvents: active ? "auto" : "none",
      }}
    >
      <div className="slide">
        {/* Title Block */}
        <div className="title text-center md:text-left flex flex-col w-full md:w-1/3">
          <h2>{title}</h2>
          {summary && <p>{summary}</p>}
        </div>

        {/* Divider */}
        <div className="divider" />

        {/* Features */}
        <div className="content">
          <ul>
            {features.map(({ id, title, description, level }) => (
              <li key={id}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="">{title}</h3>
                  {level && (
                    <span
                      className={`level self-start ${levelColors[level.toLowerCase()] ||
                        "bg-gray-500/30 text-gray-300"
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
