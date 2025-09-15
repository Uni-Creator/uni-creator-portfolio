export type ToastType = "success" | "error" | "info";

export const isToastType = (t: any): t is ToastType =>
  ["success", "error", "info"].includes(t);


export type Toast = {
  id: number;
  message: string;
  duration?: number;
  type: ToastType;
};

export type ToastOptions = {
  type?: ToastType;
  duration?: number;
};

export type ToastContextType = {
  toast: (
    message: string,
    durationOrOptions?: number | ToastOptions,
    options?: ToastOptions
  ) => void;
};
