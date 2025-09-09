import Carousel from "../utils/Carousel/Carousel";

const Skills = ({ sectionRef }: { sectionRef: (node?: Element | null) => void }) => {
  return (
    <div
      ref={sectionRef}
      id="skills"
      className="w-screen min-h-screen mt-10 flex-center  flex-col sm:p-10"
    >
      <h2 className="text-[5vw] font-bold text-text-primary mb-12">My Skills</h2>
      <div className="bg-[url('/images/skill-bg.avif')] bg-fixed w-full min-h-[80%] sm:max-h-[50%] flex justify-center items-center p-10 rounded-4xl">
      <Carousel animationType="fade" animationDuration={0.6}/>
      </div>
    </div>
  );
};

export default Skills;