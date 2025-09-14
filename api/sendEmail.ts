import emailjs from "@emailjs/browser";
import {contactDetails} from "../constants"

export const sendEmail = async (form: React.RefObject<HTMLFormElement | null>) => {
  try {
    if(!form.current) {
      throw new Error("Form error")
    }
    const result = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        name: (form.current[0] as HTMLInputElement).value,
        from_email: (form.current[1] as HTMLInputElement).value,
        subject: (form.current[2] as HTMLInputElement).value,
        message: (form.current[3] as HTMLTextAreaElement).value,
        email: contactDetails.email,
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );

    return { type: "success", message: "Email sent successfully!",result };
  } catch (error) {
    return { type:"error", message: "Failed to send email." };
  }
};
