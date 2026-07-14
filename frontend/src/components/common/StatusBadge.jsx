const styles = {
  paid: "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300",
  partial: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  pending: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

export default function StatusBadge({ status }) {
  const key = String(status).toLowerCase();
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${styles[key] || styles.pending}`}>
      {key}
    </span>
  );
}
