type ProjectType = {
    id: string;
    href: string;
    title: string;
    subtitle:string;
    img:string
};

type ProjectListType = ProjectType[];

type FeaturesType = {
  topic:string;
  work:string
}

type FeaturesProjectsType = {
  title:string;
  features:FeaturesType[];
}

type FeaturesProjectsListType = FeaturesProjectsType[];

type NavList = {
    id: string;
    title: string;
};

type NavListsType = NavList[];


type AboutProps = {
  heading: string;
  description: string;
  highlights: { text: string; highlight?: boolean }[];
  tagline: string;
};


export type { NavListsType, ProjectListType,AboutProps,FeaturesProjectsListType};