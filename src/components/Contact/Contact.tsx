import { useRef, useState } from "react";
import Info from "./Info";
import Form from "./Form";
import { useSendEmail } from "../../../hooks/useSendEmail";

const Contact = ({
  sectionRef,
}: {
  sectionRef: (node?: Element | null) => void;
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [videoAction, setVideoAction] = useState<"success" | "error" | null>(
    null
  );
  const { loading, emailer } = useSendEmail();

  const handleSubmit: SubmitType = async (e) => {
    e.preventDefault();

    const results = await emailer(formRef);

    // Update video action based on result type
    if (!results) return;
    setVideoAction(results.type === "success" ? "success" : "error");

    // Reset form fields
    if (formRef.current) {
      Array.from(formRef.current.elements).forEach((element) => {
        if (
          element instanceof HTMLInputElement ||
          element instanceof HTMLTextAreaElement
        ) {
          element.value = ""; // Clear input and textarea values
        }
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="w-screen min-h-screen flex items-center justify-center px-4 sm:px-10 py-16"
    >
      <div className="video-background-container">
        {/* Left Side – Info */}
        <Info videoAction={videoAction} setVideoAction={setVideoAction} />

        {/* Right Side – Form */}
        <Form handleSubmit={handleSubmit} formRef={formRef} loading={loading} />
      </div>
    </section>
  );
};

export default Contact;

// Fixed SubmitType interface
interface SubmitType {
  (e: React.FormEvent): Promise<void>;
}
