import { HandCoins } from "lucide-react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-brand-700 to-brand-900 text-white p-12">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-lg bg-white/15 flex items-center justify-center">
            <HandCoins size={22} />
          </div>
          <span className="font-bold text-xl">Worker Ledger</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold leading-tight max-w-md">
            Track every job, every rupee, every customer — in one simple place.
          </h2>
          <p className="mt-4 text-brand-100 max-w-md">
            Built for painters, electricians, plumbers, and every daily-wage worker who deserves to know exactly
            who owes them what.
          </p>
        </div>
        <p className="text-sm text-brand-200">© {new Date().getFullYear()} Worker Ledger</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 justify-center mb-8">
            <div className="h-10 w-10 rounded-lg bg-brand-600 flex items-center justify-center">
              <HandCoins className="text-white" size={20} />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-gray-100">Worker Ledger</span>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
