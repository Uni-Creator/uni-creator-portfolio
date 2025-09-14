import { useGSAP } from "@gsap/react";
import { navLists, projectsList } from "../../../constants";
import type { MenuListProps } from "../../utils/utilsType";
import { useState, type MouseEvent } from "react";
import gsap from "gsap";

export const MenuList = ({
  isMobile,
  isOpen,
  setIsOpen,
  isProjectsOpen,
  setIsProjectsOpen,
  currentPage,
}: MenuListProps) => {
  const [scrollTo, setScrollTo] = useState<{ scrollto: string }>({
    scrollto: "",
  });
  useGSAP(() => {
    if (scrollTo.scrollto) {
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: scrollTo.scrollto, offsetY: 60,autoKill:true },
        ease: "sine.out",
      });
    }
  }, [scrollTo]);

  const handleLinkClick = (e: MouseEvent, href: string) => {
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
  return (
    <div
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
            className={`${currentPage === list.href
                ? "border-b-3 border-active-text"
                : ""
            } relative  max-w-fit`}
            onMouseEnter={() =>
              !isMobile && list.id === "projects" && setIsProjectsOpen(true)
            }
            onMouseLeave={() => !isMobile && setIsProjectsOpen(false)}
          >
            <a
              href={list.href}
              target="_blank"
              className={`hover:text-active-text text-xl md:text-xl`}
              onClick={(e) =>
                list.id !== "resume" && handleLinkClick(e, list.href)
              }
            >
              {list.title}
            </a>
            {list.id === "projects" && isProjectsOpen && (
              <ul className="md:absolute rounded  md:top-7 text-md md:right-0 md:bg-white md:shadow-lg md:rounded-lg md:p-2 mt-2 md:mt-0">
                {projectsList.map((project, pIdx) => (
                  <li
                    key={project.href + pIdx}
                    className="p-2"
                    onClick={(e) => handleLinkClick(e, project.href)}
                  >
                    <a
                      href={project.href}
                      className="hover:text-active-text whitespace-nowrap"
                    >
                      {project.title}
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
