import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin, SplitText } from "gsap/all";

import { RefsProvider, useRefs } from "../context/RefsContext";
import { PageProvider, usePage } from "../context/PageContext";

import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home";
import AboutSection from "./components/About";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import Projects from "./components/Projects";
import Footer from "./components/Footer";
import { ToastProvider } from "./components/Toaster/ToastProvider";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText);
ScrollToPlugin.config({ autoKill: true });

function AppContent() {

  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <main>
        <Home/>
        <AboutSection/>
        <Skills />
        <Projects/>
        <Contact/>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <RefsProvider>
        <PageProvider>
          <AppContent />
        </PageProvider>
      </RefsProvider>
    </ToastProvider>
  );
}

export default App;
