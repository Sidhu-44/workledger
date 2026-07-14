import { LayoutDashboard, Users, HardHat, Wallet, FileBarChart, Settings, HandCoins } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/work-entries", label: "Work Entries", icon: HardHat },
  { to: "/payments", label: "Payments", icon: Wallet },
  { to: "/reports", label: "Reports", icon: FileBarChart },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ isOpen, onClose }) {
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

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
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

        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400">
          Worker Ledger v1.0.0
        </div>
      </aside>
    </>
  );
}
