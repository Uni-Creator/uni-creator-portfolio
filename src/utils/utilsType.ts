import type { AnimationType } from "../../animations/animationTypes";
import type { Skill } from "../../constants/constantTtypes";

type MenuIconProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type MenuListProps = {
  isMobile: boolean;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isProjectsOpen: boolean;
  setIsProjectsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentPage: string;
};

type TimelineItem = {
  period: string;
  title: string;
  subtitle?: string;
  details: string[];
};

type TimelineProps = {
  sectionTitle: string;
  items: TimelineItem[];
};


interface CarouselProps {
  animationType?: AnimationType; // choose fade, slide-up, zoom
  animationDuration?: number;
}

interface SlideProps extends Omit<Skill, "id"> {
  active: boolean;
  slideRef: (el: HTMLDivElement | null) => void;
}

interface NavigationProps {
  current: number;
  goToSlide: (index: number) => void;
  pauseWithDebounce: () => void;
}

export type {
  MenuIconProps,
  MenuListProps,
  TimelineItem,
  TimelineProps,
  CarouselProps,
  SlideProps,
  NavigationProps,
};
