import { GithubIcon, LinkedinIcon, TwitterIcon } from "../assets/icons";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-primary text-text-primary to-purple-500  py-8 mt-10">
      <div className="container mx-auto px-4 flex flex-col justify-between items-center space-y-6">
        {/* Brand Section */}
        <div className="text-lg w-full text-center font-semibold">
          © {new Date().getFullYear()} Uni-Creator. All rights reserved.
        </div>

        {/* Creator Section */}
        <div className="text-sm w-full text-text-primary/40 text-center font-semibold">
          Created By:{" "}
          <a
            href="https://github.com/shivamByteLab"
            target="_blank"
            title="https://github.com/shivamByteLab"
            className="mx-2 text-white/70 hover:text-yellow-300 transition duration-300"
          >
            shivamByteLab
          </a>
        </div>

        {/* Social Media Links */}
        <div className="flex space-x-4">
          <a
            href="https://github.com/shivamByteLab"
            target="_blank"
            className="text-white/70 hover:text-yellow-300 transition duration-300"
            title="GitHub"
          >
            <i className="fab fa-github text-2xl"><GithubIcon size={18}/></i>
          </a>
          <a
            href="https://linkedin.com/in/shivam99singh33"
            target="_blank"
            className="text-white/70 hover:text-yellow-300 transition duration-300"
            title="LinkedIn"
          >
            <i className="fab fa-linkedin text-2xl"><LinkedinIcon size={18}/></i>
          </a>
          <a
            href="https://x.com/shivam99singh33"
            target="_blank"
            className="text-black/70 hover:text-yellow-300 transition duration-300"
            title="Twitter"
          >
            <i className="fab fa-twitter text-2xl"><TwitterIcon size={18}/></i>
          </a>
        </div>
      </div>
    </footer>
  );
}
