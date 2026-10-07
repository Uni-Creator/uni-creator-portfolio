import { useGSAP } from "@gsap/react";
import { navLists, projectsList, resumeList } from "../../../constants";
import type { MenuListProps } from "../../utils/utilsType";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import gsap from "gsap";

export const MenuList = ({
  isMobile,
  isOpen,
  setIsOpen,
  isProjectsOpen,
  setIsProjectsOpen,
  isResumeOpen,
  setIsResumeOpen,
  currentPage,
}: MenuListProps) => {
  const [scrollTo, setScrollTo] = useState<{ scrollto: string }>({
    scrollto: "",
  });
  const menuRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = isOpen ? "hidden" : "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isMobile]);

  // Close on outside click
  useEffect(() => {
    if (!isMobile || !isOpen) return;
    const handleOutside = (e: MouseEvent | globalThis.MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isMobile, isOpen, setIsOpen]);

  useGSAP(() => {
    if (scrollTo.scrollto) {
      gsap.to(window, {
        duration: 1,
        scrollTo: scrollTo.scrollto,
        ease: "sine.out",
      });
    }
  }, [scrollTo]);

  const handleLinkClick = (e: MouseEvent, href: string) => {
    if (href.startsWith("/")) {
      if (isMobile) {
        setIsOpen(false);
      }
      return;
    }
    e.preventDefault();
    if (isMobile) {
      if (href === "#projects") {
        setIsProjectsOpen(!isProjectsOpen);
      } else {
        setScrollTo({ scrollto: href });
        setIsOpen(false);
      }
    } else {
      setScrollTo({ scrollto: href });
    }
  };

  const handleResumeClick = (e: MouseEvent) => {
    e.preventDefault();
    if (isMobile) {
      setIsResumeOpen(!isResumeOpen);
    }
  };

  return (
    <div
      ref={menuRef}
      id="menuList"
      className={`${
        isOpen && isMobile ? "nav-list-mobile" : "hidden"
      }  md:inline-block md:bg-transparent md:shadow-none`}
    >
      <ul
        className={`
          ${isMobile ? "col-center max-h-full" : "flex"} 
           gap-10 md:flex-row md:gap-5 text-center
        `}
      >
        {navLists.map((list) => (
          <li
            key={list.id}
            className={`${
              currentPage === list.href ? "border-b-3 border-active-text" : ""
            } relative max-w-fit`}
            onMouseEnter={() => {
              if (!isMobile) {
                if (list.id === "projects") setIsProjectsOpen(true);
                if (list.id === "resume") setIsResumeOpen(true);
              }
            }}
            onMouseLeave={() => {
              if (!isMobile) {
                if (list.id === "projects") setIsProjectsOpen(false);
                if (list.id === "resume") setIsResumeOpen(false);
              }
            }}
          >
            <a
              href={list.href}
              className={`hover:text-active-text text-xl md:text-base lg:text-lg`}
              onClick={(e) => {
                if (list.id === "resume") {
                  handleResumeClick(e);
                } else {
                  handleLinkClick(e, list.href);
                }
              }}
            >
              {list.title}
              {list.id === "resume" && (
                <span
                  className="ml-1 text-xs inline-block transition-transform duration-200"
                  style={{
                    transform: isResumeOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  ▾
                </span>
              )}
            </a>

            {list.id === "projects" && isProjectsOpen && (
              <ul className="md:absolute rounded md:top-7 text-md md:right-0 md:bg-white md:shadow-lg md:rounded-lg md:p-2 mt-2 md:mt-0">
                {projectsList.map((project, pIdx) => (
                  <li
                    key={project.href + pIdx}
                    className="p-2"
                    onClick={(e) => handleLinkClick(e, project.href)}
                  >
                    <a
                      href={project.href}
                      className="hover:text-active-text whitespace-nowrap text-sm"
                    >
                      {project.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}

            {list.id === "resume" && isResumeOpen && (
              <ul className="md:absolute rounded md:top-7 text-md md:right-0 md:bg-white md:shadow-lg md:rounded-lg md:p-2 mt-2 md:mt-0 min-w-[150px]">
                {resumeList.map((resume) => (
                  <li key={resume.id} className="p-2">
                    <a
                      href={resume.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-active-text whitespace-nowrap text-sm"
                      onClick={() => isMobile && setIsOpen(false)}
                    >
                      {resume.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
