// context/PageContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { useSectionObserver } from "./Oberver";

interface PageContextType {
  currentPage: string;
}

const PageContext = createContext<PageContextType | null>(null);

export const PageProvider = ({ children }: { children: React.ReactNode }) => {
  const { inView: inHome } = useSectionObserver();
  const { inView: inAbout } = useSectionObserver();
  const { inView: inSkills } = useSectionObserver();
  const { inView: inProjects } = useSectionObserver();
  const { inView: inContact } = useSectionObserver();

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

  return <PageContext.Provider value={{ currentPage }}>{children}</PageContext.Provider>;
};

export const usePage = () => {
  const ctx = useContext(PageContext);
  if (!ctx) throw new Error("usePage must be used within PageProvider");
  return ctx;
};
