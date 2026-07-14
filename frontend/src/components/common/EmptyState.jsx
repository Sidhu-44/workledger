export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {Icon && (
        <div className="h-14 w-14 rounded-full bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center mb-4">
          <Icon className="text-brand-500" size={26} />
        </div>
      )}
      <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
      {description && <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
