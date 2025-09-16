import { createContext, useContext, useEffect, useState } from "react";
import { useSectionObserver } from "./Oberver";

interface PageContextType {
  currentPage: string;
  homeRef: (node?: Element | null) => void;
  aboutRef: (node?: Element | null) => void;
  skillsRef: (node?: Element | null) => void;
  projectsRef: (node?: Element | null) => void;
  contactRef: (node?: Element | null) => void;
}

const PageContext = createContext<PageContextType | null>(null);

export const PageProvider = ({ children }: { children: React.ReactNode }) => {
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
  }, [inHome, inAbout, inSkills, inProjects, inContact]);

  useEffect(() => {
    localStorage.setItem("inPage", currentPage);
  }, [currentPage]);

  return (
    <PageContext.Provider
      value={{ currentPage, homeRef, aboutRef, skillsRef, projectsRef, contactRef }}
    >
      {children}
    </PageContext.Provider>
  );
};

export const usePage = () => {
  const ctx = useContext(PageContext);
  if (!ctx) throw new Error("usePage must be used within PageProvider");
  return ctx;
};
