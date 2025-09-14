export type ToastType = "success" | "error" | "info";

export const isToastType = (t: any): t is ToastType =>
  ["success", "error", "info"].includes(t);
