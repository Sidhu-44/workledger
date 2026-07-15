import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function HelpCenter() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </Link>

      <h1 className="text-4xl font-bold">Help Center</h1>

      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Need help? Start here.
      </p>

      <div className="mt-10 space-y-10">

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            Getting Started
          </h2>

          <ol className="list-decimal pl-6 space-y-3 text-gray-600 dark:text-gray-300">
            <li>Create your account.</li>
            <li>Add your customers.</li>
            <li>Create work entries.</li>
            <li>Record payments.</li>
            <li>Track earnings from the dashboard.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            Common Issues
          </h2>

          <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
            <li>Forgot your password? Contact support.</li>
            <li>Unable to login? Check your phone number and password.</li>
            <li>Data not updating? Refresh the page and try again.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            Contact Support
          </h2>

          <p className="text-gray-600 dark:text-gray-300">
            If you still need assistance, email us at:
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