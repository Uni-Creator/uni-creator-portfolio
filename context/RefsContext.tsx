// context/RefsContext.tsx
import { createContext, useContext } from "react";
import { useSectionObserver } from "./Oberver";

interface RefsContextType {
  homeRef: (node: HTMLElement | null) => void;
  aboutRef: (node: HTMLElement | null) => void;
  skillsRef: (node: HTMLElement | null) => void;
  projectsRef: (node: HTMLElement | null) => void;
  contactRef: (node: HTMLElement | null) => void;
}

const RefsContext = createContext<RefsContextType | null>(null);

export const RefsProvider = ({ children }: { children: React.ReactNode }) => {
  const { ref: homeRef } = useSectionObserver();
  const { ref: aboutRef } = useSectionObserver();
  const { ref: skillsRef } = useSectionObserver();
  const { ref: projectsRef } = useSectionObserver();
  const { ref: contactRef } = useSectionObserver();

  // refs don’t change → stable object
  const refs: RefsContextType = { homeRef, aboutRef, skillsRef, projectsRef, contactRef };

  return <RefsContext.Provider value={refs}>{children}</RefsContext.Provider>;
};

export const useRefs = () => {
  const ctx = useContext(RefsContext);
  if (!ctx) throw new Error("useRefs must be used within RefsProvider");
  return ctx;
};
