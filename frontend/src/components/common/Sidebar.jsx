import { LayoutDashboard, Users, HardHat, Wallet, FileBarChart, Settings, HandCoins, HelpCircle, LogOut, Bot } from "lucide-react";
import { NavLink } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/ai-assistant", label: "AI Assistant", icon: Bot },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/work-entries", label: "Work Entries", icon: HardHat },
  { to: "/payments", label: "Payments", icon: Wallet },
  { to: "/reports", label: "Reports", icon: FileBarChart },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center gap-2.5 px-6 h-16 border-b border-gray-100 dark:border-gray-800">
          <div className="h-9 w-9 rounded-lg bg-brand-600 flex items-center justify-center">
            <HandCoins className="text-white" size={20} />
          </div>
          <span className="font-bold text-gray-900 dark:text-gray-100 text-lg">Worker Ledger</span>
        </div>

        <div className="lg:hidden flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="h-11 w-11 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 flex items-center justify-center text-base font-semibold shrink-0">
            {user?.full_name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="leading-tight min-w-0">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{user?.full_name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.trade || "Worker"}</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3.5 lg:py-2.5 min-h-[48px] lg:min-h-0 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="lg:hidden px-3 pb-2 space-y-1 border-t border-gray-100 dark:border-gray-800 pt-3">
          <NavLink
            to="/help-center"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3.5 min-h-[48px] rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`
            }
          >
            <HelpCircle size={18} />
            Help
          </NavLink>
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="w-full flex items-center gap-3 px-3 py-3.5 min-h-[48px] rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400">
          Worker Ledger v1.0.0
        </div>
      </aside>
    </>
  );
}