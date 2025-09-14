import type { FormValues, ValidationResult } from "./utilsType";

export function validateForm(values: FormValues): ValidationResult {
  const errors: Partial<Record<keyof FormValues, string>> = {};
  const emailRegix = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Name (alphabets & spaces only)
  if (!values.name.trim()) {
    errors.name = "Name is required.";
  } else if (!/^[a-zA-Z\s]{2,50}$/.test(values.name)) {
    errors.name = "Name should contain only letters (min 2 characters).";
  }

  // Email
  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!emailRegix.test(values.email)) {
    errors.email = "Invalid email format.";
  }

  // Subject
  if (!values.subject.trim()) {
    errors.subject = "Subject is required.";
  } else if (values.subject.length < 3) {
    errors.subject = "Subject must be at least 3 characters.";
  }

  // Message
  if (!values.message.trim()) {
    errors.message = "Message is required.";
  } else if (values.message.length < 10) {
    errors.message = "Message must be at least 10 characters.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
