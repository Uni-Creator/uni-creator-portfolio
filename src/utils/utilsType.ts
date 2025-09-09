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
  currentPage:string
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

type AnimationType = "fade" | "slide-up" | "zoom";

interface CarouselProps {
  animationType?: AnimationType; // choose fade, slide-up, zoom
  animationDuration?: number;
}


interface Feature {
  topic: string;
  work: string;
}

interface SlideProps {
  title: string;
  features: Feature[];
  active: boolean;
  slideRef: (el: HTMLDivElement | null) => void;
}

export type { MenuIconProps, MenuListProps,TimelineItem,TimelineProps,CarouselProps,AnimationType,SlideProps,Feature };