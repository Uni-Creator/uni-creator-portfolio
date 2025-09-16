import gsap from "gsap";
import { PageProvider, usePage } from "../context/PageContext";
import AboutSection from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Navbar from "./components/Navbar/Navbar";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import { ToastProvider } from "./components/Toaster/ToastProvider";

import { ScrollToPlugin,ScrollTrigger,SplitText } from "gsap/all";

gsap.registerPlugin(ScrollToPlugin,SplitText,ScrollTrigger)

function App() {
  return (
    <PageProvider>
      <InnerApp />
    </PageProvider>
  );
}
export default App;
function InnerApp() {
  const { currentPage, homeRef, aboutRef, skillsRef, projectsRef, contactRef } = usePage();

  return (
    <ToastProvider>
    <div className="overflow-x-hidden">
      <Navbar currentPage={currentPage} />
      <main>
        <Home sectionRef={homeRef} />
        <AboutSection sectionRef={aboutRef} />
        <Skills sectionRef={skillsRef} />
        <Projects sectionRef={projectsRef} />
        <Contact sectionRef={contactRef} />
      </main>
      <Footer />
    </div>
    </ToastProvider>
  );
}
