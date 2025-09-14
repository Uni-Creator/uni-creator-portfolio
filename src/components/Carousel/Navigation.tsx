import type { FC } from "react";
import type { NavigationProps } from "../../utils/utilsType";


const Navigation: FC<NavigationProps> = ({ current, goToSlide, pauseWithDebounce }) => {
  return (
    <>
      <button
        onClick={() => {
          goToSlide(current - 1);
          pauseWithDebounce();
        }}
        className="prev navigationButton"
      >
        &#8249;
      </button>

      <button
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
