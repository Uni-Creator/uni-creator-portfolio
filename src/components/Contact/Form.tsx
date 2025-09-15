import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { formFields } from "../../../constants";

interface FormType {
  handleSubmit: (
    e: React.FormEvent,
    formRef: React.RefObject<HTMLFormElement | null>
  ) => Promise<void>;
  formRef: React.RefObject<HTMLFormElement | null>;
  loading: boolean;
}

const Form = ({ handleSubmit, formRef, loading }: FormType) => {
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
    <div id="form" ref={formDivRef}>
      <h2>Get in Touch</h2>
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
            className={`col-span-1 ${
              field.colSpan === 2 ? "sm:col-span-2" : ""
            }`}
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
              />
            ) : (
              <input
                id={field.id}
                name={field.id}
                type={field.type}
                placeholder={field.placeholder}
              />
            )}
          </div>
        ))}

        <div className="col-span-1 sm:col-span-2">
          <button
            type="submit"
            className={` ${loading ? "cursor-progress" : "cursor-pointer"}`}
          >
            Send Message
          </button>
        </div>
      </form>
      {loading && <Loader />}
    </div>
  );
};

export default Form;

export const Loader = () => {
  return (
    <div>
      <div className="absolute inset-0 flex justify-center items-center bg-transparent bg-opacity-80 z-50 rounded-lg">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    </div>
  );
};
