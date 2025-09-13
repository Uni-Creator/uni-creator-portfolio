import { createContext, useContext, useState, type ReactNode } from "react";

type Toast = {
  id: number;
  message: string;
  duration?: number;
  type?: "success" | "error" | "info";
};

type ToastContextType = {
  toast: (
    message: string,
    durationOrOptions?: number | { type?: "success" | "error" | "info"; duration?: number },
    maybeOptions?: { type?: "success" | "error" | "info" }
  ) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast: ToastContextType["toast"] = (message, durationOrOptions, maybeOptions) => {
    let duration = 3000;
    let options: { type?: "success" | "error" | "info" } = {};

    // Case 1: toast(message, { type: "error" })
    if (typeof durationOrOptions === "object") {
      options = durationOrOptions;
      duration = durationOrOptions.duration ?? 3000;
    }
    // Case 2: toast(message, 3000, { type: "error" })
    else if (typeof durationOrOptions === "number") {
      duration = durationOrOptions;
      if (maybeOptions) options = maybeOptions;
    }

    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type: options?.type, duration }]);

    // Auto remove after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast container */}
      <div className="fixed top-5 right-5 flex flex-col space-y-3 z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-2 rounded-lg shadow text-white transition-opacity duration-300
              ${t.type === "success" ? "bg-green-500" : ""}
              ${t.type === "error" ? "bg-red-500" : ""}
              ${t.type === "info" || !t.type ? "bg-blue-500" : ""}`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
}
