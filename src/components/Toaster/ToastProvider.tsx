import React, { createContext, useContext, useState, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import clsx from "clsx";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextProps {
  addToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType = "info", duration = 3000) => {
    const id = uuidv4();
    const newToast: Toast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-5 right-5 flex flex-col space-y-3 z-[9999]">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={clsx(
              "px-5 py-3 rounded-md shadow-lg text-white transition-all duration-300 animate-slideIn",
              {
                "bg-green-600": toast.type === "success",
                "bg-red-600": toast.type === "error",
                "bg-blue-600": toast.type === "info",
              }
            )}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextProps => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside a ToastProvider");
  return context;
};
