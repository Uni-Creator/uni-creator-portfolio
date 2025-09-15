import { createContext, useContext, useState, type ReactNode } from "react";
import {
  isToastType,
  type Toast,
  type ToastContextType,
  type ToastType,
} from "./toasterHelperTypes";

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast: ToastContextType["toast"] = (
    message,
    durationOrOptions,
    options
  ) => {
    let duration = 3000;
    let type: ToastType = "info";

    if (typeof durationOrOptions === "number") {
      duration = durationOrOptions;
      if (options?.type && isToastType(options.type)) {
        type = options.type;
      }
    } else if (typeof durationOrOptions === "object") {
      if (durationOrOptions.duration) duration = durationOrOptions.duration;
      if (durationOrOptions.type && isToastType(durationOrOptions.type)) {
        type = durationOrOptions.type;
      }
    }

    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  const icons: Record<ToastType, string> = {
    success: "✔️",
    error: "❌",
    info: "ℹ️",
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-5 right-5 flex flex-col space-y-3 z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow text-white transition-opacity duration-300
              ${t.type === "success" ? "bg-green-500" : ""}
              ${t.type === "error" ? "bg-red-500" : ""}
              ${t.type === "info" ? "bg-blue-400" : ""}`}
          >
            <span className="text-lg">{icons[t.type]}</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}
