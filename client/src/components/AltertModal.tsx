import { X } from "lucide-react";
import { useEffect } from "react";

interface AlertModalProps {
  message: string;
  type: "success" | "error" | "info";
  isOpen: boolean;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseTime?: number;
}

function AlertModal({
  message,
  type,
  isOpen,
  onClose,
  autoClose = true,
  autoCloseTime = 3000,
}: AlertModalProps) {
  useEffect(() => {
    if (autoClose && isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseTime);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, autoClose, autoCloseTime]);

  if (!isOpen) return null;

  const bgColor = {
    success: "bg-green-50",
    error: "bg-red-50",
    info: "bg-blue-50",
  }[type];

  const textColor = {
    success: "text-green-800",
    error: "text-red-800",
    info: "text-blue-800",
  }[type];

  const borderColor = {
    success: "border-green-200",
    error: "border-red-200",
    info: "border-blue-200",
  }[type];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
      <div
        className="fixed inset-0 bg-black bg-opacity-25"
        onClick={onClose}
      ></div>
      <div
        className={`relative ${bgColor} ${borderColor} border rounded-lg p-4 max-w-sm w-full shadow-lg`}
      >
        <div className="flex justify-between items-start">
          <p className={`${textColor} font-medium`}>{message}</p>
          <button
            onClick={onClose}
            className={`${textColor} hover:opacity-70 transition-opacity`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlertModal;
