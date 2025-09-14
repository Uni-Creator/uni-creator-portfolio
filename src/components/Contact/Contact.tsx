import { useRef, useState } from "react";
import Info from "./Info";
import Form from "./Form";
import { sendEmail } from "../../../api/sendEmail";
import { useToast } from "../Toaster/ToastProvider";
import { isToastType } from "../Toaster/toasterHelperTypes";
import { validateForm } from "../../utils/formValidate";

const Contact = ({ sectionRef }: { sectionRef: (node?: Element | null) => void }) => {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement | null>(null); // ✅ create ref here
  const [videoAction, setVideoAction] = useState<"success" | "error" | null>(null);

  const handleSubmit = async (
    e: React.FormEvent,
    formRef: React.RefObject<HTMLFormElement | null>
  ) => {
    e.preventDefault();
    if (!formRef.current) return;

      const formData = new FormData(formRef.current);
        const values = {
          name: formData.get("name") as string,
          email: formData.get("email") as string,
          subject: formData.get("subject") as string,
          message: formData.get("message") as string,
        };
    
        // Validate
        const { isValid, errors } = validateForm(values);
    
        if (!isValid) {
          const firstError = Object.values(errors)[0];
          if (firstError) toast(firstError, 4000, { type: "error" });
          return;
        }
    

    const result = await sendEmail(formRef);

    toast(result.message, 5000, {
      type: isToastType(result.type) ? result.type : "info",
    });

    // ✅ trigger videoAction for Info component
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
        <Form handleSubmit={handleSubmit} formRef={formRef} />
      </div>
    </section>
  );
};

export default Contact;
