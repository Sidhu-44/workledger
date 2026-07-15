import {
  BarChart3,
  CheckCircle2,
  ClipboardList,
  HandCoins,
  ShieldCheck,
  Smartphone,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Users,
    title: "Customer Management",
    description: "Manage customers in one place.",
  },
  {
    icon: ClipboardList,
    title: "Work Tracking",
    description: "Track daily work entries quickly.",
  },
  {
    icon: Wallet,
    title: "Payment Tracking",
    description: "Monitor paid and pending amounts.",
  },
  {
    icon: BarChart3,
    title: "Reports & Analytics",
    description: "View earnings and business insights.",
  },
];

const benefits = [
  { icon: Zap, text: "Fast and easy to use" },
  { icon: ShieldCheck, text: "Secure cloud storage" },
  { icon: Smartphone, text: "Works on mobile, tablet and desktop" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Top nav */}
      <header className="border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-brand-600 flex items-center justify-center">
              <HandCoins className="text-white" size={20} />
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-lg">Worker Ledger</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors duration-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Section 1 — Hero */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center min-h-[70vh] justify-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white max-w-4xl">
          Manage Customers, Work & Payments - All in One Place
        </h1>
        <p className="mt-6 text-lg text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
          Worker Ledger helps painters, electricians, plumbers, carpenters, contractors, and daily-wage workers
          manage customers, work entries, payments, and earnings—all in one secure application.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link
            to="/register"
            className="px-7 py-3.5 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors duration-200 shadow-card"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-7 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm font-semibold hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-200"
          >
            Login
          </Link>
        </div>
      </section>

      {/* Section 2 — Features */}
      <section className="bg-gray-50 dark:bg-gray-900/40 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-xl2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 shadow-soft hover:shadow-card transition-shadow duration-200"
              >
                <div className="h-11 w-11 rounded-lg bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center">
                  <Icon className="text-brand-600 dark:text-brand-400" size={22} />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">{title}</h3>
                <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 — Why Worker Ledger */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Why Choose Worker Ledger?</h2>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {benefits.map(({ icon: Icon, text }) => (
            <div key={text} className="flex flex-col items-center text-center gap-3">
              <div className="h-12 w-12 rounded-full bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center">
                <Icon className="text-brand-600 dark:text-brand-400" size={22} />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-1.5">
                <CheckCircle2 className="text-brand-500 shrink-0" size={16} />
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4 — Call to Action */}
      <section className="bg-brand-600 dark:bg-brand-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold text-white">Ready to simplify your daily work?</h2>
          <Link
            to="/register"
            className="mt-8 px-7 py-3.5 rounded-xl bg-white text-brand-700 text-sm font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-card"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}