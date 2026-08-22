import { GithubIcon, LinkedinIcon } from "../assets/icons";
import { contactDetails } from "../../constants";

const socialLinks = contactDetails.socialLinks as Record<string, string>;

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-primary text-text-primary to-purple-500 py-8 mt-10">
      <div className="container mx-auto px-4 flex flex-col justify-between items-center space-y-5">
        {/* Brand */}
        <div className="text-base w-full text-center font-semibold">
          © {new Date().getFullYear()} Abhay Singh · Uni-Creator
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-5">
          <a
            href={socialLinks.github || "https://github.com/Uni-Creator"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-primary/70 hover:text-text-primary transition duration-300"
            title="GitHub"
            aria-label="Abhay Singh on GitHub"
          >
            <GithubIcon size={20} />
          </a>
          <a
            href={socialLinks.linkedin || "http://www.linkedin.com/in/singhrabhay"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-primary/70 hover:text-text-primary transition duration-300"
            title="LinkedIn"
            aria-label="Abhay Singh on LinkedIn"
          >
            <LinkedinIcon size={20} />
          </a>
          <a
            href={`mailto:${contactDetails.email}`}
            className="text-text-primary/70 hover:text-text-primary transition duration-300 text-sm font-medium"
            title="Email"
            aria-label="Email Abhay Singh"
          >
            {contactDetails.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
