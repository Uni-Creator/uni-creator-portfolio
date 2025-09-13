import { useGSAP } from "@gsap/react";
import { contactDetails } from "../../constants";
import {
  GithubIcon,
  GmailIcon,
  LinkedinIcon,
  TwitterIcon,
  Instagram,
  Discord,
} from "../assets/icons";
import gsap from "gsap";
import { useRef } from "react";
// import { animateHeading } from "../../animations";

import { sendEmail } from "../../api/sendEmail";

const ICONS_MAP: Record<string, React.ElementType> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  twitter: TwitterIcon,
  email: GmailIcon, // use email for Gmail icon
  instagram: Instagram,
  discord: Discord,
};

const Contact = ({
  sectionRef,
}: {
  sectionRef: (node?: Element | null) => void;
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const formDivRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const iconsRef = useRef<HTMLDivElement | null>(null);

  // Convert email into socialLinks dynamically
  const socialLinks = {
    ...contactDetails.socialLinks,
    email: contactDetails.email,
  };

  useGSAP(() => {
    // Video + overlay timeline
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: videoRef.current,
        start: "top 80%",
      },
    });

    // Overlay fade
    tl.from("#overlay", {
      opacity: 0,
      duration: 1,
    }).fromTo(
      videoRef.current,
      { scale: 1.2, opacity: 0 },
      { scale: 1, opacity: 1, duration: 2.5, ease: "power2.out" },
      "-=0.5"
    );

    // Animate heading letters
    const title = document.querySelector("#title-left");
    if (title) {
      const letters = title.textContent?.split("") || [];
      title.innerHTML = letters
        .map((l) => `<span class="letter">${l}</span>`)
        .join("");

      gsap.fromTo(
        "#title-left .letter",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: title,
            start: "top 85%",
          },
        }
      );
    }

    // Form slide in
    gsap.from(formDivRef.current, {
      opacity: 0,
      x: 150,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: formDivRef.current,
        start: "top 85%",
      },
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const result = await sendEmail(formRef);

    // setStatus(result.message);
    console.log(result);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="w-screen min-h-screen flex items-center justify-center px-4 sm:px-10 py-16"
    >
      <div className="video-background-container  w-full max-w-6xl  rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Side – Info */}
        <div className="relative w-full h-full order-2 md:order-1">
          {/* Background video */}
          <div className="absolute inset-0 overflow-hidden">
            <video
              id="background-video"
              ref={videoRef}
              src="/videos/robo-bg-fixed.mp4"
              preload="auto"
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>

          {/* Optional overlay for readability */}
          <div id="overlay" className="absolute inset-0 bg-black/60 z-10" />

          {/* Content */}
          <div className="relative z-20 p-8 sm:p-12 flex flex-col justify-center  text-text-primary">
            <h3 id="title-left" className="text-2xl font-bold mb-6 text-white">
              Contact Information
            </h3>

            <ul className="space-y-4  text-gray-200">
              <li>
                🌏
                <span className="text-white/70 ml-1 ">
                  {" "}
                  {contactDetails.location}
                </span>
              </li>
              <li>
                📧
                <span className="text-blue-300 select-all ml-1">
                  {contactDetails.email}
                </span>
              </li>
              <li>
                📞{" "}
                <span className="text-white/70 ml-1">
                  {contactDetails.phone}
                </span>{" "}
              </li>
            </ul>

            {/* Socials */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold mb-4 text-white/90">
                Connect with me
              </h4>
              <div
                ref={iconsRef}
                id="iconsContainer"
                className="flex gap-6 text-white"
              >
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
          </div>
        </div>

        {/* Right Side – Form */}
        <div
          ref={formDivRef}
          className="p-8 sm:p-12 border-b md:border-b-0 md:border-l border-gray-200 order-1 md:order-2"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
            Get in Touch
          </h2>
          <p className="text-gray-600 mb-8">
            Fill out the form and I’ll get back to you as soon as possible.
          </p>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                placeholder="What’s this about?"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                rows={5}
                placeholder="Write your message..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
