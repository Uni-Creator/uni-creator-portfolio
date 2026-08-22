import type { FC } from "react";
import type { SlideProps } from "../../utils/utilsType";

const Slide: FC<SlideProps> = ({ title, summary, features, active, slideRef }) => {
  return (
    <div
      ref={slideRef}
      className={`slide-container w-full h-full transition-opacity duration-700 ease-in-out ${
        active ? "active opacity-100" : "opacity-0"
      }`}
      style={{
        visibility: active ? "visible" : "hidden",
        pointerEvents: active ? "auto" : "none",
      }}
    >
      <div className="slide">
        {/* Title Block */}
        <div className="title text-center md:text-left flex flex-col w-full md:w-1/3">
          <h2>{title}</h2>
          {summary && (
            <p className="line-clamp-2 text-sm sm:text-base leading-relaxed">
              {summary}
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="divider" />

        {/* Features */}
        <div className="content">
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {features.map(({ id, title, description }) => (
              <li key={id}>
                <div className="mb-1">
                  <h3 className="text-sm sm:text-base font-medium">{title}</h3>
                </div>
                {description && (
                  <p className="line-clamp-2 text-xs sm:text-sm leading-relaxed opacity-80">
                    {description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Slide;