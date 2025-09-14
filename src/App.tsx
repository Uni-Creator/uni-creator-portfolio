import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin,SplitText } from "gsap/all";

import { useSectionObserver } from "./utils/Oberver";


import Navbar from "./components/Navbar";
import Home from "./components/Home";
import AboutSection from "./components/AboutSection";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import Projects from "./components/Projects";
import Footer from "./components/Footer";
import { ToastProvider } from "./components/Toaster/ToastProvider";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin,SplitText);
ScrollToPlugin.config({ autoKill: true });

function App() {
  const [currentPage, setCurrentPage] = useState(localStorage.getItem("inPage")||"#home");

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
    localStorage.setItem("inPage",currentPage)
  }, [inHome, inAbout, inSkills, inContact]);

  return (
    <ToastProvider>
    <div id="" className="overflow-x-hidden">
      <Navbar currentPage={currentPage} />
      <div id="">
        <main>
          <Home sectionRef={homeRef} />
          <AboutSection sectionRef={aboutRef} />
          <Skills sectionRef={skillsRef} />
          <Projects sectionRef={projectsRef} />
          <Contact sectionRef={contactRef} />
        </main>
      </div>
      <Footer/>
    </div>
    </ToastProvider>
  );
}

export default App;
