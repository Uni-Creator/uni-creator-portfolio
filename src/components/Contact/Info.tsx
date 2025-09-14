import { useEffect, useRef } from "react";
import { contactDetails } from "../../../constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { TypingAnimation } from "../../../animations";
import SocialLinks from "./SocialLinks";


const Info = ({ videoAction }: { videoAction: "success" | "error" | null }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current || !videoAction) return;

    const video = videoRef.current;

    if (videoAction === "success") {
      video.currentTime = 5;
      video.play();
    } else if (videoAction === "error") {
      video.currentTime = 0;
      video.play();

      // stop at 5s
      const stopVideo = () => {
        if (video.currentTime >= 5) {
          video.pause();
          video.removeEventListener("timeupdate", stopVideo);
        }
      };
      video.addEventListener("timeupdate", stopVideo);
    }
  }, [videoAction]);

  useGSAP(() => {
    if (!videoRef.current) return;

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: videoRef.current,
        start: "top 80%",
      },
    });

    tl.from("#overlay", { opacity: 0, duration: 1 })
      .fromTo(
        videoRef.current,
        { scale: 1.2, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2.5, ease: "power2.out" },
        "-=0.5"
      );

    TypingAnimation("#title-left");
  }, []);



  return (
    <div className="relative w-full h-full order-2 md:order-1">
      <div className="absolute inset-0 overflow-hidden">
        <video
          id="background-video"
          ref={videoRef}
          src="/videos/robo-bg-fixed.mp4"
          preload="auto"
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      <div id="overlay" className="absolute inset-0 bg-black/60 z-10" />

      <div className="relative z-20 p-8 sm:p-12 flex flex-col justify-center text-text-primary">
        <h3 id="title-left" className="text-2xl font-bold mb-6 text-white">
          Contact Information
        </h3>

        <ul className="space-y-4 text-gray-200">
          <li>🌏 <span className="text-white/70 ml-1">{contactDetails.location}</span></li>
          <li>📧 <span className="text-blue-300 select-all ml-1">{contactDetails.email}</span></li>
          <li>📞 <span className="text-white/70 ml-1">{contactDetails.phone}</span></li>
        </ul>

        <SocialLinks />
      </div>
    </div>
  );
};

export default Info;
