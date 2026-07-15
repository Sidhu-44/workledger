import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function TermsOfService() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </Link>

      <h1 className="text-4xl font-bold">Terms of Service</h1>

      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Last Updated: July 2026
      </p>

      <div className="mt-10 space-y-10">

        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
          <p className="leading-8 text-gray-600 dark:text-gray-300">
            By creating an account and using Worker Ledger, you agree to these Terms of Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Account Responsibility</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
            <li>Keep your login credentials secure.</li>
            <li>Provide accurate information.</li>
            <li>You are responsible for all activity under your account.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. Acceptable Use</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
            <li>Do not misuse the application.</li>
            <li>Do not attempt unauthorized access.</li>
            <li>Do not upload harmful or illegal content.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Data Ownership</h2>
          <p className="leading-8 text-gray-600 dark:text-gray-300">
            All customer, payment, and work-entry data belongs to you. Worker Ledger stores it only to provide the service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Limitation of Liability</h2>
          <p className="leading-8 text-gray-600 dark:text-gray-300">
            Worker Ledger is provided "as is". We are not responsible for any financial loss resulting from incorrect information entered by users.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Contact</h2>
          <a
            href="mailto:sidhubahi44@gmail.com"
            className="text-brand-600 hover:underline"
          >
            sidhubahi44@gmail.com
          </a>
        </section>

      </div>
    </div>
  );
}