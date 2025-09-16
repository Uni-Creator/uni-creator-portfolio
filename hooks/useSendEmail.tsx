import { useState, useRef, useEffect } from "react";
import { useToast } from "../src/components/Toaster/ToastProvider";
import { validateForm } from "../src/utils/formValidate";
import { sendEmail } from "../api/sendEmail";
import { isToastType } from "../src/components/Toaster/toasterHelperTypes";

export const useSendEmail = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Create audio refs
  const errorAudio = useRef<HTMLAudioElement | null>(null);
  const successAudio = useRef<HTMLAudioElement | null>(null);
  const infoAudio = useRef<HTMLAudioElement | null>(null);

  // Initialize & preload once
  useEffect(() => {
    errorAudio.current = new Audio("/audios/error.mp3");
    successAudio.current = new Audio("/audios/success.mp3");
    infoAudio.current = new Audio("/audios/info.mp3");

    // Preload setup
    [errorAudio, successAudio, infoAudio].forEach(ref => {
      if (ref.current) {
        ref.current.preload = "auto";  // ensures browser loads file
        ref.current.load();            // forces preload immediately
      }
    });
  }, []);

  const playSound = (ref: React.RefObject<HTMLAudioElement | null>) => {
    if (ref.current) {
      ref.current.currentTime = 0; // reset to start in case of overlap
      ref.current.play().catch(() => {
        // autoplay might fail before user interacts
        console.warn("Audio play failed (user gesture required).");
      });
    }
  };

  const emailer = async (formRef: React.RefObject<HTMLFormElement | null>) => {
    setLoading(true);
    try {
      if (!formRef.current) throw new Error("Form invalid");

      const formData = new FormData(formRef.current);
      const values = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        subject: formData.get("subject") as string,
        message: formData.get("message") as string,
      };

      const { isValid, errors } = validateForm(values);

      if (!isValid) {
        const firstError = Object.values(errors)[0];
        toast(firstError, 5000, { type: "info" });
        playSound(infoAudio);
        return null;
      }

      const res = await sendEmail(formRef);

      toast(res.message, 5000, {
        type: isToastType(res.type) ? res.type : "info",
      });

      if (res.type === "success") {
        playSound(successAudio);
      } else {
        playSound(errorAudio);
      }

      return res;
    } catch (err: unknown) {
      playSound(errorAudio);
      if (err instanceof Error) {
        toast(err.message, { type: "error" });
        return { type: "error", message: err.message };
      } else {
        toast("An unknown error occurred", { type: "info" });
        return { type: "error", message: "An unknown error occurred" };
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, emailer };
};
