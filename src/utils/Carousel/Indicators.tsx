import type { FC } from "react";

interface IndicatorsProps {
  count: number;
  current: number;
  goToSlide: (index: number) => void;
  pauseWithDebounce: () => void;
}

const Indicators: FC<IndicatorsProps> = ({ count, current, goToSlide, pauseWithDebounce }) => {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
            index === current ? "bg-white" : "bg-gray-500"
          }`}
          onClick={() => {
            goToSlide(index);
            pauseWithDebounce();
          }}
        ></button>
      ))}
    </div>
  );
};

export default Indicators;
