import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </Link>

      <h1 className="text-4xl font-bold">Privacy Policy</h1>

      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Last Updated: July 2026
      </p>

      <div className="mt-10 space-y-10">

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            1. Introduction
          </h2>

          <p className="leading-8 text-gray-600 dark:text-gray-300">
            Worker Ledger values your privacy. This Privacy Policy explains
            how we collect, use, and protect your information when you use
            our application.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            2. Information We Collect
          </h2>

          <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
            <li>Full Name</li>
            <li>Phone Number</li>
            <li>Email Address (optional)</li>
            <li>Customer records you create</li>
            <li>Work entries and payment records</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            3. How We Use Your Information
          </h2>

          <p className="mb-3 text-gray-600 dark:text-gray-300">
            Your information is used only to:
          </p>

          <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
            <li>Create your account</li>
            <li>Store your work records</li>
            <li>Calculate earnings and pending payments</li>
            <li>Improve application performance</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            4. Data Security
          </h2>

          <p className="leading-8 text-gray-600 dark:text-gray-300">
            Your account is protected using secure authentication. Passwords
            are encrypted and are never stored in plain text.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            5. Data Sharing
          </h2>

          <p className="leading-8 text-gray-600 dark:text-gray-300">
            Worker Ledger does not sell, rent, or share your personal
            information with third parties.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            6. Your Rights
          </h2>

          <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
            <li>Update your profile information</li>
            <li>Delete your account</li>
            <li>Contact us regarding your personal data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            7. Contact Us
          </h2>

          <p className="text-gray-600 dark:text-gray-300">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>

          <a
            href="mailto:sidhubahi44@gmail.com"
            className="mt-2 inline-block text-brand-600 hover:underline"
          >
            sidhubahi44@gmail.com
          </a>
        </section>

      </div>
    </div>
  );
}