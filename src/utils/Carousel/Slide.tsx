import type { FC } from "react";
import type { SlideProps } from "../utilsType";



const Slide: FC<SlideProps> = ({ title, skills, active, slideRef }) => {
  return (
    <div
      ref={slideRef}
      className={`slide-container ${
        active ? "opacity-100 relative block" : "opacity-0 hidden"
      }`}
    >
      <div className="slide">
        <h2 className="title">
          {title}
        </h2>

        <div className="hidden md:block w-[1px] bg-gray-600 h-60"></div>

        <ul>
          {skills.map(({topic,work}, idx) => (
            <li key={idx} className="break-words">
              <p>{topic}: </p>
              <span className="text-white/70 break-words">{work}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};


export default Slide;
