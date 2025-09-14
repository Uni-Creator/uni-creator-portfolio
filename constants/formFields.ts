import type {Field} from "./constantTtypes"
const formFields: Field[] = [
  {
    id: "name",
    label: "Name",
    type: "text",
    placeholder: "Your name",
    colSpan: 1,
  },
  {
    id: "email",
    label: "Email",
    type: "email",
    placeholder: "you@example.com",
    colSpan: 1,
  },
  {
    id: "subject",
    label: "Subject",
    type: "text",
    placeholder: "What’s this about?",
    colSpan: 2,
  },
  {
    id: "message",
    label: "Message",
    type: "textarea",
    placeholder: "Write your message...",
    rows: 5,
    colSpan: 2,
  },
];
export default formFields