import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </Link>

      <h1 className="text-4xl font-bold">About Worker Ledger</h1>

      <div className="mt-10 space-y-8">

        <section>
          <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>

          <p className="leading-8 text-gray-600 dark:text-gray-300">
            Worker Ledger is designed to simplify the daily lives of workers by
            helping them manage customers, work records, earnings, and payments
            in one secure place.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Why We Built It</h2>

          <p className="leading-8 text-gray-600 dark:text-gray-300">
            This project was inspired by a real-world problem observed in daily
            wage work. Many workers relied on notebooks or memory to track
            payments and completed jobs. Worker Ledger provides a digital,
            organized, and reliable solution.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Technology Stack</h2>

          <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
            <li>React + Vite</li>
            <li>FastAPI</li>
            <li>PostgreSQL (Supabase)</li>
            <li>JWT Authentication</li>
            <li>Tailwind CSS</li>
            <li>Render & Vercel</li>
          </ul>
        </section>

      </div>
    </div>
  );
}