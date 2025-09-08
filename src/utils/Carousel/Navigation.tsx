import type { FC } from "react";

interface NavigationProps {
  current: number;
  goToSlide: (index: number) => void;
  pauseWithDebounce: () => void;
}

const Navigation: FC<NavigationProps> = ({ current, goToSlide, pauseWithDebounce }) => {
  return (
    <>
      <button
        onClick={() => {
          goToSlide(current - 1);
          pauseWithDebounce();
        }}
        className="absolute top-1/2 left-5 transform -translate-y-1/2 text-white/20 cursor-pointer hover:text-white/50 text-6xl font-bold"
      >
        &#8249;
      </button>

      <button
        onClick={() => {
          goToSlide(current + 1);
          pauseWithDebounce();
        }}
        className="absolute top-1/2 right-5 transform -translate-y-1/2 text-white/20 cursor-pointer hover:text-white/50 text-6xl font-bold"
      >
        &#8250;
      </button>
    </>
  );
};

export default Navigation;
