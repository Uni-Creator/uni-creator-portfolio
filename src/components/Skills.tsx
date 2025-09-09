import Carousel from "../utils/Carousel/Carousel";

const Skills = ({ sectionRef }: { sectionRef: (node?: Element | null) => void }) => {
  return (
    <div
      ref={sectionRef}
      id="skills"    >
      <h2 className="text-[5vw] font-bold text-text-primary mb-12">My Skills</h2>
      <div className="carousel-container">
      <Carousel animationType="fade" animationDuration={0.6}/>
      </div>
    </div>
  );
};

export default Skills;
