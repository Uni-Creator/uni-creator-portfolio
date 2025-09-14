import { contactDetails } from "../../../constants";
import { ICONS_MAP } from "./iconMap";

const SocialLinks = () => {
  const socialLinks = {
    ...contactDetails.socialLinks,
    email: contactDetails.email,
  };

  return (
    <div className="mt-8">
      <h4 className="text-lg font-semibold mb-4 text-white/90">
        Connect with me
      </h4>
      <div id="iconsContainer" className="flex gap-6 text-white">
        {Object.entries(socialLinks).map(([key, link]) => {
          const Icon = ICONS_MAP[key];
          if (!Icon || !link) return null;

          const href = key === "email" ? `mailto:${link}` : link;

          return (
            <a
              key={key}
              href={href}
              target={key === "email" ? undefined : "_blank"}
              rel={key === "email" ? undefined : "noopener noreferrer"}
              className={`hover:animate-pulse  text-white backdrop-blur-lg bg-black/70 p-2 rounded-full hover:text-blue-300 transition transform hover:scale-110`}
            >
              <Icon />
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default SocialLinks;
