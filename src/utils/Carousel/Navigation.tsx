import type { FC } from "react";
import type { NavigationProps } from "../utilsType";


const Navigation: FC<NavigationProps> = ({ current, goToSlide, pauseWithDebounce }) => {
  return (
    <>
      <button
        onClick={() => {
          goToSlide(current - 1);
          pauseWithDebounce();
        }}
        className="left-5 navigationButton"
      >
        &#8249;
      </button>

      <button
        onClick={() => {
          goToSlide(current + 1);
          pauseWithDebounce();
        }}
        className="right-5 navigationButton"
      >
        &#8250;
      </button>
    </>
  );
};

export default Navigation;
