import type { FC } from "react";
import type { SlideProps } from "../utilsType";



const Slide: FC<SlideProps> = ({ title, features, active, slideRef }) => {
  return (
    <div
      ref={slideRef}
      className={`w-full transition-opacity duration-500 ${
        active ? "opacity-100 relative block" : "opacity-0 hidden"
      }`}
    >
      <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
        <h2 className="text-[clamp(1.5rem,4vw,2rem)] sm:w-1/3 font-bold text-center">
          {title}
        </h2>

        <div className="hidden md:block w-[1px] bg-gray-600 h-60"></div>

        <ul className="list-disc w-full md:w-1/2 list-inside marker:text-accent space-y-4 break-words text-[clamp(1rem,2vw,1rem)]">
          {features.map((feature, idx) => (
            <li key={idx} className="break-words">
              <p className="inline font-bold">{feature.topic}: </p>
              <span className="text-accent break-words">{feature.work}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};


export default Slide;
