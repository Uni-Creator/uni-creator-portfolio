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



export type { MenuIconProps, MenuListProps,TimelineItem,TimelineProps };