import { animateDuration, animateType } from "../../constants";
import { useRefs } from "../../context/RefsContext";
import Carousel from "./Carousel/Carousel";

const Skills = () => {
    const {skillsRef} = useRefs()
  
  return (
    <div
      ref={skillsRef}
      id="skills">
      <h2 className="text-6xl  font-bold text-text-primary mb-12">My Skills</h2>
      <div className="carousel-container">
      <Carousel animationType={animateType} animationDuration={animateDuration}/>
      </div>
    </div>
  );
};

export default Skills;
