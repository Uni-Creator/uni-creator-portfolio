import { useState } from "react";
import Info from "./Info";
import Form from "./Form";
import { sendEmail } from "../../../api/sendEmail";
import { useToast } from "../Toaster/ToastProvider";
import { isToastType } from "../Toaster/toasterHelperTypes";

const Contact = ({ sectionRef }: { sectionRef: (node?: Element | null) => void }) => {
  const { toast } = useToast();
  const [videoAction, setVideoAction] = useState<"success" | "error" | null>(null);

  const handleSubmit = async (e: React.FormEvent, formRef: React.RefObject<HTMLFormElement | null>) => {
    e.preventDefault();
    if (!formRef.current) return;

    const result = await sendEmail(formRef);

    toast(result.message, 5000, {
      type: isToastType(result.type) ? result.type : "info",
    });

    // set video action for Info component
    if (result.type === "success") {
      setVideoAction("success");
    } else if (result.type === "error") {
      setVideoAction("error");
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="w-screen min-h-screen flex items-center justify-center px-4 sm:px-10 py-16"
    >
      <div className="video-background-container w-full max-w-6xl rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Side – Info */}
        <Info videoAction={videoAction} />

        {/* Right Side – Form */}
        <Form handleSubmit={handleSubmit} />
      </div>
    </section>
  );
};

export default Contact;
