import { X } from "lucide-react";
import { useEffect } from "react";

export default function Modal({ isOpen, onClose, title, children, footer, maxWidth = "max-w-lg" }) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
     <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div
  className={`relative z-10 w-full ${maxWidth} bg-white dark:bg-gray-900 rounded-xl2 shadow-card border border-gray-100 dark:border-gray-800 max-h-[90vh] overflow-y-auto`}
>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg p-1"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}
