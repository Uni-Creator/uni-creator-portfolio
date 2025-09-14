import { Discord, GithubIcon, GmailIcon, Instagram, LinkedinIcon, TwitterIcon } from "../../assets/icons";

export const ICONS_MAP: Record<string, React.ElementType> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  twitter: TwitterIcon,
  email: GmailIcon, // use email for Gmail icon
  instagram: Instagram,
  discord: Discord,
};
