import type { FC } from "react";
import type { NavigationProps } from "../../utils/utilsType";


const Navigation: FC<NavigationProps> = ({ current, goToSlide, pauseWithDebounce }) => {
  return (
    <>
      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => {
          goToSlide(current - 1);
          pauseWithDebounce();
        }}
        className="prev navigationButton"
      >
        &#8249;
      </button>

      <button
        type="button"
        aria-label="Next slide"
        onClick={() => {
          goToSlide(current + 1);
          pauseWithDebounce();
        }}
        className="next navigationButton"
      >
        &#8250;
      </button>
    </>
  );
};

export default Navigation;