export default function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-xl2 shadow-soft border border-gray-100 dark:border-gray-800 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
