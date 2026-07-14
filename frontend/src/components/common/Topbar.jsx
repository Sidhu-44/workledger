import { Bell, Menu, Moon, Search, Sun, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { dashboardService } from "../../services/dashboardService";
import { searchService } from "../../services/reportService";

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    dashboardService.alerts().then((data) => setNotifications(data.notifications)).catch(() => {});
  }, []);

  useEffect(() => {
    function onClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults(null);
      return;
    }
    const timeout = setTimeout(() => {
      searchService.search(query).then((data) => {
        setResults(data);
        setShowResults(true);
      });
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-100 dark:border-gray-800 flex items-center gap-4 px-4 lg:px-6">
      <button onClick={onMenuClick} className="lg:hidden p-2 text-gray-500">
        <Menu size={22} />
      </button>

      <div className="relative flex-1 max-w-md" ref={searchRef}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results && setShowResults(true)}
          placeholder="Search customers, work..."
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        {showResults && results && (
          <div className="absolute mt-2 w-full bg-white dark:bg-gray-900 rounded-lg shadow-card border border-gray-100 dark:border-gray-800 max-h-80 overflow-y-auto">
            {results.customers.length === 0 && results.work_entries.length === 0 && (
              <p className="p-4 text-sm text-gray-400">No results found.</p>
            )}
            {results.customers.length > 0 && (
              <div className="p-2">
                <p className="text-xs font-semibold text-gray-400 px-2 py-1">Customers</p>
                {results.customers.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      navigate(`/customers/${c.id}`);
                      setShowResults(false);
                      setQuery("");
                    }}
                    className="w-full text-left px-2 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 text-sm"
                  >
                    {c.name} {c.phone_number && <span className="text-gray-400">· {c.phone_number}</span>}
                  </button>
                ))}
              </div>
            )}
            {results.work_entries.length > 0 && (
              <div className="p-2 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs font-semibold text-gray-400 px-2 py-1">Work Entries</p>
                {results.work_entries.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => {
                      navigate(`/work-entries`);
                      setShowResults(false);
                      setQuery("");
                    }}
                    className="w-full text-left px-2 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 text-sm"
                  >
                    {e.description} · {e.customer_name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          title="Toggle theme"
        >
          {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowNotifications((s) => !s)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 relative"
            title="Notifications"
          >
            <Bell size={19} />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-accent-500" />
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-900 rounded-lg shadow-card border border-gray-100 dark:border-gray-800 max-h-80 overflow-y-auto">
              <p className="text-xs font-semibold text-gray-400 px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                Notifications
              </p>
              {notifications.length === 0 ? (
                <p className="p-4 text-sm text-gray-400">You're all caught up.</p>
              ) : (
                notifications.map((n, i) => (
                  <div key={i} className="px-4 py-3 text-sm border-b border-gray-50 dark:border-gray-800 last:border-0">
                    {n.message}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-2 pl-2 ml-1 border-l border-gray-200 dark:border-gray-700">
          <div className="h-8 w-8 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 flex items-center justify-center text-sm font-semibold">
            {user?.full_name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="leading-tight">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{user?.full_name}</p>
            <p className="text-xs text-gray-400">{user?.trade || "Worker"}</p>
          </div>
          <button
            onClick={logout}
            className="ml-2 p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
