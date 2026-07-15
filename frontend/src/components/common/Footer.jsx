import { Github, HandCoins, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const quickLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/customers", label: "Customers" },
  { to: "/work-entries", label: "Work Entries" },
  { to: "/reports", label: "Reports" },
];

const resourceLinks = [
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/terms-of-service", label: "Terms of Service" },
  { to: "/faq", label: "FAQ" },
  { to: "/help-center", label: "Help Center" },
];

const companyLinks = [
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/changelog", label: "Changelog" },
];

const socialLinks = [
  { href: "https://github.com/Sidhu-44", label: "GitHub", icon: Github },
  { href: "https://www.linkedin.com/in/ande-naga-subramanyam", label: "LinkedIn", icon: Linkedin },
  { href: "https://mail.google.com/mail/?view=cm&fs=1&to=sidhubahi44@gmail.com", label: "Email", icon: Mail },
];

function FooterColumn({ title, links }) {
  return (
    <nav aria-label={title}>
      <h3 className="text-sm font-semibold tracking-wide text-gray-900 dark:text-white">{title}</h3>
      <ul className="mt-5 space-y-3">
        {links.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className="inline-block text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-all duration-200"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer() {
  return (
    <footer
        className="
            mt-8
            rounded-t-3xl
            bg-white dark:bg-slate-900
            border border-gray-200 dark:border-slate-700
            shadow-md
            dark:shadow-none
        "
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Left section ~40% */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-brand-600 flex items-center justify-center">
              <HandCoins className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-brand-500">Worker Ledger</span>
          </div>

          <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">Track every job, every rupee, every customer.</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            Built for painters, electricians, plumbers, carpenters and every daily-wage worker who deserves to know
            exactly who owes them what.
          </p>

          <div className="mt-6 flex items-center gap-3">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full
                    bg-gray-100 dark:bg-slate-800
                    text-gray-600 dark:text-gray-400
                    hover:bg-brand-600
                    hover:text-white
                    hover:scale-110
                    dark:hover:bg-brand-500
                    transition-all duration-300"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Middle section ~60%: 3 columns */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-10">
          <FooterColumn title="Quick Links" links={quickLinks} />
          <FooterColumn title="Resources" links={resourceLinks} />
          <FooterColumn title="Company" links={companyLinks} />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} Worker Ledger. All rights reserved.
          </p>
          <p className="text-center sm:text-right">
            Built with <span className="text-accent-500">❤️</span> by{" "}
            <span className="font-medium text-gray-700 dark:text-gray-200">Ande Naga Subramanyam</span>
          </p>
        </div>
      </div>
    </footer>
  );
}