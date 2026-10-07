import Wave from "../../utils/Wave";
import Timeline from "./Timeline";
import { aboutData, educationData } from "../../../constants";
import AboutMe from "./AboutMe";

const AboutSection = ({
  sectionRef,
}: {
  sectionRef: (node?: Element | null) => void;
}) => {
  return (
    <section ref={sectionRef} id="about">
      <img
        src="/images/aboutMe-bg.avif"
        alt="About me background"
        className="about-bg"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/70 -z-10" />

      {/* About content */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 w-full max-w-6xl z-10">
        <img
          src="/images/me/profile.jpg"
          alt="Abhay Singh"
          className="w-40 h-40 sm:w-48 sm:h-48 rounded-full object-cover border-4 border-indigo-400/60 shadow-xl shrink-0 opacity-100 z-10"
        />
        <AboutMe {...aboutData} />
      </div>

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
