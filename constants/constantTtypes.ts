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

type SkillsType = {
  title:string;
  features:FeaturesType[];
}

type SkillsListType = SkillsType[];

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


export type { NavListsType, ProjectListType,AboutProps,SkillsListType,FeaturesType};