import { useState } from "react";
import { useToast } from "../src/components/Toaster/ToastProvider";
import { validateForm } from "../src/utils/formValidate";
import { sendEmail } from "../api/sendEmail";
import { isToastType } from "../src/components/Toaster/toasterHelperTypes";
// import { ResultType } from "../src/utils/utilsType";

export const useSendEmail = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const errorAudio = new Audio("/audios/error.mp3");
  const success = new Audio("/audios/success.mp3");
  const info = new Audio("/audios/info.mp3");

  const emailer = async (formRef: React.RefObject<HTMLFormElement | null>) => {
    setLoading(true);
    try {
      if (!formRef.current) throw new Error("Form invalid");

      const formData = new FormData(formRef.current);
      let values = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        subject: formData.get("subject") as string,
        message: formData.get("message") as string,
      };

      // Validate
      const { isValid, errors } = validateForm(values);

      if (!isValid) {
        const firstError = Object.values(errors)[0];
         toast(firstError,5000, { type: "info" });
         info.play()
         return null
      }

      const res = await sendEmail(formRef);

      toast(res.message, 5000, {
        type: isToastType(res.type) ? res.type : "info",
      });

      if (res.type === "success") {
        success.play();
      } else {
        errorAudio.play();
      }
      return res;
    } catch (err: unknown) { // This catch block handles errors from validateForm and the initial formRef check
      errorAudio.play();
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
