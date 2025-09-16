import { useState, useRef, useEffect } from "react";
import { MenuIcon } from "./MenuIcon";
import { useMediaQuery } from "react-responsive";
import { MenuList } from "./MenuList";
import gsap from "gsap";

const Navbar = ({ currentPage }: { currentPage: string }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [isOpen, setIsOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const lastScroll = useRef(window.scrollY);

  useEffect(() => {
    const handleScroll = () => {
      if (isMobile && isOpen) {
        gsap.set(navRef.current, { opacity: 1 });
        return;
      }
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll.current) {
        gsap.to(navRef.current, {
          opacity: 0,
          duration: 0.6,
          y:-100,
          ease: "easeIn",
        });
      } else {
        gsap.to(navRef.current, {
          opacity: 1,
          duration: 0.3,
          y:0,
          ease: "power2.out",
        });
      }
      lastScroll.current = currentScroll;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile, isOpen]);

  return (
    <nav
      ref={navRef}
      className="fixed-nav w-full z-50 flex  transition-transform backdrop-blur-sm"
    >
      <a href="#home">
        <div id="logo" className="flex items-center gap-2">
        <img
          src="/images/3D_Shape_1.avif"
          alt="logo"
          className="max-w-[40px] max-h-[40px]"
        />
        <h3 className="font-bold text-2xl">Uni-Creator</h3>
      </div>
      </a>

      <MenuIcon isOpen={isOpen} setIsOpen={setIsOpen} />
      <MenuList
        isMobile={isMobile}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isProjectsOpen={isProjectsOpen}
        setIsProjectsOpen={setIsProjectsOpen}
        currentPage={currentPage}
      />
    </nav>
  );
};

export default Navbar;
