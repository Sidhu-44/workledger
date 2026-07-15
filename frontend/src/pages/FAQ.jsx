import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function FAQ() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </Link>

      <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>

      <div className="mt-10 space-y-8">

        <section>
          <h2 className="text-xl font-semibold">What is Worker Ledger?</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Worker Ledger helps daily-wage workers manage customers, work entries, payments, and earnings in one place.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Is my data secure?</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Yes. Passwords are encrypted, and your account is protected with secure authentication.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Can I use Worker Ledger on mobile?</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Yes. The application is fully responsive and works on phones, tablets, and desktops.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Is Worker Ledger free?</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            The current version is free to use. Premium features may be introduced in the future.
          </p>
        </section>

      </div>
    </div>
  );
}