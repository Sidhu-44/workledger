import { HandCoins, Menu } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

export default function MobileTopNavbar({ onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-card flex items-center gap-3 px-4">
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="p-2 -ml-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <Menu size={22} />
      </button>

      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <div className="h-9 w-9 rounded-lg bg-brand-600 flex items-center justify-center shrink-0">
          <HandCoins className="text-white" size={20} />
        </div>
        <span className="font-bold text-gray-900 dark:text-gray-100 text-base truncate">Worker Ledger</span>
      </div>

      <div className="h-9 w-9 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 flex items-center justify-center text-sm font-semibold shrink-0">
        {user?.full_name?.[0]?.toUpperCase() || "U"}
      </div>
    </header>
  );
}