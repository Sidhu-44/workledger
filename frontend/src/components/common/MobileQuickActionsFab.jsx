// import { useState } from "react";
// import { Outlet } from "react-router-dom";

// import Footer from "../components/common/Footer";
// import MobileQuickActionsFab from "../components/common/MobileQuickActionsFab";
// import MobileTopNavbar from "../components/common/MobileTopNavbar";
// import Sidebar from "../components/common/Sidebar";
// import Topbar from "../components/common/Topbar";

// export default function MainLayout() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
//       <MobileTopNavbar onMenuClick={() => setSidebarOpen(true)} />
//       <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
//       <div className="flex-1 flex flex-col min-w-0 pt-16 lg:pt-0">
//         <Topbar onMenuClick={() => setSidebarOpen(true)} />
//         <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
//           <Outlet />
//         </main>
//         <Footer />
//       </div>
//       <MobileQuickActionsFab />
//     </div>
//   );
// }


import { HardHat, Plus, User, Wallet } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const quickActions = [
  { to: "/customers", label: "Add Customer", icon: User },
  { to: "/work-entries", label: "Add Work Entry", icon: HardHat },
  { to: "/payments", label: "Record Payment", icon: Wallet },
];

export default function MobileQuickActionsFab() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function onClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const handleAction = (to) => {
    setOpen(false);
    navigate(to);
  };

  return (
    <div ref={containerRef} className="lg:hidden fixed z-50" style={{ bottom: 24, right: 20 }}>
      {open && <div className="fixed inset-0 bg-black/10 -z-10" onClick={() => setOpen(false)} />}

      <div className="relative">
        <div className="absolute bottom-full right-0 mb-3 flex flex-col items-end gap-3">
          {quickActions.map(({ to, label, icon: Icon }, i) => (
            <button
              key={to}
              onClick={() => handleAction(to)}
              style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
              className={`flex items-center gap-3 transition-all duration-200 ease-out origin-bottom-right ${
                open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-2 pointer-events-none"
              }`}
            >
              <span className="px-3 py-1.5 rounded-lg bg-gray-900 dark:bg-gray-800 text-white text-xs font-medium shadow-card whitespace-nowrap">
                {label}
              </span>
              <span className="h-11 w-11 shrink-0 rounded-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-card flex items-center justify-center text-brand-600 dark:text-brand-400">
                <Icon size={18} />
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close quick actions" : "Open quick actions"}
          aria-expanded={open}
          className="h-14 w-14 rounded-full bg-brand-600 hover:bg-brand-700 active:scale-95 text-white shadow-card flex items-center justify-center transition-all duration-200"
        >
          <Plus size={26} className={`transition-transform duration-200 ${open ? "rotate-45" : "rotate-0"}`} />
        </button>
      </div>
    </div>
  );
}