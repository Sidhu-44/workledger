import { ArrowLeft, Mail, Github, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Contact() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </Link>

      <h1 className="text-4xl font-bold">Contact Us</h1>

      <p className="mt-3 text-gray-600 dark:text-gray-300">
        We'd love to hear your feedback, suggestions, or bug reports.
      </p>

      <div className="mt-10 space-y-6">

        <a
          href="mailto:sidhubahi44@gmail.com"
          className="flex items-center gap-3 text-brand-600 hover:underline"
        >
          <Mail size={20} />
          sidhubahi44@gmail.com
        </a>

        <a
          href="https://github.com/Sidhu-44"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 text-brand-600 hover:underline"
        >
          <Github size={20} />
          GitHub
        </a>

        <a
          href="https://www.linkedin.com/in/ande-naga-subramanyam/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 text-brand-600 hover:underline"
        >
          <Linkedin size={20} />
          LinkedIn
        </a>

      </div>
    </div>
  );
}