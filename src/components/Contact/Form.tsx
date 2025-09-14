import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { formFields } from "../../../constants";

interface FormType {
  handleSubmit: (
    e: React.FormEvent,
    formRef: React.RefObject<HTMLFormElement | null>
  ) => Promise<void>;
  formRef: React.RefObject<HTMLFormElement | null>; // ✅ accept as prop
}

const Form = ({ handleSubmit, formRef }: FormType) => {
  const formDivRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
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

  return (
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

      <form
        ref={formRef}
        onSubmit={(e) => handleSubmit(e, formRef)}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
      >
        {formFields.map((field) => (
          <div
            key={field.id}
            className={`col-span-1 ${field.colSpan === 2 ? "sm:col-span-2" : ""}`}
          >
            <label
              htmlFor={field.id}
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea
                id={field.id}
                name={field.id}
                rows={field.rows || 4}
                placeholder={field.placeholder}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <input
                id={field.id}
                name={field.id}
                type={field.type}
                placeholder={field.placeholder}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        ))}

        <div className="col-span-1 sm:col-span-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send Message
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
