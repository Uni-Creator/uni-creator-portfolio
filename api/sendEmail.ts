import emailjs from "@emailjs/browser";
import {contactDetails} from "../constants"

export const sendEmail = async (form) => {
  try {
    const result = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        name: form.current[0].value,
        from_email: form.current[1].value,
        subject: form.current[2].value,
        message: form.current[3].value,
        email: contactDetails.email,
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );

    return { success: true, message: "Email sent successfully!" };
  } catch (error) {
    return { success: false, message: "Failed to send email." };
  }
};
