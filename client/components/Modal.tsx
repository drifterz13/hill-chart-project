import { useEffect } from "react";
import { X } from "lucide-react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "lg",
}: ModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-base-content/60"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative z-50 flex w-full ${maxWidthClasses[maxWidth]} flex-col rounded-xl bg-base-100 shadow-2xl`}
      >
        <div className="flex flex-col p-8 gap-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base-content text-[24px] font-bold leading-tight">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-base-content/60 hover:text-base-content transition-colors"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
