import Wave from "../utils/Wave";
import Timeline from "../utils/Timeline";
import { aboutData, educationData } from "../../constants";
import AboutMe from "../utils/AboutMe";

const AboutSection = ({
  sectionRef,
}: {
  sectionRef: (node?: Element | null) => void;
}) => {
  return (
    <section ref={sectionRef} id="about">
      <img
        src="/images/aboutMe-bg.avif"
        alt="About me background"      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/70 -z-10" />

      {/* About content */}
      <AboutMe {...aboutData} />

      {/* Timeline */}
      <div className="w-full max-w-6xl mt-16 z-10">
        <Timeline sectionTitle="Education" items={educationData} />
      </div>

      <div className="absolute bottom-0 w-full">
        <Wave />
      </div>
    </section>
  );
};

export default AboutSection;
