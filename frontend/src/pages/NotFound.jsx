import { HandCoins } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-6">
      <div className="text-center max-w-sm">
        <div className="h-14 w-14 rounded-full bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center mx-auto mb-4">
          <HandCoins className="text-brand-500" size={26} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">404</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <Link
          to="/dashboard"
          className="mt-6 inline-flex px-4 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
