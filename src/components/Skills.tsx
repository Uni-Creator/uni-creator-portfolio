import Carousel from "../utils/Carousel";

const Skills = ({ sectionRef }: { sectionRef: (node?: Element | null) => void }) => {
  return (
    <div
      ref={sectionRef}
      id="skills"
      className="w-full min-h-screen flex-center flex-col bg-primary p-10"
    >
      <h2 className="text-5xl font-bold text-text-primary mb-12">My Skills</h2>
      <Carousel />
    </div>
  );
};

export default Skills;