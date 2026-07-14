import { forwardRef } from "react";

const Input = forwardRef(({ label, error, className = "", ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
      )}
      <input
        ref={ref}
        className={`w-full rounded-lg border px-3.5 py-2.5 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow ${
          error ? "border-red-400" : "border-gray-300 dark:border-gray-700"
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
