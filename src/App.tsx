import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollToPlugin,SplitText } from "gsap/all";

import { useSectionObserver } from "./utils/Oberver";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import AboutSection from "./components/AboutSection";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import Projects from "./components/Projects";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin,SplitText);
ScrollToPlugin.config({ autoKill: true });

function App() {
  const [currentPage, setCurrentPage] = useState("#home");

  // Section observers
  const { ref: homeRef, inView: inHome } = useSectionObserver();
  const { ref: aboutRef, inView: inAbout } = useSectionObserver();
  const { ref: skillsRef, inView: inSkills } = useSectionObserver();
  const { ref: projectsRef, inView: inProjects } = useSectionObserver();
  const { ref: contactRef, inView: inContact } = useSectionObserver();

  useEffect(() => {
    if (inHome) setCurrentPage("#home");
    else if (inAbout) setCurrentPage("#about");
    else if (inProjects) setCurrentPage("#projects");
    else if (inSkills) setCurrentPage("#skills");
    else if (inContact) setCurrentPage("#contact");
  }, [inHome, inAbout, inSkills, inContact]);

  useEffect(() => {
    ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1,
      effects: true,
      smoothTouch: 0.1,
    });
  }, []);

  return (
    <div id="smooth-wrapper">
      <Navbar currentPage={currentPage} />
      <div id="smooth-content">
        <main>
          <Home sectionRef={homeRef} />
          <AboutSection sectionRef={aboutRef} />
          <Skills sectionRef={skillsRef} />
          <Projects sectionRef={projectsRef} />
          <Contact sectionRef={contactRef} />
        </main>
      </div>
    </div>
  );
}

export default App;
