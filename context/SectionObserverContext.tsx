import { createContext, useContext, useEffect, useState } from "react";
import { useSectionObserver } from "./Oberver";

interface SectionObserverContextType {
  refs: {
    homeRef: (node: HTMLElement | null) => void;
    aboutRef: (node: HTMLElement | null) => void;
    skillsRef: (node: HTMLElement | null) => void;
    projectsRef: (node: HTMLElement | null) => void;
    contactRef: (node: HTMLElement | null) => void;
  };
  inView: {
    inHome: boolean;
    inAbout: boolean;
    inSkills: boolean;
    inProjects: boolean;
    inContact: boolean;
  };
  currentPage: string;
}

const SectionObserverContext = createContext<SectionObserverContextType | null>(
  null
);

export const SectionObserverProvider = ({ children }: { children: React.ReactNode }) => {
  const { ref: homeRef, inView: inHome } = useSectionObserver();
  const { ref: aboutRef, inView: inAbout } = useSectionObserver();
  const { ref: skillsRef, inView: inSkills } = useSectionObserver();
  const { ref: projectsRef, inView: inProjects } = useSectionObserver();
  const { ref: contactRef, inView: inContact } = useSectionObserver();

  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem("inPage") || "#home"
  );

  useEffect(() => {
    if (inHome) setCurrentPage("#home");
    else if (inAbout) setCurrentPage("#about");
    else if (inProjects) setCurrentPage("#projects");
    else if (inSkills) setCurrentPage("#skills");
    else if (inContact) setCurrentPage("#contact");
  }, [inHome, inAbout, inProjects, inSkills, inContact]);

  useEffect(() => {
    localStorage.setItem("inPage", currentPage);
  }, [currentPage]);

  return (
    <SectionObserverContext.Provider
      value={{
        refs: { homeRef, aboutRef, skillsRef, projectsRef, contactRef },
        inView: { inHome, inAbout, inSkills, inProjects, inContact },
        currentPage,
      }}
    >
      {children}
    </SectionObserverContext.Provider>
  );
};

export const useSectionContext = () => {
  const ctx = useContext(SectionObserverContext);
  if (!ctx) {
    throw new Error("useSectionContext must be used within SectionObserverProvider");
  }
  return ctx;
};
