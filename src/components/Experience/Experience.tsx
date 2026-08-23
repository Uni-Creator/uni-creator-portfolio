import Timeline from "../About/Timeline";
import experienceData from "../../../constants/experience";

const Experience = ({
  sectionRef,
}: {
  sectionRef: (node?: Element | null) => void;
}) => {
  return (
    <section
      ref={sectionRef}
      id="experience"
      className="w-full flex flex-col items-center justify-center px-4 sm:px-10 md:px-20 py-16"
    >
      <div className="w-full max-w-4xl">
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-10 tracking-tight text-center sm:text-left">
          Experience
        </h2>
        <Timeline items={experienceData} variant="light" />
      </div>
    </section>
  );
};

export default Experience;
