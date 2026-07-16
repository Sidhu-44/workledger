import { useState } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/common/Footer";
import Sidebar from "../components/common/Sidebar";
import Topbar from "../components/common/Topbar";
import MobileTopNavbar from "../components/common/MobileTopNavbar";
import MobileQuickActionsFab from "../components/common/MobileQuickActionsFab";
export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <MobileTopNavbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 pt-16 lg:pt-0">
        
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
        <Footer />
      </div>
      <MobileQuickActionsFab />
    </div>
  );
}
