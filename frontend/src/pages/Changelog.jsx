import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Changelog() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </Link>

      <h1 className="text-4xl font-bold">Changelog</h1>

      <div className="mt-10 space-y-8">

        <div className="border-l-4 border-brand-600 pl-6">
          <h2 className="text-2xl font-semibold">
            Version 1.0.0
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            July 2026
          </p>

          <ul className="mt-4 list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
            <li>User Registration & Login</li>
            <li>Customer Management</li>
            <li>Work Entry Management</li>
            <li>Payment Tracking</li>
            <li>Dashboard Analytics</li>
            <li>Dark & Light Theme</li>
            <li>Responsive Design</li>
            <li>Supabase PostgreSQL Integration</li>
            <li>Backend Deployment on Render</li>
            <li>Frontend Deployment on Vercel</li>
          </ul>
        </div>

      </div>
    </div>
  );
}