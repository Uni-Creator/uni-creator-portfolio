import { animateDuration, animateType } from "../../constants";
import Carousel from "./Carousel/Carousel";

const Skills = ({ sectionRef }: { sectionRef: (node?: Element | null) => void }) => {
  return (
    <div
      ref={sectionRef}
      id="skills">
      <h2 className="text-6xl  font-bold text-text-primary mb-12">Skills</h2>
      <div className="carousel-container">
      <Carousel animationType={animateType} animationDuration={animateDuration}/>
      </div>
    </div>
  );
};

export default Skills;
