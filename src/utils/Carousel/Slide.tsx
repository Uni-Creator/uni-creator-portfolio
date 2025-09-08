import type { FC } from "react";

interface Feature {
  topic: string;
  work: string;
}

interface SlideProps {
  title: string;
  features: Feature[];
  active: boolean;
  slideRef: (el: HTMLDivElement | null) => void;
}

const Slide: FC<SlideProps> = ({ title, features, active, slideRef }) => {
  return (
    <div
      ref={slideRef}
      className={`absolute inset-0 ${active ? "z-10" : "z-0"}`}
      style={{ opacity: active ? 1 : 0 }}
    >
      <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
        <h2 className="text-3xl md:w-1/2 font-bold text-center">{title}</h2>

        {/* Vertical separator that stretches with content */}
        <div className="hidden md:block w-[1px]  bg-gray-600 h-60"></div>

        <ul className="list-disc w-full md:w-1/2 list-inside marker:text-accent space-y-4 break-words">
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
